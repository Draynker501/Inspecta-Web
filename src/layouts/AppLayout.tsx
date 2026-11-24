import { useEffect, useRef, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { IonIcon } from "@ionic/react";
import { clearAuthToken } from "../api/client";
import { getStoredUser, logout } from "../services/auth.service";
import inspectaLogo from "../assets/inspecta-logo.png";

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
  menuOutline,
} from "ionicons/icons";

const SIDEBAR_STORAGE_KEY = "inspecta_sidebar_collapsed";
const SIDEBAR_BREAKPOINT = "(max-width: 900px)";

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

function getInitialSidebarState(): boolean {
  if (window.matchMedia(SIDEBAR_BREAKPOINT).matches) {
    return true;
  }

  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function getInitials(name?: string | null): string {
  if (!name?.trim()) {
    return "UI";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getStoredUser();

  const mainRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    getInitialSidebarState
  );

  const userName = user?.name ?? "Usuario Inspecta";

  const userRole =
    Array.isArray(user?.roles) && user.roles.length
      ? (
        typeof user.roles[0] === "string"
          ? user.roles[0]
          : user.roles[0]?.name
      ) ?? "Usuario"
      : user?.role ?? "Usuario";

  /* =====================================================
     REINICIAR SCROLL AL CAMBIAR DE MÓDULO
     ===================================================== */

  useEffect(() => {
    mainRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  /* =====================================================
     COMPORTAMIENTO RESPONSIVE DEL SIDEBAR
     ===================================================== */

  useEffect(() => {
    const mediaQuery = window.matchMedia(SIDEBAR_BREAKPOINT);

    const handleBreakpointChange = (
      event: MediaQueryListEvent
    ) => {
      if (event.matches) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(
          localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true"
        );
      }

      setProfileOpen(false);
    };

    mediaQuery.addEventListener(
      "change",
      handleBreakpointChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleBreakpointChange
      );
    };
  }, []);

  /* =====================================================
     CERRAR MENÚ DE PERFIL
     ===================================================== */

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !profileRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [profileOpen]);

  /* =====================================================
     CONTRAER / EXPANDIR SIDEBAR
     ===================================================== */

  const toggleSidebar = () => {
    const nextCollapsed = !sidebarCollapsed;

    setSidebarCollapsed(nextCollapsed);
    setProfileOpen(false);

    if (!window.matchMedia(SIDEBAR_BREAKPOINT).matches) {
      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextCollapsed)
      );
    }
  };

  /* =====================================================
     CERRAR SESIÓN
     ===================================================== */

  const handleLogout = async () => {
    setProfileOpen(false);

    try {
      await logout();
    } finally {
      clearAuthToken();
      localStorage.removeItem("inspecta_user");

      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <div
      className={`app-shell ${sidebarCollapsed
          ? "sidebar-collapsed"
          : "sidebar-expanded"
        }`}
    >
      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        id="inspecta-sidebar"
        className="sidebar"
      >
        {/* BOTÓN PARA CONTRAER / EXPANDIR */}

        <div className="sidebar-controls">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={
              sidebarCollapsed
                ? "Expandir menú lateral"
                : "Minimizar menú lateral"
            }
            aria-label={
              sidebarCollapsed
                ? "Expandir menú lateral"
                : "Minimizar menú lateral"
            }
            aria-expanded={!sidebarCollapsed}
            aria-controls="inspecta-sidebar"
          >
            <IonIcon
              icon={menuOutline}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* LOGO */}

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img
              src={inspectaLogo}
              alt="Logo de INSPECTA"
            />
          </div>

          <div className="sidebar-brand-text">
            <strong>INSPECTA</strong>

            <span>Seguridad e higiene</span>
          </div>
        </div>

        {/* NAVEGACIÓN */}

        <nav
          className="sidebar-nav"
          aria-label="Navegación principal"
        >
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              aria-label={item.label}
              onClick={() => {
                setProfileOpen(false);

                if (
                  window.matchMedia(
                    SIDEBAR_BREAKPOINT
                  ).matches
                ) {
                  setSidebarCollapsed(true);
                }
              }}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <IonIcon
                icon={item.icon}
                className="nav-icon"
                aria-hidden="true"
              />

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* PARTE INFERIOR */}

        <div className="sidebar-bottom">
          {/* PERFIL */}

          <div
            className="profile-container"
            ref={profileRef}
          >
            {profileOpen && (
              <div
                id="inspecta-profile-menu"
                className="profile-menu"
              >
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
              <div
                className="profile-avatar"
                title={userName}
              >
                {getInitials(user?.name)}
              </div>

              <div className="profile-info">
                <strong title={userName}>
                  {userName}
                </strong>

                <span>{userRole}</span>
              </div>

              <button
                ref={profileButtonRef}
                type="button"
                className="profile-more"
                onClick={() =>
                  setProfileOpen((previous) => !previous)
                }
                title="Opciones de usuario"
                aria-label="Opciones de usuario"
                aria-expanded={profileOpen}
                aria-controls={
                  profileOpen
                    ? "inspecta-profile-menu"
                    : undefined
                }
              >
                <IonIcon
                  icon={ellipsisVerticalOutline}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* VERSIÓN */}

          <div className="sidebar-footer">
            <span>INSPECTA PWA</span>

            <small>Frontend · v0.1</small>
          </div>
        </div>
      </aside>

      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <main
        className="main-area"
        ref={mainRef}
      >
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}