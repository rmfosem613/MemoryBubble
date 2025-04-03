package com.ssafy.memorybubble.api.file.service;

import com.ssafy.memorybubble.api.file.dto.FileResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    private final S3Presigner s3Presigner;
    private final CloudFrontService cloudFrontService;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    public FileResponse createDownloadFileResponse(String key) {
        return FileResponse.builder()
                .fileName(key)
                .presignedUrl(getDownloadSignedURL(key))
                .build();
    }

    public FileResponse createUploadFileResponse(String key) {
        return FileResponse.builder()
                .fileName(key)
                .presignedUrl(getUploadPresignedUrl(key))
                .build();
    }

    // S3에 업로드
    public String getUploadPresignedUrl(String key) {
        PresignedPutObjectRequest presignedRequest = s3Presigner.presignPutObject(
                req->req.signatureDuration(Duration.ofMinutes(15))
                        .putObjectRequest(
                                PutObjectRequest.builder()
                                        .bucket(bucket)
                                        .key(key)
                                        .build()
                        )
        );
        return presignedRequest.url().toString();
    }

    // S3에서 다운로드
    public String getDownloadPresignedURL(String key) {
        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(
                req -> req.signatureDuration(Duration.ofMinutes(15)) // 15분 유효기간
                        .getObjectRequest(
                                GetObjectRequest.builder()
                                        .bucket(bucket)
                                        .key(key)
                                        .build()
                        )
        );
        return presignedRequest.url().toString();
    }

    // 클라우드 프론트에서 다운로드
    public String getDownloadSignedURL(String key) {
        try {
            return cloudFrontService.generateSignedUrl(key);
        } catch (Exception e) {
            log.error(e.getMessage());
            return getDownloadPresignedURL(key);
        }
    }
}
