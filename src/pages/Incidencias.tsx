
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Alert } from "@mui/material";
import { isApiConfigured } from "../api/client";
import { getIncidents, type Incident } from "../services/incidents.service";

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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Incidencia {
  folio: string;
  descripcion: string;
  area: string;
  tipo: string;
  severidad: "Baja" | "Media" | "Alta" | "Crítica";
  fecha: string;
  estado: "Abierta" | "En investigación" | "En seguimiento" | "Resuelta" | "Cerrada";
  responsable: string;
}

type EvidenciaIncidencia = {
  src: string;
  descripcion: string;
  fecha?: string;
  tipo?: "Antes" | "Después" | "General";
};

type DetalleIncidencia = {
  ubicacion: string;
  descripcionDetallada: string;
  accionesInmediatas: string;
  causaProbable: string;
  accionCorrectiva: string;
  responsableSeguimiento: string;
  fechaCompromiso: string;
  observaciones: string;
  evidencias: EvidenciaIncidencia[];
};

const detallesDemo: Record<string, DetalleIncidencia> = {
  "INC-2026-001": {
    ubicacion: "Zona de producción, pasillo junto a la línea de trabajo",
    descripcionDetallada: "Se reportó un derrame de líquido en el área de producción. La superficie puede volverse resbaladiza y provocar caídas.",
    accionesInmediatas: "Delimitar el área, colocar señalización preventiva y solicitar la limpieza del derrame.",
    causaProbable: "Por confirmar durante la investigación.",
    accionCorrectiva: "Identificar el origen del derrame, corregir la fuga si existe y establecer una revisión periódica del área.",
    responsableSeguimiento: "Carlos Méndez",
    fechaCompromiso: "Por definir",
    observaciones: "Registro de demostración. Confirmar los datos con el responsable de planta.",
    evidencias: [],
  },
  "INC-2026-002": {
    ubicacion: "Área de ensamble",
    descripcionDetallada: "Se observó a un trabajador realizando actividades sin el equipo de protección personal requerido.",
    accionesInmediatas: "Detener la actividad de forma segura y proporcionar el equipo de protección correspondiente.",
    causaProbable: "Por confirmar; verificar disponibilidad, capacitación y cumplimiento del procedimiento.",
    accionCorrectiva: "Reforzar la capacitación y comprobar el uso del EPP antes de iniciar las labores.",
    responsableSeguimiento: "Laura Gómez",
    fechaCompromiso: "Por definir",
    observaciones: "Registro de demostración. Evitar incluir datos personales innecesarios en evidencias.",
    evidencias: [],
  },
  "INC-2026-003": {
    ubicacion: "Almacén, acceso al extintor",
    descripcionDetallada: "El acceso al extintor se encuentra obstruido por materiales, lo que podría retrasar su uso durante una emergencia.",
    accionesInmediatas: "Retirar los materiales y mantener despejada la zona de acceso.",
    causaProbable: "Almacenamiento temporal fuera de las áreas delimitadas.",
    accionCorrectiva: "Señalizar el área libre y añadir la revisión de accesibilidad a las inspecciones rutinarias.",
    responsableSeguimiento: "Miguel Torres",
    fechaCompromiso: "Por definir",
    observaciones: "Registro de demostración. La severidad crítica requiere atención prioritaria.",
    evidencias: [],
  },
  "INC-2026-004": {
    ubicacion: "Área de logística",
    descripcionDetallada: "Se reportó una caída de material durante una maniobra. La incidencia figura como resuelta en el registro.",
    accionesInmediatas: "Asegurar el área y verificar que no haya personas lesionadas ni riesgos remanentes.",
    causaProbable: "Por confirmar con la investigación del evento.",
    accionCorrectiva: "Revisar el método de sujeción y manipulación de materiales y reforzar el procedimiento seguro.",
    responsableSeguimiento: "Ana López",
    fechaCompromiso: "Registrada como resuelta",
    observaciones: "Registro de demostración. Validar que las acciones correctivas estén documentadas.",
    evidencias: [],
  },
  "INC-2026-005": {
    ubicacion: "Área de mantenimiento",
    descripcionDetallada: "Se identificó un cable eléctrico fuera de la canaleta, con posible exposición a daño físico o tropiezos.",
    accionesInmediatas: "Asegurar el área y solicitar al personal autorizado que gestione el cableado de forma segura.",
    causaProbable: "Por confirmar mediante revisión del cableado y su instalación.",
    accionCorrectiva: "Reinstalar la canaleta o protección adecuada y verificar la integridad del cable.",
    responsableSeguimiento: "Jorge Ramírez",
    fechaCompromiso: "Por definir",
    observaciones: "Registro de demostración. La intervención eléctrica debe realizarla personal autorizado.",
    evidencias: [],
  },
  "INC-2026-006": {
    ubicacion: "Almacén, ruta de circulación de montacargas",
    descripcionDetallada: "Se reportó un casi accidente relacionado con un montacargas. Se requiere investigar las condiciones de circulación y operación.",
    accionesInmediatas: "Asegurar la ruta y reportar el evento al responsable de seguridad.",
    causaProbable: "Por determinar durante la investigación del evento.",
    accionCorrectiva: "Revisar rutas peatonales, señalización, visibilidad y cumplimiento del procedimiento de operación.",
    responsableSeguimiento: "Pedro Sánchez",
    fechaCompromiso: "Por definir",
    observaciones: "Registro de demostración. Documentar las conclusiones de la investigación.",
    evidencias: [],
  },
};

const detalleVacio: DetalleIncidencia = {
  ubicacion: "Sin información disponible",
  descripcionDetallada: "No hay descripción detallada registrada para esta incidencia.",
  accionesInmediatas: "Sin información disponible.",
  causaProbable: "Pendiente de investigación.",
  accionCorrectiva: "Pendiente de definir.",
  responsableSeguimiento: "Por asignar",
  fechaCompromiso: "Por definir",
  observaciones: "No hay observaciones registradas.",
  evidencias: [],
};

const incidenciasIniciales: Incidencia[] = [
  {
    folio: "INC-2026-001",
    descripcion: "Derrame de líquido en zona de producción",
    area: "Producción",
    tipo: "Condición insegura",
    severidad: "Alta",
    fecha: "01/10/2026",
    estado: "Abierta",
    responsable: "Carlos Méndez",
  },
  {
    folio: "INC-2026-002",
    descripcion: "Trabajador sin equipo de protección",
    area: "Ensamble",
    tipo: "Acto inseguro",
    severidad: "Media",
    fecha: "30/09/2026",
    estado: "En investigación",
    responsable: "Laura Gómez",
  },
  {
    folio: "INC-2026-003",
    descripcion: "Extintor con acceso obstruido",
    area: "Almacén",
    tipo: "Condición insegura",
    severidad: "Crítica",
    fecha: "29/09/2026",
    estado: "En seguimiento",
    responsable: "Miguel Torres",
  },
  {
    folio: "INC-2026-004",
    descripcion: "Caída de material durante maniobra",
    area: "Logística",
    tipo: "Incidente",
    severidad: "Alta",
    fecha: "28/09/2026",
    estado: "Resuelta",
    responsable: "Ana López",
  },
  {
    folio: "INC-2026-005",
    descripcion: "Cable eléctrico fuera de canaleta",
    area: "Mantenimiento",
    tipo: "Condición insegura",
    severidad: "Media",
    fecha: "27/09/2026",
    estado: "Abierta",
    responsable: "Jorge Ramírez",
  },
  {
    folio: "INC-2026-006",
    descripcion: "Casi accidente con montacargas",
    area: "Almacén",
    tipo: "Casi accidente",
    severidad: "Alta",
    fecha: "26/09/2026",
    estado: "En investigación",
    responsable: "Pedro Sánchez",
  },
];

const coloresSeveridad: Record<string, string> = {
  Baja: "#2673C9",
  Media: "#F2A900",
  Alta: "#E07825",
  Crítica: "#B42318",
};

const coloresEstado: Record<string, string> = {
  Abierta: "#B42318",
  "En investigación": "#2673C9",
  "En seguimiento": "#F2A900",
  Resuelta: "#16803C",
  Cerrada: "#475569",
};

interface TarjetaProps {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: ReactNode;
  color: string;
}

function TarjetaResumen({
  titulo,
  valor,
  descripcion,
  icono,
  color,
}: TarjetaProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <Box>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 13 }}
            >
              {titulo}
            </Typography>

            <Typography
              sx={{
                fontSize: 30,
                fontWeight: 700,
                color: "#16324F",
              }}
            >
              {valor}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icono}
          </Box>
        </Stack>

        <Typography
          color="text.secondary"
          sx={{ fontSize: 12, mt: 1 }}
        >
          {descripcion}
        </Typography>
      </CardContent>
    </Card>
  );
}

async function cargarImagenParaPDF(src: string): Promise<string | null> {
  if (src.startsWith("data:image/")) return src;

  try {
    const respuesta = await fetch(src, { mode: "cors" });
    if (!respuesta.ok) return null;
    const blob = await respuesta.blob();
    if (!blob.type.startsWith("image/")) return null;

    return await new Promise((resolve) => {
      const lector = new FileReader();
      lector.onload = () => resolve(typeof lector.result === "string" ? lector.result : null);
      lector.onerror = () => resolve(null);
      lector.readAsDataURL(blob);
    });
  } catch {
    // Las imágenes remotas sin permisos CORS no pueden incrustarse en el PDF.
    return null;
  }
}

function traducirTipo(tipo: Incident["type"]): string {
  const tipos: Record<Incident["type"], string> = {
    unsafe_condition: "Condición insegura",
    unsafe_act: "Acto inseguro",
    near_miss: "Casi accidente",
    environmental_spill: "Derrame ambiental",
    equipment_damage: "Daño a equipo",
  };

  return tipos[tipo] ?? tipo;
}

function traducirSeveridad(
  riesgo: Incident["risk_level"],
): Incidencia["severidad"] {
  const severidades: Record<Incident["risk_level"], Incidencia["severidad"]> = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    critical: "Crítica",
  };

  return severidades[riesgo];
}

function traducirEstado(estado: Incident["status"]): Incidencia["estado"] {
  const estados: Record<Incident["status"], Incidencia["estado"]> = {
    open: "Abierta",
    in_progress: "En seguimiento",
    resolved: "Resuelta",
    closed: "Cerrada",
  };

  return estados[estado];
}

function adaptarIncidencia(incidencia: Incident): Incidencia {
  const fechaOrigen = incidencia.reported_at ?? incidencia.created_at;
  const fecha = fechaOrigen
    ? new Date(fechaOrigen).toLocaleDateString("es-MX")
    : "Sin fecha";

  return {
    folio: incidencia.id,
    descripcion: incidencia.title,
    area: incidencia.area_id,
    tipo: traducirTipo(incidencia.type),
    severidad: traducirSeveridad(incidencia.risk_level),
    fecha,
    estado: traducirEstado(incidencia.status),
    responsable: `Usuario ${incidencia.reported_by}`,
  };
}

export default function Incidencias() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroSeveridad, setFiltroSeveridad] = useState("Todas");
  const [incidencias, setIncidencias] = useState<Incidencia[]>(incidenciasIniciales);
  const [errorApi, setErrorApi] = useState("");
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null);

  useEffect(() => {
    if (!isApiConfigured) return;

    let cancelado = false;

    async function cargarIncidencias() {
      try {
        setErrorApi("");
        const respuesta = await getIncidents({ page: 1, perPage: 100 });

        if (!cancelado) {
          setIncidencias(respuesta.data.map(adaptarIncidencia));
        }
      } catch (error) {
        if (!cancelado) {
          setErrorApi(
            error instanceof Error
              ? error.message
              : "No fue posible cargar las incidencias. Se muestran datos de ejemplo.",
          );
        }
      }
    }

    void cargarIncidencias();

    return () => {
      cancelado = true;
    };
  }, []);


  const resumen = {
    total: incidencias.length,
    abiertas: incidencias.filter((i) => i.estado === "Abierta").length,
    investigacion: incidencias.filter(
      (i) => i.estado === "En investigación"
    ).length,
    resueltas: incidencias.filter((i) => i.estado === "Resuelta").length,
  };

  const incidenciasFiltradas = useMemo(() => {
    return incidencias.filter((incidencia) => {
      const coincideBusqueda = [
        incidencia.folio,
        incidencia.descripcion,
        incidencia.area,
        incidencia.responsable,
        incidencia.tipo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideEstado =
        filtroEstado === "Todos" || incidencia.estado === filtroEstado;

      const coincideSeveridad =
        filtroSeveridad === "Todas" ||
        incidencia.severidad === filtroSeveridad;

      return coincideBusqueda && coincideEstado && coincideSeveridad;
    });
  }, [busqueda, filtroEstado, filtroSeveridad, incidencias]);

  const generarPDF = async () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margen = 14;
    const ancho = pdf.internal.pageSize.getWidth();
    const alto = pdf.internal.pageSize.getHeight();
    const fechaGeneracion = new Date().toLocaleString("es-MX");

    pdf.setFillColor(22, 50, 79);
    pdf.rect(0, 0, ancho, 34, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(19);
    pdf.text("INSPECTA | REPORTE DE INCIDENCIAS", margen, 15);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(`Generado: ${fechaGeneracion}`, margen, 23);
    pdf.text(`Incidencias incluidas: ${incidencias.length}`, margen, 29);

    autoTable(pdf, {
      startY: 40,
      head: [["Folio", "Descripción", "Área", "Tipo", "Severidad", "Fecha", "Estado", "Responsable"]],
      body: incidencias.map((i) => [i.folio, i.descripcion, i.area, i.tipo, i.severidad, i.fecha, i.estado, i.responsable]),
      margin: { left: margen, right: margen },
      styles: { font: "helvetica", fontSize: 7, cellPadding: 2.2, overflow: "linebreak" },
      headStyles: { fillColor: [22, 50, 79], textColor: 255 },
      alternateRowStyles: { fillColor: [246, 249, 252] },
    });

    for (const incidencia of incidencias) {
      pdf.addPage();
      pdf.setTextColor(22, 50, 79);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(incidencia.folio, margen, 18);
      pdf.setFontSize(12);
      pdf.text(incidencia.descripcion, margen, 26, { maxWidth: ancho - margen * 2 });

      const detalle = detallesDemo[incidencia.folio] ?? detalleVacio;
      autoTable(pdf, {
        startY: 32,
        head: [["Campo", "Información"]],
        body: [
          ["Área", incidencia.area],
          ["Tipo", incidencia.tipo],
          ["Severidad", incidencia.severidad],
          ["Estado actual", incidencia.estado],
          ["Fecha", incidencia.fecha],
          ["Responsable del reporte", incidencia.responsable],
          ["Descripción detallada", detalle.descripcionDetallada],
          ["Ubicación", detalle.ubicacion],
          ["Acciones inmediatas", detalle.accionesInmediatas],
          ["Causa probable", detalle.causaProbable],
          ["Acción correctiva recomendada", detalle.accionCorrectiva],
          ["Responsable de seguimiento", detalle.responsableSeguimiento],
          ["Fecha compromiso", detalle.fechaCompromiso],
          ["Observaciones", detalle.observaciones],
        ],
        margin: { left: margen, right: margen },
        styles: { font: "helvetica", fontSize: 8, cellPadding: 2.5, overflow: "linebreak" },
        headStyles: { fillColor: [22, 50, 79], textColor: 255 },
        columnStyles: { 0: { cellWidth: 48, fontStyle: "bold" }, 1: { cellWidth: ancho - margen * 2 - 48 } },
      });

      let y = ((pdf as any).lastAutoTable?.finalY ?? 32) + 8;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(22, 50, 79);
      if (y > alto - 25) {
        pdf.addPage();
        y = 18;
      }
      pdf.text(`Evidencias fotográficas (${detalle.evidencias.length})`, margen, y);
      y += 5;

      if (detalle.evidencias.length === 0) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(82, 100, 119);
        pdf.text("No hay fotografías asociadas a esta incidencia.", margen, y + 2);
      } else {
        for (const evidencia of detalle.evidencias) {
          const imagen = await cargarImagenParaPDF(evidencia.src);
          if (!imagen) {
            if (y > alto - 18) { pdf.addPage(); y = 18; }
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(180, 35, 24);
            pdf.text(`No se pudo insertar la imagen: ${evidencia.descripcion}`, margen, y + 2, { maxWidth: ancho - margen * 2 });
            y += 8;
            continue;
          }
          const formato = imagen.startsWith("data:image/png") ? "PNG" : "JPEG";
          const maxAncho = ancho - margen * 2;
          const maxAlto = 65;
          const props = pdf.getImageProperties(imagen);
          const escala = Math.min(maxAncho / props.width, maxAlto / props.height);
          const imgW = props.width * escala;
          const imgH = props.height * escala;
          if (y + imgH + 14 > alto - 12) { pdf.addPage(); y = 18; }
          pdf.addImage(imagen, formato, margen, y, imgW, imgH);
          y += imgH + 4;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(82, 100, 119);
          const etiqueta = `${evidencia.tipo ? `${evidencia.tipo} · ` : ""}${evidencia.descripcion}${evidencia.fecha ? ` · ${evidencia.fecha}` : ""}`;
          const lineas = pdf.splitTextToSize(etiqueta, ancho - margen * 2);
          pdf.text(lineas, margen, y);
          y += lineas.length * 4 + 5;
        }
      }
    }

    const paginas = pdf.getNumberOfPages();
    for (let pagina = 1; pagina <= paginas; pagina++) {
      pdf.setPage(pagina);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(129, 144, 157);
      pdf.text(`Inspecta · Página ${pagina} de ${paginas}`, ancho - margen, alto - 7, { align: "right" });
    }

    pdf.save(`Inspecta-incidencias-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

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
            sx={{ fontWeight: 700, color: "#16324F" }}
          >
            Incidencias
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >
            Registro y seguimiento de incidencias de seguridad e higiene.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={() => void generarPDF()}
          disabled={incidenciasFiltradas.length === 0}
          sx={{
            px: 2.5,
            py: 1.2,
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        >
          Generar PDF
        </Button>
      </Stack>

      {errorApi && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se pudieron cargar las incidencias del backend. Se conservan los
          datos de ejemplo. Detalle: {errorApi}
        </Alert>
      )}

      {/* Tarjetas */}
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
        <TarjetaResumen
          titulo="Total de incidencias"
          valor={resumen.total}
          descripcion="Registros existentes"
          icono={<ReportProblemOutlinedIcon />}
          color="#16324F"
        />

        <TarjetaResumen
          titulo="Abiertas"
          valor={resumen.abiertas}
          descripcion="Pendientes de atención"
          icono={<PendingActionsIcon />}
          color="#B42318"
        />

        <TarjetaResumen
          titulo="En investigación"
          valor={resumen.investigacion}
          descripcion="En proceso de análisis"
          icono={<ManageSearchIcon />}
          color="#2673C9"
        />

        <TarjetaResumen
          titulo="Resueltas"
          valor={resumen.resueltas}
          descripcion="Incidencias solucionadas"
          icono={<CheckCircleIcon />}
          color="#16803C"
        />
      </Box>

      {/* Tabla */}
      <Card>
        <Box sx={{ p: 2.5 }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#16324F",
              fontSize: 17,
            }}
          >
            Registro de incidencias
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ fontSize: 13, mb: 2.5 }}
          >
            Consulta y administra las incidencias registradas en planta.
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 2.5 }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por folio, descripción, área..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#81909D" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Select
              size="small"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              sx={{ minWidth: { xs: "100%", md: 180 } }}
            >
              <MenuItem value="Todos">Todos los estados</MenuItem>
              <MenuItem value="Abierta">Abierta</MenuItem>
              <MenuItem value="En investigación">
                En investigación
              </MenuItem>
              <MenuItem value="En seguimiento">En seguimiento</MenuItem>
              <MenuItem value="Resuelta">Resuelta</MenuItem>
              <MenuItem value="Cerrada">Cerrada</MenuItem>
            </Select>

            <Select
              size="small"
              value={filtroSeveridad}
              onChange={(e) => setFiltroSeveridad(e.target.value)}
              sx={{ minWidth: { xs: "100%", md: 160 } }}
            >
              <MenuItem value="Todas">Todas las severidades</MenuItem>
              <MenuItem value="Baja">Baja</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Crítica">Crítica</MenuItem>
            </Select>
          </Stack>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="medium" sx={{ minWidth: 950 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#F4F7FA" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Folio</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Área</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Severidad</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {incidenciasFiltradas.map((incidencia) => (
                  <TableRow
                    key={incidencia.folio}
                    hover
                    sx={{ "&:last-child td": { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#16324F",
                        }}
                      >
                        {incidencia.folio}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography sx={{ fontSize: 13 }}>
                        {incidencia.descripcion}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 11 }}
                      >
                        {incidencia.responsable}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 13 }}>
                        {incidencia.area}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 12 }}>
                        {incidencia.tipo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={incidencia.severidad}
                        size="small"
                        sx={{
                          color: coloresSeveridad[incidencia.severidad],
                          bgcolor: `${coloresSeveridad[incidencia.severidad]}15`,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontSize: 12 }}>
                        {incidencia.fecha}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={incidencia.estado}
                        size="small"
                        sx={{
                          color: coloresEstado[incidencia.estado],
                          bgcolor: `${coloresEstado[incidencia.estado]}15`,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setIncidenciaSeleccionada(incidencia)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {incidenciasFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 14 }}
                      >
                        No se encontraron incidencias.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 12,
              mt: 2,
              textAlign: "right",
            }}
          >
            Mostrando {incidenciasFiltradas.length} de {incidencias.length}{" "}
            incidencias
          </Typography>
        </Box>
      </Card>

      {/* DETALLE DE LA INCIDENCIA */}
      <Dialog
        open={Boolean(incidenciaSeleccionada)}
        onClose={() => setIncidenciaSeleccionada(null)}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { borderRadius: 3, maxHeight: "92vh" } } }}
      >
        {incidenciaSeleccionada && (() => {
          const detalle = detallesDemo[incidenciaSeleccionada.folio] ?? detalleVacio;
          const colorSeveridad = coloresSeveridad[incidenciaSeleccionada.severidad] ?? "#64748B";
          const colorEstado = coloresEstado[incidenciaSeleccionada.estado] ?? "#64748B";

          return (
            <>
              <DialogTitle sx={{ pb: 1, borderBottom: "1px solid #E1E8EF" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: "#0F9D8A", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                      DETALLE DE INCIDENCIA
                    </Typography>
                    <Typography variant="h5" sx={{ color: "#16324F", fontWeight: 700 }}>
                      {incidenciaSeleccionada.folio}
                    </Typography>
                    <Typography sx={{ color: "#526477", fontSize: 14, mt: 0.5 }}>
                      {incidenciaSeleccionada.descripcion}
                    </Typography>
                  </Box>
                  <Chip
                    label={incidenciaSeleccionada.estado}
                    size="small"
                    sx={{ color: colorEstado, bgcolor: `${colorEstado}15`, fontWeight: 700 }}
                  />
                </Box>
              </DialogTitle>

              <DialogContent dividers>
                <Stack spacing={3}>
                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1.5 }}>
                      Información general
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                      {[
                        ["Área", incidenciaSeleccionada.area],
                        ["Tipo", incidenciaSeleccionada.tipo],
                        ["Responsable del reporte", incidenciaSeleccionada.responsable],
                        ["Fecha del reporte", incidenciaSeleccionada.fecha],
                        ["Severidad", incidenciaSeleccionada.severidad],
                        ["Estado actual", incidenciaSeleccionada.estado],
                      ].map(([label, value]) => (
                        <Box key={label} sx={{ bgcolor: "#F6F9FC", borderRadius: 2, p: 1.5 }}>
                          <Typography sx={{ color: "#81909D", fontSize: 12 }}>{label}</Typography>
                          <Typography sx={{ color: "#16324F", fontWeight: 600, fontSize: 14 }}>{value}</Typography>
                          {label === "Severidad" && (
                            <Chip label={value} size="small" sx={{ mt: 0.5, color: colorSeveridad, bgcolor: `${colorSeveridad}15`, fontWeight: 700 }} />
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                      Descripción detallada
                    </Typography>
                    <Typography sx={{ color: "#526477", fontSize: 14, lineHeight: 1.7 }}>
                      {detalle.descripcionDetallada}
                    </Typography>
                    <Typography sx={{ color: "#81909D", fontSize: 12, mt: 1 }}>
                      Ubicación: {detalle.ubicacion}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1.5 }}>
                      Investigación y acciones
                    </Typography>
                    <Stack spacing={1.5}>
                      {[
                        ["Acciones inmediatas", detalle.accionesInmediatas],
                        ["Causa probable", detalle.causaProbable],
                        ["Acción correctiva recomendada", detalle.accionCorrectiva],
                      ].map(([label, value]) => (
                        <Box key={label} sx={{ border: "1px solid #E1E8EF", borderRadius: 2, p: 1.5 }}>
                          <Typography sx={{ color: "#81909D", fontSize: 12, mb: 0.5 }}>{label}</Typography>
                          <Typography sx={{ color: "#273746", fontSize: 14, lineHeight: 1.6 }}>{value}</Typography>
                        </Box>
                      ))}
                    </Stack>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5, mt: 1.5 }}>
                      <Box sx={{ bgcolor: "#F6F9FC", borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: "#81909D", fontSize: 12 }}>Responsable de seguimiento</Typography>
                        <Typography sx={{ color: "#16324F", fontWeight: 600, fontSize: 14 }}>{detalle.responsableSeguimiento}</Typography>
                      </Box>
                      <Box sx={{ bgcolor: "#F6F9FC", borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: "#81909D", fontSize: 12 }}>Fecha compromiso</Typography>
                        <Typography sx={{ color: "#16324F", fontWeight: 600, fontSize: 14 }}>{detalle.fechaCompromiso}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                      Evidencias fotográficas ({detalle.evidencias.length})
                    </Typography>
                    {detalle.evidencias.length > 0 ? (
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
                        {detalle.evidencias.map((evidencia, index) => (
                          <Box key={`${evidencia.src}-${index}`} sx={{ border: "1px solid #E1E8EF", borderRadius: 2, p: 1.5 }}>
                            <Box component="img" src={evidencia.src} alt={evidencia.descripcion} sx={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 1, bgcolor: "#F6F9FC" }} />
                            <Typography sx={{ color: "#526477", fontSize: 13, mt: 1 }}>
                              {evidencia.tipo ? `${evidencia.tipo} · ` : ""}{evidencia.descripcion}
                            </Typography>
                            {evidencia.fecha && <Typography sx={{ color: "#81909D", fontSize: 11 }}>{evidencia.fecha}</Typography>}
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ border: "1px dashed #CBD5E1", borderRadius: 2, p: 2, bgcolor: "#F8FAFC" }}>
                        <Typography sx={{ color: "#526477", fontSize: 13 }}>
                          No hay fotografías asociadas. El apartado está preparado para mostrar evidencias cuando se agreguen a los registros.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <Typography sx={{ color: "#16324F", fontWeight: 700, mb: 1 }}>
                      Observaciones
                    </Typography>
                    <Typography sx={{ color: "#526477", fontSize: 14, lineHeight: 1.7 }}>
                      {detalle.observaciones}
                    </Typography>
                  </Box>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CloseIcon />}
                  onClick={() => setIncidenciaSeleccionada(null)}
                  sx={{ bgcolor: "#16324F" }}
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
