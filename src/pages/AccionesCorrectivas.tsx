import { useMemo, useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface AccionCorrectiva {
  id: number;
  folio: string;
  accion: string;
  origen: string;
  area: string;
  responsable: string;
  prioridad: "Baja" | "Media" | "Alta" | "Crítica";
  fechaLimite: string;
  estado: "Pendiente" | "En proceso" | "En revisión" | "Cerrada" | "Vencida";
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  description: string;
}

const accionesIniciales: AccionCorrectiva[] = [
  {
    id: 1,
    folio: "AC-2026-001",
    accion: "Retirar material que obstruye el acceso al extintor",
    origen: "INC-2026-001",
    area: "Almacén",
    responsable: "Juan Pérez",
    prioridad: "Alta",
    fechaLimite: "2026-10-08",
    estado: "Pendiente",
  },
  {
    id: 2,
    folio: "AC-2026-002",
    accion: "Reemplazar señalización de salida de emergencia",
    origen: "INS-2026-014",
    area: "Producción",
    responsable: "María López",
    prioridad: "Media",
    fechaLimite: "2026-10-12",
    estado: "En proceso",
  },
  {
    id: 3,
    folio: "AC-2026-003",
    accion: "Colocar protección en maquinaria expuesta",
    origen: "INC-2026-003",
    area: "Línea 2",
    responsable: "Carlos Ramírez",
    prioridad: "Crítica",
    fechaLimite: "2026-10-06",
    estado: "En revisión",
  },
  {
    id: 4,
    folio: "AC-2026-004",
    accion: "Actualizar equipo de protección personal del área",
    origen: "INS-2026-017",
    area: "Mantenimiento",
    responsable: "Ana Torres",
    prioridad: "Alta",
    fechaLimite: "2026-10-15",
    estado: "Pendiente",
  },
  {
    id: 5,
    folio: "AC-2026-005",
    accion: "Corregir fuga de agua en área de servicios",
    origen: "INC-2026-004",
    area: "Servicios",
    responsable: "Luis Hernández",
    prioridad: "Media",
    fechaLimite: "2026-10-03",
    estado: "Cerrada",
  },
  {
    id: 6,
    folio: "AC-2026-006",
    accion: "Retirar cableado expuesto en zona de trabajo",
    origen: "INS-2026-019",
    area: "Producción",
    responsable: "Roberto Sánchez",
    prioridad: "Alta",
    fechaLimite: "2026-10-01",
    estado: "Vencida",
  },
];

function getEstadoColor(
  estado: AccionCorrectiva["estado"]
): "default" | "warning" | "info" | "success" | "error" {
  switch (estado) {
    case "Pendiente":
      return "warning";
    case "En proceso":
      return "info";
    case "En revisión":
      return "warning";
    case "Cerrada":
      return "success";
    case "Vencida":
      return "error";
    default:
      return "default";
  }
}

function getPrioridadColor(
  prioridad: AccionCorrectiva["prioridad"]
): "default" | "info" | "warning" | "error" {
  switch (prioridad) {
    case "Baja":
      return "info";
    case "Media":
      return "warning";
    case "Alta":
      return "error";
    case "Crítica":
      return "error";
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
    <Card sx={{ flex: 1, minWidth: 220 }}>
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

export default function AccionesCorrectivas() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");
  const [accionSeleccionada, setAccionSeleccionada] = useState<AccionCorrectiva | null>(null);

  const acciones = accionesIniciales;

  const generarPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const fechaGeneracion = new Date().toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(22, 50, 79);
    doc.text("INSPECTA | Acciones correctivas", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 105, 120);
    doc.text(`Reporte generado: ${fechaGeneracion}`, 14, 25);
    doc.text(`Total de acciones: ${acciones.length}`, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [["Folio", "Acción correctiva", "Origen", "Responsable", "Prioridad", "Área", "Fecha límite", "Estado"]],
      body: acciones.map((accion) => [
        accion.folio,
        accion.accion,
        accion.origen,
        accion.responsable,
        accion.prioridad,
        accion.area,
        accion.fechaLimite,
        accion.estado,
      ]),
      theme: "grid",
      headStyles: { fillColor: [22, 50, 79], textColor: 255, fontStyle: "bold" },
      styles: { font: "helvetica", fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      alternateRowStyles: { fillColor: [245, 248, 251] },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 40;
    let y = finalY + 12;
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(22, 50, 79);
    doc.text("Detalle de acciones", 14, y);
    y += 7;

    acciones.forEach((accion) => {
      const lineas = [
        `${accion.folio} — ${accion.accion}`,
        `Origen: ${accion.origen} | Área: ${accion.area} | Responsable: ${accion.responsable}`,
        `Prioridad: ${accion.prioridad} | Estado: ${accion.estado} | Fecha límite: ${accion.fechaLimite}`,
        "Descripción del problema y solución aplicada: información detallada pendiente de registrar en el sistema.",
        "Evidencias fotográficas: no hay evidencias vinculadas en los datos disponibles.",
        `Observaciones y cierre: ${accion.estado === "Cerrada" ? "Acción marcada como cerrada; resultado y evidencia de cierre pendientes de documentar." : "Acción sin cierre documentado."}`,
      ];
      const bloque = lineas.map((linea) => doc.splitTextToSize(linea, 265));
      const alto = bloque.reduce((total, linea) => total + linea.length * 4.5, 0) + 5;
      if (y + alto > pageHeight - 15) {
        doc.addPage();
        y = 18;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(22, 50, 79);
      doc.text(bloque[0], 14, y);
      y += bloque[0].length * 4.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(65, 80, 95);
      bloque.slice(1).forEach((linea) => {
        doc.text(linea, 14, y);
        y += linea.length * 4.5;
      });
      y += 5;
    });

    const paginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= paginas; pagina += 1) {
      doc.setPage(pagina);
      doc.setFontSize(8);
      doc.setTextColor(120, 130, 140);
      doc.text(`Inspecta · Página ${pagina} de ${paginas}`, 14, doc.internal.pageSize.getHeight() - 7);
    }

    doc.save(`Inspecta_Acciones_Correctivas_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const resumen = useMemo(() => {
    return {
      total: acciones.length,
      pendientes: acciones.filter(
        (accion) => accion.estado === "Pendiente"
      ).length,
      proceso: acciones.filter(
        (accion) => accion.estado === "En proceso"
      ).length,
      revision: acciones.filter(
        (accion) => accion.estado === "En revisión"
      ).length,
      cerradas: acciones.filter(
        (accion) => accion.estado === "Cerrada"
      ).length,
      vencidas: acciones.filter(
        (accion) => accion.estado === "Vencida"
      ).length,
    };
  }, [acciones]);

  const accionesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return acciones.filter((accion) => {
      const coincideBusqueda =
        texto === "" ||
        accion.folio.toLowerCase().includes(texto) ||
        accion.accion.toLowerCase().includes(texto) ||
        accion.area.toLowerCase().includes(texto) ||
        accion.responsable.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" || accion.estado === filtroEstado;

      const coincidePrioridad =
        filtroPrioridad === "Todas" ||
        accion.prioridad === filtroPrioridad;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincidePrioridad
      );
    });
  }, [acciones, busqueda, filtroEstado, filtroPrioridad]);

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
            Acciones correctivas
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            Seguimiento y control de las acciones derivadas de inspecciones e incidencias.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={generarPDF}
          sx={{
            backgroundColor: "#16324F",
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#0F263D" },
          }}
        >
          Generar PDF
        </Button>
      </Stack>

      {/* Tarjetas de resumen */}
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
          description="Acciones registradas"
          color="#16324F"
          icon={<AssignmentTurnedInIcon />}
        />

        <SummaryCard
          title="Pendientes"
          value={resumen.pendientes}
          description="Sin iniciar"
          color="#F2A900"
          icon={<PendingActionsIcon />}
        />

        <SummaryCard
          title="En proceso"
          value={resumen.proceso}
          description="Actualmente trabajando"
          color="#2673C9"
          icon={<AutorenewIcon />}
        />

        <SummaryCard
          title="Cerradas"
          value={resumen.cerradas}
          description="Acciones completadas"
          color="#16803C"
          icon={<CheckCircleIcon />}
        />

        <SummaryCard
          title="Vencidas"
          value={resumen.vencidas}
          description="Requieren atención"
          color="#B42318"
          icon={<WarningAmberIcon />}
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
              placeholder="Buscar por folio, acción, área o responsable..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
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
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En proceso">En proceso</MenuItem>
                <MenuItem value="En revisión">En revisión</MenuItem>
                <MenuItem value="Cerrada">Cerrada</MenuItem>
                <MenuItem value="Vencida">Vencida</MenuItem>
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
              <InputLabel>Prioridad</InputLabel>

              <Select
                value={filtroPrioridad}
                label="Prioridad"
                onChange={(event) =>
                  setFiltroPrioridad(event.target.value)
                }
              >
                <MenuItem value="Todas">Todas</MenuItem>
                <MenuItem value="Baja">Baja</MenuItem>
                <MenuItem value="Media">Media</MenuItem>
                <MenuItem value="Alta">Alta</MenuItem>
                <MenuItem value="Crítica">Crítica</MenuItem>
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
            <Box sx={{ minWidth: 1050 }}>
              {/* Encabezado */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "130px minmax(280px, 1fr) 130px 150px 110px 120px 140px 90px 110px",
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
                  FOLIO
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  ACCIÓN CORRECTIVA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  ORIGEN
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  RESPONSABLE
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  PRIORIDAD
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  ÁREA
                </Typography>

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "text.secondary",
                  }}
                >
                  FECHA LÍMITE
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
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary" }}>
                  DETALLE
                </Typography>
              </Box>

              <Divider />

              {/* Registros */}
              {accionesFiltradas.map((accion) => (
                <Box key={accion.id}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "130px minmax(280px, 1fr) 130px 150px 110px 120px 140px 90px 110px",
                      gap: 2,
                      alignItems: "center",
                      px: 3,
                      py: 2,
                    }}
                  >
                    {/* Folio */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#16324F",
                      }}
                    >
                      {accion.folio}
                    </Typography>

                    {/* Acción */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#273746",
                      }}
                    >
                      {accion.accion}
                    </Typography>

                    {/* Origen */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {accion.origen}
                    </Typography>

                    {/* Responsable */}
                    <Typography
                      sx={{
                        fontSize: 13,
                      }}
                    >
                      {accion.responsable}
                    </Typography>

                    {/* Prioridad */}
                    <Chip
                      label={accion.prioridad}
                      size="small"
                      color={getPrioridadColor(
                        accion.prioridad
                      )}
                      variant="outlined"
                    />

                    {/* Área */}
                    <Typography
                      sx={{
                        fontSize: 13,
                      }}
                    >
                      {accion.area}
                    </Typography>

                    {/* Fecha */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >
                      {accion.fechaLimite}
                    </Typography>

                    {/* Estado */}
                    <Chip
                      label={accion.estado}
                      size="small"
                      color={getEstadoColor(accion.estado)}
                    />
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setAccionSeleccionada(accion)}
                      sx={{ color: "#16324F", whiteSpace: "nowrap" }}
                    >
                      Ver detalle
                    </Button>
                  </Box>

                  <Divider />
                </Box>
              ))}

              {/* Sin resultados */}
              {accionesFiltradas.length === 0 && (
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
                    No se encontraron acciones correctivas.
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
              Mostrando {accionesFiltradas.length} de{" "}
              {acciones.length} acciones
            </Typography>


          </Box>
        </CardContent>
      </Card>

      <Dialog
  open={Boolean(accionSeleccionada)}
  onClose={() => setAccionSeleccionada(null)}
  fullWidth
  maxWidth="md"
  slotProps={{
    paper: {
      sx: { borderRadius: 3 },
    },
  }}
>
        {accionSeleccionada && (
          <>
            <DialogTitle sx={{ borderBottom: "1px solid #E1E8EF", pb: 2 }}>
             <Stack
  direction="row"
  sx={{
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2,
  }}
>
                <Box>
                  <Typography sx={{ color: "#0F9D8A", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                    DETALLE DE ACCIÓN CORRECTIVA
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#16324F", fontWeight: 700 }}>
                    {accionSeleccionada.folio}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
                    {accionSeleccionada.accion}
                  </Typography>
                </Box>
                <Chip label={accionSeleccionada.estado} color={getEstadoColor(accionSeleccionada.estado)} />
              </Stack>
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={3} sx={{ py: 1 }}>
                <Box>
                  <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1.5 }}>
                    Información general
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                    {[
                      ["Folio", accionSeleccionada.folio],
                      ["Área", accionSeleccionada.area],
                      ["Origen relacionado", accionSeleccionada.origen],
                      ["Responsable", accionSeleccionada.responsable],
                      ["Prioridad", accionSeleccionada.prioridad],
                      ["Fecha límite", accionSeleccionada.fechaLimite],
                      ["Estado actual", accionSeleccionada.estado],
                      ["Fecha de registro", "Por definir"],
                    ].map(([label, value]) => (
                      <Box key={label} sx={{ p: 1.5, bgcolor: "#F5F8FB", borderRadius: 2 }}>
                        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>{label}</Typography>
                        <Typography sx={{ color: "#16324F", fontWeight: 600 }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                    Descripción y seguimiento
                  </Typography>
                  <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>
                    Acción requerida: {accionSeleccionada.accion}. Se debe atender en el área de {accionSeleccionada.area} y documentar la solución aplicada antes de cerrar el registro.
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5, mt: 2 }}>
                    <Box sx={{ border: "1px solid #DCE5EF", borderRadius: 2, p: 1.5 }}>
                      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Acción a realizar</Typography>
                      <Typography sx={{ fontSize: 13 }}>{accionSeleccionada.accion}</Typography>
                    </Box>
                    <Box sx={{ border: "1px solid #DCE5EF", borderRadius: 2, p: 1.5 }}>
                      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Responsable de seguimiento</Typography>
                      <Typography sx={{ fontSize: 13 }}>{accionSeleccionada.responsable}</Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                    Evidencias fotográficas
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: "#F8FAFC", border: "1px dashed #C8D5E3", borderRadius: 2 }}>
                    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                      No hay fotografías asociadas a esta acción correctiva. Este apartado está preparado para mostrar evidencias del antes y después cuando se vinculen al registro.
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                    Cierre de la acción
                  </Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                    <Box sx={{ p: 1.5, bgcolor: "#F5F8FB", borderRadius: 2 }}>
                      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Resultado de la corrección</Typography>
                      <Typography sx={{ fontSize: 13 }}>Pendiente de documentar</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: "#F5F8FB", borderRadius: 2 }}>
                      <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Fecha de cierre</Typography>
                      <Typography sx={{ fontSize: 13 }}>
                        {accionSeleccionada.estado === "Cerrada" ? "Registrada en el sistema" : "Sin cerrar"}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 1.5 }}>
                    Observaciones: no hay observaciones adicionales registradas.
                  </Typography>
                </Box>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button variant="contained" onClick={() => setAccionSeleccionada(null)} sx={{ bgcolor: "#16324F" }}>
                Cerrar detalle
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}