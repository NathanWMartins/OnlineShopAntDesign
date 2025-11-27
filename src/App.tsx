import { App as AntApp } from "antd";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import PrivateRoutes, { AdminRoute } from "./routes/PrivateRoutes";
import ClientsPage from "./pages/ClientsPage";

export default function App() {
  return (
    <AntApp>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/clients"
          element={
            <PrivateRoutes>
              <ClientsPage />
            </PrivateRoutes>
          }
        />
        <Route path="/admin/users" element={
          <AdminRoute>
            <></>
          </AdminRoute>
        } />
      </Routes>
    </AntApp>
  );
}