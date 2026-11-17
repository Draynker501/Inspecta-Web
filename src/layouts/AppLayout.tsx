import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { clearAuthToken, getAuthToken } from "../api/client";
import { getStoredUser, logout } from "../services/auth.service";

import {
  gridOutline,
  clipboardOutline,
  warningOutline,
  checkmarkDoneOutline,
  listOutline,
  documentTextOutline,
  barChartOutline,
  settingsOutline,
  ellipsisVerticalOutline,
  personOutline,
  logOutOutline,
} from "ionicons/icons";

const items = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: gridOutline,
  },
  {
    label: "Inspecciones",
    path: "/inspecciones",
    icon: clipboardOutline,
  },
  {
    label: "Incidencias",
    path: "/incidencias",
    icon: warningOutline,
  },
  {
    label: "Acciones correctivas",
    path: "/acciones-correctivas",
    icon: checkmarkDoneOutline,
  },
  {
    label: "Checklists",
    path: "/checklists",
    icon: listOutline,
  },
  {
    label: "Normativa",
    path: "/normativa",
    icon: documentTextOutline,
  },
  {
    label: "Reportes",
    path: "/reportes",
    icon: barChartOutline,
  },
  {
    label: "Administración",
    path: "/administracion",
    icon: settingsOutline,
  },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      await logout();
    } finally {
      clearAuthToken();
      localStorage.removeItem("inspecta_user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="sidebar-brand">

          <div className="brand-mark small">
            I
          </div>

          <div className="sidebar-brand-text">

            <strong>
              INSPECTA
            </strong>

            <span>
              Seguridad e higiene
            </span>

          </div>

        </div>


        {/* NAVEGACIÓN */}

        <nav className="sidebar-nav">

          {items.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >

              <IonIcon
                icon={item.icon}
                className="nav-icon"
              />

              <span>
                {item.label}
              </span>

            </NavLink>

          ))}

        </nav>


        {/* PARTE INFERIOR */}

        <div className="sidebar-bottom">

          {/* PERFIL */}

          <div className="profile-container">

            {profileOpen && (

              <div className="profile-menu">

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <IonIcon icon={personOutline} />
                  <span>Mi perfil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                >
                  <IonIcon icon={settingsOutline} />
                  <span>Configuración</span>
                </button>

                <div className="profile-menu-divider" />

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <IonIcon icon={logOutOutline} />
                  <span>Cerrar sesión</span>
                </button>

              </div>

            )}


            <div className="profile-card">

              <div className="profile-avatar">
                SH
              </div>

              <div className="profile-info">

                <strong>
                  {user?.name ?? "Usuario Inspecta"}
                </strong>

                <span>
                  {Array.isArray(user?.roles) && user.roles.length
                    ? (typeof user.roles[0] === "string" ? user.roles[0] : user.roles[0]?.name) ?? "Usuario"
                    : user?.role ?? "Usuario"}
                </span>

              </div>

              <button
                type="button"
                className="profile-more"
                onClick={() =>
                  setProfileOpen(!profileOpen)
                }
                aria-label="Opciones de usuario"
              >

                <IonIcon
                  icon={ellipsisVerticalOutline}
                />

              </button>

            </div>

          </div>


          {/* VERSION */}

          <div className="sidebar-footer">

            <span>
              INSPECTA PWA
            </span>

            <small>
              Frontend · v0.1
            </small>

          </div>

        </div>

      </aside>


      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <main className="main-area">

        <div className="content">

          <Outlet />

        </div>

      </main>

    </div>
  );
}