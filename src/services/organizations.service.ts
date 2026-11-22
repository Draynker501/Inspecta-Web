
import {
  apiRequest,
  clearOrganizationId,
  getOrganizationId,
  setOrganizationId,
} from "../api/client";

export interface Organization {
  id: string;
  name: string;
  code: string | null;
  type: string;
  status: string;
  membership_id: string;
  membership_status: string;
}

interface OrganizationsResponse {
  message?: string;
  data: Organization[];
}

export async function getOrganizations(): Promise<Organization[]> {
  const response = await apiRequest<OrganizationsResponse>(
    "/auth/organizations",
    { method: "GET" }
  );

  if (!Array.isArray(response.data)) {
    throw new Error(
      "La API no devolvió una lista válida de organizaciones."
    );
  }

  return response.data;
}

export function selectOrganization(organization: Organization): void {
  setOrganizationId(organization.id);
}

export function getSelectedOrganizationId(): string | null {
  return getOrganizationId();
}

export function unselectOrganization(): void {
  clearOrganizationId();
}
