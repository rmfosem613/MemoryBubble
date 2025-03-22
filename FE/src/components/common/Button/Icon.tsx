import { Send, Mic, PenLine, ArrowLeft, ArrowRight } from 'lucide-react'
import { IconProps } from '@/types/Button';

// IconMark 종류는 5개
const iconMark = {
  send: Send,
  mic: Mic,
  pen: PenLine,
  left: ArrowLeft,
  right: ArrowRight
};

export function Icon({ icon }: IconProps) {

  // icon이 null 이면 icon 표시x
  if (!icon) return null

  const IconComponent = iconMark[icon]

  return (
    // icon 크기 반응형
    <IconComponent
      className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] lg:w-[24px] lg:h-[24px]"
      strokeWidth={1}
    />
  )
}

export default Icon