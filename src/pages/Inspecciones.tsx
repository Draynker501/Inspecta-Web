import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Alert from "@mui/material/Alert";

import { isApiConfigured } from "../api/client";
import { getInspections } from "../services/inspections.service";
import type { InspectionBase } from "../types/inspections";
type Estado =
  | "Completada"
  | "En proceso"
  | "Pendiente"
  | "Confirmada"
  | "Rechazada";

type Inspeccion = {
  id: string;
  area: string;
  tipo: string;
  responsable: string;
  fecha: string;
  estado: Estado;
  avance: number | null;
};

const inspeccionesIniciales: Inspeccion[] = [
  {
    id: "INS-001",
    area: "Almacén",
    tipo: "Seguridad",
    responsable: "Juan Pérez",
    fecha: "29 Sep 2026",
    estado: "En proceso",
    avance: 75,
  },
  {
    id: "INS-002",
    area: "Línea 3",
    tipo: "Seguridad",
    responsable: "Ana López",
    fecha: "30 Sep 2026",
    estado: "Pendiente",
    avance: 0,
  },
  {
    id: "INS-003",
    area: "Producción",
    tipo: "Higiene",
    responsable: "Carlos Ramírez",
    fecha: "28 Sep 2026",
    estado: "Completada",
    avance: 100,
  },
  {
    id: "INS-004",
    area: "Línea 2",
    tipo: "Seguridad",
    responsable: "María González",
    fecha: "27 Sep 2026",
    estado: "En proceso",
    avance: 45,
  },
  {
    id: "INS-005",
    area: "Mantenimiento",
    tipo: "Higiene",
    responsable: "Luis Hernández",
    fecha: "26 Sep 2026",
    estado: "Completada",
    avance: 100,
  },
  {
    id: "INS-006",
    area: "Almacén",
    tipo: "Seguridad",
    responsable: "Sofía Martínez",
    fecha: "25 Sep 2026",
    estado: "Pendiente",
    avance: 0,
  },
];

function convertirInspeccionApi(item: InspectionBase): Inspeccion {
  const estados: Record<InspectionBase["status"], Estado> = {
    draft: "Pendiente",
    completed: "Completada",
    confirmed: "Confirmada",
    rejected: "Rechazada",
  };

  const fecha = item.completed_at ?? item.started_at;

  return {
    id: item.id,
    area: `Área ${item.area_id.slice(0, 8)}`,
    tipo: "—",
    responsable: `Usuario ${item.user_id.slice(0, 8)}`,
    fecha: fecha
      ? new Date(fecha).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—",
    estado: estados[item.status],
    avance: null,
  };
}

async function obtenerImagenParaPDF(src: string): Promise<{ dataUrl: string; formato: "PNG" | "JPEG"; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!src.startsWith("data:")) image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("No fue posible procesar una imagen de evidencia."));
          return;
        }
        context.drawImage(image, 0, 0);
        const esPng = src.startsWith("data:image/png");
        resolve({
          dataUrl: canvas.toDataURL(esPng ? "image/png" : "image/jpeg", 0.9),
          formato: esPng ? "PNG" : "JPEG",
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      } catch {
        reject(new Error("No se pudo leer una imagen. Verifica que la URL permita CORS o usa una data URL."));
      }
    };
    image.onerror = () => reject(new Error("No se pudo cargar una imagen de evidencia."));
    image.src = src;
  });
}

export default function Inspecciones() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const [datosInspecciones, setDatosInspecciones] =
    useState<Inspeccion[]>(inspeccionesIniciales);
  const [cargando, setCargando] = useState(false);
  const [errorApi, setErrorApi] = useState("");
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState<Inspeccion | null>(null);

  useEffect(() => {
    if (!isApiConfigured) return;

    let activo = true;

    async function cargarInspecciones() {
      setCargando(true);
      setErrorApi("");

      try {
        const respuesta = await getInspections({
          page: 1,
          perPage: 100,
        });

        if (!activo) return;
        setDatosInspecciones(respuesta.data.map(convertirInspeccionApi));
      } catch (error) {
        if (!activo) return;
        setErrorApi(
          error instanceof Error
            ? error.message
            : "No fue posible cargar las inspecciones.",
        );
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarInspecciones();

    return () => {
      activo = false;
    };
  }, []);

  const inspecciones = useMemo(() => {
    return datosInspecciones.filter((inspeccion) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        inspeccion.id.toLowerCase().includes(texto) ||
        inspeccion.area.toLowerCase().includes(texto) ||
        inspeccion.responsable.toLowerCase().includes(texto);

      const coincideEstado =
        estadoFiltro === "Todos" ||
        inspeccion.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [busqueda, estadoFiltro, datosInspecciones]);

  const total = datosInspecciones.length;

  const completadas = datosInspecciones.filter(
    (item) => item.estado === "Completada"
  ).length;

  const enProceso = datosInspecciones.filter(
    (item) => item.estado === "En proceso"
  ).length;

  const pendientes = datosInspecciones.filter(
    (item) => item.estado === "Pendiente"
  ).length;

  const generarPDF = async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const fechaGeneracion = new Date().toLocaleString("es-MX");
    const azul = [22, 50, 79] as [number, number, number];
    const verde = [15, 157, 138] as [number, number, number];

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.setTextColor(...azul);
    pdf.text("INSPECTA | Reporte de inspecciones", 14, 17);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Generado: ${fechaGeneracion}`, 14, 24);
    pdf.text(`Inspecciones incluidas: ${datosInspecciones.length}`, 14, 29);

    autoTable(pdf, {
      startY: 35,
      head: [["Folio", "Área", "Tipo", "Responsable", "Fecha", "Estado", "Avance"]],
      body: datosInspecciones.map((item) => [
        item.id,
        item.area,
        item.tipo,
        item.responsable,
        item.fecha,
        item.estado,
        item.avance === null ? "Sin datos" : `${item.avance}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: azul, textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
      alternateRowStyles: { fillColor: [246, 249, 252] },
      margin: { left: 14, right: 14 },
    });

    for (const item of datosInspecciones) {
      pdf.addPage();
      const detalle = detallesDemo[item.id] ?? detallesDemo.default;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(...azul);
      pdf.text(`Detalle de inspección: ${item.id}`, 14, 17);

      autoTable(pdf, {
        startY: 23,
        head: [["Campo", "Información"]],
        body: [
          ["Área de trabajo", item.area],
          ["Tipo de inspección", item.tipo],
          ["Inspector responsable", item.responsable],
          ["Fecha", item.fecha],
          ["Estado", item.estado],
          ["Avance", item.avance === null ? "Sin datos disponibles" : `${item.avance}%`],
          ["Prioridad general", detalle.prioridad],
          ["Objetivo y alcance", detalle.objetivo],
          ["Observaciones", detalle.observaciones],
        ],
        theme: "grid",
        headStyles: { fillColor: verde, textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
        columnStyles: { 0: { cellWidth: 42, fontStyle: "bold" }, 1: { cellWidth: "auto" } },
        margin: { left: 14, right: 14 },
      });

      let y = (pdf as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 100;
      y += 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(...azul);
      pdf.text(`Incidencias detectadas (${detalle.incidencias.length})`, 14, y);

      autoTable(pdf, {
        startY: y + 4,
        head: [["Incidencia", "Descripción", "Riesgo", "Ubicación", "Acción recomendada", "Responsable", "Fecha límite"]],
        body: detalle.incidencias.length
          ? detalle.incidencias.map((incidencia) => [
              incidencia.titulo,
              incidencia.descripcion,
              incidencia.riesgo,
              incidencia.ubicacion,
              incidencia.accion,
              incidencia.responsable,
              incidencia.fechaLimite,
            ])
          : [["Sin incidencias registradas en los datos de demostración", "—", "—", "—", "—", "—", "—"]],
        theme: "grid",
        headStyles: { fillColor: azul, textColor: 255 },
        styles: { fontSize: 7, cellPadding: 2, overflow: "linebreak" },
        margin: { left: 14, right: 14 },
      });

      for (const incidencia of detalle.incidencias) {
        for (const evidencia of incidencia.imagenes ?? []) {
          try {
            const imagen = await obtenerImagenParaPDF(evidencia.src);
            pdf.addPage();
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(15);
            pdf.setTextColor(...azul);
            pdf.text(`Evidencia fotográfica | ${item.id}`, 14, 17);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            pdf.text(`Incidencia: ${incidencia.titulo}`, 14, 25, { maxWidth: 180 });
            const descripcion = evidencia.descripcion || "Evidencia fotográfica";
            pdf.setFontSize(9);
            pdf.text(`Tipo: ${evidencia.tipo || "General"} · ${descripcion}`, 14, 33, { maxWidth: 260 });
            if (evidencia.fecha) pdf.text(`Fecha: ${evidencia.fecha}`, 14, 39);
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const top = evidencia.fecha ? 45 : 39;
            const maxWidth = pageWidth - 28;
            const maxHeight = pageHeight - top - 14;
            const scale = Math.min(maxWidth / imagen.width, maxHeight / imagen.height);
            const width = imagen.width * scale;
            const height = imagen.height * scale;
            pdf.addImage(imagen.dataUrl, imagen.formato, (pageWidth - width) / 2, top, width, height);
          } catch (error) {
            console.warn(`No se pudo agregar evidencia de ${item.id}:`, error);
          }
        }
      }
    }

    pdf.save(`Inspecta-reporte-inspecciones-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const getEstadoColor = (estado: Estado) => {
    switch (estado) {
      case "Completada":
        return {
          color: "#16803C",
          background: "#EAF7EF",
        };

      case "En proceso":
        return {
          color: "#B77900",
          background: "#FFF5D9",
        };

      case "Pendiente":
        return {
          color: "#2673C9",
          background: "#EDF5FF",
        };

      case "Confirmada":
        return {
          color: "#16803C",
          background: "#EAF7EF",
        };

      case "Rechazada":
        return {
          color: "#B42318",
          background: "#FDECEC",
        };
    }
  };

  return (
    <Box>
      {/* ENCABEZADO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          mb: 4,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0F9D8A",
              letterSpacing: 1,
              mb: 0.5,
            }}
          >
            GESTIÓN OPERATIVA
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#16324F",
              mb: 0.5,
            }}
          >
            Inspecciones
          </Typography>

          <Typography
            sx={{
              color: "#81909D",
              fontSize: 14,
            }}
          >
            Consulta, gestiona y da seguimiento a las inspecciones.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={generarPDF}
          sx={{
            backgroundColor: "#0F9D8A",
            px: 2.5,
            py: 1.2,
            "&:hover": {
              backgroundColor: "#0C8878",
            },
          }}
        >
          Generar PDF
        </Button>
      </Box>

      {errorApi && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se pudieron cargar las inspecciones de la API. Se conservan los
          datos disponibles. Detalle: {errorApi}
        </Alert>
      )}

      {cargando && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Cargando inspecciones...
        </Alert>
      )}

      {/* RESUMEN */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard
          title="Total"
          value={total}
          icon={<AssignmentIcon />}
          iconColor="#2673C9"
          iconBackground="#EDF5FF"
        />

        <SummaryCard
          title="En proceso"
          value={enProceso}
          icon={<PlayCircleIcon/>}
          iconColor="#B77900"
          iconBackground="#FFF5D9"
        />

        <SummaryCard
          title="Pendientes"
          value={pendientes}
          icon={<PendingActionsIcon />}
          iconColor="#2673C9"
          iconBackground="#EDF5FF"
        />

        <SummaryCard
          title="Completadas"
          value={completadas}
          icon={<CheckCircleIcon />}
          iconColor="#16803C"
          iconBackground="#EAF7EF"
        />
      </Box>

      {/* FILTROS */}
      <Card
        sx={{
          mb: 2,
          border: "none",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por folio, área o responsable..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{
                          color: "#81909D",
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Select
              size="small"
              value={estadoFiltro}
              onChange={(event) =>
                setEstadoFiltro(event.target.value)
              }
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 190,
                },
              }}
            >
              <MenuItem value="Todos">Todos los estados</MenuItem>
              <MenuItem value="Pendiente">Pendiente</MenuItem>
              <MenuItem value="En proceso">En proceso</MenuItem>
              <MenuItem value="Completada">Completada</MenuItem>
              <MenuItem value="Confirmada">Confirmada</MenuItem>
              <MenuItem value="Rechazada">Rechazada</MenuItem>
            </Select>
          </Box>
        </CardContent>
      </Card>

      {/* TABLA */}
      <Card
        sx={{
          border: "none",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#F8FAFC",
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Folio
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Área
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Tipo
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Responsable
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Fecha
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Estado
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#16324F",
                  }}
                >
                  Avance
                </TableCell>

                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {inspecciones.map((inspeccion) => {
                const estado = getEstadoColor(inspeccion.estado);

                return (
                  <TableRow
                    key={inspeccion.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#16324F",
                        }}
                      >
                        {inspeccion.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#273746",
                        }}
                      >
                        {inspeccion.area}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#81909D",
                        }}
                      >
                        {inspeccion.tipo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#273746",
                        }}
                      >
                        {inspeccion.responsable}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#81909D",
                        }}
                      >
                        {inspeccion.fecha}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={inspeccion.estado}
                        size="small"
                        sx={{
                          color: estado.color,
                          backgroundColor: estado.background,
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ minWidth: 130 }}>
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#273746",
                          }}
                        >
                          {inspeccion.avance === null
                            ? "Sin datos"
                            : `${inspeccion.avance}%`}
                        </Typography>

                        <Box
                          sx={{
                            width: "100%",
                            height: 5,
                            backgroundColor: "#E6EDF2",
                            borderRadius: 10,
                            overflow: "hidden",
                          }}
                        >
                          {inspeccion.avance !== null && (
                            <Box
                              sx={{
                                width: `${inspeccion.avance}%`,
                                height: "100%",
                                backgroundColor:
                                  inspeccion.estado === "Completada" ||
                                  inspeccion.estado === "Confirmada"
                                    ? "#16803C"
                                    : "#0F9D8A",
                                borderRadius: 10,
                              }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setInspeccionSeleccionada(inspeccion)}
                        sx={{
                          color: "#16324F",
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {inspecciones.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 6,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#81909D",
                        fontSize: 14,
                      }}
                    >
                      No se encontraron inspecciones.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* DETALLE DE LA INSPECCIÓN */}
      <Dialog
        open={Boolean(inspeccionSeleccionada)}
        onClose={() => setInspeccionSeleccionada(null)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        {inspeccionSeleccionada && (() => {
          const detalle = detallesDemo[inspeccionSeleccionada.id] ?? detallesDemo.default;
          const estadoDetalle = getEstadoColor(inspeccionSeleccionada.estado);

          return (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box
  sx={{
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 1,
  }}
>
                  <Box>
                    <Typography sx={{ color: "#0F9D8A", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                      DETALLE DE INSPECCIÓN
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#16324F", fontWeight: 700 }}>
                      {inspeccionSeleccionada.id}
                    </Typography>
                  </Box>
                  <Chip
                    label={inspeccionSeleccionada.estado}
                    sx={{ color: estadoDetalle.color, backgroundColor: estadoDetalle.background, fontWeight: 700 }}
                  />
                </Box>
              </DialogTitle>

              <DialogContent dividers>
                <Stack spacing={3}>
                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1.5 }}>
                      Información general
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                      {[
                        ["Área de trabajo", inspeccionSeleccionada.area],
                        ["Tipo de inspección", inspeccionSeleccionada.tipo],
                        ["Inspector responsable", inspeccionSeleccionada.responsable],
                        ["Fecha", inspeccionSeleccionada.fecha],
                        ["Avance", inspeccionSeleccionada.avance === null ? "Sin datos disponibles" : `${inspeccionSeleccionada.avance}%`],
                        ["Prioridad general", detalle.prioridad],
                      ].map(([label, value]) => (
                        <Box key={label} sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                          <Typography sx={{ color: "#81909D", fontSize: 12, mb: 0.5 }}>{label}</Typography>
                          <Typography sx={{ color: "#16324F", fontWeight: 600 }}>{value}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                      Objetivo y alcance
                    </Typography>
                    <Typography sx={{ color: "#526477", fontSize: 14, lineHeight: 1.7 }}>
                      {detalle.objetivo}
                    </Typography>
                    <Typography sx={{ color: "#81909D", fontSize: 12, mt: 1 }}>
                      Los datos de incidencias que se muestran son de demostración y deberán sustituirse por los registros de la API.
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1.5 }}>
                      Incidencias detectadas ({detalle.incidencias.length})
                    </Typography>
                    {detalle.incidencias.length ? (
                      <Stack spacing={1.5}>
                        {detalle.incidencias.map((incidencia, index) => (
                          <Box key={`${incidencia.titulo}-${index}`} sx={{ border: "1px solid #E1E8EF", borderRadius: 2, p: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" },
                                justifyContent: "space-between",
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography sx={{ color: "#16324F", fontWeight: 700 }}>
                                {index + 1}. {incidencia.titulo}
                              </Typography>
                              <Chip
                                size="small"
                                label={incidencia.riesgo}
                                color={incidencia.riesgo === "Alto" ? "error" : incidencia.riesgo === "Medio" ? "warning" : "info"}
                              />
                            </Box>
                            <Typography sx={{ color: "#526477", fontSize: 14, mb: 1.5, lineHeight: 1.6 }}>
                              {incidencia.descripcion}
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                              <Box>
                                <Typography sx={{ color: "#81909D", fontSize: 12 }}>Ubicación</Typography>
                                <Typography sx={{ color: "#273746", fontSize: 13 }}>{incidencia.ubicacion}</Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: "#81909D", fontSize: 12 }}>Acción recomendada</Typography>
                                <Typography sx={{ color: "#273746", fontSize: 13 }}>{incidencia.accion}</Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: "#81909D", fontSize: 12 }}>Responsable de seguimiento</Typography>
                                <Typography sx={{ color: "#273746", fontSize: 13 }}>{incidencia.responsable}</Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ color: "#81909D", fontSize: 12 }}>Fecha límite</Typography>
                                <Typography sx={{ color: "#273746", fontSize: 13 }}>{incidencia.fechaLimite}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                              <Typography sx={{ color: "#16324F", fontSize: 13, fontWeight: 700, mb: 1 }}>
                                Evidencias fotográficas ({incidencia.imagenes?.length ?? 0})
                              </Typography>
                              {incidencia.imagenes && incidencia.imagenes.length > 0 ? (
                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                                  {incidencia.imagenes.map((imagen, imageIndex) => (
                                    <Box key={`${imagen.src}-${imageIndex}`} sx={{ border: "1px solid #E1E8EF", borderRadius: 2, p: 1, minWidth: 0 }}>
                                      <Box
                                        component="img"
                                        src={imagen.src}
                                        alt={imagen.descripcion || `Evidencia ${imageIndex + 1}`}
                                        sx={{ display: "block", width: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 1, bgcolor: "#F8FAFC" }}
                                      />
                                      <Typography sx={{ color: "#526477", fontSize: 12, mt: 1 }}>
                                        {imagen.tipo ? `${imagen.tipo} · ` : ""}{imagen.descripcion || `Evidencia ${imageIndex + 1}`}
                                      </Typography>
                                      {imagen.fecha && <Typography sx={{ color: "#81909D", fontSize: 11 }}>{imagen.fecha}</Typography>}
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Box sx={{ border: "1px dashed #C7D7E8", borderRadius: 2, p: 1.5, bgcolor: "#F8FAFC" }}>
                                  <Typography sx={{ color: "#526477", fontSize: 12 }}>
                                    No hay fotografías asociadas a esta incidencia. El apartado está preparado para mostrar evidencias cuando se agreguen al registro.
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="success">No se registran incidencias para esta inspección de demostración.</Alert>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                      Observaciones del inspector
                    </Typography>
                    <Typography sx={{ color: "#526477", fontSize: 14, lineHeight: 1.7 }}>
                      {detalle.observaciones}
                    </Typography>
                  </Box>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button
                  onClick={() => setInspeccionSeleccionada(null)}
                  variant="contained"
                  sx={{ bgcolor: "#16324F", textTransform: "none", "&:hover": { bgcolor: "#234766" } }}
                >
                  Cerrar detalle
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

    </Box>
  );
}

type EvidenciaImagen = {
  src: string; // URL accesible con CORS o data URL (base64)
  descripcion?: string;
  fecha?: string;
  tipo?: "Antes" | "Después" | "General";
};

type IncidenciaDetalle = {
  titulo: string;
  descripcion: string;
  riesgo: "Alto" | "Medio" | "Bajo";
  ubicacion: string;
  accion: string;
  responsable: string;
  fechaLimite: string;
  imagenes?: EvidenciaImagen[];
};

const detallesDemo: Record<string, {
  prioridad: string;
  objetivo: string;
  observaciones: string;
  incidencias: IncidenciaDetalle[];
}> = {
  "INS-001": {
    prioridad: "Alta",
    objetivo: "Verificar condiciones seguras de almacenamiento, pasillos despejados, señalización y disponibilidad de equipo de protección personal en el almacén.",
    observaciones: "Inspección en proceso. Se recomienda atender los hallazgos de mayor riesgo y documentar la evidencia de cierre.",
    incidencias: [
      { titulo: "Pasillo parcialmente obstruido", descripcion: "Se observó material almacenado en una zona de circulación peatonal, lo que puede dificultar el tránsito y una evacuación.", riesgo: "Alto", ubicacion: "Pasillo central del almacén", accion: "Retirar el material y mantener delimitada la ruta de circulación.", responsable: "Responsable de almacén", fechaLimite: "Por definir" },
      { titulo: "Señalización preventiva deteriorada", descripcion: "Una señal de advertencia no se distingue claramente desde el acceso al área.", riesgo: "Medio", ubicacion: "Acceso al almacén", accion: "Reponer la señal y verificar su visibilidad.", responsable: "Seguridad e higiene", fechaLimite: "Por definir" },
    ],
  },
  "INS-002": {
    prioridad: "Por evaluar",
    objetivo: "Revisar condiciones de seguridad de la Línea 3, incluyendo equipo de protección, señalización y condiciones de operación.",
    observaciones: "Inspección pendiente de inicio; todavía no hay hallazgos verificados.",
    incidencias: [],
  },
  "INS-003": {
    prioridad: "Media",
    objetivo: "Verificar orden, limpieza e higiene del área de producción.",
    observaciones: "Inspección marcada como completada. Confirmar que los hallazgos y evidencias estén documentados en el registro definitivo.",
    incidencias: [
      { titulo: "Contenedor sin identificación visible", descripcion: "Se detectó un contenedor cuyo contenido no está identificado de forma clara.", riesgo: "Medio", ubicacion: "Zona de producción", accion: "Identificar el contenedor conforme al procedimiento interno.", responsable: "Responsable de producción", fechaLimite: "Por definir" },
    ],
  },
  "INS-004": {
    prioridad: "Alta",
    objetivo: "Revisar los riesgos de seguridad y las condiciones de trabajo de la Línea 2.",
    observaciones: "Inspección en proceso. Los hallazgos mostrados son ilustrativos y requieren validación por el inspector.",
    incidencias: [
      { titulo: "Resguardo de máquina por verificar", descripcion: "Es necesario confirmar que el resguardo del equipo esté colocado y funcione correctamente antes de operar.", riesgo: "Alto", ubicacion: "Estación de trabajo de Línea 2", accion: "Verificar el resguardo y documentar el resultado antes de continuar la operación.", responsable: "Mantenimiento y producción", fechaLimite: "Por definir" },
    ],
  },
  "INS-005": {
    prioridad: "Baja",
    objetivo: "Verificar orden y limpieza en el área de mantenimiento.",
    observaciones: "Inspección completada. Revisar el registro oficial para consultar evidencias y confirmar el cierre de las acciones.",
    incidencias: [],
  },
  "INS-006": {
    prioridad: "Por evaluar",
    objetivo: "Revisar condiciones de seguridad en el almacén.",
    observaciones: "Inspección pendiente de inicio; no se han capturado incidencias.",
    incidencias: [],
  },
  default: {
    prioridad: "Por evaluar",
    objetivo: "Consultar el cumplimiento de los puntos definidos para esta inspección.",
    observaciones: "No hay observaciones adicionales disponibles en los datos de demostración.",
    incidencias: [],
  },
};

type SummaryCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  iconColor: string;
  iconBackground: string;
};

function SummaryCard({
  title,
  value,
  icon,
  iconColor,
  iconBackground,
}: SummaryCardProps) {
  return (
    <Card
      sx={{
        border: "none",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          py: "18px !important",
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
            backgroundColor: iconBackground,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 12,
              color: "#81909D",
              mb: 0.3,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: "#16324F",
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}