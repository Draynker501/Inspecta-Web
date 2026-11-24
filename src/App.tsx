import { useEffect } from "react";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import type { ReactNode } from "react";

import {
  API_ACCESS_EVENT,
  getAuthToken,
  getOrganizationId,
} from "./api/client";

import type {
  ApiAccessEventDetail,
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

import {
  OrganizationProvider,
} from "./contexts/OrganizationContext";

/* =====================================================
   GESTIÓN GLOBAL DE ACCESO
   ===================================================== */

function ApiAccessHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAccessInvalidated = (event: Event) => {
      const { detail } =
        event as CustomEvent<ApiAccessEventDetail>;

      if (!detail) {
        return;
      }

      if (detail.type === "session") {
        navigate("/login", {
          replace: true,
          state: {
            accessMessage: detail.message,
          },
        });

        return;
      }

      if (detail.type === "organization") {
        if (!getAuthToken()) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        navigate(
          "/seleccionar-organizacion?mode=recovery",
          {
            replace: true,
            state: {
              accessMessage: detail.message,
            },
          }
        );
      }
    };

    window.addEventListener(
      API_ACCESS_EVENT,
      handleAccessInvalidated
    );

    return () => {
      window.removeEventListener(
        API_ACCESS_EVENT,
        handleAccessInvalidated
      );
    };
  }, [navigate]);

  return null;
}

/* =====================================================
   PROTECCIÓN DE SESIÓN
   ===================================================== */

function RequireLogin({
  children,
}: {
  children: ReactNode;
}) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/* =====================================================
   PROTECCIÓN DE ORGANIZACIÓN
   ===================================================== */

function RequireOrganization({
  children,
}: {
  children: ReactNode;
}) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  if (!getOrganizationId()) {
    return (
      <Navigate
        to="/seleccionar-organizacion"
        replace
      />
    );
  }

  return <>{children}</>;
}

/* =====================================================
   APLICACIÓN
   ===================================================== */

export default function App() {
  return (
    <>
      <ApiAccessHandler />

      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

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
              <OrganizationProvider>
                <AppLayout />
              </OrganizationProvider>
            </RequireOrganization>
          }
        >
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/inspecciones"
            element={<Inspecciones />}
          />

          <Route
            path="/incidencias"
            element={<Incidencias />}
          />

          <Route
            path="/acciones-correctivas"
            element={<AccionesCorrectivas />}
          />

          <Route
            path="/checklists"
            element={<Checklists />}
          />

          <Route
            path="/normativa"
            element={<Normativa />}
          />

          <Route
            path="/reportes"
            element={<Reportes />}
          />

          <Route
            path="/administracion"
            element={<Administracion />}
          />
        </Route>

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}