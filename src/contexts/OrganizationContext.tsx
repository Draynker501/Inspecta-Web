import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReactNode } from "react";

import { getOrganizationId } from "../api/client";

import {
  getOrganizations,
} from "../services/organizations.service";

import type {
  Organization,
} from "../services/organizations.service";

import {
  getCapabilities,
} from "../services/capabilities.service";

import type {
  OrganizationCapabilities,
  ModuleCapabilities,
  CorrectiveActionCapabilities,
  ModuleKey,
} from "../services/capabilities.service";

interface OrganizationContextValue {
  organization: Organization | null;
  organizations: Organization[];
  capabilities: OrganizationCapabilities | null;
  roles: string[];
  modules: ModuleCapabilities | null;
  correctiveActions: CorrectiveActionCapabilities | null;
  loading: boolean;
  error: string | null;
  hasModule: (module: ModuleKey) => boolean;
  refresh: () => Promise<void>;
}

interface OrganizationProviderProps {
  children: ReactNode;
}

const OrganizationContext =
  createContext<OrganizationContextValue | undefined>(undefined);

export function OrganizationProvider({
  children,
}: OrganizationProviderProps) {
  const [organization, setOrganization] =
    useState<Organization | null>(null);

  const [organizations, setOrganizations] =
    useState<Organization[]>([]);

  const [capabilities, setCapabilities] =
    useState<OrganizationCapabilities | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const requestRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // Cancelar cualquier solicitud anterior.
    requestRef.current?.abort();

    const controller = new AbortController();

    requestRef.current = controller;

    const organizationId = getOrganizationId();

    // Evitar conservar información de un contexto anterior.
    setOrganization(null);
    setOrganizations([]);
    setCapabilities(null);
    setError(null);
    setLoading(true);

    try {
      if (!organizationId) {
        throw new Error(
          "No hay una organización seleccionada."
        );
      }

      const availableOrganizations = await getOrganizations();

      if (controller.signal.aborted) {
        return;
      }

      const selectedOrganization =
        availableOrganizations.find(
          (item) => item.id === organizationId
        );

      if (!selectedOrganization) {
        throw new Error(
          "Ya no tienes acceso a la organización seleccionada."
        );
      }

      const organizationCapabilities = await getCapabilities(
        controller.signal
      );

      if (controller.signal.aborted) {
        return;
      }

      // Comprobar que la organización no cambió durante la solicitud.
      if (getOrganizationId() !== organizationId) {
        throw new Error(
          "La organización seleccionada cambió durante la consulta."
        );
      }

      // Impedir que se utilicen capacidades de otra organización.
      if (
        organizationCapabilities.organization_id !== organizationId
      ) {
        throw new Error(
          "Las capacidades recibidas no corresponden a la organización activa."
        );
      }

      setOrganizations(availableOrganizations);
      setOrganization(selectedOrganization);
      setCapabilities(organizationCapabilities);
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      setOrganization(null);
      setOrganizations([]);
      setCapabilities(null);

      setError(
        err instanceof Error
          ? err.message
          : "No fue posible cargar la información de la organización."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();

    return () => {
      requestRef.current?.abort();
    };
  }, [refresh]);

  const hasModule = useCallback(
    (module: ModuleKey): boolean => {
      return capabilities?.modules[module] === true;
    },
    [capabilities]
  );

  const value: OrganizationContextValue = {
    organization,
    organizations,
    capabilities,
    roles: capabilities?.roles ?? [],
    modules: capabilities?.modules ?? null,
    correctiveActions:
      capabilities?.corrective_actions ?? null,
    loading,
    error,
    hasModule,
    refresh,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization(): OrganizationContextValue {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      "useOrganization debe utilizarse dentro de OrganizationProvider."
    );
  }

  return context;
}