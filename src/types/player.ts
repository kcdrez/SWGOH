import { Unit } from "./unit";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id?: string;
  updated: number;
}

export interface PlayerResponse extends Player {
  gear?: any;
  relic?: any;
  planner?: any;
  energyData?: any;
  teams?: any[];
  shards: any;
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
