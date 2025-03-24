import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@apis': fileURLToPath(new URL('./src/apis', import.meta.url)), // API 호출 관련 함수
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)), // 재사용 가능한 컴포넌트
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)), // 커스텀 훅
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)), // 페이지별 컴포넌트
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)), // zustand 컴포넌트
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)), // 타입 정의 재사용 (User.ts, Product.ts 등등)
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)), // 유틸 함수 (데이터 포맷 변환, 공통 함수 등)
    },
  },
  // 퍼블릭 디렉토리와 에셋 설정
  publicDir: 'public',
  base: '/',
})
