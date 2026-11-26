
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Business,
  Refresh,
  Security,
  Settings,
} from "@mui/icons-material";

import {
  getOrganizations,
  getSelectedOrganizationId,
} from "../services/organizations.service";

import type {
  Organization,
} from "../services/organizations.service";

// =====================================================
// ENCABEZADO DE TARJETAS
// =====================================================

interface ConfigurationCardHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  backgroundColor: string;
}

function ConfigurationCardHeader({
  title,
  description,
  icon,
  backgroundColor,
}: ConfigurationCardHeaderProps) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center" }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: 2,
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#16324F",
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#81909D" }}
        >
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

// =====================================================
// CAMPO DE SOLO LECTURA
// =====================================================

interface ReadOnlyFieldProps {
  label: string;
  value: string | null | undefined;
}

function ReadOnlyField({
  label,
  value,
}: ReadOnlyFieldProps) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value ?? "No disponible"}
      slotProps={{
        htmlInput: {
          readOnly: true,
        },
      }}
    />
  );
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function ConfigurationAdministration() {
  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshVersion, setRefreshVersion] =
    useState(0);

  const organizationId =
    getSelectedOrganizationId();

  // ===================================================
  // CONSULTAR ORGANIZACIÓN ACTUAL
  // ===================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadConfiguration() {
      setLoading(true);
      setError(null);
      setOrganization(null);

      try {
        if (!organizationId) {
          throw new Error(
            "No hay una organización seleccionada."
          );
        }

        const organizations =
          await getOrganizations(
            controller.signal
          );

        if (controller.signal.aborted) {
          return;
        }

        const currentOrganization =
          organizations.find(
            (item) => item.id === organizationId
          );

        if (!currentOrganization) {
          throw new Error(
            "No fue posible encontrar la " +
              "organización seleccionada entre " +
              "tus organizaciones disponibles."
          );
        }

        setOrganization(currentOrganization);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "No fue posible consultar " +
              "la configuración."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadConfiguration();

    return () => controller.abort();
  }, [organizationId, refreshVersion]);

  // ===================================================
  // ACTUALIZAR INFORMACIÓN
  // ===================================================

  function refresh() {
    setRefreshVersion(
      (current) => current + 1
    );
  }

  // ===================================================
  // INTERFAZ
  // ===================================================

  return (
    <Stack spacing={3}>
      {/* ENCABEZADO */}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            md: "center",
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#16324F",
            }}
          >
            Configuración general
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#81909D" }}
          >
            Consulta la información general
            de tu organización en INSPECTA.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refresh}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Stack>

      {/* CARGA */}

      {loading ? (
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            py: 5,
          }}
        >
          <CircularProgress size={32} />

          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            Cargando configuración...
          </Typography>
        </Stack>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={refresh}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      ) : organization ? (
        <>
          {/* INFORMACIÓN GENERAL */}

          <Card
            variant="outlined"
            sx={{ boxShadow: "none" }}
          >
            <CardContent>
              <Stack spacing={3}>
                <ConfigurationCardHeader
                  title="Información de la organización"
                  description="Datos generales del espacio de trabajo seleccionado."
                  icon={
                    <Business
                      sx={{ color: "#16324F" }}
                    />
                  }
                  backgroundColor="#E8F0F6"
                />

                <Divider />

                <Grid container spacing={3}>
                  <Grid
                    size={{ xs: 12, md: 6 }}
                  >
                    <ReadOnlyField
                      label="Nombre de la organización"
                      value={organization.name}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 6 }}
                  >
                    <ReadOnlyField
                      label="Código de organización"
                      value={organization.code}
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 6 }}
                  >
                    <ReadOnlyField
                      label="Tipo de organización"
                      value={
                        organization.type === "client"
                          ? "Cliente"
                          : organization.type
                      }
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 6 }}
                  >
                    <ReadOnlyField
                      label="Identificador"
                      value={organization.id}
                    />
                  </Grid>
                </Grid>

                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#16324F",
                    }}
                  >
                    Estado de la organización:
                  </Typography>

                  <Chip
                    label={
                      organization.status
                        ? "Activa"
                        : "Inactiva"
                    }
                    color={
                      organization.status
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* MEMBRESÍA Y ACCESO */}

          <Card
            variant="outlined"
            sx={{ boxShadow: "none" }}
          >
            <CardContent>
              <Stack spacing={3}>
                <ConfigurationCardHeader
                  title="Membresía y acceso"
                  description="Información de tu relación con la organización actual."
                  icon={
                    <Security
                      sx={{ color: "#0F9D8A" }}
                    />
                  }
                  backgroundColor="#E8F5F2"
                />

                <Divider />

                <Grid container spacing={3}>
                  <Grid
                    size={{ xs: 12, md: 8 }}
                  >
                    <ReadOnlyField
                      label="Identificador de membresía"
                      value={
                        organization.membership_id
                      }
                    />
                  </Grid>

                  <Grid
                    size={{ xs: 12, md: 4 }}
                  >
                    <Stack
                      spacing={1}
                      sx={{
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                        }}
                      >
                        Estado de membresía
                      </Typography>

                      <Chip
                        label={
                          organization.membership_status ===
                          "active"
                            ? "Activa"
                            : organization.membership_status ===
                              "revoked"
                            ? "Revocada"
                            : "Estado desconocido"
                        }
                        color={
                          organization.membership_status ===
                          "active"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Stack>
                  </Grid>
                </Grid>

                <Alert severity="info">
                  Los usuarios, roles y ubicaciones
                  se administran dentro del contexto
                  de la organización seleccionada.
                </Alert>
              </Stack>
            </CardContent>
          </Card>

          {/* PREFERENCIAS */}

          <Card
            variant="outlined"
            sx={{ boxShadow: "none" }}
          >
            <CardContent>
              <Stack spacing={2}>
                <ConfigurationCardHeader
                  title="Preferencias de la organización"
                  description="Configuración adicional de la plataforma."
                  icon={
                    <Settings
                      sx={{ color: "#16324F" }}
                    />
                  }
                  backgroundColor="#F0F2F5"
                />

                <Divider />

                <Alert severity="info">
                  La edición de preferencias de
                  la organización no se encuentra
                  disponible actualmente.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">
          No hay información de la organización
          disponible.
        </Alert>
      )}
    </Stack>
  );
}
