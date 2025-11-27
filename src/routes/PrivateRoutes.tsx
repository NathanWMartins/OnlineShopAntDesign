import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoutes({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/products" replace />;
}

export function AdminRoute({ children }: { children: JSX.Element }) {
    const { isAdmin } = useAuth();
    return isAdmin ? children : <Navigate to="/unauthorized" replace />;
}