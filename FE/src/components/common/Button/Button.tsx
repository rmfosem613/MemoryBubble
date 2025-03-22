import { ButtonType } from '@/types/Button';
import { Icon } from './Icon';
import { iconStyle } from './ButtonStyle';

// 두 가지 버전의 버튼 사용 가능
// <Button icon='send' name='보내기' color='blue'>
// <Button name='보내기' color='blue'>
function Button({ icon, name, color, onClick }: ButtonType) {
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
          flex items-center justify-center space-x-1 
          rounded-[8px] 
          font-p-500
          pt-[13px] pb-[13px] pl-[12px] pr-[12px]
          md:pt-[13px] md:pb-[13px] md:pl-[16px] md:pr-[16px]
          lg:pt-[13px] lg:pb-[13px] lg:pl-[24px] lg:pr-[24px]
        `}
        onClick={onClick}>
        <Icon icon={icon} />

        {/* name 값이 없을 때 여백 뜨지 않게 */}
        {name && (
          <span className="text-subtitle-1-sm md:text-subtitle-1-md lg:text-subtitle-1-lg font-p-500">
            {name}
          </span>
        )}
      </button>
    </>
  );
}

export default Button;
