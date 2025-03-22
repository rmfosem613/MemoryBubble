# 빌드 단계
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 (종속성 설치 최적화)
COPY package*.json ./

# 종속성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# 퍼블릭 디렉토리와 에셋 확인 (디버깅 용)
RUN ls -la /app/src/assets

# 환경 변수 파일 복사 (필요한 경우)
# COPY .env .env

# React 애플리케이션 빌드
RUN npm run build

# 빌드된 결과물 확인 (디버깅 용)
RUN ls -la /app/dist

# 실행 단계
FROM nginx:alpine

# nginx의 기본 설정 파일을 삭제
RUN rm -rf /etc/nginx/conf.d/*

# nginx 설정 복사 (필요한 경우 로컬에 nginx.conf 파일 생성 필요)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 단계에서 생성된 파일을 nginx의 서비스 디렉토리로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 3000 포트 노출
# EXPOSE 80
EXPOSE 3000

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]