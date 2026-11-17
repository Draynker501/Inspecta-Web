import { useMemo, useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GavelIcon from "@mui/icons-material/Gavel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArchiveIcon from "@mui/icons-material/Archive";

interface Norma {
  id: number;
  clave: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fechaPublicacion: string;
  vigencia: string;
  estado: "Activa" | "En revisión" | "Archivada";
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  description: string;
}

const normasIniciales: Norma[] = [
  {
    id: 1,
    clave: "NOM-001-STPS-2008",
    nombre:
      "Edificios, locales, instalaciones y áreas en los centros de trabajo",
    categoria: "Seguridad",
    descripcion:
      "Condiciones de seguridad de edificios, locales, instalaciones y áreas de trabajo.",
    fechaPublicacion: "24/11/2008",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 2,
    clave: "NOM-002-STPS-2010",
    nombre:
      "Prevención y protección contra incendios en los centros de trabajo",
    categoria: "Seguridad",
    descripcion:
      "Condiciones de seguridad para la prevención y protección contra incendios.",
    fechaPublicacion: "09/12/2010",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 3,
    clave: "NOM-004-STPS-1999",
    nombre:
      "Sistemas de protección y dispositivos de seguridad en la maquinaria",
    categoria: "Seguridad",
    descripcion:
      "Sistemas de protección y dispositivos de seguridad en maquinaria y equipo.",
    fechaPublicacion: "31/05/1999",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 4,
    clave: "NOM-017-STPS-2024",
    nombre:
      "Equipo de protección personal - Selección, uso y manejo en los centros de trabajo",
    categoria: "Seguridad",
    descripcion:
      "Requisitos para la selección, uso y manejo del equipo de protección personal.",
    fechaPublicacion: "28/03/2025",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 5,
    clave: "NOM-019-STPS-2011",
    nombre:
      "Constitución, integración, organización y funcionamiento de las comisiones de seguridad e higiene",
    categoria: "Gestión",
    descripcion:
      "Lineamientos relacionados con las comisiones de seguridad e higiene.",
    fechaPublicacion: "13/04/2011",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 6,
    clave: "NOM-026-STPS-2008",
    nombre:
      "Colores y señales de seguridad e higiene, e identificación de riesgos",
    categoria: "Seguridad",
    descripcion:
      "Colores y señales de seguridad e higiene e identificación de riesgos.",
    fechaPublicacion: "25/11/2008",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 7,
    clave: "NOM-030-STPS-2009",
    nombre:
      "Servicios preventivos de seguridad y salud en el trabajo",
    categoria: "Gestión",
    descripcion:
      "Funciones y actividades de los servicios preventivos de seguridad y salud.",
    fechaPublicacion: "22/12/2009",
    vigencia: "Vigente",
    estado: "Activa",
  },
  {
    id: 8,
    clave: "NOM-035-STPS-2018",
    nombre:
      "Factores de riesgo psicosocial en el trabajo",
    categoria: "Salud",
    descripcion:
      "Identificación, análisis y prevención de factores de riesgo psicosocial.",
    fechaPublicacion: "23/10/2018",
    vigencia: "Vigente",
    estado: "Activa",
  },
];

function getEstadoColor(
  estado: Norma["estado"]
): "default" | "warning" | "success" {
  switch (estado) {
    case "Activa":
      return "success";
    case "En revisión":
      return "warning";
    case "Archivada":
      return "default";
    default:
      return "default";
  }
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  description,
}: SummaryCardProps) {
  return (
    <Card sx={{ flex: 1, minWidth: 210 }}>
      <CardContent>
        <Stack
          direction="row"
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
                mb: 0.5,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#16324F",
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                mt: 0.5,
              }}
            >
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
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

export default function Normativa() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const normas = normasIniciales;

  const resumen = useMemo(() => {
    return {
      total: normas.length,
      activas: normas.filter(
        (norma) => norma.estado === "Activa"
      ).length,
      revision: normas.filter(
        (norma) => norma.estado === "En revisión"
      ).length,
      archivadas: normas.filter(
        (norma) => norma.estado === "Archivada"
      ).length,
    };
  }, [normas]);

  const normasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return normas.filter((norma) => {
      const coincideBusqueda =
        texto === "" ||
        norma.clave.toLowerCase().includes(texto) ||
        norma.nombre.toLowerCase().includes(texto) ||
        norma.categoria.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        norma.estado === filtroEstado;

      const coincideCategoria =
        filtroCategoria === "Todas" ||
        norma.categoria === filtroCategoria;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideCategoria
      );
    });
  }, [
    normas,
    busqueda,
    filtroEstado,
    filtroCategoria,
  ]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Encabezado */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
          mb: 3,
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
            Normativa
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            Consulta y administración de la normativa de seguridad e higiene.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#16324F",
            "&:hover": {
              backgroundColor: "#0F263D",
            },
          }}
        >
          Nueva norma
        </Button>
      </Stack>

      {/* Resumen */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <SummaryCard
          title="Total"
          value={resumen.total}
          description="Normas registradas"
          color="#16324F"
          icon={<GavelIcon />}
        />

        <SummaryCard
          title="Activas"
          value={resumen.activas}
          description="Normativa vigente"
          color="#16803C"
          icon={<CheckCircleIcon />}
        />

        <SummaryCard
          title="En revisión"
          value={resumen.revision}
          description="Requieren revisión"
          color="#F2A900"
          icon={<PendingActionsIcon />}
        />

        <SummaryCard
          title="Archivadas"
          value={resumen.archivadas}
          description="Conservadas para historial"
          color="#81909D"
          icon={<ArchiveIcon />}
        />
      </Stack>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
          >
            <TextField
              fullWidth
              placeholder="Buscar por clave, nombre o categoría..."
              value={busqueda}
              onChange={(event) =>
                setBusqueda(event.target.value)
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        color: "text.secondary",
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
            />

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 190,
                },
              }}
            >
              <InputLabel>Estado</InputLabel>

              <Select
                value={filtroEstado}
                label="Estado"
                onChange={(event) =>
                  setFiltroEstado(event.target.value)
                }
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Activa">Activa</MenuItem>
                <MenuItem value="En revisión">
                  En revisión
                </MenuItem>
                <MenuItem value="Archivada">
                  Archivada
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 190,
                },
              }}
            >
              <InputLabel>Categoría</InputLabel>

              <Select
                value={filtroCategoria}
                label="Categoría"
                onChange={(event) =>
                  setFiltroCategoria(event.target.value)
                }
              >
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="Seguridad">
                  Seguridad
                </MenuItem>
                <MenuItem value="Gestión">
                  Gestión
                </MenuItem>
                <MenuItem value="Salud">
                  Salud
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              overflowX: "auto",
              width: "100%",
            }}
          >
            <Box sx={{ minWidth: 1150 }}>
              {/* Encabezado */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "170px minmax(300px, 1fr) 120px 130px 110px 110px 100px",
                  gap: 2,
                  alignItems: "center",
                  px: 3,
                  py: 2,
                  backgroundColor: "#F4F7FA",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  NORMA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  NOMBRE
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  CATEGORÍA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  PUBLICACIÓN
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  VIGENCIA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  ESTADO
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  ACCIÓN
                </Typography>
              </Box>

              <Divider />

              {/* Registros */}
              {normasFiltradas.map((norma) => (
                <Box key={norma.id}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "170px minmax(300px, 1fr) 120px 130px 110px 110px 100px",
                      gap: 2,
                      alignItems: "center",
                      px: 3,
                      py: 2,
                    }}
                  >
                    {/* Clave */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#16324F",
                      }}
                    >
                      {norma.clave}
                    </Typography>

                    {/* Nombre */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#273746",
                      }}
                    >
                      {norma.nombre}
                    </Typography>

                    {/* Categoría */}
                    <Chip
                      label={norma.categoria}
                      size="small"
                      variant="outlined"
                    />

                    {/* Fecha */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {norma.fechaPublicacion}
                    </Typography>

                    {/* Vigencia */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {norma.vigencia}
                    </Typography>

                    {/* Estado */}
                    <Chip
                      label={norma.estado}
                      size="small"
                      color={getEstadoColor(norma.estado)}
                    />

                    {/* Acción */}
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{
                        color: "#16324F",
                      }}
                    >
                      Ver
                    </Button>
                  </Box>

                  <Divider />
                </Box>
              ))}

              {/* Sin resultados */}
              {normasFiltradas.length === 0 && (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 14,
                    }}
                  >
                    No se encontraron normas.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Pie */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 12,
              }}
            >
              Mostrando {normasFiltradas.length} de{" "}
              {normas.length} normas
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}