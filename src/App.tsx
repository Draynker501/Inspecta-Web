import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { getAuthToken } from "./api/client";

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

function Placeholder({ title }: { title: string }) {
  return (
    <section className="page-section">
      <span className="eyebrow">Módulo</span>
      <h1>{title}</h1>
      <p className="page-description">
        Este módulo se implementará en la siguiente etapa.
      </p>
    </section>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  return getAuthToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
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