import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useUser from './hooks/useUser';
import {
  requestNotificationPermission,
  onMessageListener,
} from './hooks/firebase';

// 보호된 라우트 컴포넌트들
import {
  ProtectedRoute,
  FamilyCreationRoute,
  ProfileCreationRoute,
  NonAuthRoute,
  AdminRoute,
} from './components/ProtectedRoute';

// 페이지 컴포넌트들
import LoadingPage from './pages/LoadingPage';
import BasicPhotoAlbumPage from './pages/BasicPhotoAlbumPage';
import FontPage from './pages/FontPage';
import IntroPage from './pages/IntroPage';
import PhotoAlbumPage from './pages/PhotoAlbumPage';
import WriteLetterPage from './pages/WriteLetterPage';
import CalendarPage from './pages/CalendarPage';
import MainWithLoading from './pages/MainWithLoading';
import LetterStoragePage from './pages/LetterStoragePage';
import EnterPage from './pages/EnterPage';
import JoinPage from './pages/JoinPage';
import CreateGroupPage from './pages/CreateGroupPage';
import Header from './components/header/Header';

// 관리자 페이지
import AdminPage from './pages/AdminPage';
import TestKakaoLogin from './pages/TestKakaoLogin';
import OAuthCallback from './components/oauth/OAuthCallback';
import LandingPage from './pages/LandingPage';
import IntroducePage from './pages/IntroducePage';
// import PWAInstaller from './components/PWAInstaller';

type NotificationPayload = {
  notification?: {
    title?: string;
    body?: string;
  };
};

function App() {
  const { isLoading, checkAuthAndFetchUserData } = useUser();

  // 컴포넌트 마운트 시 인증 확인 및 사용자 정보 요청
  useEffect(() => {
    checkAuthAndFetchUserData();
  }, []);

  // fcm token 요청
  useEffect(() => {
    const initFCM = async (): Promise<void> => {
      await requestNotificationPermission();
    };

    // 포그라운드 메시지 리스너 설정
    onMessageListener()
      .then((payload: NotificationPayload) => {
        if (payload.notification) {
          console.log('Foreground message received:', payload.notification);
          console.log(payload.notification.title);
          console.log(payload.notification.body);
          alert(
            `알림 도착: ${payload.notification.title} ${payload.notification.body}`,
          );
        }
      })
      .catch((err) => console.log('FCM 메시지 리스너 오류:', err));

    initFCM();
  }, []);

  if (isLoading) {
    // 로딩 중일 때 표시할 컴포넌트
    return <LoadingPage message="Now Loading..." />;
  }

  return (
    <div className="font-pretendard font-normal min-w-80">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/introduce" element={<IntroducePage />} />

          {/* 인증이 필요 없는 경로 (로그인하지 않은 사용자만 접근 가능) */}
          <Route element={<NonAuthRoute />}>
            <Route path="/oauth/callback" element={<OAuthCallback />} />
            <Route path="/kakao" element={<TestKakaoLogin />} />
          </Route>

          {/* 가족 생성/가입 페이지 - 인증 필요, 가족 없어야 함 */}
          <Route element={<FamilyCreationRoute />}>
            <Route path="/enter" element={<EnterPage />} />
            <Route path="/create" element={<CreateGroupPage />} />
          </Route>

          {/* 사용자 정보 등록 페이지 - 인증 필요, 가족 있어야 함 */}
          <Route element={<ProfileCreationRoute />}>
            <Route path="/join" element={<JoinPage />} />
          </Route>

          {/* 완전 보호된 경로 - 모든 조건 충족 필요 */}
          <Route element={<ProtectedRoute />}>
            <Route index path="/" element={<MainWithLoading />} />
            <Route path="/font" element={<FontPage />} />
            <Route path="/letter" element={<WriteLetterPage />} />
            <Route path="/album/basic" element={<BasicPhotoAlbumPage />} />
            <Route path="/album" element={<PhotoAlbumPage />} />
            <Route path="/album/:id" element={<PhotoAlbumPage />} />
            <Route path="/storage" element={<LetterStoragePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* 일치하는 경로가 없는 경우 메인으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
