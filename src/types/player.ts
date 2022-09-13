import { IDailyCurrency, IWallet } from "./currency";
import { ConfigType as GearConfigType, EnergyConfig } from "./gear";
import { ConfigType as PlannerConfigType } from "./planner";
import { OwnedRelicConfig } from "./relic";
import { OwnedShardsMap } from "./shards";
import { ITeam, Team } from "./teams";
import { IUnit, Unit } from "./unit";
import { Goal } from "types/goals";

export interface Player {
  ally_code: number;
  name: string;
  units: Unit[];
  id?: string;
  updated: number;
  guild_id: string;
  gear?: GearConfigType;
  relic?: OwnedRelicConfig;
  planner?: { targetData: PlannerConfigType; unitList: string[] };
  energyData?: EnergyConfig;
  teams?: Team[];
  shards: OwnedShardsMap;
  wallet: IWallet;
  dailyCurrency: IDailyCurrency;
  goalList: Goal[];
}

export interface PlayerResponse {
  ally_code: number;
  name: string;
  units: IUnit[];
  id?: string;
  updated: number;
  guild_id: string;
  gear?: any;
  relic?: OwnedRelicConfig;
  planner?: { targetData: PlannerConfigType; unitList: string[] };
  energyData?: EnergyConfig;
  teams?: ITeam[];
  shards: OwnedShardsMap;
  wallet: IWallet;
  dailyCurrency: IDailyCurrency;
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
