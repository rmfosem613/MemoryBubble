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
      // 정적 에셋 처리 개선
    build: {
        assetsDir: 'assets',
        // 빌드 명령 실행 시 콘솔에 상세 정보 출력
        reportCompressedSize: true,
        rollupOptions: {
            output: {
                // 청크 이름 커스터마이징
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
                // 에셋 파일명 형식 지정
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const extType = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        return `assets/images/[name]-[hash][extname]`;
                    }
                    if (/woff|woff2|ttf|eot/i.test(extType)) {
                        return `assets/fonts/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                },
            },
        },
    },
    // 퍼블릭 디렉토리와 에셋 설정
    publicDir: 'public',
})
