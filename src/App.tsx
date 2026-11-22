
import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import {
  getAuthToken,
  getOrganizationId,
} from "./api/client";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Inspecciones from "./pages/Inspecciones";
import Incidencias from "./pages/Incidencias";
import AccionesCorrectivas from "./pages/AccionesCorrectivas";
import Checklists from "./pages/Checklists";
import Normativa from "./pages/Normativa";
import Reportes from "./pages/Reportes";
import Administracion from "./pages/Administracion";
import SeleccionOrganizacion from "./pages/SeleccionOrganizacion";

function RequireLogin({ children }: { children: ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function RequireOrganization({ children }: { children: ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  if (!getOrganizationId()) {
    return <Navigate to="/seleccionar-organizacion" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/seleccionar-organizacion"
        element={
          <RequireLogin>
            <SeleccionOrganizacion />
          </RequireLogin>
        }
      />

      <Route
        element={
          <RequireOrganization>
            <AppLayout />
          </RequireOrganization>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inspecciones" element={<Inspecciones />} />
        <Route path="/incidencias" element={<Incidencias />} />
        <Route
          path="/acciones-correctivas"
          element={<AccionesCorrectivas />}
        />
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/normativa" element={<Normativa />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/administracion" element={<Administracion />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
