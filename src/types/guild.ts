import store from "../vuex-store/store";
import { Unit, UnitGear, Ability } from "./unit";
import { round2Decimals } from "../utils";

export interface GuildPayload {
  territoryWar?: TerritoryWarEvent[];
  territoryBattle?: TerritoryBattleEvent[];
}

export interface TerritoryWarEvent {
  id: string;
  date: string;
  win: boolean;
  get1: number;
  get2: number;
  zetas: number;
}

export interface TerritoryBattleEvent {
  id: string;
  date: string;
  type: "Dark" | "Light";
  name:
    | "Separatist Might"
    | "Republic Offensive"
    | "Rebel Assault"
    | "Imperial Retaliation";
  get1: number;
  get2: number;
  stars: number;
  gear: any[];
  crystals: number;
  characterShards: { id: string; count: number };
}

type unitMappingData = {
  [key: number]: number;
};

interface IUnitOwned {
  allyCode: number;
  name: string;
  gearLevel: number;
  relicLevel: number;
  zetas: number;
  omicrons: number;
  speed: number;
  speedMod: number;
  physicalOffense: number;
  specialOffense: number;
  protection: number;
  health: number;
  tenacity: number;
  potency: number;
  physicalCrit: number;
  specialCrit: number;
  critDamage: number;
  armor: number;
  resistance: number;
  ultimate: boolean;
}

export type tUnitOwnedKeys =
  | "allyCode"
  | "name"
  | "gearLevel"
  | "relicLevel"
  | "zetas"
  | "omicrons"
  | "speed"
  | "speedMod"
  | "physicalOffense"
  | "specialOffense"
  | "protection"
  | "health"
  | "tenacity"
  | "potency"
  | "physicalCrit"
  | "specialCrit"
  | "critDamage"
  | "armor"
  | "resistance"
  | "ultimate";

interface IUnitUnowned {
  allyCode: number;
  name: string;
}

export interface IGuildUnitMap {
  zetas: unitMappingData;
  speed?: {
    min: number;
    max: number;
    average: number;
  };
  gearLevels: unitMappingData;
  relicLevels: unitMappingData;
  owned: IUnitOwned[];
  unowned: IUnitUnowned[];
}

export function estimatedTime(unit: Unit): number {
  const type =
    unit.id === "KIADIMUNDI" || unit.id === "IMPERIALPROBEDROID"
      ? "Light"
      : "Dark";
  const avgShardsPerEvent = store.getters["guild/tbAvgShards"](type, unit.id);
  return Math.ceil(unit.remainingShards / (avgShardsPerEvent / 30));
}
