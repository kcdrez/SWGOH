import store from "../vuex-store/store";
import { Unit } from "./unit";

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
}

interface IUnitOwned {
  allyCode: number,
  name: string,
  gearLevel: number,
  relicLevel: number,
  zetas: number,
  omicrons: number,
  speed: number,
  offense: {
    physical: number,
    special: number
  },
  protection: number,
  health: number,
  tenacity: number,
  potency: number,
  critChance: {
    physical: number,
    special: number
  },
  critDamage: number,
  armor: {
    physical: number,
    special: number
  },
  ultimate: boolean,
}

interface IUnitUnowned {
  allyCode: number,
  name: string
}

export interface IGuildUnitMap {
  zetas: unitMappingData,
  speed?: {
    min: number,
    max: number,
    average: number
  },
  gearLevels: unitMappingData,
  relicLevels: unitMappingData,
  owned: IUnitOwned[],
  unowned: IUnitUnowned[]
}

export function estimatedTime(unit: Unit): number {
  const type =
    unit.id === "KIADIMUNDI" || unit.id === "IMPERIALPROBEDROID"
      ? "Light"
      : "Dark";
  const avgShardsPerEvent = store.getters["guild/tbAvgShards"](type, unit.id);
  return Math.ceil(unit.remainingShards / (avgShardsPerEvent / 30));
}
