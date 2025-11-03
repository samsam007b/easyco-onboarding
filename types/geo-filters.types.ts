export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface DrawingShape {
  type: 'circle' | 'polygon' | 'rectangle';
  coordinates: GeoLocation[];
  radius?: number; // for circles, in meters
}

export interface GeoFilter {
  id: string;
  name?: string;
  shape: DrawingShape;
  created_at: string;
}

export interface ProximityFilter {
  location: GeoLocation;
  radius: number; // in meters
  poi_type?: 'metro' | 'school' | 'hospital' | 'supermarket' | 'park';
}

export interface CommuteFilter {
  destination: GeoLocation;
  max_duration: number; // in minutes
  transport_mode: 'driving' | 'walking' | 'transit' | 'bicycling';
}

export interface AdvancedMapFilters {
  drawing?: DrawingShape;
  proximity?: ProximityFilter[];
  commute?: CommuteFilter;
}

export interface SavedMapFilter {
  id: string;
  user_id: string;
  name: string;
  filters: AdvancedMapFilters;
  created_at: string;
  updated_at: string;
}
