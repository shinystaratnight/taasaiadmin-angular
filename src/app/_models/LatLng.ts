export interface LatLng {
    constructor(lat: number, lng: number): void;
    lat(): number;
    lng(): number;
    toString(): string;
  }
  