export interface LocationProductionLine {
  id: string;
  name: string;
  code: string;
  status: boolean;
}

export interface LocationArea {
  id: string;
  name: string;
  code: string;
  type: string | null;
  status: boolean;
  production_lines: LocationProductionLine[];
}

export interface LocationPlant {
  id: string;
  name: string;
  code: string;
  status: boolean;
  areas: LocationArea[];
}

export interface LocationHierarchyResponse {
  data: LocationPlant[];

  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface LocationAreaOption {
  id: string;
  name: string;
  plant_id: string;
  plant_name: string;
  status: boolean;
}