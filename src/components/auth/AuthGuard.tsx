import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Position, Roles } from '@/utils/roles';
interface AuthGuardProps {
    requiredPosition?: string[];
    roles?: string[]
}

const AuthGuard = ({ requiredPosition, roles }: AuthGuardProps) => {
    const { token, user } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user?.positions?.includes(Position.ADMIN) || user?.roles.includes(Roles.ADMIN)) {
        return <Outlet />
    }

    if (requiredPosition && requiredPosition.length > 0 && user?.positions && user?.positions.length > 0) {
        const hasPermission = user?.positions.some(position => requiredPosition.includes(position));
        if (!hasPermission) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    if (roles && roles.length > 0 && user?.roles && user?.roles.length > 0) {
        const hasRequiredRole = user?.roles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};

export default AuthGuard;
