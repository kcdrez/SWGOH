import { CurrencyTypeConfig } from "./currency";
import { Unit, unitsByPriority } from "./unit";

export type ShardsConfigType = {
  [key: number]: number;
};

export const shardMapping: ShardsConfigType = {
  1: 10,
  2: 15,
  3: 25,
  4: 30,
  5: 65,
  6: 85,
  7: 100,
};

export class FarmingNode {
  private _id: string;
  private _table: string;
  private _difficulty?: "Hard" | "Normal" | "";
  private _map?: number;
  private _mission?: string;
  private _characters?: NodeCharacter[];
  private _gear?: any;

  constructor(data: IFarmingNode) {
    this._id = data.id;
    this._table = data.table;
    this._difficulty = data.difficulty;
    this._map = data.map;
    this._mission = data.mission;
    this._characters = data.characters;
    this._gear = data.gear;
  }

  public get id() {
    return this._id;
  }
  public get table() {
    return this._table;
  }
  public get difficulty() {
    return this._difficulty;
  }
  public get map() {
    return this._map;
  }
  public get mission() {
    return this._mission;
  }
  public get characters() {
    return this._characters || [];
  }
  public get gear() {
    return this._gear;
  }
  public get label() {
    let str = `${this.table}`;
    if (this.map) {
      str += ` ${this.map}-${this.mission}`;
    }
    if (this.difficulty) {
      str += ` (${this.difficulty})`;
    }
    return str;
  }
  public get currencyType(): CurrencyTypeConfig | undefined {
    switch (this.id) {
      case "guild_events_store1":
        return "get1";
      case "guild_events_store2":
        return "get2";
      case "cantina_battles_store":
        return "cantinaBattleCurrency";
      case "guild_store":
        return "guildStoreCurrency";
      case "squad_arena_store":
        return "squadArenaCurrency";
      case "galactic_war_store":
        return "galacticWarCurrency";
      case "fleet_arena_store":
        return "fleetArenaCurrency";
      case "shard_store":
        return "shardCurrency";
    }
  }
}
export interface IFarmingNode {
  id: string;
  table: string;
  difficulty?: "Hard" | "Normal" | "";
  map?: number;
  mission?: string;
  characters: NodeCharacter[];
  gear?: any[];
}

interface NodeCharacter {
  id: string;
  dropRate?: number;
  shardCount?: number;
  cost?: number;
  prerequisites?: {
    id?: string;
    requirement?: IPrerequisite;
    tags?: string[];
    count?: number;
    recommended?: IPrerequisite;
  }[];
}

interface IPrerequisite {
  value: number;
  type: "Relic" | "Power" | "Gear" | "Stars";
}

export type OwnedShardsMap = {
  [key: string]: ShardData;
};

interface ShardData extends UnitNodeData {
  owned: number;
}

type UnitNodeData = {
  nodes?: Node[];
  tracking?: boolean;
  // priority?: number;
};

export type Node = {
  id: string;
  count?: number;
  priority?: number;
};

export interface NodePayload extends UnitNodeData {
  id: string;
  count?: number;
}

export function estimatedTime(
  unitList: Unit[],
  tableNames: string[],
  unit: Unit
): number {
  const unitListByPriority = unitsByPriority(unitList, tableNames);
  const index = unitListByPriority.findIndex((u) => u.id === unit.id);

  const priority = unit.tablePriority(tableNames);
  let days = unitEstimated(unit, tableNames);
  const alreadyCheckedPriorities: number[] = [];
  for (let i = index - 1; i >= 0; i--) {
    const el = unitListByPriority[i];
    const prevPriority = el.tablePriority(tableNames);
    if (
      priority > prevPriority &&
      !alreadyCheckedPriorities.includes(prevPriority)
    ) {
      days += unitEstimated(el, tableNames);
      alreadyCheckedPriorities.push(prevPriority);
    }
  }

  return days;
}

function unitEstimated(unit: Unit, tableNames: string[]) {
  let shardsPerDay = 0;

  unit.whereToFarm.forEach((location) => {
    const defaultNodesPerDay = tableNames.includes(location.table) ? 5 : 0;
    const nodesPerDay =
      unit.shardNodes.find((n) => n.id === location.id)?.count ||
      defaultNodesPerDay;

    shardsPerDay += nodesPerDay * 0.33 * unit.shardDropRate;
  });

  return shardsPerDay === 0
    ? 0
    : Math.ceil(unit.remainingShards / shardsPerDay);
}

export function getCurrentLevel() {}

export function isRelicRequirement(
  type: string,
  value: any,
  relicLevel: any
): boolean {
  if (type !== "Relic") {
    return false;
  } else if (value === null) {
    return (relicLevel ?? 0) > 0;
  } else {
    return true;
  }
}

export function isGearRequirement(
  type: string,
  value: any,
  relicLevel: any
): boolean {
  return (
    (type === "Relic" && !isRelicRequirement(type, value, relicLevel)) ||
    type === "Gear"
  );
}

export function displayValue(
  type: string,
  value: any,
  relicLevel: any,
  gearLevel: any,
  stars: any
) {
  if (value === null) {
    if (type === "Relic" && relicLevel) {
      return relicLevel ?? 0;
    } else if (type === "Relic" || type === "Gear") {
      return gearLevel ?? 0;
    } else if (type === "Stars") {
      return stars ?? 0;
    }
  }
  return value;
}
