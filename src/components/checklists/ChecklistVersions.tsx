
import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import ChecklistVersionEditor from "./ChecklistVersionEditor";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import {
    getAllChecklistVersions,
    getChecklistVersion,
    createChecklistVersion,
    updateChecklistVersion,
} from "../../services/checklists.service";

import type {
    Checklist,
    ChecklistVersion,
    ChecklistVersionStatus,
} from "../../types/checklists";

const NAVY = "#16324F";
const GREEN = "#0F9D8A";

const STATUS_LABELS: Record<ChecklistVersionStatus, string> = {
    draft: "Borrador",
    published: "Publicada",
    archived: "Archivada",
};

const STATUS_COLORS: Record<ChecklistVersionStatus, string> = {
    draft: "#B7791F",
    published: "#16803C",
    archived: "#64748B",
};

interface Props {
    checklist: Checklist;
    onClose: () => void;
    onChanged?: () => void;
}

function dateText(value?: string | null): string {
    if (!value) return "—";

    const date = new Date(
        value.length === 10 ? `${value}T12:00:00` : value
    );

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString("es-MX");
}

function errorText(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "No fue posible completar la solicitud.";
}

function VersionChip({
    status,
}: {
    status: ChecklistVersionStatus;
}) {
    return (
        <Chip
            size="small"
            label={STATUS_LABELS[status]}
            sx={{
                minWidth: 90,
                bgcolor: STATUS_COLORS[status],
                color: "#FFFFFF",
                fontWeight: 600,
            }}
        />
    );
}

function InfoField({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#F4F7FA",
            }}
        >
            <Typography
                sx={{
                    fontSize: 12,
                    color: "#81909D",
                    mb: 0.5,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    fontSize: 14,
                    color: NAVY,
                    fontWeight: 600,
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

export default function ChecklistVersions({
    checklist,
    onClose,
    onChanged,
}: Props) {
    const [versions, setVersions] = useState<ChecklistVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Formulario de creación y edición.
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<ChecklistVersion | null>(null);
    const [versionName, setVersionName] = useState("");
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    // Detalle de versión.
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<ChecklistVersion | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    const [contentVersion, setContentVersion] =
        useState<ChecklistVersion | null>(null);

    useEffect(() => {
        let active = true;

        setLoading(true);
        setError("");

        getAllChecklistVersions(checklist.id)
            .then((result) => {
                if (active) setVersions(result);
            })
            .catch((e) => {
                if (active) setError(errorText(e));
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [checklist.id, reload]);

    useEffect(() => {
        let active = true;

        setDetail(null);
        setDetailError("");

        if (!selectedId) {
            setDetailLoading(false);

            return () => {
                active = false;
            };
        }

        setDetailLoading(true);

        getChecklistVersion(checklist.id, selectedId)
            .then((response) => {
                if (active) setDetail(response.data);
            })
            .catch((e) => {
                if (active) setDetailError(errorText(e));
            })
            .finally(() => {
                if (active) setDetailLoading(false);
            });

        return () => {
            active = false;
        };
    }, [checklist.id, selectedId]);

    const published = versions.find(
        (version) => version.status === "published"
    );

    const drafts = versions.filter(
        (version) => version.status === "draft"
    ).length;

    const archived = versions.filter(
        (version) => version.status === "archived"
    ).length;

    function openCreate() {
        setEditing(null);
        setVersionName("");
        setFormError("");
        setSuccess("");
        setFormOpen(true);
    }

    function openEdit(version: ChecklistVersion) {
        if (
            version.status !== "draft" ||
            version.published_at !== null
        ) {
            return;
        }

        setEditing(version);
        setVersionName(version.version);
        setFormError("");
        setSuccess("");
        setFormOpen(true);
    }

    function closeForm() {
        if (saving) return;

        setFormOpen(false);
        setFormError("");
    }

    async function saveVersion() {
        if (saving) return;

        const value = versionName.trim();

        if (!value) {
            setFormError("El número de versión es obligatorio.");
            return;
        }

        if (value.length > 20) {
            setFormError(
                "La versión no puede superar los 20 caracteres."
            );
            return;
        }

        const duplicated = versions.some(
            (version) =>
                version.version === value &&
                version.id !== editing?.id
        );

        if (duplicated) {
            setFormError(
                "Ya existe una versión con ese identificador."
            );
            return;
        }

        setSaving(true);
        setFormError("");

        try {
            if (editing) {
                await updateChecklistVersion(
                    checklist.id,
                    editing.id,
                    value
                );

                setSuccess(
                    "Versión actualizada correctamente."
                );
            } else {
                await createChecklistVersion(
                    checklist.id,
                    value
                );

                setSuccess(
                    "Versión creada correctamente como borrador."
                );
            }

            setFormOpen(false);
            setEditing(null);
            setVersionName("");
            setReload((previous) => previous + 1);

            onChanged?.();
        } catch (e) {
            setFormError(errorText(e));
        } finally {
            setSaving(false);
        }
    }

    const columns =
        "minmax(100px, 1fr) 120px 135px 135px 140px";

    return (
        <>
            {/* Modal principal de versiones */}
            <Dialog
                open
                onClose={() => {
                    if (!saving && !formOpen && !selectedId) {
                        onClose();
                    }
                }}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: { borderRadius: 3 },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        borderBottom: "1px solid #DCE6EE",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1,
                            color: GREEN,
                        }}
                    >
                        ADMINISTRACIÓN DE CHECKLISTS
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 22,
                            fontWeight: 700,
                            color: NAVY,
                        }}
                    >
                        Gestión de versiones
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: 14,
                            color: "#526477",
                            mt: 0.5,
                        }}
                    >
                        {checklist.name}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2.5} sx={{ pt: 2 }}>
                        {!checklist.status && (
                            <Alert severity="warning">
                                Este checklist está inactivo.
                                No será posible publicar nuevas
                                versiones hasta activarlo.
                            </Alert>
                        )}

                        {success && (
                            <Alert
                                severity="success"
                                onClose={() => setSuccess("")}
                            >
                                {success}
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error">
                                {error}
                            </Alert>
                        )}

                        {/* Resumen de versiones */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)",
                                },
                                gap: 1.5,
                            }}
                        >
                            <InfoField
                                label="Versión publicada"
                                value={
                                    loading || error
                                        ? "—"
                                        : published?.version ||
                                        "Sin publicar"
                                }
                            />

                            <InfoField
                                label="Borradores"
                                value={
                                    loading || error
                                        ? "—"
                                        : String(drafts)
                                }
                            />

                            <InfoField
                                label="Versiones archivadas"
                                value={
                                    loading || error
                                        ? "—"
                                        : String(archived)
                                }
                            />
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: NAVY,
                                    fontWeight: 700,
                                }}
                            >
                                Historial de versiones
                                {!loading && !error
                                    ? ` (${versions.length})`
                                    : ""}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<RefreshIcon />}
                                    disabled={loading}
                                    onClick={() =>
                                        setReload(
                                            (previous) => previous + 1
                                        )
                                    }
                                    sx={{
                                        color: GREEN,
                                        borderColor: GREEN,
                                        textTransform: "none",
                                    }}
                                >
                                    Actualizar
                                </Button>

                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    disabled={loading}
                                    onClick={openCreate}
                                    sx={{
                                        bgcolor: NAVY,
                                        textTransform: "none",
                                    }}
                                >
                                    Nueva versión
                                </Button>
                            </Stack>
                        </Box>

                        {/* Listado */}
                        <Paper
                            variant="outlined"
                            sx={{
                                overflowX: "auto",
                                borderRadius: 2,
                                borderColor: "#DCE6EE",
                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: 640,
                                    display: "grid",
                                    gridTemplateColumns: columns,
                                }}
                            >
                                {[
                                    "VERSIÓN",
                                    "ESTADO",
                                    "CREACIÓN",
                                    "PUBLICACIÓN",
                                    "ACCIONES",
                                ].map((header) => (
                                    <Box
                                        key={header}
                                        sx={{
                                            p: 1.5,
                                            bgcolor: "#F4F7FA",
                                            color: "#71808C",
                                            fontSize: 12,
                                            fontWeight: 700,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {header}
                                    </Box>
                                ))}

                                {loading ? (
                                    <Box
                                        sx={{
                                            gridColumn: "1 / -1",
                                            p: 4,
                                            textAlign: "center",
                                        }}
                                    >
                                        <CircularProgress
                                            size={26}
                                            sx={{ color: GREEN }}
                                        />

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 13,
                                                color: "#81909D",
                                            }}
                                        >
                                            Consultando versiones...
                                        </Typography>
                                    </Box>
                                ) : error ? (
                                    <Box
                                        sx={{
                                            gridColumn: "1 / -1",
                                            p: 3,
                                            textAlign: "center",
                                            color: "#81909D",
                                        }}
                                    >
                                        No fue posible consultar las versiones.
                                    </Box>
                                ) : versions.length === 0 ? (
                                    <Box
                                        sx={{
                                            gridColumn: "1 / -1",
                                            p: 4,
                                            textAlign: "center",
                                        }}
                                    >
                                        <LayersOutlinedIcon
                                            sx={{
                                                fontSize: 40,
                                                color: "#81909D",
                                                mb: 1,
                                            }}
                                        />

                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                color: NAVY,
                                            }}
                                        >
                                            Sin versiones registradas
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "#81909D",
                                                mt: 0.5,
                                            }}
                                        >
                                            Crea una versión para comenzar
                                            a construir el checklist.
                                        </Typography>
                                    </Box>
                                ) : (
                                    versions.map((version) => (
                                        <Box
                                            key={version.id}
                                            sx={{
                                                gridColumn: "1 / -1",
                                                display: "grid",
                                                gridTemplateColumns: columns,
                                                alignItems: "center",
                                                borderTop: "1px solid #DCE6EE",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    color: NAVY,
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {version.version}
                                            </Box>

                                            <Box sx={{ p: 1.5 }}>
                                                <VersionChip
                                                    status={version.status}
                                                />
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    color: "#526477",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {dateText(version.created_at)}
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    color: "#526477",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {dateText(version.published_at)}
                                            </Box>

                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                sx={{
                                                    p: 1,
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Tooltip title="Ver versión">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setSelectedId(version.id)
                                                        }
                                                        sx={{ color: NAVY }}
                                                    >
                                                        <VisibilityOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                {version.status === "draft" &&
                                                    version.published_at === null && (
                                                        <Tooltip title="Editar versión">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openEdit(version)}
                                                                sx={{ color: GREEN }}
                                                            >
                                                                <EditOutlinedIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                <Tooltip
                                                    title={
                                                        version.status === "draft" &&
                                                            version.published_at === null
                                                            ? "Editar contenido"
                                                            : "Consultar contenido"
                                                    }
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => setContentVersion(version)}
                                                        sx={{ color: GREEN }}
                                                    >
                                                        <ListAltOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Paper>

                        <Alert severity="info">
                            Las versiones nuevas se crean como borradores.
                            Las versiones publicadas y archivadas no pueden
                            editarse.
                        </Alert>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        disabled={saving}
                        sx={{
                            bgcolor: NAVY,
                            textTransform: "none",
                        }}
                    >
                        Cerrar versiones
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Formulario de versión */}
            <Dialog
                open={formOpen}
                onClose={closeForm}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle
                    sx={{
                        color: NAVY,
                        fontWeight: 700,
                    }}
                >
                    {editing
                        ? "Editar versión"
                        : "Crear nueva versión"}
                </DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {formError && (
                            <Alert severity="error">
                                {formError}
                            </Alert>
                        )}

                        <TextField
                            label="Número de versión"
                            placeholder="Ej. 1.1"
                            value={versionName}
                            required
                            fullWidth
                            disabled={saving}
                            onChange={(event) =>
                                setVersionName(event.target.value)
                            }
                            helperText={`${versionName.length}/20 caracteres`}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 20,
                                },
                            }}
                        />

                        {!editing && (
                            <Alert severity="info">
                                La versión se creará como un borrador
                                vacío. Sus secciones y preguntas se
                                agregarán posteriormente.
                            </Alert>
                        )}
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={closeForm}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        disabled={saving}
                        onClick={() => void saveVersion()}
                        sx={{
                            bgcolor: GREEN,
                            textTransform: "none",
                            "&:hover": {
                                bgcolor: "#0C8878",
                            },
                        }}
                    >
                        {saving
                            ? "Guardando..."
                            : editing
                                ? "Guardar cambios"
                                : "Crear versión"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detalle de una versión */}
            <Dialog
                open={Boolean(selectedId)}
                onClose={() => setSelectedId(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        color: NAVY,
                        fontWeight: 700,
                    }}
                >
                    Detalle de versión
                </DialogTitle>

                <DialogContent dividers>
                    {detailLoading ? (
                        <Box
                            sx={{
                                py: 4,
                                textAlign: "center",
                            }}
                        >
                            <CircularProgress
                                sx={{ color: GREEN }}
                            />
                        </Box>
                    ) : detailError ? (
                        <Alert severity="error">
                            {detailError}
                        </Alert>
                    ) : detail ? (
                        <Stack spacing={2}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: NAVY,
                                        fontWeight: 700,
                                        fontSize: 22,
                                    }}
                                >
                                    Versión {detail.version}
                                </Typography>

                                <VersionChip status={detail.status} />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: "#526477",
                                }}
                            >
                                {checklist.name}
                            </Typography>

                            <Divider />

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        sm: "repeat(2, 1fr)",
                                    },
                                    gap: 1.5,
                                }}
                            >
                                <InfoField
                                    label="Fecha de creación"
                                    value={dateText(detail.created_at)}
                                />

                                <InfoField
                                    label="Última actualización"
                                    value={dateText(detail.updated_at)}
                                />

                                <InfoField
                                    label="Fecha de publicación"
                                    value={dateText(detail.published_at)}
                                />

                                <InfoField
                                    label="Estado"
                                    value={STATUS_LABELS[detail.status]}
                                />
                            </Box>

                            <InfoField
                                label="Identificador de versión"
                                value={detail.id}
                            />

                            {detail.status === "draft" ? (
                                <Alert severity="info">
                                    Esta versión puede editarse
                                    mientras permanezca como borrador.
                                </Alert>
                            ) : (
                                <Alert severity="info">
                                    Esta versión es de solo lectura.
                                    Su estructura se conserva para
                                    mantener la trazabilidad de las
                                    inspecciones.
                                </Alert>
                            )}
                        </Stack>
                    ) : null}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    {detail?.status === "draft" &&
                        detail.published_at === null && (
                            <Button
                                variant="outlined"
                                startIcon={<EditOutlinedIcon />}
                                onClick={() => {
                                    const version = detail;
                                    setSelectedId(null);
                                    openEdit(version);
                                }}
                                sx={{
                                    color: GREEN,
                                    borderColor: GREEN,
                                    textTransform: "none",
                                }}
                            >
                                Editar versión
                            </Button>
                        )}

                    <Button
                        variant="contained"
                        onClick={() => setSelectedId(null)}
                        sx={{
                            bgcolor: NAVY,
                            textTransform: "none",
                        }}
                    >
                        Volver a versiones
                    </Button>
                </DialogActions>
            </Dialog>
            {contentVersion && (
                <ChecklistVersionEditor
                    key={contentVersion.id}
                    checklist={checklist}
                    version={contentVersion}
                    onClose={() => setContentVersion(null)}
                    onChanged={() => {
                        onChanged?.();
                    }}
                />
            )}
        </>
    );
}
