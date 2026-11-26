
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Edit,
  Refresh,
  Search,
} from "@mui/icons-material";

import {
  getAdministrationUsers,
} from "../services/users.services";

import type {
  AdministrationUser,
  MembershipStatus,
} from "../types/administration";

const PER_PAGE = 15;

type StatusFilter = "all" | MembershipStatus;

const TABLE_HEADERS = [
  "Usuario",
  "Plantas",
  "Áreas",
  "Roles",
  "Estado",
  "Acción",
];

const CELL_STYLES = {
  padding: "16px 12px",
  borderBottom: "1px solid #DCE6EE",
  verticalAlign: "middle",
};

// =====================================================
// ESTADO DEL USUARIO
// =====================================================

function UserStatus({
  user,
}: {
  user: AdministrationUser;
}) {
  if (user.membership.status === "revoked") {
    return (
      <Chip
        label="Revocado"
        size="small"
        color="default"
      />
    );
  }

  if (!user.account_status) {
    return (
      <Chip
        label="Cuenta inactiva"
        size="small"
        color="warning"
      />
    );
  }

  return (
    <Chip
      label="Activo"
      size="small"
      color="success"
    />
  );
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

export default function UserAdministration() {
  const [users, setUsers] =
    useState<AdministrationUser[]>([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshVersion, setRefreshVersion] =
    useState(0);

  // ===================================================
  // BÚSQUEDA CON DEBOUNCE
  // ===================================================

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [search]);

  // ===================================================
  // CONSULTAR USUARIOS
  // ===================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      setLoading(true);
      setError(null);

      try {
        const response =
          await getAdministrationUsers(
            {
              page,
              perPage: PER_PAGE,
              q: debouncedSearch,
              status:
                status === "all"
                  ? undefined
                  : status,
            },
            controller.signal
          );

        if (controller.signal.aborted) {
          return;
        }

        const nextLastPage = Math.max(
          1,
          response.meta.last_page
        );

        if (page > nextLastPage) {
          setPage(nextLastPage);
          return;
        }

        setUsers(response.data);
        setTotal(response.meta.total);
        setLastPage(nextLastPage);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setUsers([]);
        setTotal(0);
        setLastPage(1);

        setError(
          err instanceof Error
            ? err.message
            : "No fue posible consultar los usuarios."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadUsers();

    return () => controller.abort();
  }, [
    page,
    debouncedSearch,
    status,
    refreshVersion,
  ]);

  // ===================================================
  // ACCIONES
  // ===================================================

  function refresh() {
    setRefreshVersion((current) => current + 1);
  }

  function changeStatus(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  // ===================================================
  // INTERFAZ
  // ===================================================

  return (
    <Stack spacing={3}>
      {/* FILTROS */}

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
        <TextField
          fullWidth
          placeholder="Buscar usuario..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          slotProps={{
            input: {
              startAdornment: (
                <Search
                  sx={{
                    color: "#81909D",
                    mr: 1,
                  }}
                />
              ),
            },
            htmlInput: {
              maxLength: 100,
            },
          }}
          sx={{
            maxWidth: { md: 420 },
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
        >
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Estado</InputLabel>

            <Select
              value={status}
              label="Estado"
              onChange={(event) =>
                changeStatus(
                  event.target.value as StatusFilter
                )
              }
            >
              <MenuItem value="all">
                Todos
              </MenuItem>

              <MenuItem value="active">
                Membresía activa
              </MenuItem>

              <MenuItem value="revoked">
                Revocados
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={refresh}
            disabled={loading}
          >
            Actualizar
          </Button>
        </Stack>
      </Stack>

      {/* ERRORES */}

      {error && (
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
      )}

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
            Cargando usuarios...
          </Typography>
        </Stack>
      ) : !error ? (
        <>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            Usuarios encontrados: {total}
          </Typography>

          {users.length === 0 ? (
            <Alert severity="info">
              No se encontraron usuarios con
              los filtros seleccionados.
            </Alert>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 900,
                }}
              >
                <thead>
                  <tr>
                    {TABLE_HEADERS.map((header) => (
                      <Box
                        component="th"
                        key={header}
                        sx={{
                          textAlign: "left",
                          padding: "14px 12px",
                          borderBottom:
                            "1px solid #DCE6EE",
                          color: "#81909D",
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {header}
                      </Box>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {/* USUARIO */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#16324F",
                          }}
                        >
                          {user.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#81909D" }}
                        >
                          {user.email}
                        </Typography>
                      </Box>

                      {/* PLANTAS */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        {user.locations.plants.length >
                        0 ? (
                          <Stack spacing={0.5}>
                            {user.locations.plants.map(
                              (plant) => (
                                <Typography
                                  key={plant.id}
                                  variant="body2"
                                >
                                  {plant.name}
                                </Typography>
                              )
                            )}
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Sin plantas visibles
                          </Typography>
                        )}
                      </Box>

                      {/* ÁREAS */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        {user.locations.areas.length >
                        0 ? (
                          <Stack spacing={0.5}>
                            {user.locations.areas.map(
                              (area) => (
                                <Typography
                                  key={area.id}
                                  variant="body2"
                                >
                                  {area.name}
                                </Typography>
                              )
                            )}
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Sin áreas visibles
                          </Typography>
                        )}
                      </Box>

                      {/* ROLES */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        {user.roles.length > 0 ? (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            useFlexGap
                            sx={{
                              flexWrap: "wrap",
                            }}
                          >
                            {user.roles.map((role) => (
                              <Chip
                                key={role.id}
                                label={
                                  role.status
                                    ? role.name
                                    : `${role.name} (inactivo)`
                                }
                                size="small"
                                variant={
                                  role.status
                                    ? "filled"
                                    : "outlined"
                                }
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.secondary",
                            }}
                          >
                            Sin roles
                          </Typography>
                        )}
                      </Box>

                      {/* ESTADO */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        <UserStatus user={user} />
                      </Box>

                      {/* ACCIONES */}

                      <Box
                        component="td"
                        sx={CELL_STYLES}
                      >
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          disabled
                        >
                          Editar
                        </Button>
                      </Box>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          )}

          {/* PAGINACIÓN */}

          {lastPage > 1 && (
            <Stack
              sx={{
                alignItems: "center",
                pt: 1,
              }}
            >
              <Pagination
                count={lastPage}
                page={page}
                onChange={(_, value) =>
                  setPage(value)
                }
                color="primary"
                shape="rounded"
              />
            </Stack>
          )}
        </>
      ) : null}
    </Stack>
  );
}
