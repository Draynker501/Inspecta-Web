import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Business,
  Groups,
  Person,
  Security,
  Settings,
  Edit,
  Search,
} from "@mui/icons-material";

import { useState } from "react";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  puesto: string;
  area: string;
  rol: string;
  estado: "Activo" | "Inactivo";
};

const usuarios: Usuario[] = [
  {
    id: 1,
    nombre: "Santiago Hernández",
    correo: "santiago@inspecta.com",
    puesto: "Administrador",
    area: "TI",
    rol: "Administrador",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Carlos Ramírez",
    correo: "carlos@inspecta.com",
    puesto: "Supervisor de Seguridad",
    area: "Seguridad e Higiene",
    rol: "Supervisor",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Ana López",
    correo: "ana@inspecta.com",
    puesto: "Inspector",
    area: "Producción",
    rol: "Inspector",
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Miguel Torres",
    correo: "miguel@inspecta.com",
    puesto: "Responsable de área",
    area: "Mantenimiento",
    rol: "Responsable",
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    correo: "laura@inspecta.com",
    puesto: "Consulta",
    area: "Recursos Humanos",
    rol: "Consulta",
    estado: "Inactivo",
  },
];

const areas = [
  "Producción",
  "Almacén",
  "Mantenimiento",
  "Servicios",
  "Oficinas",
  "Seguridad e Higiene",
  "Recursos Humanos",
  "TI",
];

const roles = [
  {
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema.",
    usuarios: 1,
  },
  {
    nombre: "Supervisor",
    descripcion: "Supervisa inspecciones, incidencias y acciones.",
    usuarios: 3,
  },
  {
    nombre: "Inspector",
    descripcion: "Realiza inspecciones y registra hallazgos.",
    usuarios: 8,
  },
  {
    nombre: "Responsable",
    descripcion: "Gestiona acciones correctivas de su área.",
    usuarios: 9,
  },
  {
    nombre: "Consulta",
    descripcion: "Solo puede consultar información.",
    usuarios: 3,
  },
];

export default function Administracion() {
  const [tab, setTab] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("Todos");

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.area.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      estado === "Todos" || usuario.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <section className="page-section">
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          mb: 3,
        }}
      >
        <Box>
          <span className="eyebrow">Sistema</span>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#16324F",
            }}
          >
            Administración
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#81909D",
              mt: 0.5,
            }}
          >
            Gestiona usuarios, roles, áreas y configuración de INSPECTA.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Nuevo usuario
        </Button>
      </Stack>

      {/* RESUMEN */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "#E8F0F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Person sx={{ color: "#16324F" }} />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#81909D" }}
                  >
                    Usuarios
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#16324F",
                    }}
                  >
                    24
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "#E8F5F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Groups sx={{ color: "#0F9D8A" }} />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#81909D" }}
                  >
                    Usuarios activos
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#16324F",
                    }}
                  >
                    21
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "#FFF5D9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Security sx={{ color: "#F2A900" }} />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#81909D" }}
                  >
                    Roles
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#16324F",
                    }}
                  >
                    5
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "#F0F2F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Business sx={{ color: "#2673C9" }} />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#81909D" }}
                  >
                    Áreas
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#16324F",
                    }}
                  >
                    8
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CONTENIDO */}

      <Card>
        <Box sx={{ borderBottom: "1px solid #DCE6EE" }}>
          <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<Person />}
              iconPosition="start"
              label="Usuarios"
            />

            <Tab
              icon={<Security />}
              iconPosition="start"
              label="Roles y permisos"
            />

            <Tab
              icon={<Business />}
              iconPosition="start"
              label="Áreas"
            />

            <Tab
              icon={<Settings />}
              iconPosition="start"
              label="Configuración"
            />
          </Tabs>
        </Box>

        {/* USUARIOS */}

        {tab === 0 && (
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <TextField
                fullWidth
                placeholder="Buscar usuario..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
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
                }}
                sx={{
                  maxWidth: { md: 420 },
                }}
              />

              <FormControl
                sx={{
                  minWidth: 180,
                }}
              >
                <InputLabel>Estado</InputLabel>

                <Select
                  value={estado}
                  label="Estado"
                  onChange={(event) =>
                    setEstado(event.target.value)
                  }
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  <MenuItem value="Activo">Activos</MenuItem>
                  <MenuItem value="Inactivo">Inactivos</MenuItem>
                </Select>
              </FormControl>
            </Stack>

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
                    {[
                      "Usuario",
                      "Puesto",
                      "Área",
                      "Rol",
                      "Estado",
                      "Acción",
                    ].map((header) => (
                      <Box
                        component="th"
                        key={header}
                        sx={{
                          textAlign: "left",
                          padding: "14px 12px",
                          borderBottom: "1px solid #DCE6EE",
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
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: "#16324F",
                          }}
                        >
                          {usuario.nombre}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "#81909D",
                          }}
                        >
                          {usuario.correo}
                        </Typography>
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        {usuario.puesto}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        {usuario.area}
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        <Chip
                          label={usuario.rol}
                          size="small"
                        />
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        <Chip
                          label={usuario.estado}
                          size="small"
                          color={
                            usuario.estado === "Activo"
                              ? "success"
                              : "default"
                          }
                        />
                      </Box>

                      <Box
                        component="td"
                        sx={{
                          padding: "16px 12px",
                          borderBottom: "1px solid #DCE6EE",
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<Edit />}
                        >
                          Editar
                        </Button>
                      </Box>
                    </tr>
                  ))}
                </tbody>
              </Box>
            </Box>
          </CardContent>
        )}

        {/* ROLES */}

        {tab === 1 && (
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#16324F",
                mb: 0.5,
              }}
            >
              Roles y permisos
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#81909D",
                mb: 3,
              }}
            >
              Define el nivel de acceso de cada tipo de usuario.
            </Typography>

            <Grid container spacing={2}>
              {roles.map((rol) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={rol.nombre}
                >
                  <Card
                    sx={{
                      height: "100%",
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Security
                          sx={{
                            color: "#0F9D8A",
                          }}
                        />

                        <Chip
                          label={`${rol.usuarios} usuarios`}
                          size="small"
                        />
                      </Stack>

                      <Typography
                        variant="h6"
                        sx={{
                          mt: 2,
                          fontWeight: 700,
                          color: "#16324F",
                        }}
                      >
                        {rol.nombre}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#81909D",
                          mt: 1,
                        }}
                      >
                        {rol.descripcion}
                      </Typography>

                      <Button
                        size="small"
                        startIcon={<Edit />}
                        sx={{ mt: 2 }}
                      >
                        Configurar permisos
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {/* ÁREAS */}

        {tab === 2 && (
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                mb: 3,
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
                  Áreas de la organización
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#81909D",
                    mt: 0.5,
                  }}
                >
                  Administra las áreas disponibles para las inspecciones.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Add />}
              >
                Nueva área
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {areas.map((area) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4 }}
                  key={area}
                >
                  <Card
                    sx={{
                      boxShadow: "none",
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          sx={{ alignItems: "center" }}
                        >
                          <Business
                            sx={{
                              color: "#2673C9",
                            }}
                          />

                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: "#16324F",
                            }}
                          >
                            {area}
                          </Typography>
                        </Stack>

                        <Button
                          size="small"
                          startIcon={<Edit />}
                        >
                          Editar
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}

        {/* CONFIGURACIÓN */}

        {tab === 3 && (
          <CardContent>
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
              sx={{
                color: "#81909D",
                mt: 0.5,
                mb: 3,
              }}
            >
              Configura los datos generales de la plataforma.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de la empresa"
                  defaultValue="Empresa Demo"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nombre de la planta"
                  defaultValue="Planta Guadalajara"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Correo de contacto"
                  defaultValue="contacto@empresa.com"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  defaultValue="33 0000 0000"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 1 }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#16324F",
                  }}
                >
                  Notificaciones
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#81909D",
                    mt: 0.5,
                  }}
                >
                  Configuración para futuras notificaciones del sistema.
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  variant="contained"
                  startIcon={<Settings />}
                >
                  Guardar configuración
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        )}
      </Card>
    </section>
  );
}