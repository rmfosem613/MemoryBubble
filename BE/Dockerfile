# 기본 이미지로 openjdk 사용
FROM openjdk:17-slim

# 컨테이너 내부의 작업 디렉토리를 /app으로 설정
WORKDIR /app

# 로컬 빌드 디렉토리에서 생성된 JAR 파일을 컨테이너 내부로 복사
COPY build/libs/MemoryBubble-0.0.1-SNAPSHOT.jar /app/MemoryBubble-0.0.1-SNAPSHOT.jar

# application-private.yml 파일을 컨테이너 내부로 복사
COPY ./src/main/resources/application-private.yml /app/src/main/resources/application-private.yml

# 컨테이너가 8081 포트를 사용함을 문서화
EXPOSE 8081

# 컨테이너 시작 시 JAR 파일을 실행하는 명령어 설정
ENTRYPOINT ["sh", "-c", "java -jar /app/MemoryBubble-0.0.1-SNAPSHOT.jar"]