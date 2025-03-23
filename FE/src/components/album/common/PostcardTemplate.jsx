import React from 'react';
import upFlower from '@/assets/postCard/flower_up.svg';
import downFlower from '@/assets/postCard/flower_under.svg';

function PostcardTemplate() {
  return (
    <div>
      <img
        src={upFlower}
        className="absolute top-[10px] left-[10px] z-0 w-[110px] lg:w-[130px] md:w-[120px] pointer-events-none"
        alt="장식 꽃"
      />
      <img
        src={downFlower}
        className="absolute bottom-0 right-0 z-0 w-[140px] lg:w-[160px] md:w-[150px] pointer-events-none"
        alt="장식 꽃"
      />
    </div>
  );
}

export default PostcardTemplate;
