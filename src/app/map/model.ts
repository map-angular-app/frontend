export interface Position {
  lat: string | number;
  lng: string | number;
}
export interface Marker {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  label?: string | google.maps.MarkerLabel;
  title?: string;
  options?: google.maps.MarkerOptions;
  icon: string | google.maps.Icon | google.maps.Symbol;
}
