import os
import glob
import fontforge


import unicodedata
from get_unicode_from_filename import get_unicode


def create_font_from_folder(folder_path, output_ttf="generated_font.ttf", font_name="KoreanFont", is_unicode=True):
    """
    폴더 내의 모든 PNG 이미지를 글리프로 변환하여 TTF 폰트 파일 생성

    Args:
        folder_path: PNG 이미지들이 있는 폴더 경로
        output_ttf: 출력할 TTF 파일 이름
        font_name: 생성할 폰트의 이름
        is_unicode: 파일명이 유니코드인지 여부

    Returns:
        output_ttf: 생성된 TTF 파일 경로
    """
    # 폰트 객체 생성
    font = fontforge.font()
    font.familyname = font_name
    font.fontname = font_name
    font.fullname = font_name

    # 폴더 내의 모든 PNG 파일 찾기
    # png_files = glob.glob(os.path.join(folder_path, "*.png"))

    # 모든 PNG 파일 찾기 (서브폴더 포함)
    png_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith('.png'):
                png_files.append(os.path.join(root, file))

    if not png_files:
        print(f"경고: '{folder_path}' 폴더에 PNG 파일이 없습니다.")
        return None

    print(f"총 {len(png_files)}개의 PNG 파일을 처리합니다...")

    # 처리 성공 및 실패 카운트
    success_count = 0
    failed_count = 0

    # 각 PNG 파일을 글리프로 변환
    for image_path in png_files:
        # 파일명에서 글자 추출 (확장자 제외)
        filename = os.path.basename(image_path)
        base_name = os.path.splitext(filename)[0]

        code_point = base_name

        if not is_unicode: # 파일이름이 유니코드가 아닌 경우 unicode얻어오기
            code_point = get_unicode(filename)

        if code_point is None:
            print(f"경고: '{filename}'의 파일명이 한 글자가 아니라서 건너뜁니다.")
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
                print(f"  > '{base_name}' 글리프 생성 성공")
            else:
                failed_count += 1
                print(f"  > '{base_name}' 글리프 생성 실패: 이미지 임포트 오류")

        except Exception as e:
            failed_count += 1
            print(f"  > '{base_name}' 글리프 생성 실패: {str(e)}")

    # 처리 결과 출력
    print(f"\n처리 완료: 성공 {success_count}개, 실패 {failed_count}개")

    if success_count > 0:
        # 폰트 생성
        print(f"폰트 파일 생성 중: {output_ttf}")
        font.generate(output_ttf)
        print(f"폰트 생성 완료: {output_ttf}")
        return output_ttf
    else:
        print("성공적으로 생성된 글리프가 없어 폰트를 생성하지 않습니다.")
        return None

# 사용 예시
if __name__ == "__main__":
    # 이미지가 있는 폴더 경로를 지정하세요
    folder_path = "./output"
    output_ttf = "generate_font.ttf"

    create_font_from_folder(folder_path, output_ttf, "MyKoreanFont")

    