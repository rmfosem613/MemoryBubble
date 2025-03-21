package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.domain.User;
import com.ssafy.memorybubble.dto.*;
import com.ssafy.memorybubble.exception.FamilyException;
import com.ssafy.memorybubble.repository.FamilyRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.ssafy.memorybubble.exception.ErrorCode.*;

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

    @Transactional
    public FamilyCreateResponse addFamily(Long userId, FamilyRequest familyRequest) {
        User user = userService.getUser(userId);
        // 유저가 이미 가족이 있으면 예외 반환
        if (user.getFamily() != null) {
            throw new FamilyException(ALREADY_FAMILY_EXIST);
        }

        // UUID로 presigendUrl 생성, 가족 이미지 업로드 용 presigned Url 반환
        String key = "family/" + UUID.randomUUID();
        String presignedUrl = fileService.getUploadPresignedUrl(key);

        // familyRequest에 있는 familyName으로 family 생성
        Family family = familyRepository.save(Family.builder()
                .name(familyRequest.getFamilyName())
                .thumbnail(key)
                .build());

        // 유저 정보에 가족 업데이트
        userService.updateUserFamily(user, family);

        // 기본 그룹 앨범 생성(추억보관함), 앨범 썸네일에 가족 썸네일 넣음
        albumService.addAlbum(family, "추억 보관함", "이것은 기본 앨범입니다. 추억을 담아보세요!",
                "#FFFFFF", key);

        // presignedURL 반환
        return FamilyCreateResponse.builder()
                .familyId(family.getId())
                .fileName(key)
                .presignedUrl(presignedUrl)
                .build();
    }

    public CodeDto getInviteCode(Long userId, Long familyId) {
        User user = userService.getUser(userId);
        // 요청을 한 user가 가입된 family가 없으면 예외 반환
        Family family = user.getFamily();
        if(family == null) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        // 요청 한 user가 가입된 family와 familyId가 일치하지 않으면 예외 반환
        if(!familyId.equals(family.getId())) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        // redis에 familyId 있으면 반환, 없으면 familyId로 code 만들어서 redis에 저장
        return CodeDto.builder()
                .code(codeService.getInviteCode(familyId))
                .build();
    }

    public CodeResponse getFamilyIdByCode(CodeDto codeDto) {
        // code를 Redis에서 찾아서 familyId 반환
        return CodeResponse.builder()
                .familyId(codeService.getFamilyIdByCode(codeDto.getCode()))
                .build();
    }

    @Transactional
    public FileResponse join(Long userId, JoinRequest joinRequest) {
        User user = userService.getUser(userId);

        // 유저가 이미 다른 그룹에 가입되어 있으면 예외 반환
        Family existingFamily = user.getFamily();
        if (existingFamily != null && !existingFamily.getId().equals(joinRequest.getFamilyId())) {
            throw new FamilyException(ALREADY_FAMILY_EXIST);
        }

        //유저의 정보가 이미 기입되어 있으면 가입한 것이므로 예외 반환
        if (user.getProfile() != null || user.getBirth() != null || user.getPhoneNumber() != null || user.getGender() != null) {
           throw new FamilyException(ALREADY_JOINED);
        }

        // joinRequest의 familyId로 family 찾기, 없으면 예외 반환
        Long familyId = joinRequest.getFamilyId();
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new FamilyException(FAMILY_NOT_FOUND));

        // 유저의 가족 정보 업데이트
        userService.updateUserFamily(user, family);

        // UUID로 presigendUrl 생성, 프로필 이미지 업로드 용 presigned Url 반환
        String key = "user/" + UUID.randomUUID();
        String presignedUrl = fileService.getUploadPresignedUrl(key);

        // 유저의 정보 업데이트
        userService.updateUser(user, joinRequest, key);

        return FileResponse.builder()
                .fileName(key)
                .presignedUrl(presignedUrl)
                .build();
    }

    public FamilyResponse getFamily(Long userId, Long familyId) {
        User user = userService.getUser(userId);
        Family family = user.getFamily();

        // user가 다른 그룹에 가입 되어있거나 가입되어 있지 않은 경우 예외 반환
        if (family == null || !family.getId().equals(familyId)) {
            throw new FamilyException(FAMILY_NOT_FOUND);
        }

        // 해당 가족에 소속된 user 목록 찾기 -> 자기 자신은 포함 x
        List<User> familyMembers = userService.getUsersByFamilyId(familyId)
                .stream()
                .filter(member->!member.getId().equals(userId))
                .toList();

        // Dto로 변환
        List<UserInfoDto> familyMembersDto = familyMembers.stream()
                .map(userService::convertToDto)
                .toList();

        // 가족의 썸네일 presignd Url 반환
        String thumbnailUrl = fileService.getDownloadPresignedURL(family.getThumbnail());

        return FamilyResponse.builder()
                .familyName(family.getName())
                .thumbnailUrl(thumbnailUrl)
                .familyMembers(familyMembersDto)
                .build();
    }
}