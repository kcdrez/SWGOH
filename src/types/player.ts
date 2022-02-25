import { Team } from "./teams";
import { Unit } from "./unit";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id?: string;
  updated: number;
  guild_id: string;
}

export interface PlayerResponse extends Player {
  gear?: any;
  relic?: any;
  planner?: any;
  energyData?: any;
  teams?: any[];
  shards: any;
}

export interface OpponentResponse {
  opponentAllyCode: string;
  teams: Team[];
  id: string;
  matches: { opponentTeamId: string; playerTeamId: string; gameMode: string }[];
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
