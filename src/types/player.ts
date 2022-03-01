import { ITeam, Team } from "./teams";
import { IUnit, Unit } from "./unit";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id?: string;
  updated: number;
  guild_id: string;
}

export interface PlayerResponse {
  ally_code: number;
  name: string;
  units: IUnit[];
  id?: string;
  updated: number;
  guild_id: string;
  gear?: any;
  relic?: any;
  planner?: any;
  energyData?: any;
  teams?: ITeam[];
  shards: any;
}

export interface OpponentResponse {
  opponentAllyCode: string;
  teams: ITeam[];
  id: string;
  matches: { opponentTeamId: string; playerTeamId: string; gameMode: string }[];
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
  slot: number;
}
