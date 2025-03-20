
import sys
sys.path.insert(0, '/home/j-j12d201/.local/squashfs-root/usr/lib/python3.10/site-packages')

import os
import glob
import fontforge
import unicodedata

# def get_unicode(filename):
#     # 확장자 제거
#     base_name = os.path.splitext(filename)[0]

#     # 디버깅 출력
#     print(f"파일명: '{filename}', 기본 이름: '{base_name}', 길이: {len(base_name)}")

#     # 유니코드 정규화 (조합형 -> 완성형)
#     normalized = unicodedata.normalize('NFC', base_name)
#     print(f"정규화된 문자: '{normalized}', 길이: {len(normalized)}")

#     # 정규화된 문자가 한 글자라면
#     if len(normalized) == 1:
#         code_point = ord(normalized)
#         print(f"유니코드 코드 포인트: {hex(code_point)}")
#         return code_point

#     # 정규화가 실패하면, 파일명을 한글 유니코드 범위에 있는지 확인
#     for char in base_name:
#         if 0xAC00 <= ord(char) <= 0xD7A3:  # 한글 유니코드 범위
#             code_point = ord(char)
#             print(f"한글 코드 포인트 찾음: {hex(code_point)}")
#             return code_point

#     # 마지막 대안: 첫 자모만 사용
#     if len(base_name) > 0:
#         code_point = ord(base_name[0])
#         print(f"첫 문자 코드 포인트: {hex(code_point)}")
#         if 0x1100 <= code_point <= 0x11FF or 0x3130 <= code_point <= 0x318F:  # 한글 자모 범위
#             return code_point

#     return None



def get_unicode(filename):
    # 확장자 제거
    base_name = os.path.splitext(filename)[0]
    # 디버깅 출력
    print(f"파일명: '{filename}', 기본 이름: '{base_name}', 길이: {len(base_name)}")
    # 유니코드 정규화 (조합형 -> 완성형)
    normalized = unicodedata.normalize('NFC', base_name)
    print(f"정규화된 문자: '{normalized}', 길이: {len(normalized)}")
    # 정규화된 문자가 한 글자라면
    if len(normalized) == 1:
        code_point = ord(normalized)
        print(f"유니코드 코드 포인트: {hex(code_point)}")
        return f"U+{code_point:04X}"
    # 정규화가 실패하면, 파일명을 한글 유니코드 범위에 있는지 확인
    for char in base_name:
        if 0xAC00 <= ord(char) <= 0xD7A3:  # 한글 유니코드 범위
            code_point = ord(char)
            print(f"한글 코드 포인트 찾음: {hex(code_point)}")
            return f"U+{code_point:04X}"
    # 마지막 대안: 첫 자모만 사용
    if len(base_name) > 0:
        code_point = ord(base_name[0])
        print(f"첫 문자 코드 포인트: {hex(code_point)}")
        if 0x1100 <= code_point <= 0x11FF or 0x3130 <= code_point <= 0x318F:  # 한글 자모 범위
            return f"U+{code_point:04X}"
    return None # 대체 문자 반환