import { ButtonType } from '@/types/Button'
import { Icon } from './Icon'
import { iconStyle } from './ButtonStyle'

function Button({ icon, name, color }: ButtonType) {
  return (
    <>
      {/* 버튼을 감싸는 div의 크기를 지정해주면 너비가 가득 차지함 */}
      <button
        className={`
          w-full
          ${iconStyle[color].bg} 
          ${iconStyle[color].text} 
          border-2 
          ${iconStyle[color].border} 
          flex items-center justify-center 
          rounded-[8px] 
          font-subtitle-1
          pt-[5px] pb-[5px] pl-[12px] pr-[12px]
          md:pt-[9px] md:pb-[9px] md:pl-[16px] md:pr-[16px]
          lg:pt-[14px] lg:pb-[14px] lg:pl-[24px] lg:pr-[24px]
        `}
      >
        <Icon icon={icon} />

        <span className="text-subtitle-1-sm md:text-subtitle-1-md lg:text-subtitle-1-lg font-subtitle-1">
          {name}
        </span>
      </button>
    </>
  );
}

export default Button;