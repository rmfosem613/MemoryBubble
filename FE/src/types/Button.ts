// 버튼 props
export interface ButtonType {
  icon?: string
  name?: string
  color: string
  onClick?: () => void
}

// 아이콘 스타일 전용 props
export interface IconProps {
  icon?: string
}