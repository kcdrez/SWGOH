import { Unit } from "./unit";

export interface Team {
  id: string;
  name: string;
  units: Unit[];
}