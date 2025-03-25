import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://memorybubble.site', // API 서버 주소
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
        const { data } = await apiClient.post(
          '/api/auth/reissue',
          {},
          {
            headers: { refreshToken: refreshToken },
          },
        );

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신 샐패 : ', refreshError);
        localStorage.clear();
        // Todo: 새 access token 갱신 실패 시 로직 처리하기
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
