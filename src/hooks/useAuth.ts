import { useAuthApi } from './useAuthApi';

export const useAuth = () => {
  const { user, loading, error, login, logout, isAuthenticated } = useAuthApi();

  const isAdmin = user?.role === 'admin';

  return {
    user,
    // keep both names for backward-compat:
    loading,            // many components expect `loading`
    isLoading: loading, // some places used `isLoading`
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };
};
