import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const AuthenticatedRoute = ({ children }) => {
  const { initialized, user, loading } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[#06b6d4]" />
          <p className="text-sm font-medium text-white/60 animate-pulse">Checking session...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthenticatedRoute;
