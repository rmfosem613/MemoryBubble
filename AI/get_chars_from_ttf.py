"""
FFG-benchmarks
Copyright (c) 2021-present NAVER Corp.
MIT license
"""
import sys
from tqdm import tqdm
from pathlib import Path

from base.dataset import get_filtered_chars


def main():
    root_dir = sys.argv[1]
    print(root_dir)
    ttffiles = sorted(Path(root_dir).rglob("*.ttf"))

    for ttffile in tqdm(ttffiles):
        txtfile = Path(str(ttffile).replace(".ttf", ".txt"))
        # if txtfile.is_file():
        #     continue
        try:
            avail_chars = get_filtered_chars(ttffile)
            print(f"파일: {ttffile}, 문자 개수: {len(avail_chars)}")  # 디버깅 출력
            
            # 내용 확인
            if avail_chars:
                print(f"첫 10개 문자: {avail_chars[:10]}")
            
            with open(txtfile, "w", encoding="utf-8") as f:  # 인코딩 명시
                content = "".join(avail_chars)
                f.write(content)
                print(f"쓰여진 내용 길이: {len(content)}")
                
            # 파일이 제대로 생성되었는지 확인
            if txtfile.is_file() and txtfile.stat().st_size > 0:
                print(f"파일이 성공적으로 생성됨: {txtfile}")
            else:
                print(f"파일이 비어있거나 생성되지 않음: {txtfile}")
                
        except Exception as e:
            print(f"오류 발생: {ttffile}: {e}")


if __name__ == "__main__":
    main()
