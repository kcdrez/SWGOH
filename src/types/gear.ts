export interface Gear {
  base_id: string;
  image: string;
  name: string;
  owned: number;
  amount: number;
  lookupMissionList: Mission[];
}

export interface Mission {
  missionIdentifier: MissionNode;
}

type campaignTypes = {
  //campaignId
  C01D: string;
  C01L: string;
  C01SP: string;
};

type mapTypes = {
  //mapId
  M01: string;
  M02: string;
  M03: string;
  M04: string;
  M05: string;
  M06: string;
  M07: string;
  M08: string;
  M09: string;
  M010: string;
  M011: string;
  M012: string;
  CHALLENGES: string;
};

type missionTypes = {
  //missionId
  Mi01: string;
  Mi02: string;
  Mi03: string;
  Mi04: string;
  Mi05: string;
  Mi06: string;
  Mi07: string;
  Mi08: string;
  Mi09: string;
  Mi10: string;
  Mi11: string;
  Mi12: string;
};

type difficultyTypes = {
  4: string;
  5: string;
};

type nodeTypes = {
  EQUIPMENT_STRENGTH: string;
  EQUIPMENT_INTELLIGENCE: string;
  EQUIPMENT_AGILITY: string;
};

interface MissionNode {
  campaignId: keyof campaignTypes;
  campaignNodeDifficulty: keyof difficultyTypes;
  campaignMapId: keyof mapTypes;
  campaignMissionId: keyof missionTypes;
  campaignNodeId: keyof nodeTypes;
}

export type ConfigType = {
  [key: string]: {
    owned: number;
    irrelevant: boolean;
  };
};
/*
{
  id: {
    owned: 0,
    irrelevant: true
  }
}
*/

export type OwnedCount = {
  count: number;
  base_id: string;
  irrelevant: boolean;
};
