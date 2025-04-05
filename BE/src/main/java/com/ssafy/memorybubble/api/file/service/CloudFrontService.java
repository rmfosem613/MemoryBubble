package com.ssafy.memorybubble.api.file.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudFrontService {
    @Value("${spring.cloud.aws.cloudfront.domain}")
    private String domain;

    @Value("${cloudfront.key-pair-id}")
    private String keyPairId;

    @Value("${cloudfront.private-key-path}")
    private String privateKeyPath;

    public String generateSignedUrl(String key) throws Exception {
        CloudFrontUtilities cloudFrontUtilities = CloudFrontUtilities.create();
        Instant expirationDate = Instant.now().plus(7, ChronoUnit.DAYS);    //유효기간 7일
        String resourceUrl = domain + "/" + key;

        // log.info("keyPairId: {}", keyPairId);
        // log.info("privateKeyPath: {}", privateKeyPath);

        // PEM 키 경로 결정
        Path keyPath = Paths.get(getClass().getClassLoader().getResource(privateKeyPath).toURI());
        // log.info("key path: {}", keyPath);

        // 서명 요청 구성
        CannedSignerRequest cannedRequest = CannedSignerRequest.builder()
                .resourceUrl(resourceUrl)
                .privateKey(keyPath)
                .keyPairId(keyPairId)
                .expirationDate(expirationDate)
                .build();

        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCannedPolicy(cannedRequest);
        log.info("signedUrl.url(): {}", signedUrl.url());
        return signedUrl.url();
    }
}