from PIL import Image, ImageDraw
import os
import re
from natsort import natsorted

def preprocess_imgs_direct(folder_path, output_dir, is_debug=True, temp_size=(1654, 2339)):
    """
    폴더 내의 모든 이미지를 처리하여 미리 정의된 문자 시퀀스를 
    그리드 셀과 매칭시킵니다.
    
    Args:
        folder_path: 처리할 이미지가 있는 폴더 경로
        output_dir: 잘라낸 문자 이미지를 저장할 디렉토리
        is_debug: 디버그 이미지를 저장할지 여부
    """
    # 폴더 내 이미지 파일 찾기
    image_files = []
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
            image_files.append(filename)
    
    # 파일명으로 정렬
    image_files.sort()
    print(f"발견된 이미지: {image_files}")
    print(f"총 {len(image_files)}개의 이미지 파일을 찾았습니다.")
    
    # 이미지별 문자 집합 정의
    # (실제 이미지에 맞게 조정 필요)
    char_sets = {
        # 이미지 1 - 한글 문자 (han1)
        0: ['값', '같', '곬', '곶', '깎',
            '꽃', '넋', '녘', '늪', '닫',
            '닭', '닻', '됩', '뗌', '략',
            '릎', '많', '몃', '밝', '밟',
            '볘', '뺐', '뽙', '삶', '섧',
            '솩', '쌓', '쐐', '앉', '얹'
            ],
        
        # 이미지 2 - 추가 한글 문자 (han2)
        1: ['않', '앓', '얘', '얾', '엌',
            '옳', '읊', '죨', '쮜', '쯢',
            '춰', '츌', '퀭', '틔', '핀',
            '핥', '훑', '훟'],
        
        # 이미지 3 - 한글 자음 (han3)
        2: ['ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ',
            'ㄶ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄺ',
            'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
            'ㅀ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅄ',
            'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
            'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
        
        # 이미지 4 - 한글 모음 (han4)
        3: ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
            'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
            'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
            'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
            'ㅣ'],
        
        # 이미지 5 - 특수 기호
        4: ['!', '@', '#', '$', '%',
            '^', '&', '*', '(', ')',
            '-', '=', '+', '/', '\\',
            '[', ']', '{', '}', ';',
            ':', '\'', '\"', '<', '>',
            ',', '.', '?', '~'],
        
        # 이미지 6 - 대문자와 첫 소문자 (abc1)
        5: ['A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O',
            'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y',
            'Z', 'a', 'b', 'c', 'd'],
        
        # 이미지 7 - 나머지 소문자와 숫자 (abc2)
        6: ['e', 'f', 'g', 'h', 'i',
            'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's',
            't', 'u', 'v', 'w', 'x',
            'y', 'z', '0', '1', '2', 
            '3', '4', '5', '6', '7'],
        
        # 이미지 8 - 나머지 숫자 (abc3)
        7: ['8', '9']
    }
    
    # 출력 디렉토리 생성
    os.makedirs(output_dir, exist_ok=True)
    
    # 디버그 디렉토리 생성 (필요한 경우)
    if is_debug:
        debug_dir = "debug_images"
        os.makedirs(debug_dir, exist_ok=True)
    
    # 각 이미지 처리
    for idx, img_file in enumerate(image_files):
        if idx >= len(char_sets):
            print(f"\n더 이상 처리할 문자 집합이 없습니다. 남은 이미지는 건너뜁니다.")
            break
            
        print(f"\n파일 처리 중: {img_file} (집합 {idx})")
        image_path = os.path.join(folder_path, img_file)
        
        try:
            img = Image.open(image_path)

            # 이미지 크기 출력
            original_width, original_height = img.size
            print(f"원본 이미지 크기: {original_width} x {original_height}")

            # 이미지 리사이즈
            img = img.resize(temp_size, Image.LANCZOS)
            print(f"리사이즈된 이미지 크기: {temp_size[0]} x {temp_size[1]}")
            
        except Exception as e:
            print(f"이미지를 열 수 없습니다: {e}")
            continue
        
        # 이 이미지의 문자 집합 가져오기
        char_list = char_sets[idx]
        print(f"이미지 {idx}의 문자 집합: {len(char_list)}개 문자")
        
        # 이미지 크기 가져오기
        width, height = img.size
        print(f"이미지 크기: {width} x {height}")
        
        # 그리드 구조 정의
        cols = 5
        
        # DPI 설정
        dpi = 120

        short_row_cm = 1.1  # 라벨 행 높이
        tall_row_cm = 5.8 # 문자 행 높이
        left_margin_cm = 2.9
        right_margin_cm = 2.9
        top_margin_cm = 3.7
        
        
        # 설정 (필요에 따라 조정) 민주 크기
        # short_row_cm = 0.9  # 라벨 행 높이
        # tall_row_cm = 5.5   # 문자 행 높이
        # left_margin_cm = 2.9
        # right_margin_cm = 2.9
        # top_margin_cm = 3.5

        # 동균크기
        # short_row_cm = 0.8  # 짧은 행(레이블 행) 높이
        # tall_row_cm = 3.5 # 긴 행(문자 행) 높이
        # left_margin_cm = 1.8
        # right_margin_cm = 1.8
        # top_margin_cm = 2.15
        
        # cm를 픽셀로 변환
        left_margin_px = int((left_margin_cm / 2.54) * dpi)
        right_margin_px = int((right_margin_cm / 2.54) * dpi)
        top_margin_px = int((top_margin_cm / 2.54) * dpi)
        short_row_px = int((short_row_cm / 2.54) * dpi)
        tall_row_px = int((tall_row_cm / 2.54) * dpi)

        
        # 실제 테이블 영역 계산 (여백 제외)
        table_left = left_margin_px
        table_right = width - right_margin_px
        table_top = top_margin_px
        table_width = table_right - table_left
        
        print(f"top_margin_cm: {top_margin_cm}")
        print(f"top_margin_px: {top_margin_px}")
        print(f"table_top: {table_top}")
        
        # 테이블 영역 자르기
        table_img = img.crop((table_left, table_top, table_right, height))
        table_width = table_right - table_left
        table_height = height - table_top
        
        # 디버그 이미지 준비
        if is_debug:
            debug_img = table_img.copy()
            draw = ImageDraw.Draw(debug_img)
        
        # 열 위치 계산 - 균등하게 분배
        col_positions = []
        for i in range(cols + 1):
            pos = int(i * table_width / cols)
            col_positions.append(pos)
        
        # 행 위치 계산
        row_positions = [0]  # 첫 번째 행 시작
        current_height = 0
        
        # 직접 지정된 값으로 행 위치 계산
        for i in range(6):  # 6쌍의 행 (라벨 + 문자)
            # 라벨 행 추가
            current_height += short_row_px
            row_positions.append(current_height)
            
            # 문자 행 추가
            current_height += tall_row_px
            row_positions.append(current_height)
        
        # 마지막 행이 이미지 높이를 초과하는 경우 조정
        if row_positions[-1] > table_height:
            row_positions[-1] = table_height
        
        # 디버깅을 위한 그리드 선 그리기
        if is_debug:
            for x in col_positions:
                draw.line([(x, 0), (x, table_height)], fill="red", width=2)
            
            for y in row_positions:
                draw.line([(0, y), (table_width, y)], fill="blue", width=2)
        
        # 문자 셀 위치 목록 생성
        all_cell_positions = []
        for row_idx in range(1, len(row_positions)-1, 2):  # 문자 행만 (홀수 인덱스)
            for col_idx in range(len(col_positions)-1):
                left = col_positions[col_idx]
                right = col_positions[col_idx + 1]
                top = row_positions[row_idx]
                bottom = row_positions[row_idx + 1]
                
                if left < right and top < bottom and right <= table_width and bottom <= table_height:
                    all_cell_positions.append((left, top, right, bottom))
                    if len(all_cell_positions) == len(char_list):
                        break
        
        # 문자와 위치 매핑
        char_positions = []
        for char_idx, char in enumerate(char_list):
            if char_idx >= len(all_cell_positions):
                print(f"경고: 문자 '{char}'에 대한 셀이 없습니다. 건너뜁니다.")
                continue
                
            left, top, right, bottom = all_cell_positions[char_idx]
            char_positions.append((char, left, top, right, bottom))
            
            if is_debug:
                # 디버그 이미지에 셀과 문자 표시
                draw.rectangle([left, top, right, bottom], outline="green", width=2)
                draw.text((left + 5, top + 5), char, fill="red")
        
        # 문자가 있는 디버그 이미지 저장
        if is_debug:
            base_name = os.path.basename(image_path)
            base_name_no_ext = os.path.splitext(base_name)[0]
            debug_cells_path = os.path.join(debug_dir, f"debug_cells_{base_name_no_ext}.png")
            debug_img.save(debug_cells_path)
            print(f"문자 셀 디버그 이미지 저장: {debug_cells_path}")
        
        # 문자 이미지 추출 및 저장
        saved_count = 0
        for char, left, top, right, bottom in char_positions:
            try:
                # 유효한 좌표 확인
                if left >= right or top >= bottom:
                    print(f"경고: 문자 '{char}'에 대한 좌표가 유효하지 않습니다. 건너뜁니다.")
                    continue
                
                # 패딩 추가
                padding = 10
                crop_left = left + padding
                crop_right = right - padding
                crop_top = top + padding
                crop_bottom = bottom - padding
                
                # 패딩 후 유효한 좌표 확인
                if crop_left >= crop_right or crop_top >= crop_bottom:
                    crop_left = left
                    crop_right = right
                    crop_top = top
                    crop_bottom = bottom
                
                # 문자 이미지 잘라내기
                cell = table_img.crop((crop_left, crop_top, crop_right, crop_bottom))
                
                # 목표 크기로 리사이즈
                target_size = (128, 128)
                cell = cell.resize(target_size, Image.LANCZOS)
                
                # 그레이스케일로 변환 및 이진화
                cell = cell.convert('L')
                cell = cell.point(lambda p: 0 if p < 200 else 255)
                
                # 인덱스에 따라 다른 방식으로 파일명 생성
                if idx in [0, 1]:  # 한글 문자(han1, han2)는 문자 그대로 저장
                    file_name = f"{char}.png"
                    save_dir = os.path.join("./dataset/user", "ref_chars")
                else:  # 다른 문자는 유니코드 코드 포인트로 저장
                    codepoint = ord(char)
                    file_name = f"{codepoint}.png"
                    save_dir = output_dir
                    
                # 저장 디렉토리 생성
                os.makedirs(save_dir, exist_ok=True)
                
                file_path = os.path.join(save_dir, file_name)
                cell.save(file_path, format="PNG")
                
                print(f"'{char}' (U+{ord(char):04X}) 이미지 저장: {file_path}")
                saved_count += 1
            except Exception as e:
                print(f"문자 '{char}' 처리 중 오류: {e}")
        
        print(f"이미지 {img_file} 처리: {len(char_list)}개 중 {saved_count}개 문자 이미지를 {output_dir}에 저장했습니다.")

# 사용 예시
if __name__ == "__main__":
    # 경로
    images_folder = "./dataset/template"  
    output_dir = "./cropped_template"
    
    # 처리 방법 선택
    preprocess_imgs_direct(images_folder, output_dir)  