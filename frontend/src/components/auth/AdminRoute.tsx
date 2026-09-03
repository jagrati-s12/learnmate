import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminRoute = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full border-4 border-t-purple-600 h-12 w-12"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (!user || !user.is_admin) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return <Outlet />;
};
