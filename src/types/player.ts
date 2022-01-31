import { Unit } from "./unit";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id: string;
}

export interface PlayerResponse extends Player {
  gear?: any;
  relic?: any;
  planner?: any;
  energyData?: any;
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
