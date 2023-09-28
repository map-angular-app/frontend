import { Position } from '../map/model';

export interface Option {
  label: string;
  value: string;
  position?: Position;
}

export interface City {
  id: string | number;
  city_name: string;
  lat: string | number;
  lng: string | number;
}

export interface Hospital {
  hosidno1?: string;
  hospital_name?: string;
  address1?: string;
  address2?: string;
  city_name?: string;
  state_name?: string;
  pin_code?: string;
  lat?: number;
  lng?: number;
}

export interface Filter {
  type?: string | null;
  value?: string | Position | null;
  lat?: number;
  lng?: number;
  radius?: number | null;
}
