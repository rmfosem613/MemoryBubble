import json
from pathlib import Path
from PIL import Image
from itertools import chain

import torch
from sconf import Config
from torchvision import transforms

transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])
import pdb
from collections import defaultdict
from base.dataset import read_font, render
from base.utils import save_tensor_to_image, load_reference
from LF.models import Generator
from inference import infer_LF

from LF.models import Generator
from inference import infer_LF

def load_reference(data_dir, extension, ref_chars):
    if extension == "ttf":
        key_font_dict, key_ref_dict = load_ttf_data(data_dir, char_filter=ref_chars, extension=extension)

        def load_img(key, char):
            return render(key_font_dict[key], char)
    else:
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

    weight_path = "result/lf2-20/checkpoints/200000.pth" 
    # weight_path = "result/lf2/checkpoints/100000.pth" 
    emb_dim = 8
    decomposition = "data/kor/decomposition.json"  #{가:[ㄱ,ㅏ],...}
    primals = "data/kor/primals.json"  # ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ', 'ㅏ', 'ㅑ', 'ㅓ', 'ㅕ',  
                                       # 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ']


    decomposition = json.load(open(decomposition))
    primals = json.load(open(primals))
    n_comps = len(primals)

    def decompose_to_ids(char):
        dec = decomposition[char]
        comp_ids = [primals.index(d) for d in dec]
        return comp_ids

    cfg = Config("cfgs/LF/p2/default.yaml")
    gen = Generator(n_comps=n_comps, emb_dim=emb_dim).cuda().eval()

    # add_safe_globals([ScalarFloat, CommentedSeq])
    weight = torch.load(weight_path, weights_only=False)
    if "generator_ema" in weight:
        weight = weight["generator_ema"]
    gen.load_state_dict(weight)

    ref_path = "./dataset/user"
    extension = "png"
    # ref_chars = "값같곬곶깎넋늪닫닭닻됩뗌략몃밟볘뺐뽙솩쐐앉않얘얾엌옳읊죨쮜춰츌퀭틔핀핥훟"    # 36자
    ref_chars = "값같곬곶깎꽃넋녘늪닫닭닻됩뗌략릎많몃밝밟볘뺐뽙삶섧솩쌓쐐앉얹않앓얘얾엌옳읊죨쮜쯢춰츌퀭틔핀핥훑훟"  # 48자
    # ref_chars = "값릎쯢훑"    # 4자
    ref_dict, load_img = load_reference(ref_path, extension, ref_chars)

    print("ref_dict 내용:", ref_dict)
    print("ref_dict 키 목록:", list(ref_dict.keys()))
    print("ref_dict가 비어 있나요?", len(ref_dict) == 0)
    
    # 모든 한글 글자 생성 (가-힣)
    korean_chars = ""
    for code in range(ord('가'), ord('힣') + 1):
        korean_chars += chr(code)

    save_dir = Path("./model_output")
    source_path = "data/kor/source.ttf"
    source_ext = "ttf"
    batch_size = 16
    
    # pdb.set_trace()
    infer_LF(gen, save_dir, source_path, source_ext, korean_chars, ref_dict, load_img,
         decomposition, primals, batch_size)


if __name__ == "__main__":
    infer_all_char()
    