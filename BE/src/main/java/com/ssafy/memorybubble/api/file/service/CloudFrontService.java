package com.ssafy.memorybubble.api.file.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CustomSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
        Instant expirationDate = Instant.now().plus(7, ChronoUnit.DAYS);

        // 파일명 인코딩
        String encodedKey = URLEncoder.encode(key, StandardCharsets.UTF_8)
                .replace("+", "%20");

        // 와일드카드를 포함한 리소스 URL
        String resourceUrl = domain + "/" + encodedKey + "*";

        // PEM 키 경로 결정
        Path keyPath = Paths.get(getClass().getClassLoader().getResource(privateKeyPath).toURI());

        // 서명 요청 구성
        CustomSignerRequest customRequest = CustomSignerRequest.builder()
                .resourceUrl(resourceUrl)
                .privateKey(keyPath)
                .keyPairId(keyPairId)
                .expirationDate(expirationDate)
                .build();

        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCustomPolicy(customRequest);

        // URL에서 와일드카드(*) 제거 후 반환
        String finalUrl = signedUrl.url().replace("/" + encodedKey + "*", "/" + encodedKey);
        log.info("finalUrl: {}", finalUrl);

        return finalUrl;
    }
}