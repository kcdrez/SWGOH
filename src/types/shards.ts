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

export interface FarmingNode {
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
  nodes: Node[];
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
