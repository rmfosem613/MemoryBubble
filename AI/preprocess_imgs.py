from PIL import Image, ImageDraw
import os
from PIL import Image, ImageDraw
from get_unicode_from_filename import get_unicode


def preprocess_imgs(folder_path, is_debug = True):
    """
    Process all images in the given folder, sorting them by filename.
    For each image, crop according to the grid logic and save individual alphabet images.
    
    Args:
        folder_path: Path to the folder containing images to process
    """
    # 폴더 내 이미지 파일 찾기
    image_files = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
            image_files.append(filename)
    
    # 파일명으로 정렬
    image_files.sort()
    
    print(f"총 {len(image_files)}개의 이미지 파일을 찾았습니다.")
    # 한글 char 리스트 36개 + 한글 자모모
    han1 = ['값', '같', '곬', '곶', '깎',
           '넋', '늪', '닫', '닭', '닻',
           '됩', '뗌', '략', '몃', '밟',
           '볘', '뺐', '뽙', '솩', '쐐',
           '앉', '않', '얘', '얾', '엌',
           '옳', '읊', '죡', '쮜', '춰']
    
    han2 = ['츄', '퀭', '틔', '핀', '핥',
           '훟', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
           'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ', 'ㄹ',
           'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
           'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅃ',
           'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ']
    
    han3 = ['ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ',
           'ㅎ', 'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ',
           'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ',
           'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
           'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ',
           'ㅢ', 'ㅣ']
    
    symbol = ['!', '@', '#', '$', '%',
              '^', '&', '*', '(', ')',
              '-', '=', '+', '/', '\\',
              '[', ']', '{', '}', ';',
              ':', '\'', '\"', '<', '>',
              ',', '.', '?', '~']
    # 알파벳 리스트 - 출력할 알파벳 순서
    abc1 = [
        'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y',
        'Z', 'a', 'b', 'c', 'd'
    ]

    abc2 = [ 'e', 'f', 'g' , 'h', 'i',
            'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's',
            't', 'u', 'v', 'w', 'x',
            'y', 'z', '0', '1', '2', 
            '3', '4', '5', '6', '7']
    
    abc3 = ['8', '9']

    character_dict = {
    'han1': han1,
    'han2': han2,
    'han3': han3,
    'symbol': symbol,
    'abc1': abc1,
    'abc2': abc2,
    'abc3': abc3
    }

    dict_keys = list(character_dict.keys())
    
    # 각 이미지 파일 처리
    for idx, img_file in enumerate(image_files):
        print(f"\n파일 처리 중: {img_file}")
        image_path = os.path.join(folder_path, img_file)     

        try:
            img = Image.open(image_path)
        except Exception as e:
            print(f"이미지를 열 수 없습니다: {e}")
            return

        # 이미지 크기 확인
        width, height = img.size
        print(f"전체 이미지 크기: {width} x {height}")

        # 표 구조 정의 - 고정된 행/열 수
        cols = 5
        rows = 12  # 6쌍(레이블 행 + 문자 행)

        # DPI 설정
        dpi = 120  # 일반적인 화면 해상도, 필요시 조정

        # 직접 설정하는 값들 (필요에 따라 수정하세요)
        short_row_cm = 0.8  # 짧은 행(레이블 행) 높이
        tall_row_cm = 3.5 # 긴 행(문자 행) 높이
        left_margin_cm = 1.8
        right_margin_cm = 1.8
        top_margin_cm = 2.15

        # cm를 픽셀로 변환
        left_margin_px = int((left_margin_cm / 2.54) * dpi)
        right_margin_px = int((right_margin_cm / 2.54) * dpi)
        top_margin_px = int((top_margin_cm / 2.54) * dpi)
        short_row_px = int((short_row_cm / 2.54) * dpi)
        tall_row_px = int((tall_row_cm / 2.54) * dpi)

        print(f"좌측 여백: {left_margin_px}px, 우측 여백: {right_margin_px}px, 상단 여백: {top_margin_px}px")
        print(f"짧은 행 높이: {short_row_px}px, 긴 행 높이: {tall_row_px}px")

        # 표의 실제 영역 계산 (여백 제외)
        table_left = left_margin_px
        table_right = width - right_margin_px
        table_top = top_margin_px
        table_width = table_right - table_left

        # 표 영역 크롭
        table_img = img.crop((table_left, table_top, table_right, height))
        table_width = table_right - table_left
        table_height = height - table_top

        print(f"표 영역: 좌={table_left}, 상={table_top}, 우={table_right}, 하={height}")
        print(f"표 크기: {table_width} x {table_height}")

        # 디버깅 이미지 준비
        debug_img = table_img.copy()
        draw = ImageDraw.Draw(debug_img)


        # 열 구분선 위치 계산 - 균등 분할
        col_positions = []
        for i in range(cols + 1):
            pos = int(i * table_width / cols)
            col_positions.append(pos)

        # 행 구분선 위치 계산
        # 두 가지 높이의 행이 번갈아 나타남 (레이블 행: 작음, 문자 행: 큼)
        row_positions = [0]  # 첫 번째 행 시작
        current_height = 0

        # 행 위치 계산 - 직접 지정한 값 사용
        for i in range(6):  # 6개의 행 쌍 (레이블 행 + 문자 행)
            # 레이블 행 추가
            current_height += short_row_px
            row_positions.append(current_height)
            
            # 문자 행 추가
            current_height += tall_row_px
            row_positions.append(current_height)

        # 마지막 행이 이미지 크기를 넘어가지 않도록 조정
        if row_positions[-1] > table_height:
            row_positions[-1] = table_height

        # 그리드 라인 그리기
        for x in col_positions:
            draw.line([(x, 0), (x, table_height)], fill="red", width=2)

        for y in row_positions:
            draw.line([(0, y), (table_width, y)], fill="blue", width=2)

        # 디버깅 폴더 생성
        if(is_debug):
            debug_dir = "디버그_이미지"
            os.makedirs(debug_dir, exist_ok=True)
        
            # 파일명에서 확장자 제외한 이름 추출
            base_name = os.path.basename(image_path)
            base_name_no_ext = os.path.splitext(base_name)[0]
        
            # 디버깅 이미지 저장
            debug_grid_path = os.path.join(debug_dir, f"debug_grid_{base_name_no_ext}.png")
            debug_img.save(debug_grid_path)
            print(f"그리드 라인이 표시된 이미지 저장됨: {debug_grid_path}")

        
        # 알파벳 위치 계산 및 추출
        char_list = character_dict[dict_keys[idx]]
        char_positions = []
        char_idx = 0

        # 문자 행만 처리 (홀수 인덱스의 행: 1, 3, 5, ...)
        for row_idx in range(1, len(row_positions)-1, 2):
            for col_idx in range(len(col_positions)-1):
                if char_idx < len(char_list):
                    char = char_list[char_idx]
                    
                    # 셀 경계 확인 (좌표가 유효한지 확인)
                    left = col_positions[col_idx]
                    right = col_positions[col_idx + 1]
                    top = row_positions[row_idx]
                    bottom = row_positions[row_idx + 1]
                    
                    # 유효성 검사 - 좌표가 올바른지 확인
                    if left < right and top < bottom and right <= table_width and bottom <= table_height:
                        # 위치 저장
                        char_positions.append((char, left, top, right, bottom))
                        
                        if(is_debug):
                            # 디버그 이미지에 셀 및 알파벳 표시
                            draw.rectangle([left, top, right, bottom], outline="green", width=2)
                            draw.text((left + 5, top + 5), char, fill="red")
                        
                        char_idx += 1
                    else:
                        print(f"오류: 좌표가 잘못됨 - ({left}, {top}, {right}, {bottom})")

        if(is_debug):
            # 디버깅 이미지 저장
            debug_cells_path = os.path.join(debug_dir, f"debug_alphabet_cells_{base_name_no_ext}.png")
            debug_img.save(debug_cells_path)
            print(f"알파벳 셀 위치가 표시된 이미지 저장됨: {debug_cells_path}")

        output_dir = './output'

        # 저장할 디렉토리 생성
        os.makedirs(output_dir, exist_ok=True)

        # 이미지 크롭 및 저장
        saved_count = 0
        for char, left, top, right, bottom in char_positions:
            try:
                # 경계 유효성 다시 확인
                if left >= right or top >= bottom:
                    print(f"경고: 알파벳 {char}의 좌표가 유효하지 않아 건너뜁니다. ({left}, {top}, {right}, {bottom})")
                    continue
                    
                # 이미지 크롭 (여백 없음)
                # crop_left = left
                # crop_right = right
                # crop_top = top
                # crop_bottom = bottom

                padding = 10
                crop_left = left + padding
                crop_right = right - padding
                crop_top = top + padding
                crop_bottom = bottom - padding

                # 조정된 좌표가 유효한지 확인
                if crop_left >= crop_right or crop_top >= crop_bottom:
                    print(f"경고: 패딩 적용 후 {char}의 좌표가 유효하지 않아 원본 좌표 사용. ({crop_left}, {crop_top}, {crop_right}, {crop_bottom})")
                    crop_left = left
                    crop_right = right
                    crop_top = top
                    crop_bottom = bottom
                
                # 이미지 크롭
                cell = table_img.crop((crop_left, crop_top, crop_right, crop_bottom))

                # 이미지 리사이즈 (원하는 크기로 지정)
                target_size = (128, 128)  # 예: 64x64 픽셀로 모든 이미지 통일
                cell = cell.resize(target_size, Image.LANCZOS)  # LANCZOS는 품질 좋은 리사이징 알고리즘

                #유니코드 계산
                codepoint = get_unicode(char)
                
                # 파일 저장 - 유니코드명으로 저장장
                file_name = f"{codepoint}.png"
                file_path = os.path.join(output_dir, file_name)
                
                cell.save(file_path, format="PNG")
                
                print(f"{char} 이미지 저장 완료: {file_path}")
                saved_count += 1
            except Exception as e:
                print(f"{char} 처리 중 오류 발생: {e}")

        print(f"총 {saved_count}개의 알파벳 이미지가 {output_dir} 폴더에 저장되었습니다.")
        
        




    

# 사용 예시
if __name__ == "__main__":
    # 이미지가 있는 폴더 경로 지정
    images_folder = "./dataset/templete"  
    preprocess_imgs(images_folder)