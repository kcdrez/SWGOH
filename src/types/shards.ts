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
  prerequisites?: {
    id?: string;
    requirement: string;
    tags?: string[];
    recommended: string;
  }[];
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
