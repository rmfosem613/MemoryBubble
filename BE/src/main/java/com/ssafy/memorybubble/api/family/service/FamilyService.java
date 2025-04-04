package com.ssafy.memorybubble.api.family.service;

import com.ssafy.memorybubble.api.album.service.AlbumService;
import com.ssafy.memorybubble.api.family.dto.*;
import com.ssafy.memorybubble.api.family.exception.FamilyException;
import com.ssafy.memorybubble.api.family.repository.FamilyRepository;
import com.ssafy.memorybubble.api.file.dto.FileResponse;
import com.ssafy.memorybubble.api.file.service.FileService;
import com.ssafy.memorybubble.api.user.dto.UserInfoDto;
import com.ssafy.memorybubble.api.user.service.UserService;
import com.ssafy.memorybubble.common.util.Validator;
import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import static com.ssafy.memorybubble.common.exception.ErrorCode.*;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class FamilyService {
    private final FamilyRepository familyRepository;
    private final FileService fileService;
    private final AlbumService albumService;
    private final UserService userService;
    private final CodeService codeService;

    private final String[] colors = {"#F4E2DC", "#F3D1B2", "#F7F0D5", "#BFDAAB", "#C5DFE6", "#B3C6E3"};

    @Transactional
    public FamilyResponse addFamily(Long userId, FamilyRequest request) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        // 유저가 이미 가족이 있으면 예외 반환
        if (user.getFamily() != null) {
            throw new FamilyException(ALREADY_FAMILY_EXIST);
        }

        // UUID로 presigendUrl 생성, 가족 이미지 업로드 용 presigned Url 반환
        String key = "family/" + UUID.randomUUID();
        String presignedUrl = fileService.getUploadPresignedUrl(key);

        // familyRequest에 있는 familyName으로 family 생성
        Family family = familyRepository.save(Family.builder()
                .name(request.getFamilyName())
                .thumbnail(key)
                .build());
        log.info("family created: {}", family);

        // 유저 정보에 가족 업데이트
        userService.updateUserFamily(user, family);

        // 랜덤한 배경색 선택
        String randomColor = colors[ThreadLocalRandom.current().nextInt(colors.length)];

        // 기본 그룹 앨범 생성(추억보관함), 앨범 썸네일에 가족 썸네일 넣음
        albumService.addAlbum(family, "추억 보관함", "이것은 기본 앨범입니다. 추억을 담아보세요!", randomColor, key);

        // presignedURL 반환
        return FamilyResponse.builder()
                .familyId(family.getId())
                .fileName(key)
                .presignedUrl(presignedUrl)
                .build();
    }

    public CodeDto getInviteCode(Long userId, Long familyId) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        // 요청을 한 user가 가입된 family가 없으면 예외 반환
        Family family = Validator.validateAndGetFamily(user, familyId);

        // redis에 familyId 있으면 반환, 없으면 familyId로 code 만들어서 redis에 저장
        return CodeDto.builder()
                .code(codeService.getInviteCode(family.getId()))
                .build();
    }

    public CodeResponse getFamilyIdByCode(CodeDto request) {
        // code를 Redis에서 찾아서 familyId 반환
        return CodeResponse.builder()
                .familyId(codeService.getFamilyIdByCode(request.getCode()))
                .build();
    }

    @Transactional
    public FileResponse join(Long userId, FamilyJoinRequest request) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);

        // 유저가 이미 다른 그룹에 가입되어 있으면 예외 반환
        Family existingFamily = user.getFamily();
        if (existingFamily != null && !existingFamily.getId().equals(request.getFamilyId())) {
            throw new FamilyException(ALREADY_FAMILY_EXIST);
        }

        //유저의 정보가 이미 기입되어 있으면 가입한 것이므로 예외 반환
        if (user.getProfile() != null || user.getBirth() != null || user.getPhoneNumber() != null || user.getGender() != null) {
           throw new FamilyException(ALREADY_JOINED);
        }

        // joinRequest의 familyId로 family 찾기, 없으면 예외 반환
        Long familyId = request.getFamilyId();
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new FamilyException(FAMILY_NOT_FOUND));

        // 유저의 가족 정보 업데이트
        userService.updateUserFamily(user, family);
        log.info("family joined: {}", family);

        // UUID로 presigendUrl 생성, 프로필 이미지 업로드 용 presigned Url 반환
        String key = "user/" + UUID.randomUUID();
        // 유저의 정보 업데이트
        userService.updateUser(user, request, key);
        log.info("user info updated: {}", user);

        return fileService.createUploadFileResponse(key);
    }

    public FamilyInfoResponse getFamily(Long userId, Long familyId) {
        User user = userService.getUser(userId);
        Family family = Validator.validateAndGetFamily(user, familyId);

        // 해당 가족에 소속된 user 목록 찾기 -> 자기 자신은 포함 x
        List<User> familyMembers = userService.getUsersByFamilyId(familyId)
                .stream()
                .filter(member->!member.getId().equals(userId))
                .toList();
        log.info("family members: {}", familyMembers);

        // Dto로 변환
        List<UserInfoDto> familyMembersDto = familyMembers.stream()
                .map(userService::getUserInfoDto)
                .toList();
        log.info("family members dto: {}", familyMembersDto);

        // 가족의 썸네일 반환
        String thumbnailUrl = fileService.getDownloadSignedURL(family.getThumbnail())+"&w=100&h=100";

        return FamilyInfoResponse.builder()
                .familyName(family.getName())
                .thumbnailUrl(thumbnailUrl)
                .familyMembers(familyMembersDto)
                .build();
    }

    @Transactional
    public FamilyResponse updateFamily(Long userId, Long familyId, FamilyRequest request) {
        User user = userService.getUser(userId);
        log.info("user: {}", user);
        Family family = Validator.validateAndGetFamily(user, familyId);
        log.info("family: {}", family);

        // 가족 이름 수정
        family.updateFamilyName(request.getFamilyName());
        log.info("updated family: {}", family);

        // 기존 thumbnail(fileName)으로 가족 이미지 업로드용 presigned Url 반환
        String key = family.getThumbnail();
        String presignedUrl = fileService.getUploadPresignedUrl(key);

        // presignedURL 반환
        return FamilyResponse.builder()
                .familyId(family.getId())
                .fileName(key)
                .presignedUrl(presignedUrl)
                .build();
    }
}