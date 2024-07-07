import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}
const CheckRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.log('No refresh token found');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            console.log('Token refreshed');
        } else {
            console.error('Error refreshing token:', data.message);
            return data.message;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return error;
    }
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/check-token-valid`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                    }
                    console.log('Token invalid. Checking refresh token...');
                    const refreshTokenError = await CheckRefreshToken();
                    if (!refreshTokenError) {
                        console.log('Refresh token successful');
                        setIsAuthenticated(true);
                    } else {
                        console.error('Error refreshing token:', refreshTokenError);
                        setIsAuthenticated(false);
                    }
                }
            } catch (error) {
                console.error('Error checking token:', error);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading }}>
    {children}
    </AuthContext.Provider>
);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
