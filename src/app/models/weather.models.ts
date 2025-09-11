export interface Weathermodels {
  name: string;
  city: string;
  weather: { description: string; icon: string }[];
  main: { temp: number; temp_min: number; temp_max: number; humidity: number };
  wind: { speed: number };
}
