import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
interface AuthGuardProps {
    requiredFeature?: string;
    roles?: string[]
}

const AuthGuard = ({ requiredFeature, roles }: AuthGuardProps) => {
    const { token, user } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredFeature) {
        const hasPermission = user?.features?.includes(requiredFeature);

        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    if (roles && roles.length > 0) {
        const hasRequiredRole = user?.roles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default AuthGuard;
