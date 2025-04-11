import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import { ReactNode } from 'react';

interface RouteProps {
  children?: ReactNode;
}

// 사용자 권한 검증을 위한 커스텀 훅 (export 추가)
export const useAuth = () => {
  const { user } = useUserStore();
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  const hasFamilyId = !!user.familyId;
  const hasCompletedProfile = !!user.birth;
  const isAdmin = user.role === 'ADMIN';

  return {
    isAuthenticated,
    hasFamilyId,
    hasCompletedProfile,
    isAdmin,
  };
};

// 로그인하지 않은 사용자만 접근 가능한 라우트 (OAuthCallback용)
export const OAuthRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, hasFamilyId, hasCompletedProfile } = useAuth();

  if (isAuthenticated) {
    // 로그인 되어 있으면, 상태에 따라 적절한 페이지로 리다이렉션
    if (!hasFamilyId) {
      return <Navigate to="/enter" replace />;
    } else if (!hasCompletedProfile) {
      return <Navigate to="/join" replace />;
    } else {
      return <Navigate to="/main" replace />;
    }
  }
  return children || <Outlet />;
};

// 로그인 상태에 상관없이 누구나 접근 가능한 라우트 (LandingWithIntro)
export const PublicRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, hasFamilyId, hasCompletedProfile } = useAuth();

  if (isAuthenticated) {
    if (!hasFamilyId) {
      // 가족 정보가 없는 경우
      return <Navigate to="/enter" replace />;
    } else if (!hasCompletedProfile) {
      // 가족 정보는 있지만 프로필 정보가 없는 경우
      return <Navigate to="/join" replace />;
    }
    // 그 외에는 접근 허용 (로그인 + 가족정보 + 프로필정보 모두 있음)
  }
  return children || <Outlet />;
};

// 가족 생성/가입 라우트 - 인증 필요 + 가족이 없어야 함
export const FamilyCreationRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, hasFamilyId, hasCompletedProfile } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 가족정보가 이미 있는 경우
  if (hasFamilyId) {
    // 프로필 정보도 있으면 메인으로, 없으면 프로필 생성 페이지로
    return <Navigate to={hasCompletedProfile ? '/main' : '/join'} replace />;
  }

  return children || <Outlet />;
};

// 프로필 생성 라우트 - 인증 + 가족 필요 + 프로필이 없어야 함
export const ProfileCreationRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, hasFamilyId, hasCompletedProfile } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // 가족정보가 없는 경우
  if (!hasFamilyId) {
    return <Navigate to="/enter" replace />;
  }
  // 프로필 정보가 이미 있는 경우
  if (hasCompletedProfile) {
    return <Navigate to="/main" replace />;
  }
  return children || <Outlet />;
};

// 완전히 보호된 라우트 - 인증, 가족, 프로필 정보 모두 필요
export const ProtectedRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, hasFamilyId, hasCompletedProfile } = useAuth();

  // 인증 확인
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // 가족 정보 확인
  if (!hasFamilyId) {
    return <Navigate to="/enter" replace />;
  }
  // 프로필 정보 확인
  if (!hasCompletedProfile) {
    return <Navigate to="/join" replace />;
  }
  return children || <Outlet />;
};

// 관리자 라우트 - 인증 + 관리자 역할만 필요
export const AdminRoute = ({ children }: RouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // 인증이 안 된 경우 로그인 페이지로
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  // 관리자가 아닌 경우 메인으로
  if (!isAdmin) {
    return <Navigate to="/main" replace />;
  }

  return children || <Outlet />;
};
