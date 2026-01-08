const KEY = 'barbershop_demo_role';

export type UserRole = 'client' | 'barber' | 'admin' | null;

export const demoAuth = {
    login: (role: UserRole) => {
        if (role) localStorage.setItem(KEY, role);
        else localStorage.removeItem(KEY);
        // Dispatch a custom event so components can update immediately if they listen
        window.dispatchEvent(new Event('auth-change'));
    },
    logout: () => {
        localStorage.removeItem(KEY);
        window.dispatchEvent(new Event('auth-change'));
    },
    getRole: (): UserRole => {
        return (localStorage.getItem(KEY) as UserRole) || 'client'; // Default to client if nothing set for smoother demo
    },
    getUserName: () => {
        const role = localStorage.getItem(KEY);
        if (role === 'admin') return 'Admin User';
        if (role === 'barber') return 'Michael Chang';
        return 'Alex Johnson';
    }
}
