import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'sonner';


interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
    oauthLogin: (provider: 'google' | 'github') => Promise<void>;
    setAuthFromToken: (token: string) => void;
}

// Rehydrate user from the stored JWT on every page load.
// Also checks the token's expiry claim — if expired, clears it immediately.
const getInitialUser = (): User | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // exp is in seconds; Date.now() is in milliseconds
        if (payload.exp && payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return null;
        }
        return { id: payload.userId, email: payload.email, role: payload.role };
    } catch {
        localStorage.removeItem('token');
        return null;
    }
};

// Derive initial auth state after the expiry-aware getInitialUser() runs.
// If getInitialUser() returned null it also cleared localStorage, so
// localStorage.getItem('token') will already be null at this point.
export const useAuth = create<AuthState>((set) => ({
    user: getInitialUser(),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email, password) => {
        const data = await api.login(email, password);
        // Persist token so it survives page refreshes
        localStorage.setItem('token', data.token);
        set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
        });
    },

    register: async (email, password) => {
        const data = await api.register(email, password);
        // Auto-login after registration
        if (data.user) {
            const loginData = await api.login(email, password);
            set({
                user: loginData.user,
                token: loginData.token,
                isAuthenticated: true,
            });
        }
    },

    logout: () => {
        api.logout();
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    checkAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
            api.getProfile().then((profileData) => {
                // Merge profile data with existing store user so the JWT-decoded
                // role is preserved even if /profile doesn't return a role field.
                set((state) => ({
                    user: { ...state.user, ...profileData },
                    isAuthenticated: true,
                }));
            }).catch(() => {
                set({ user: null, token: null, isAuthenticated: false });
                localStorage.removeItem('token');
            });
        }
    },

    oauthLogin: async (provider: 'google' | 'github') => {
        try {
            // OAuth routes are mounted at /api/oauth
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
            window.location.href = `${baseUrl}/oauth/${provider}`;
        } catch (error) {
            console.error('OAuth login error:', error);
            toast.error('Failed to initiate OAuth login');
        }
    },

    setAuthFromToken: (token: string) => {
        localStorage.setItem('token', token);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            set({
                user: {
                    id: payload.userId, email: payload.email, role: payload.role,
                },
                token,
                isAuthenticated: true,
            })
        } catch (error) {
            console.error('Failed to parse token:', error);
        }
    }
}));
