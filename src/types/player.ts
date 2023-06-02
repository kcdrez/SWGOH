import { IDailyCurrency, IWallet } from "./currency";
import { ConfigType as GearConfigType, EnergyConfig } from "./gear";
import { ConfigType as PlannerConfigType } from "./planner";
import { OwnedRelicConfig } from "./relic";
import { OwnedShardsMap } from "./shards";
import { ITeam, Team } from "./teams";
import { IUnit, Unit } from "./unit";
import { Goal } from "types/goals";

export interface Player {
  allyCode: number;
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
  settings?: ISettings;
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

export interface ISettings {
  startPercent?: number;
  startDate?: string;
  assaultBattles: {
    ct1: number;
    ct2: number;
    ct3: number;
  };
  conquest: {
    difficulty: "easy" | "normal" | "hard";
    box: "box1" | "box2" | "box3" | "box4" | "box5" | "box6" | "box7";
  };
  gc: {
    box:
      | "box1"
      | "box2"
      | "box3"
      | "box4"
      | "box5"
      | "box6"
      | "box7"
      | "box8"
      | "box9"
      | "box10";
  };
  gac: {
    league: "kyber" | "aurodium" | "chromium" | "bronzium" | "carbonite";
    division: number;
    rank:
      | "rank1"
      | "rank2"
      | "rank3"
      | "rank4"
      | "rank5"
      | "rank6"
      | "rank7"
      | "rank8";
  };
  calculateCompletion?: boolean;
  completionDate?: string;
}
