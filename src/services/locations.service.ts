import { apiRequest } from "../api/client";

import type {
  LocationHierarchyResponse,
  LocationPlant,
  LocationAreaOption,
} from "../types/locations";

export interface GetLocationHierarchyParams {
  page?: number;
  perPage?: number;
  plantId?: string;
  areaId?: string;
}

export function getLocationHierarchy(
  filters: GetLocationHierarchyParams = {},
  signal?: AbortSignal
): Promise<LocationHierarchyResponse> {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    per_page: String(filters.perPage ?? 15),
  });

  if (filters.plantId) {
    params.set("plant_id", filters.plantId);
  }

  if (filters.areaId) {
    params.set("area_id", filters.areaId);
  }

  return apiRequest<LocationHierarchyResponse>(
    `/locations/hierarchy?${params.toString()}`,
    {
      method: "GET",
      signal,
    }
  );
}

export async function getAllLocationPlants(
  signal?: AbortSignal
): Promise<LocationPlant[]> {
  const plants: LocationPlant[] = [];

  let page = 1;
  let lastPage = 1;

  do {
    const response = await getLocationHierarchy(
      {
        page,
        perPage: 15,
      },
      signal
    );

    plants.push(...response.data);

    lastPage = response.meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return plants;
}

export async function getLocationAreas(
  signal?: AbortSignal
): Promise<LocationAreaOption[]> {
  const plants = await getAllLocationPlants(signal);

  return plants
    .flatMap((plant) =>
      plant.areas.map((area) => ({
        id: area.id,
        name: area.name,
        plant_id: plant.id,
        plant_name: plant.name,
        status: area.status,
      }))
    )
    .sort(
      (a, b) =>
        a.name.localeCompare(b.name, "es") ||
        a.plant_name.localeCompare(b.plant_name, "es")
    );
}