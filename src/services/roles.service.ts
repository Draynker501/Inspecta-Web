
import { apiRequest } from "../api/client";

import type {
  AdministrationRolesResponse,
  AdministrationRoleResponse,
  AdministrationPermissionsResponse,
  GetAdministrationRolesParams,
} from "../types/administration";

// =====================================================
// LISTADO DE ROLES
// =====================================================

export function getAdministrationRoles(
  filters: GetAdministrationRolesParams = {},
  signal?: AbortSignal
): Promise<AdministrationRolesResponse> {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    per_page: String(filters.perPage ?? 15),
  });

  const search = filters.q?.trim();

  if (search) {
    params.set("q", search);
  }

  if (filters.status !== undefined) {
    params.set(
      "status",
      filters.status ? "1" : "0"
    );
  }

  return apiRequest<AdministrationRolesResponse>(
    `/roles?${params.toString()}`,
    {
      method: "GET",
      signal,
    }
  );
}

// =====================================================
// DETALLE DE ROL
// =====================================================

export function getAdministrationRole(
  roleId: string,
  signal?: AbortSignal
): Promise<AdministrationRoleResponse> {
  return apiRequest<AdministrationRoleResponse>(
    `/roles/${encodeURIComponent(roleId)}`,
    {
      method: "GET",
      signal,
    }
  );
}

// =====================================================
// CATÁLOGO DE PERMISOS
// =====================================================

export function getAdministrationPermissions(
  signal?: AbortSignal
): Promise<AdministrationPermissionsResponse> {
  return apiRequest<AdministrationPermissionsResponse>(
    "/permissions",
    {
      method: "GET",
      signal,
    }
  );
}
