import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import { ReactNode, useMemo } from 'react';

interface RouteProps {
  children?: ReactNode;
}

const useRouteAuth = () => {
  const { user } = useUserStore();
  const isAuthenticated = localStorage.getItem('accessToken') !== null;
  const hasFamilyId = !!user.familyId;
  const hasCompletedProfile = !!user.birth;

  // 사용자 상태에 따른 적절한 리다이렉트 경로 반환
  const getRedirectPath = () => {
    if (!isAuthenticated) {
      return '/kakao';
    }
    
    if (!hasFamilyId) {
      return '/enter';
    }
    
    if (!hasCompletedProfile) {
      return '/join';
    }
    
    return '/'; // 모든 조건 충족 시 메인으로
  };

  return {
    isAuthenticated,
    hasFamilyId,
    hasCompletedProfile,
    getRedirectPath,
    // 특정 라우트 접근 가능 여부 확인 함수들
    canAccessProtectedRoute: isAuthenticated && hasFamilyId && hasCompletedProfile,
    canAccessFamilyCreation: isAuthenticated && !hasFamilyId,
    canAccessProfileCreation: isAuthenticated && hasFamilyId && !hasCompletedProfile,
    canAccessNonAuth: !isAuthenticated
  };
};

// 완전히 보호된 라우트 - 인증, 가족, 프로필 정보 모두 필요
export const ProtectedRoute = ({ children }: RouteProps) => {
  const { canAccessProtectedRoute, getRedirectPath } = useRouteAuth();

  if (!canAccessProtectedRoute) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children || <Outlet />;
};

// 가족 생성/가입 라우트 - 인증 필요 + 가족이 없어야 함
export const FamilyCreationRoute = ({ children }: RouteProps) => {
  const { canAccessFamilyCreation, getRedirectPath } = useRouteAuth();

  if (!canAccessFamilyCreation) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children || <Outlet />;
};

// 프로필 생성 라우트 - 인증 + 가족 필요 + 프로필이 없어야 함
export const ProfileCreationRoute = ({ children }: RouteProps) => {
  const { canAccessProfileCreation, getRedirectPath } = useRouteAuth();

  if (!canAccessProfileCreation) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children || <Outlet />;
};

// 인증되지 않은 사용자만 접근 가능한 라우트 컴포넌트
export const NonAuthRoute = ({ children }: RouteProps) => {
  const { canAccessNonAuth, getRedirectPath } = useRouteAuth();
  
  if (!canAccessNonAuth) {
    return <Navigate to={getRedirectPath()} replace />;
  }

  return children || <Outlet />;
};