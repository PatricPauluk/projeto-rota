export interface Vehicle {
  id: string;
  plate: string;
  fleet: string | null;
  type: string;
  model: string;
  nameOwner: string;
  status: string;
  createdAt: string;
}

export interface LocationVehicle {
  id: string;
  fleet: string | null;
  equipmentId: string;
  name: string;
  plate: string;
  ignition: string;
  lat: number;
  lng: number;
  speed: number;
  createdAt: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: string;
}

export interface ApiContent {
  vehicles: Vehicle[];
  locationVehicles: LocationVehicle[];
  totalPages: number;
  page: number;
  perPage: string;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  content: ApiContent;
}

export interface EnrichedVehicle extends Vehicle {
  latitude?: number;
  longitude?: number;
  equipmentId?: string;
  ignition?: string;
  speed?: number;
}