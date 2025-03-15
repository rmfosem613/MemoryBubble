import { Send, Mic, PenLine } from 'lucide-react'
import { IconProps } from '@/types/Button';

// IconMark 종류는 3개
const iconMark = {
  send: Send,
  mic: Mic,
  pen: PenLine
};

export function Icon({ icon }: IconProps) {

  // icon이 null 이면 icon 표시x
  if (!icon) return null

  const IconComponent = iconMark[icon]

  return (
    // icon 크기 반응형
    <IconComponent
      className="mr-[8px] w-[20px] h-[20px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px]"
      strokeWidth={1}
    />
  )
}

export default Icon