import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

const ProtectedRoute = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;