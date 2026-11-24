import { apiRequest } from "../api/client";

export interface ModuleCapabilities {
  dashboard: boolean;
  inspections: boolean;
  incidents: boolean;
  corrective_actions: boolean;
  checklists: boolean;
  norms: boolean;
  reports: boolean;
  administration: boolean;
}

export interface CorrectiveActionCapabilities {
  view: boolean;
  create: boolean;
  update: boolean;
  record_update: boolean;
  verify: boolean;
}

export interface OrganizationCapabilities {
  organization_id: string;
  roles: string[];
  modules: ModuleCapabilities;
  corrective_actions: CorrectiveActionCapabilities;
}

export type ModuleKey = keyof ModuleCapabilities;

export async function getCapabilities(
  signal?: AbortSignal
): Promise<OrganizationCapabilities> {
  return apiRequest<OrganizationCapabilities>(
    "/auth/capabilities",
    {
      method: "GET",
      signal,
    }
  );
}