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
  table: "Light" | "Dark" | "Fleet" | "Cantina";
  difficulty: "Hard" | "Normal" | "";
  map: number;
  mission: string;
  characters: { id: string; dropRate: number }[];
  gear: any[];
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
};

export type Node = {
  id: string;
  count: number;
};

export interface NodePayload extends UnitNodeData {
  id: string;
  count?: number;
}
