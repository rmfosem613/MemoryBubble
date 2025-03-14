// 버튼 props
export interface ButtonType {
  icon?: 'send' | 'mic' | 'pen' | null
  name: string
  color: 'blue' | 'white'
}

// 아이콘 스타일 전용 props
export interface IconProps {
  icon?: 'send' | 'mic' | 'pen' | null
}