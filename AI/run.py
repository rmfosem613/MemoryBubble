import torch
import json
import random
import os
from sconf import Config
from collections import defaultdict
from pathlib import Path
from PIL import Image
from torchvision import transforms
import pdb


from DM.models import Generator
from inference import infer_DM

def load_reference(data_dir, extension, ref_chars):
    key_dir_dict, key_ref_dict = load_img_data(data_dir, char_filter=ref_chars, extension=extension)
    print(ref_chars)
    def load_img(key, char):
        return Image.open(str(key_dir_dict[key][char] / f"{char}.{extension}"))

    return key_ref_dict, load_img

def sample(population, k):
    if len(population) < k:
        sampler = random.choices
    else:
        sampler = random.sample
    sampled = sampler(population, k=k)
    return sampled


def load_img_data(data_dirs, char_filter=None, extension="png", n_font=None):
    data_dirs = [data_dirs] if not isinstance(data_dirs, list) else data_dirs
    char_filter = set(char_filter) if char_filter is not None else None

    key_dir_dict = defaultdict(dict)
    key_char_dict = defaultdict(list)

    for pathidx, path in enumerate(data_dirs):
        _key_dir_dict, _key_char_dict = load_img_data_from_single_dir(path, char_filter, extension, n_font)
        for _key in _key_char_dict:
            key_dir_dict[_key].update(_key_dir_dict[_key])
            key_char_dict[_key] += _key_char_dict[_key]
            key_char_dict[_key] = sorted(set(key_char_dict[_key]))

    return dict(key_dir_dict), dict(key_char_dict)


def load_img_data_from_single_dir(data_dir, char_filter=None, extension="png", n_font=None):
    # pdb.set_trace()
    data_dir = Path(data_dir)

    key_dir_dict = defaultdict(dict)
    key_char_dict = {}

    fonts = [x.name for x in data_dir.iterdir() if x.is_dir() and not x.name.startswith('.')]
    if n_font is not None:
        fonts = sample(fonts, n_font)

    for key in fonts:
        # chars = [x.stem for x in (data_dir / key).glob(f"*.{extension}")]
        # print(set(chars))
        # print(fonts)
        # print(char_filter)
        chars = list(char_filter)

        # if char_filter is not None:
        #     filter_list = list(char_filter)
        #     print(filter_list)
        #     chars = [c for c in chars if c in filter_list]
        #     print(chars)

        if not chars:
            print(key, "is excluded! (no available characters)")
            continue
        else:
            key_char_dict[key] = list(chars)
            for char in chars:
                key_dir_dict[key][char] = (data_dir / key)

    return dict(key_dir_dict), key_char_dict

def infer_all_char():

    weight_path = "result/dm/checkpoints/last.pth"  
    decomposition = "data/kor/decomposition_DM.json"
    n_heads = 3
    n_comps = 68

    cfg = Config("cfgs/DM/default.yaml")
    decomposition = json.load(open(decomposition))
    
    gen = Generator(n_heads=n_heads, n_comps=n_comps).cuda().eval()

    weight = torch.load(weight_path, weights_only=False)
    gen.load_state_dict(weight["generator_ema"])

    ref_path = "./dataset/user"
    extension = "png"
    # ref_chars = "값같곬곶깎넋늪닫닭닻됩뗌략몃밟볘뺐뽙솩쐐앉않얘얾엌옳읊죨쮜춰츌퀭틔핀핥훟"    # 36자
    ref_chars = "값같곬곶깎꽃넋녘늪닫닭닻됩뗌략릎많몃밝밟볘뺐뽙삶섧솩쌓쐐앉얹않앓얘얾엌옳읊죨쮜쯢춰츌퀭틔핀핥훑훟"  # 48자
    ref_dict, load_img = load_reference(ref_path, extension, ref_chars)

    print("ref_dict 내용:", ref_dict)
    print("ref_dict 키 목록:", list(ref_dict.keys()))
    print("ref_dict가 비어 있나요?", len(ref_dict) == 0)
    
    # 모든 한글 글자 생성 (가-힣)
    korean_chars = ""
    for code in range(ord('가'), ord('힣') + 1):
        korean_chars += chr(code)

    save_dir = Path("./model_output")
    batch_size = 16
    

    infer_DM(gen, save_dir, korean_chars, ref_dict, load_img, decomposition, batch_size)


    files = []
    for filename in os.listdir(save_dir):
        files.append(filename)
    
    print(f"{save_dir}에 {len(files)} 파일 저장")


if __name__ == "__main__":
    infer_all_char()
    