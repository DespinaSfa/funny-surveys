import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Ladeanzeige, bis die Authentifizierung überprüft wurde
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;