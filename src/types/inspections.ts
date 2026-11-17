
export type InspectionStatus =
  | "draft"
  | "completed"
  | "confirmed"
  | "rejected";

export interface InspectionBase {
  id: string;
  user_id: string;
  supervisor_id: string | null;
  checklist_version_id: string;
  plant_id: string;
  area_id: string;
  production_line_id: string | null;
  status: InspectionStatus;
  started_at: string | null;
  completed_at: string | null;
  supervisor_confirmed_at?: string | null;
  rejected_at?: string | null;
  location_description?: string | null;
  latitude?: number;
  longitude?: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InspectionDetail extends InspectionBase {
  supervisor_observations?: string | null;
  answers?: Array<{
    id: string;
    question_id: string;
    answer: string | null;
    observation: string | null;
  }>;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
}
