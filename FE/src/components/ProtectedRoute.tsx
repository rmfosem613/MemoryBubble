import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';

interface RouteProps {
  children?: React.ReactNode;
}

// 완전히 보호된 라우트 - 인증, 가족, 프로필 정보 모두 필요
export const ProtectedRoute = ({ children }: RouteProps) => {
  const { user } = useUserStore();
  const isAuthenticated = localStorage.getItem('accessToken') !== null;

  // 로그인이 안 된 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/kakao" replace />;
  }

  // 그룹에 가입되어 있지 않은 경우 그룹 가입 페이지로 리다이렉트
  if (!user.familyId) {
    return <Navigate to="/enter" replace />;
  }

  // 사용자 정보가 등록되어 있지 않은 경우 사용자 정보 등록 페이지로 리다이렉트
  if (!user.birth || !user.name) {
    return <Navigate to="/join" replace />;
  }

  // 모든 조건을 만족하는 경우 자식 컴포넌트 또는 Outlet 렌더링
  return children || <Outlet />;
};

// 가족 생성/가입 라우트 - 인증 필요 + 가족이 없어야 함
export const FamilyCreationRoute = ({ children }: RouteProps) => {
  const { user } = useUserStore();
  const isAuthenticated = localStorage.getItem('accessToken') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/kakao" replace />;
  }

  if (user.familyId) {
    return <Navigate to="/" replace />; // 이미 가족이 있으면 메인으로
  }

  return children || <Outlet />;
};

// 프로필 생성 라우트 - 인증 + 가족 필요 + 프로필이 없어야 함
export const ProfileCreationRoute = ({ children }: RouteProps) => {
  const { user } = useUserStore();
  const isAuthenticated = localStorage.getItem('accessToken') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/kakao" replace />;
  }

  if (!user.familyId) {
    return <Navigate to="/enter" replace />; // 가족이 없으면 입장 페이지로
  }

  if (user.birth) {
    return <Navigate to="/" replace />; // 이미 정보가 있으면 메인으로
  }

  return children || <Outlet />;
};
