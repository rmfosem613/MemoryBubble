package com.ssafy.memorybubble.service;

import com.ssafy.memorybubble.domain.Family;
import com.ssafy.memorybubble.dto.CodeDto;
import com.ssafy.memorybubble.dto.CodeResponse;
import com.ssafy.memorybubble.dto.FamilyRequest;
import com.ssafy.memorybubble.dto.FamilyResponse;
import com.ssafy.memorybubble.exception.FamilyException;
import com.ssafy.memorybubble.repository.FamilyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static com.ssafy.memorybubble.exception.ErrorCode.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class FamilyService {
    private final FamilyRepository familyRepository;
    private final FileService fileService;
    private final AlbumService albumService;
    private final UserService userService;
    private final CodeService codeService;

    public FamilyResponse addFamily(Long userId, FamilyRequest familyRequest) {
        // 유저가 이미 그룹이 있으면 예외 반환
        if (userService.isFamilyExist(userId)) {
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
        userService.updateUserFamily(userId, family);

        // 기본 그룹 앨범 생성(추억보관함), 앨범 썸네일에 가족 썸네일 넣음
        albumService.addAlbum(family, "추억 보관함", "이것은 기본 앨범입니다. 추억을 담아보세요!",
                "#FFFFFF", key);

        // presignedURL 반환
        return FamilyResponse.builder()
                .familyId(family.getId())
                .fileName(key)
                .presignedUrl(presignedUrl)
                .build();
    }

    public CodeDto getInviteCode(Long userId, Long familyId) {
        // family가 없으면 예외 반환
        Family family = Optional.ofNullable(userService.getFamily(userId))
                .orElseThrow(() -> new FamilyException(FAMILY_NOT_FOUND));

        // 요청 한 user가 가진 family와 familyId가 맞지 않으면 예외 반환
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
}