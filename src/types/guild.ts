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

interface IGuildUnit {
  id: string;
  name: string;
  gear_level: number;
  level: number;
  power: number;
  rarity: number;
  gear: UnitGear[];
  url: string;
  stats: any;
  stat_diffs: any;
  zeta_abilities: string[];
  omicron_abilities: string[];
  ability_data: Ability[];
  mod_set_ids: string[];
  relic_tier: number;
  has_ultimate: boolean;
  is_galactic_legend: boolean;
}
export class GuildUnit {
  private _gear_level;
  private _gear;
  private _name: string;
  private _ability_data: Ability[];
  private _relic_tier: number;
  private _stars: number;
  private _id: string;
  private _image: string;
  private _stats: any;
  private _stat_diff: any;
  private _power: number;
  private _zeta_abilities: string[];
  private _omicron_abilities: string[];
  private _has_ultimate: boolean;
  private _is_GL: boolean;
  private _mod_sets: string[];

  constructor(payload: IGuildUnit) {
    this._id = payload.id;
    this._name = payload.name;
    this._gear_level = payload.gear_level || 0;
    this._gear = payload.gear;
    this._ability_data = payload?.ability_data || [];
    this._relic_tier = (payload?.relic_tier ?? 0) - 2;
    this._stars = payload?.rarity || 0;
    this._image = payload.url;
    this._stats = payload.stats;
    this._stat_diff = payload.stat_diffs;
    this._power = payload.power;
    this._zeta_abilities = payload.zeta_abilities;
    this._omicron_abilities = payload.omicron_abilities;
    this._has_ultimate = payload.has_ultimate;
    this._is_GL = payload.is_galactic_legend;
    this._mod_sets = payload.mod_set_ids;
  }

  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public get gearLevel() {
    return this._gear_level;
  }
  public get gear() {
    return this._gear;
  }
  public get abilities() {
    return this._ability_data;
  }
  public get relicLevel() {
    return this._relic_tier;
  }
  public get stars() {
    return this._stars;
  }
  public get image() {
    return this._image;
  }
  public get power() {
    return this._power;
  }
  public get zetas() {
    return this._zeta_abilities;
  }
  public get omicrons() {
    return this._omicron_abilities;
  }
  public get hasUlt() {
    return this._has_ultimate;
  }
  public get isGL() {
    return this._is_GL;
  }

  public get protection() {
    return this._stats["28"];
  }
  public get health() {
    return this._stats["1"];
  }
  public get tenacity() {
    return round2Decimals(this._stats["18"] * 100);
  }
  public get potency() {
    return round2Decimals(this._stats["17"] * 100);
  }
  public get armor() {
    return {
      physical: round2Decimals(this._stats["8"] * 100),
      special: round2Decimals(this._stats["9"] * 100),
    };
  }
  public get speed() {
    return this._stats["5"];
  }
  public get modSpeed() {
    return 0;
  }
  public get offense() {
    return {
      physical: this._stats["6"],
      special: this._stats["7"],
    };
  }
  public get critChance() {
    return {
      physical: round2Decimals(this._stats["14"]),
      special: round2Decimals(this._stats["15"]),
    };
  }
  public get critDamage() {
    return round2Decimals(this._stats["16"] * 100);
  }
}
