import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

type EstadoChecklist = "Activo" | "Borrador" | "Inactivo";
type Checklist = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  preguntas: string[];
  version: string;
  actualizacion: string;
  estado: EstadoChecklist;
};

type FormChecklist = Omit<Checklist, "id" | "actualizacion">;

const STORAGE_KEY = "inspecta_checklists_v1";
const fechaHoy = () => new Date().toLocaleDateString("es-MX");

const datosIniciales: Checklist[] = [
  {
    id: "epp", nombre: "Inspección de EPP", categoria: "Seguridad",
    descripcion: "Verificación del uso y condiciones del equipo de protección personal.",
    preguntas: ["¿El personal utiliza el EPP requerido?", "¿El equipo se encuentra en buen estado?", "¿El EPP corresponde al riesgo del puesto?", "¿El personal conoce el uso correcto del equipo?"],
    version: "v1.2", actualizacion: "05/10/2026", estado: "Activo",
  },
  {
    id: "incendios", nombre: "Inspección contra incendios", categoria: "Seguridad",
    descripcion: "Verificación de equipos, rutas y condiciones de seguridad contra incendios.",
    preguntas: ["¿Los extintores están visibles y accesibles?", "¿Las rutas de evacuación están despejadas?", "¿La señalización de emergencia es visible?", "¿Las salidas de emergencia funcionan correctamente?"],
    version: "v1.0", actualizacion: "03/10/2026", estado: "Activo",
  },
  {
    id: "maquinaria", nombre: "Inspección de maquinaria", categoria: "Seguridad",
    descripcion: "Revisión de condiciones de seguridad y funcionamiento de maquinaria.",
    preguntas: ["¿Las guardas de seguridad están instaladas?", "¿El paro de emergencia funciona?", "¿Se observan cables o conexiones dañadas?", "¿El área de operación está libre de obstáculos?"],
    version: "v1.1", actualizacion: "01/10/2026", estado: "Activo",
  },
  {
    id: "area", nombre: "Inspección de área de trabajo", categoria: "Higiene",
    descripcion: "Evaluación de las condiciones generales del área de trabajo.",
    preguntas: ["¿El área está limpia y ordenada?", "¿Los pasillos están despejados?", "¿Los residuos están en contenedores adecuados?", "¿La iluminación es suficiente?"],
    version: "v1.0", actualizacion: "28/09/2026", estado: "Activo",
  },
  {
    id: "electricas", nombre: "Inspección de instalaciones eléctricas", categoria: "Seguridad",
    descripcion: "Revisión de instalaciones, conexiones y condiciones eléctricas.",
    preguntas: ["¿Los cables están aislados y protegidos?", "¿Los tableros eléctricos están señalizados?", "¿Hay conexiones expuestas?"],
    version: "v0.9", actualizacion: "26/09/2026", estado: "Borrador",
  },
  {
    id: "ergonomia", nombre: "Inspección de ergonomía", categoria: "Higiene",
    descripcion: "Evaluación de condiciones ergonómicas de los puestos de trabajo.",
    preguntas: ["¿La estación permite una postura adecuada?", "¿Las herramientas están al alcance?", "¿Se cuenta con pausas o rotación cuando corresponde?"],
    version: "v1.0", actualizacion: "20/09/2026", estado: "Inactivo",
  },
];

const formularioVacio: FormChecklist = {
  nombre: "", categoria: "Seguridad", descripcion: "", preguntas: [""], version: "v1.0", estado: "Borrador",
};

export default function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados ? JSON.parse(guardados) as Checklist[] : datosIniciales;
    } catch {
      return datosIniciales;
    }
  });
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [estado, setEstado] = useState("Todos");
  const [modalFormulario, setModalFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState<FormChecklist>(formularioVacio);
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<Checklist | null>(null);
  const [confirmarBorrado, setConfirmarBorrado] = useState<Checklist | null>(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklists));
  }, [checklists]);

  const filtrados = useMemo(() => {
    const term = search.trim().toLowerCase();
    return checklists.filter((item) => {
      const matchSearch = !term || item.nombre.toLowerCase().includes(term) || item.descripcion.toLowerCase().includes(term) || item.preguntas.some((p) => p.toLowerCase().includes(term));
      return matchSearch && (categoria === "Todas" || item.categoria === categoria) && (estado === "Todos" || item.estado === estado);
    });
  }, [checklists, categoria, estado, search]);

  const abrirNuevo = () => {
    setModoEdicion(false); setIdEditando(null); setForm({ ...formularioVacio, preguntas: [""] }); setModalFormulario(true);
  };

  const abrirEdicion = (item: Checklist) => {
    setModoEdicion(true); setIdEditando(item.id);
    setForm({ nombre: item.nombre, categoria: item.categoria, descripcion: item.descripcion, preguntas: [...item.preguntas], version: item.version, estado: item.estado });
    setModalFormulario(true);
  };

  const actualizarPregunta = (index: number, valor: string) => {
    setForm((prev) => ({ ...prev, preguntas: prev.preguntas.map((p, i) => i === index ? valor : p) }));
  };

  const guardarChecklist = () => {
    const nombre = form.nombre.trim();
    if (!nombre || !form.descripcion.trim()) {
      setMensaje("Completa el nombre y la descripción del checklist.");
      return;
    }
    const preguntas = form.preguntas.map((p) => p.trim()).filter(Boolean);
    if (preguntas.length === 0) {
      setMensaje("Agrega al menos una pregunta al checklist.");
      return;
    }
    if (modoEdicion && idEditando) {
      setChecklists((prev) => prev.map((item) => item.id === idEditando ? { ...item, ...form, nombre, preguntas, actualizacion: fechaHoy() } : item));
      setMensaje("Checklist actualizado correctamente.");
    } else {
      const nuevo: Checklist = { ...form, nombre, preguntas, id: `checklist-${Date.now()}`, actualizacion: fechaHoy(), version: form.version.trim() || "v1.0" };
      setChecklists((prev) => [nuevo, ...prev]);
      setMensaje("Checklist creado correctamente.");
    }
    setModalFormulario(false);
  };

  const eliminarChecklist = () => {
    if (!confirmarBorrado) return;
    setChecklists((prev) => prev.filter((item) => item.id !== confirmarBorrado.id));
    setConfirmarBorrado(null);
    setMensaje("Checklist eliminado.");
  };

  const cambiarEstado = (item: Checklist) => {
    const nuevoEstado: EstadoChecklist = item.estado === "Activo" ? "Inactivo" : "Activo";
    setChecklists((prev) => prev.map((actual) => actual.id === item.id ? { ...actual, estado: nuevoEstado, actualizacion: fechaHoy() } : actual));
  };

  const cerrarFormulario = () => { setModalFormulario(false); setMensaje(""); };

  return (
    <section className="page-section">
      <Stack component="div" direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 13, color: "#81909D", fontWeight: 600 }}>MÓDULO</Typography>
          <Typography component="h1" sx={{ fontSize: { xs: 28, md: 34 }, fontWeight: 700, color: "#16324F" }}>Checklists</Typography>
          <Typography sx={{ fontSize: 15, color: "#81909D", mt: 0.5 }}>Administra cuestionarios y preguntas con fundamento normativo.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={abrirNuevo} sx={{ minHeight: 44, backgroundColor: "#16324F", "&:hover": { backgroundColor: "#0F263D" } }}>Nuevo checklist</Button>
      </Stack>

      {mensaje && <Alert severity="success" onClose={() => setMensaje("")} sx={{ mb: 2 }}>{mensaje}</Alert>}
      <Alert severity="info" sx={{ mb: 2 }}>Los cambios se guardan en este navegador. La sincronización con otros usuarios requiere conectar el backend.</Alert>

      <Stack component="div" direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField size="small" placeholder="Buscar checklist o pregunta..." value={search} onChange={(event) => setSearch(event.target.value)} sx={{ flex: 1, minWidth: 240, "& .MuiInputBase-input": { fontSize: 14 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><VisibilityOutlinedIcon sx={{ fontSize: 20, color: "#81909D" }} /></InputAdornment> } }} />
        <FormControl size="small" sx={{ minWidth: 170 }}><Select value={categoria} onChange={(event) => setCategoria(event.target.value)}><MenuItem value="Todas">Todas las categorías</MenuItem><MenuItem value="Seguridad">Seguridad</MenuItem><MenuItem value="Higiene">Higiene</MenuItem></Select></FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}><Select value={estado} onChange={(event) => setEstado(event.target.value)}><MenuItem value="Todos">Todos los estados</MenuItem><MenuItem value="Activo">Activos</MenuItem><MenuItem value="Borrador">Borradores</MenuItem><MenuItem value="Inactivo">Inactivos</MenuItem></Select></FormControl>
      </Stack>

      <Paper sx={{ overflowX: "auto", border: "1px solid #DCE6EE", borderRadius: 3, boxShadow: "none" }}>
        <Box sx={{ minWidth: 1120, display: "grid", gridTemplateColumns: "230px 130px minmax(250px, 1fr) 80px 80px 110px 110px 130px" }}>
          {["CHECKLIST", "CATEGORÍA", "DESCRIPCIÓN", "PREGUNTAS", "VERSIÓN", "ACTUALIZACIÓN", "ESTADO", "ACCIONES"].map((header) => <Box key={header} sx={{ p: 2, fontSize: 12, fontWeight: 700, color: "#71808C", backgroundColor: "#F4F7FA" }}>{header}</Box>)}
          {filtrados.map((item) => (
            <Box key={item.id} sx={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "230px 130px minmax(250px, 1fr) 80px 80px 110px 110px 130px", borderTop: "1px solid #DCE6EE", alignItems: "stretch" }}>
              <Box sx={{ p: 2, fontSize: 14, fontWeight: 700, color: "#16324F", overflowWrap: "anywhere" }}>{item.nombre}</Box>
              <Box sx={{ p: 2 }}><Chip size="small" label={item.categoria} variant="outlined" sx={{ minWidth: 100, fontWeight: 600 }} /></Box>
              <Box sx={{ p: 2, fontSize: 13, color: "#81909D", lineHeight: 1.45 }}>{item.descripcion}</Box>
              <Box sx={{ p: 2, fontSize: 14, color: "#273746" }}>{item.preguntas.length}</Box>
              <Box sx={{ p: 2, fontSize: 14, color: "#16324F", fontWeight: 700 }}>{item.version}</Box>
              <Box sx={{ p: 2, fontSize: 13, color: "#81909D" }}>{item.actualizacion}</Box>
              <Box sx={{ p: 2 }}><Tooltip title="Pulsa para activar o desactivar"><Chip size="small" onClick={() => cambiarEstado(item)} label={item.estado} sx={{ minWidth: 90, color: "#FFF", fontWeight: 700, cursor: "pointer", backgroundColor: item.estado === "Activo" ? "#16803C" : item.estado === "Borrador" ? "#F2A900" : "#B42318" }} /></Tooltip></Box>
              <Stack component="div" direction="row" spacing={0.25} sx={{ p: 1, alignItems: "center", justifyContent: "center" }}>
                <Tooltip title="Ver preguntas"><IconButton size="small" onClick={() => setSeleccionado(item)} color="primary"><VisibilityOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Editar"><IconButton size="small" onClick={() => abrirEdicion(item)} color="primary"><EditOutlinedIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Eliminar"><IconButton size="small" onClick={() => setConfirmarBorrado(item)} color="error"><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </Stack>
            </Box>
          ))}
          {filtrados.length === 0 && <Box sx={{ gridColumn: "1 / -1", p: 4, textAlign: "center", color: "#81909D" }}>No hay checklists que coincidan con la búsqueda.</Box>}
        </Box>
        <Box sx={{ p: 1.75, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #DCE6EE" }}>
          <Typography sx={{ fontSize: 13, color: "#81909D" }}>Mostrando {filtrados.length} de {checklists.length} checklists</Typography>
          <Typography sx={{ fontSize: 13, color: "#81909D" }}>{filtrados.length === 1 ? "1 resultado" : `${filtrados.length} resultados`}</Typography>
        </Box>
      </Paper>

      <Dialog open={modalFormulario} onClose={cerrarFormulario} fullWidth maxWidth="md">
        <DialogTitle sx={{ color: "#16324F", fontWeight: 700 }}>{modoEdicion ? "Editar checklist" : "Crear checklist"}</DialogTitle>
        <DialogContent dividers>
          <Stack component="div" spacing={2} sx={{ pt: 1 }}>
            <TextField label="Nombre del checklist" required fullWidth value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} />
            <Stack component="div" direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField select label="Categoría" fullWidth value={form.categoria} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))}><MenuItem value="Seguridad">Seguridad</MenuItem><MenuItem value="Higiene">Higiene</MenuItem></TextField>
              <TextField label="Versión" fullWidth value={form.version} onChange={(e) => setForm((p) => ({ ...p, version: e.target.value }))} placeholder="v1.0" />
              <TextField select label="Estado" fullWidth value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value as EstadoChecklist }))}><MenuItem value="Activo">Activo</MenuItem><MenuItem value="Borrador">Borrador</MenuItem><MenuItem value="Inactivo">Inactivo</MenuItem></TextField>
            </Stack>
            <TextField label="Descripción" required fullWidth multiline minRows={2} value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} />
            <Typography sx={{ color: "#16324F", fontWeight: 700 }}>Preguntas del checklist</Typography>
            {form.preguntas.map((pregunta, index) => <Box key={index} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, alignItems: { xs: "stretch", sm: "center" } }}><TextField fullWidth label={`Pregunta ${index + 1}`} value={pregunta} onChange={(e) => actualizarPregunta(index, e.target.value)} /><Button color="error" disabled={form.preguntas.length === 1} onClick={() => setForm((p) => ({ ...p, preguntas: p.preguntas.filter((_, i) => i !== index) }))}>Quitar</Button></Box>)}
            <Box><Button startIcon={<AddIcon />} onClick={() => setForm((p) => ({ ...p, preguntas: [...p.preguntas, ""] }))}>Agregar pregunta</Button></Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={cerrarFormulario}>Cancelar</Button><Button variant="contained" onClick={guardarChecklist} sx={{ backgroundColor: "#16324F" }}>{modoEdicion ? "Guardar cambios" : "Crear checklist"}</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(seleccionado)} onClose={() => setSeleccionado(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "#16324F", fontWeight: 700 }}>Detalle del checklist</DialogTitle>
        <DialogContent dividers>
          {seleccionado && <Stack component="div" spacing={2}>
            <Typography variant="h6" sx={{ color: "#16324F", fontWeight: 700 }}>{seleccionado.nombre}</Typography>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1 }}><Chip label={seleccionado.categoria} variant="outlined" /><Chip label={seleccionado.estado} color={seleccionado.estado === "Activo" ? "success" : seleccionado.estado === "Borrador" ? "warning" : "error"} /></Box>
            <Typography>{seleccionado.descripcion}</Typography>
            <Typography variant="body2" color="text.secondary">Versión {seleccionado.version} · Actualizado: {seleccionado.actualizacion}</Typography>
            <Typography sx={{ color: "#16324F", fontWeight: 700 }}>Preguntas ({seleccionado.preguntas.length})</Typography>
            {seleccionado.preguntas.map((pregunta, index) => <Paper key={`${index}-${pregunta}`} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}><Typography>{index + 1}. {pregunta}</Typography></Paper>)}
          </Stack>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setSeleccionado(null)}>Cerrar</Button>{seleccionado && <Button variant="contained" onClick={() => { const item = seleccionado; setSeleccionado(null); abrirEdicion(item); }} sx={{ backgroundColor: "#16324F" }}>Editar</Button>}</DialogActions>
      </Dialog>

      <Dialog open={Boolean(confirmarBorrado)} onClose={() => setConfirmarBorrado(null)}>
        <DialogTitle>¿Eliminar checklist?</DialogTitle>
        <DialogContent><Typography>Se eliminará «{confirmarBorrado?.nombre}» de este navegador. Esta acción no se puede deshacer.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setConfirmarBorrado(null)}>Cancelar</Button><Button color="error" variant="contained" onClick={eliminarChecklist}>Eliminar</Button></DialogActions>
      </Dialog>
    </section>
  );
}