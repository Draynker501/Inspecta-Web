import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";

import {
  getOrganizations,
  selectOrganization,
  type Organization,
} from "../services/organizations.service";

import { logout } from "../services/auth.service";
import { clearSession } from "../api/client";

export default function SeleccionOrganizacion() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadOrganizations() {
      try {
        const result = await getOrganizations();

        if (cancelled) return;

        setOrganizations(result);

        if (result.length === 1) {
          selectOrganization(result[0]);
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "No fue posible consultar las organizaciones."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOrganizations();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSelect = (organization: Organization) => {
    selectOrganization(organization);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      clearSession();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F4F7FA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#16324F",
            mb: 2,
          }}
        >
          Seleccionar organización
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Selecciona la organización con la que deseas trabajar en Inspecta.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && organizations.length === 0 && (
          <Alert severity="warning">
            Tu usuario no tiene organizaciones activas disponibles.
            Contacta al administrador para revisar tu membresía.
          </Alert>
        )}

        {!loading &&
          organizations.map((organization) => (
            <Button
              key={organization.id}
              variant="outlined"
              fullWidth
              onClick={() => handleSelect(organization)}
              sx={{
                mb: 1.5,
                py: 1.5,
                justifyContent: "flex-start",
                textAlign: "left",
                borderColor: "#DCE6EE",
                color: "#16324F",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {organization.name}
                </Typography>

                {organization.code && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                    }}
                  >
                    Código: {organization.code}
                  </Typography>
                )}
              </Box>
            </Button>
          ))}

        <Button
          fullWidth
          color="inherit"
          onClick={() => void handleLogout()}
          sx={{ mt: 2 }}
        >
          Cerrar sesión
        </Button>
      </Paper>
    </Box>
  );
}
