# 템플릿을 잘라서 저장한 이미지 폴더와 모델이 생성한 이미지 폴더 함께 ttf 파일 생성성

import os
import glob
import fontforge
import unicodedata
import re

def get_unicode_from_filename(filename):
    """
    파일명에서 유니코드 코드 포인트를 추출합니다.
    """
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
        return code_point

    # 정규화가 실패하면, 파일명을 한글 유니코드 범위에 있는지 확인
    for char in base_name:
        if 0xAC00 <= ord(char) <= 0xD7A3:  # 한글 유니코드 범위
            code_point = ord(char)
            print(f"한글 코드 포인트 찾음: {hex(code_point)}")
            return code_point

    # 마지막 대안: 첫 자모만 사용
    if len(base_name) > 0:
        code_point = ord(base_name[0])
        print(f"첫 문자 코드 포인트: {hex(code_point)}")
        if 0x1100 <= code_point <= 0x11FF or 0x3130 <= code_point <= 0x318F:  # 한글 자모 범위
            return code_point

    return None

def get_unicode_from_numeric_filename(filename):
    """
    "33.png", "12627.png"와 같이 숫자로 된 파일명에서 
    유니코드 코드 포인트를 추출합니다.
    """
    # 확장자 제거
    base_name = os.path.splitext(filename)[0]
    
    # 숫자만 추출
    numeric_pattern = re.compile(r'^(\d+)$')
    match = numeric_pattern.match(base_name)
    
    if match:
        try:
            code_point = int(match.group(1))
            print(f"숫자 파일명에서 코드 포인트 추출: {code_point} ({hex(code_point)})")
            return code_point
        except ValueError:
            print(f"숫자 파일명 변환 실패: '{base_name}'")
            return None
    
    # 숫자 범위 패턴 (예: "33~125", "12627~12643")
    range_pattern = re.compile(r'^(\d+)~(\d+)$')
    match = range_pattern.match(base_name)
    
    if match:
        try:
            start_code = int(match.group(1))
            print(f"범위 파일명에서 시작 코드 추출: {start_code} ({hex(start_code)})")
            return start_code
        except ValueError:
            print(f"범위 파일명 변환 실패: '{base_name}'")
            return None
    
    return None

def process_image_files(font, image_dir, use_numeric_filenames=False):
    """
    지정된 디렉토리에서 이미지 파일을 처리하여
    폰트 객체에 글리프로 추가합니다.

    Args:
        font: FontForge 폰트 객체
        image_dir: 이미지 파일이 있는 디렉토리 경로
        use_numeric_filenames: 숫자로 된 파일명을 직접 유니코드 값으로 사용할지 여부

    Returns:
        (성공 개수, 실패 개수) 튜플
    """
    # 이미지 파일 수집
    all_image_files = []
    for ext in ['.png', '.jpg', '.jpeg']:
        image_files = glob.glob(os.path.join(image_dir, f"*{ext}"))
        all_image_files.extend(image_files)

    total_files = len(all_image_files)

    if total_files == 0:
        print(f"경고: '{image_dir}' 폴더에 이미지 파일이 없습니다.")
        return 0, 0

    print(f"경로: {image_dir}")
    print(f"총 {total_files}개의 이미지 파일을 처리합니다.")
    print(f"파일명 처리 방식: {'숫자 코드 사용' if use_numeric_filenames else '문자 추출'}")

    # 처리 성공 및 실패 카운트
    success_count = 0
    failed_count = 0

    # 각 이미지 파일 처리
    for image_path in all_image_files:
        filename = os.path.basename(image_path)

        # 유니코드 코드 포인트 추출
        if use_numeric_filenames:
            code_point = get_unicode_from_numeric_filename(filename)
        else:
            code_point = get_unicode_from_filename(filename)

        if code_point is None:
            print(f"경고: '{filename}'의 파일명에서 유효한 코드 포인트를 추출할 수 없어 건너뜁니다.")
            failed_count += 1
            continue

        try:
            # 글리프 생성
            glyph = font.createChar(code_point)

            # 이미지 임포트
            result = glyph.importOutlines(image_path)

            if result:
                # 글리프 후처리
                glyph.autoTrace()
                glyph.correctDirection()
                glyph.removeOverlap()
                glyph.simplify()
                glyph.width = 1000

                success_count += 1
                print(f"  > '{filename}' 글리프 생성 성공 (코드 포인트: {hex(code_point)})")
            else:
                failed_count += 1
                print(f"  > '{filename}' 글리프 생성 실패: 이미지 임포트 오류")

        except Exception as e:
            failed_count += 1
            print(f"  > '{filename}' 글리프 생성 실패: {str(e)}")

    return success_count, failed_count

def create_korean_font(image_dir1, image_dir2, output_ttf, font_name="한글폰트"):
    """
    두 개의 이미지 디렉토리를 처리하여 한글 폰트를 생성합니다.
    첫 번째 폴더는 파일명에서 문자를 추출하고, 
    두 번째 폴더는 파일명이 유니코드 값인 것으로 간주합니다.

    Args:
        image_dir1: 문자 파일명 이미지가 있는 디렉토리 경로
        image_dir2: 숫자 파일명(유니코드 코드) 이미지가 있는 디렉토리 경로
        output_ttf: 출력할 TTF 파일 경로
        font_name: 생성할 폰트 이름

    Returns:
        생성된 폰트 파일 경로 또는 실패 시 None
    """
    # 폰트 객체 생성
    font = fontforge.font()
    font.familyname = font_name
    font.fontname = font_name
    font.fullname = font_name

    # 기본 폰트 정보 설정
    font.ascent = 800
    font.descent = 200
    font.em = 1000  # em 사각형 크기

    total_success = 0
    total_failed = 0

    # 첫 번째 이미지 폴더 처리 (문자 파일명)
    print(f"\n==== 폴더 1 처리: {image_dir1} (문자 파일명) ====")
    success1, failed1 = process_image_files(font, image_dir1, use_numeric_filenames=False)
    total_success += success1
    total_failed += failed1

    # 두 번째 이미지 폴더 처리 (숫자 파일명 = 유니코드 코드 포인트)
    print(f"\n==== 폴더 2 처리: {image_dir2} (숫자 파일명) ====")
    success2, failed2 = process_image_files(font, image_dir2, use_numeric_filenames=True)
    total_success += success2
    total_failed += failed2

    # 처리 결과 출력
    print(f"\n모든 폴더 처리 완료: 성공 {total_success}개, 실패 {total_failed}개")
    print(f"- 폴더 1: 성공 {success1}개, 실패 {failed1}개")
    print(f"- 폴더 2: 성공 {success2}개, 실패 {failed2}개")

    if total_success > 0:
        # 폰트 생성
        print(f"폰트 파일 생성 중: {output_ttf}")
        font.generate(output_ttf)
        print(f"폰트 생성 완료: {output_ttf}")

        # 생성된 폰트 정보 확인
        try:
            font = fontforge.open(output_ttf)
            print(f"폰트 이름: {font.fontname}")
            print(f"글리프 수: {len(list(font.glyphs()))}")
            print(f"파일 크기: {os.path.getsize(output_ttf) / 1024:.2f} KB")
            font.close()
        except Exception as e:
            print(f"폰트 정보 확인 중 오류 발생: {str(e)}")

        return output_ttf
    else:
        print("성공적으로 생성된 글리프가 없어 폰트를 생성하지 않습니다.")
        return None


if __name__ == "__main__":
    # 두 개의 이미지 폴더 경로
    image_dir1 = "./result/my_folder"   # 문자 파일명 이미지 폴더 (예: "가.png")
    image_dir2 = "./result/my_template"  # 숫자 파일명 이미지 폴더 (예: "33.png", "12627.png")
    
    output_ttf = "햄부기체.ttf"  # 출력할 TTF 파일 이름름
    font_name = "햄부기체"    # 생성할 폰트 이름

    # 폰트 생성 함수 실행
    create_korean_font(image_dir1, image_dir2, output_ttf, font_name)

    
    """
    try:
        from google.colab import files
        files.download(output_ttf)
        print(f"코랩에서 '{output_ttf}' 파일 다운로드를 시작합니다.")
    except ImportError:
        print("로컬 환경에서 실행 중입니다. 생성된 파일을 확인하세요.")
    """