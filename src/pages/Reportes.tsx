import { useMemo, useState } from "react";
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
  Typography,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface ReporteResumenProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  icon: React.ReactNode;
  color: string;
}

function ReporteResumen({
  titulo,
  valor,
  descripcion,
  icon,
  color,
}: ReporteResumenProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                mb: 0.25,
              }}
            >
              {titulo}
            </Typography>

            <Typography
              sx={{
                fontSize: 30,
                lineHeight: 1.05,
                fontWeight: 700,
                color: "#16324F",
              }}
            >
              {valor}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                mt: 0.35,
              }}
            >
              {descripcion}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${color}15`,
              color,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Reportes() {
  const [periodo, setPeriodo] = useState("Este mes");
  const [area, setArea] = useState("Todas");

  const datos = useMemo(() => {
    return {
      inspecciones: 42,
      inspeccionesCompletadas: 36,
      incidencias: 18,
      incidenciasCriticas: 3,
      acciones: 24,
      accionesCerradas: 15,
      cumplimiento: 86,

      incidenciasAreas: [
        { area: "Producción", cantidad: 8 },
        { area: "Almacén", cantidad: 4 },
        { area: "Mantenimiento", cantidad: 3 },
        { area: "Servicios", cantidad: 2 },
        { area: "Oficinas", cantidad: 1 },
      ],

      severidades: [
        { nombre: "Bajo", cantidad: 4, color: "#2673C9" },
        { nombre: "Medio", cantidad: 7, color: "#F2A900" },
        { nombre: "Alto", cantidad: 4, color: "#B42318" },
        { nombre: "Crítico", cantidad: 3, color: "#7A1A13" },
      ],

      accionesEstado: [
        { nombre: "Pendientes", cantidad: 4 },
        { nombre: "En proceso", cantidad: 3 },
        { nombre: "En revisión", cantidad: 2 },
        { nombre: "Cerradas", cantidad: 15 },
      ],
    };
  }, []);

  const porcentajeAcciones =
    datos.acciones === 0
      ? 0
      : Math.round((datos.accionesCerradas / datos.acciones) * 100);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Encabezado */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#16324F",
            }}
          >
            Reportes
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mt: 0.25,
            }}
          >
            Consulta y análisis de los indicadores de seguridad e higiene.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.25}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdfIcon />}
            sx={{
              color: "#16324F",
              borderColor: "#DCE6EE",
            }}
          >
            Exportar PDF
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: "#16324F",
              "&:hover": {
                backgroundColor: "#0F263D",
              },
            }}
          >
            Exportar reporte
          </Button>
        </Stack>
      </Stack>

      {/* Filtros compactos */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { xs: "stretch", sm: "center" } }}
          >
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel>Periodo</InputLabel>
              <Select
                value={periodo}
                label="Periodo"
                onChange={(event) => setPeriodo(event.target.value)}
              >
                <MenuItem value="Esta semana">Esta semana</MenuItem>
                <MenuItem value="Este mes">Este mes</MenuItem>
                <MenuItem value="Últimos 3 meses">Últimos 3 meses</MenuItem>
                <MenuItem value="Este año">Este año</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel>Área</InputLabel>
              <Select
                value={area}
                label="Área"
                onChange={(event) => setArea(event.target.value)}
              >
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="Producción">Producción</MenuItem>
                <MenuItem value="Almacén">Almacén</MenuItem>
                <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                <MenuItem value="Servicios">Servicios</MenuItem>
                <MenuItem value="Oficinas">Oficinas</MenuItem>
              </Select>
            </FormControl>

            <Typography
              sx={{
                flex: 1,
                fontSize: 13,
                color: "text.secondary",
                textAlign: { xs: "left", sm: "right" },
              }}
            >
              Mostrando información de <strong>{area}</strong> durante{" "}
              <strong>{periodo.toLowerCase()}</strong>.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Indicadores principales */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReporteResumen
            titulo="Inspecciones"
            valor={datos.inspecciones}
            descripcion="Registradas"
            color="#16324F"
            icon={<AssessmentIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReporteResumen
            titulo="Incidencias"
            valor={datos.incidencias}
            descripcion="Detectadas"
            color="#B42318"
            icon={<WarningAmberIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReporteResumen
            titulo="Acciones correctivas"
            valor={datos.acciones}
            descripcion="Generadas"
            color="#2673C9"
            icon={<AssignmentTurnedInIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <ReporteResumen
            titulo="Cumplimiento"
            valor={`${datos.cumplimiento}%`}
            descripcion="Promedio general"
            color="#16803C"
            icon={<CheckCircleIcon />}
          />
        </Grid>
      </Grid>

      {/* Cumplimiento + severidad */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: { xs: "stretch", sm: "center" } }}
              >
                <Box sx={{ flex: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.75,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#16324F",
                        }}
                      >
                        Cumplimiento de inspecciones
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "text.secondary",
                          mt: 0.25,
                        }}
                      >
                        Porcentaje de inspecciones completadas.
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "#16803C",
                      }}
                    >
                      {datos.cumplimiento}%
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      width: "100%",
                      height: 9,
                      borderRadius: 4,
                      backgroundColor: "#DCE6EE",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${datos.cumplimiento}%`,
                        height: "100%",
                        backgroundColor: "#16803C",
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ display: { xs: "none", sm: "block" } }}
                />

                <Box sx={{ minWidth: { xs: "100%", sm: 130 } }}>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    Inspecciones completadas
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#16324F",
                      mt: 0.25,
                    }}
                  >
                    {datos.inspeccionesCompletadas}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        ml: 0.5,
                      }}
                    >
                      / {datos.inspecciones}
                    </Typography>
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#16324F",
                }}
              >
                Incidencias por severidad
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  mt: 0.25,
                  mb: 1.5,
                }}
              >
                Clasificación de las incidencias registradas.
              </Typography>

              <Grid container spacing={1.25}>
                {datos.severidades.map((item) => (
                  <Grid key={item.nombre} size={{ xs: 6, sm: 3, md: 6 }}>
                    <Box
                      sx={{
                        border: "1px solid #DCE6EE",
                        borderRadius: 2,
                        p: 1.5,
                        height: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Chip
                          label={item.nombre}
                          size="small"
                          sx={{
                            color: item.color,
                            borderColor: item.color,
                            fontSize: 12,
                          }}
                          variant="outlined"
                        />

                        <Typography
                          sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: "#16324F",
                          }}
                        >
                          {item.cantidad}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Incidencias por área + acciones correctivas */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#16324F",
                    }}
                  >
                    Incidencias por área
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "text.secondary",
                      mt: 0.25,
                    }}
                  >
                    Distribución de incidencias detectadas.
                  </Typography>
                </Box>

                <TrendingUpIcon sx={{ color: "#16324F", fontSize: 20 }} />
              </Stack>

              <Stack spacing={1.25}>
                {datos.incidenciasAreas.map((item, index) => {
                  const porcentaje =
                    datos.incidencias === 0
                      ? 0
                      : Math.round((item.cantidad / datos.incidencias) * 100);

                  return (
                    <Box key={item.area}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.35,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: index === 0 ? 700 : 500,
                          }}
                        >
                          {item.area}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "text.secondary",
                          }}
                        >
                          {item.cantidad} incidencias
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          width: "100%",
                          height: 9,
                          borderRadius: 4,
                          backgroundColor: "#F4F7FA",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${porcentaje}%`,
                            height: "100%",
                            backgroundColor:
                              index === 0 ? "#16324F" : "#0F9D8A",
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#16324F",
                }}
              >
                Estado de acciones correctivas
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  mt: 0.25,
                  mb: 1.5,
                }}
              >
                Seguimiento de las acciones generadas.
              </Typography>

              <Stack spacing={1.25}>
                {datos.accionesEstado.map((item) => {
                  const porcentaje =
                    datos.acciones === 0
                      ? 0
                      : Math.round((item.cantidad / datos.acciones) * 100);

                  return (
                    <Box key={item.nombre}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.35,
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>
                          {item.nombre}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "text.secondary",
                          }}
                        >
                          {item.cantidad} ({porcentaje}%)
                        </Typography>
                      </Stack>

                      <Box
                        sx={{
                          width: "100%",
                          height: 9,
                          borderRadius: 4,
                          backgroundColor: "#F4F7FA",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${porcentaje}%`,
                            height: "100%",
                            backgroundColor:
                              item.nombre === "Cerradas"
                                ? "#16803C"
                                : "#2673C9",
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 1.5 }} />

              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                }}
              >
                Porcentaje de acciones cerradas:{" "}
                <strong>{porcentajeAcciones}%</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
