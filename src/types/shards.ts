import _ from "lodash";

import { CurrencyTypeConfig } from "./currency";
import { Unit, unitsByPriority } from "./unit";
import store from "vuex-store/store";

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
  private _energy?: number;
  private _dropRate?: number;
  private _freqency?: {
    type: "month" | "week" | "day";
    amount: number;
  };

  constructor(data: IFarmingNode) {
    this._id = data.id;
    this._table = data.table;
    this._difficulty = data.difficulty;
    this._map = data.map;
    this._mission = data.mission;
    this._characters = data.characters;
    this._gear = data.gear;
    this._energy = data.energy;
    this._dropRate = data.dropRate;
    this._freqency = data.frequency;
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
  public get energy() {
    return this._energy;
  }
  public get dropRate() {
    return this._dropRate ?? 0.2; //todo: implement on the api
  }
  public get freqency() {
    return this._freqency;
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
  energy?: number;
  dropRate?: number;
  frequency?: {
    type: "month" | "week" | "day";
    amount: number;
  };
}

export interface NodeCharacter {
  id: string;
  dropRate?: number;
  shardCount?: number;
  cost?: number;
  prerequisites?: IPrerequisite[];
}

export interface IPrerequisite {
  id?: string;
  requirement?: IPrerequisiteItem;
  tags?: string[];
  count?: number;
  recommended?: IPrerequisiteItem;
  prerequisites?: IPrerequisite;
}
export interface IPrerequisiteItem {
  value: number;
  type?: "Relic" | "Power" | "Gear" | "Stars";
}

export type OwnedShardsMap = {
  [key: string]: ShardData;
};

interface ShardData extends UnitNodeData {
  owned: number;
  glFarming?: {
    tier4: boolean;
    tier5: boolean;
    ultMats: number;
  };
  capitalShipRefreshes?: number;
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
  alreadyOrdered: boolean = false
): number {
  const unitListByPriority = alreadyOrdered
    ? unitList
    : unitsByPriority(unitList, tableNames);

  let totalTime = 0;
  unitListByPriority.forEach((unit) => {
    let days = unitEstimated(unit, tableNames);
    totalTime += days;
    unit.estimatedTime = days;
  });
  return totalTime;
}

function unitEstimated(unit: Unit, tableNames: string[]) {
  let shardsPerDay = 0;

  unit.whereToFarm.forEach((location) => {
    if (location.freqency) {
      let numEvents = 0;
      if (location.freqency.type === "month") {
        numEvents = 30 / location.freqency.amount;
      } else if (location.freqency.type === "week") {
        numEvents = 7 / location.freqency.amount;
      } else if (location.freqency.type === "day") {
        numEvents = location.freqency.amount;
      }
      const match = location.characters.find((x) => x.id === unit.id);
      if (match) {
        shardsPerDay +=
          ((match?.shardCount ?? 0) * (match?.dropRate ?? 1)) / numEvents;
      }
    } else if (location.currencyType) {
      //todo for stores
    } else {
      const defaultNodesPerDay = tableNames.includes(location.table) ? 5 : 0;
      const nodesPerDay =
        unit.shardNodes.find((n) => n.id === location.id)?.count ||
        defaultNodesPerDay;

      shardsPerDay += nodesPerDay * 0.33 * unit.shardDropRate;
    }
  });

  return shardsPerDay === 0
    ? 0
    : Math.ceil(unit.remainingShards / shardsPerDay);
}

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
  stars: any,
  power?: any
) {
  if (value === null) {
    if (type === "Relic" && relicLevel) {
      return relicLevel ?? 0;
    } else if (type === "Relic" || type === "Gear") {
      return gearLevel ?? 0;
    } else if (type === "Stars") {
      return stars ?? 0;
    } else if (type === "Power") {
      return power ?? 0;
    }
  }
  return value;
}

export function isRequired(unit: Unit, checkList: any[] = []): any {
  const list: any[] = store.state.shards.shardFarming
    .filter(
      (x: FarmingNode) => x.id === "galactic_legends" || x.id === "legendary"
    )
    .reduce((acc: any[], node: FarmingNode) => {
      node.characters.forEach((char) => {
        (char?.prerequisites ?? []).forEach((requirement) => {
          const idMatch = requirement.id === unit.id;

          const tagsMatch = (() => {
            if ((requirement?.tags ?? []).length === 0) {
              return false;
            }
            return (requirement?.tags ?? []).every((tag) => {
              if (tag === "is_ship") {
                return unit.isShip;
              } else if (tag.includes("!")) {
                const notTag = tag.replace("!", "");
                if (notTag === "is_ship") {
                  return !unit.isShip;
                } else {
                  return !unit.categories.includes(notTag);
                }
              } else {
                return unit.categories.includes(tag);
              }
            });
          })();

          const alreadyExists = checkList.find((x) => x.id === char.id);

          if (
            !alreadyExists &&
            (idMatch || (tagsMatch && char.id !== unit.id))
          ) {
            acc.push({
              id: unit.id,
              ...requirement,
              requirementId: char.id,
            });
          }
        });
      });
      return acc;
    }, []);
  return _.uniqBy(list, "requirementId");
}
