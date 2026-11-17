
import type {
  InspectionBase,
  InspectionStatus,
} from "../types/inspections";

export type EstadoInspeccionUI =
  | "Pendiente"
  | "Completada"
  | "Confirmada"
  | "Rechazada";

export interface InspeccionUI {
  id: string;
  areaId: string;
  responsableId: string;
  fecha: string | null;
  estado: EstadoInspeccionUI;
}

const estadoLabels: Record<InspectionStatus, EstadoInspeccionUI> = {
  draft: "Pendiente",
  completed: "Completada",
  confirmed: "Confirmada",
  rejected: "Rechazada",
};

export function adaptarInspeccion(
  inspeccion: InspectionBase,
): InspeccionUI {
  return {
    id: inspeccion.id,
    areaId: inspeccion.area_id,
    responsableId: inspeccion.user_id,
    fecha: inspeccion.completed_at ?? inspeccion.started_at,
    estado: estadoLabels[inspeccion.status],
  };
}

export function adaptarInspecciones(
  inspecciones: InspectionBase[],
): InspeccionUI[] {
  return inspecciones.map(adaptarInspeccion);
}
