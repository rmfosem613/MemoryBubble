import useUserStore from '@/stores/useUserStore';

export const useIsLoggedIn = () => useUserStore((state) => !!state.user.userId);
export const useHasCompleteProfile = () =>
  useUserStore((state) => !!state.user.familyId && !!state.user.birth);

export const useIsAdmin = () =>
  useUserStore((state) => state.user.role == 'ADMIN');

export const useUserStatus = () => {
  const isLoggedIn = useIsLoggedIn();
  const hasCompleteProfile = useHasCompleteProfile();
  const isAdmin = useIsAdmin();

  return { isLoggedIn, hasCompleteProfile, isAdmin };
};
