import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
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
                    console.log(token, 'is valid')
                } else {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                    }
                    setIsAuthenticated(false);
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
