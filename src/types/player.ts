import { Unit } from "./unit";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id: string;
  gear?: any;
  relic?: any;
  planner?: any;
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
