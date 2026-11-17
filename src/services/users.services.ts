
import { apiRequest } from "../api/client";
import type {
  ApiResponse,
  PaginationMeta,
} from "../types/inspections";

export interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UsersResponse {
  data: User[];
  meta: PaginationMeta;
}

export function getUsers(
  page = 1,
  perPage = 100,
): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  return apiRequest<UsersResponse>(`/users?${params.toString()}`);
}

export function getUser(id: string): Promise<ApiResponse<User>> {
  return apiRequest<ApiResponse<User>>(
    `/users/${encodeURIComponent(id)}`,
  );
}
