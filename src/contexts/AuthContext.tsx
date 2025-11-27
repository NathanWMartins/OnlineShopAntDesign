import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getUserById, FAKESTORE_USERS_COUNT, type FakeStoreUser } from "../services/userService";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
};

type AuthContextType = {
    user: User | null;
    isAdmin: boolean;
    login: () => Promise<void>;    
    loginAsAdmin: () => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_USER_KEY = "authUser";
const LS_NEXT_USER_ID = "nextUserId";

function map(u: FakeStoreUser): User {
    return {
        id: u.id,
        firstName: u.name.firstname,
        lastName: u.name.lastname,
        email: u.email,
        username: u.username,
    };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem(LS_USER_KEY);
        if (raw) {
            try { setUser(JSON.parse(raw)); } catch { localStorage.removeItem(LS_USER_KEY); }
        }
    }, []);

    const getNextUserId = () => {
        const raw = localStorage.getItem(LS_NEXT_USER_ID);
        const current = raw ? parseInt(raw, 10) : 1;
        return Number.isFinite(current) && current >= 1 && current <= FAKESTORE_USERS_COUNT ? current : 1;
    };
    const advanceNextUserId = (prev: number) => {
        const next = prev >= FAKESTORE_USERS_COUNT ? 1 : prev + 1;
        localStorage.setItem(LS_NEXT_USER_ID, String(next));
    };

    const login = useCallback(async () => {
        const nextId = getNextUserId();
        const apiUser = await getUserById(nextId);
        const mapped = map(apiUser);
        setUser(mapped);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(mapped));
        advanceNextUserId(nextId);
    }, []);

    const loginAsAdmin = useCallback(async () => {
        const apiUser = await getUserById(1);
        const mapped = map(apiUser);
        setUser(mapped);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(mapped));
        localStorage.setItem(LS_NEXT_USER_ID, "2");
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(LS_USER_KEY);
    }, []);

    const isAdmin = !!user && user.id === 1; 

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, loginAsAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
