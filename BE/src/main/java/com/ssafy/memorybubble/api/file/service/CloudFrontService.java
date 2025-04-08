package com.ssafy.memorybubble.api.file.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cloudfront.CloudFrontClient;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CreateInvalidationRequest;
import software.amazon.awssdk.services.cloudfront.model.CustomSignerRequest;
import software.amazon.awssdk.services.cloudfront.model.InvalidationBatch;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

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

    @Value("${spring.cloud.aws.cloudfront.distribution-id}")
    private String distributionId;

    @Value("${spring.cloud.aws.credentials.access-key}")
    private String awsAccessKey;

    @Value("${spring.cloud.aws.credentials.secret-key}")
    private String awsSecretKey;

    public String generateSignedUrl(String key) throws Exception {
        CloudFrontUtilities cloudFrontUtilities = CloudFrontUtilities.create();
        Instant expirationDate = Instant.now().plus(7, ChronoUnit.DAYS);

        // 파일명 인코딩
        String encodedKey = getEncodedKey(key);

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

    public void invalidateFile(String key) {
        String encodedKey = getEncodedKey(key);

        if (!encodedKey.startsWith("/")) {
            encodedKey = "/" + encodedKey;
        }
        log.info("invalidate file={}", encodedKey);

        // AWS 자격 증명 생성
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                awsAccessKey,
                awsSecretKey
        );

        CloudFrontClient cloudFrontClient = CloudFrontClient.builder()
                .region(Region.AWS_GLOBAL)
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();

        // 무효화 요청 생성
        String callerReference = UUID.randomUUID().toString();
        software.amazon.awssdk.services.cloudfront.model.Paths invalidationPath = software.amazon.awssdk.services.cloudfront.model.Paths.builder()
                .quantity(1)
                .items(encodedKey)
                .build();

        InvalidationBatch invalidationBatch = InvalidationBatch.builder()
                .paths(invalidationPath)
                .callerReference(callerReference)
                .build();

        CreateInvalidationRequest invalidationRequest = CreateInvalidationRequest.builder()
                .distributionId(distributionId)
                .invalidationBatch(invalidationBatch)
                .build();

        // 무효화 요청 실행
        cloudFrontClient.createInvalidation(invalidationRequest);
    }

    private String getEncodedKey(String key) {
        return URLEncoder.encode(key, StandardCharsets.UTF_8)
                .replace("+", "%20");
    }
}