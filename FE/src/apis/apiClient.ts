import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://memorybubble.site', // API 서버 주소
  // baseURL: 'http://localhost:8080',
});

// API 요청 시 모든 요청 헤더에 access token 포함
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // access token 만료 시 refresh token으로 새 access token 요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          'https://memorybubble.site/api/auth/reissue',
          // 'http://localhost:8080/api/auth/reissue',
          { refreshToken: refreshToken },
        );

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신 샐패 : ', refreshError);

        // 모든 인증 관련 데이터 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 로그인 페이지로 리다이렉트
        window.location.href = '/kakao';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
