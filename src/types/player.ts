import { Unit } from "./unit";

export interface Player {
  url: string;
  ally_code: number;
  name: string;
  arena: any;
  fleet_arena: any;
  units: Unit[];
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
