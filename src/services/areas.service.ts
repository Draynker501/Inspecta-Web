
import { apiRequest } from "../api/client";
import type { PaginationMeta } from "../types/inspections";

export interface Area {
  id: string;
  plant_id: string;
  name: string;
  description?: string | null;
  status?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AreasResponse {
  data: Area[];
  meta: PaginationMeta;
}

export function getAreasByPlant(
  plantId: string,
  page = 1,
  perPage = 100,
): Promise<AreasResponse> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  return apiRequest<AreasResponse>(
    `/plants/${encodeURIComponent(plantId)}/areas?${params.toString()}`,
  );
}

export function getArea(id: string) {
  return apiRequest<{ data: Area }>(
    `/areas/${encodeURIComponent(id)}`,
  );
}
