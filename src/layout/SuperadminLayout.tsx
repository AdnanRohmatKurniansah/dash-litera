import { Outlet } from "react-router";
import ProtectedRoute from "./guards/ProtectedRoute";

export default function SuperadminLayout() {
  return (
    <ProtectedRoute requireSuperadmin>
      <Outlet />
    </ProtectedRoute>
  );
}