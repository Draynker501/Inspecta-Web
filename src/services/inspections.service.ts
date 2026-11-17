
import { apiRequest } from "../api/client";
import type {
  ApiResponse,
  InspectionBase,
  InspectionDetail,
  InspectionStatus,
  PaginatedResponse,
} from "../types/inspections";

export interface GetInspectionsParams {
  page?: number;
  perPage?: number;
  status?: InspectionStatus;
  plantId?: string;
  areaId?: string;
  userId?: string;
  supervisorId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function getInspections(
  filters: GetInspectionsParams = {},
): Promise<PaginatedResponse<InspectionBase>> {
  const params = new URLSearchParams();

  params.set("page", String(filters.page ?? 1));
  params.set("per_page", String(filters.perPage ?? 15));

  if (filters.status) params.set("status", filters.status);
  if (filters.plantId) params.set("plant_id", filters.plantId);
  if (filters.areaId) params.set("area_id", filters.areaId);
  if (filters.userId) params.set("user_id", filters.userId);
  if (filters.supervisorId) {
    params.set("supervisor_id", filters.supervisorId);
  }
  if (filters.dateFrom) params.set("date_from", filters.dateFrom);
  if (filters.dateTo) params.set("date_to", filters.dateTo);

  return apiRequest<PaginatedResponse<InspectionBase>>(
    `/inspections?${params.toString()}`,
  );
}

export function getInspection(
  id: string,
): Promise<ApiResponse<InspectionDetail>> {
  return apiRequest<ApiResponse<InspectionDetail>>(
    `/inspections/${encodeURIComponent(id)}`,
  );
}
