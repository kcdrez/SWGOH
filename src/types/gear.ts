export const maxGearLevel = 13;

export interface IGear {
  id: string;
  image: string;
  name: string;
  owned: number;
  amount: number;
  lookupMissionList: Mission[];
  tier: number;
  neededBy?: { name: string; id: string }[];
}

export class Gear {
  private _id: string;
  private _image: string;
  private _name: string;
  private _owned: number;
  private _amount: number;
  private _lookupMissionList: Mission[];
  private _tier: number;
  private _neededBy?: { name: string; id: string }[];

  constructor(data: IGear) {
    this._id = data.id;
    this._image = data.image
    this._name = data.name
    this._owned = data.owned
    this._amount = data.amount
    this._lookupMissionList = data.lookupMissionList
    this._tier = data.tier
    this._neededBy = data.neededBy
  }

  public get id() {
    return this._id
  }
  public get image() {
    return this._image
  }
  public get name() {
    return this._name
  }
  public get owned() {
    return this._owned
  }
  public get amount() {
    return this._amount
  }
  public set amount(val) {
    this._amount = val
  }
  public get missionList() {
    return this._lookupMissionList
  }
  public get tier() {
    return this._tier
  }
  public get neededBy() {
    return this._neededBy
  }

  public get sanitize(): IGear {
    return {
      id: this.id,
      image: this.image,
      name: this.name,
      owned: this.owned,
      amount: this.amount,
      lookupMissionList: this.missionList,
      tier: this.tier,
      neededBy: this.neededBy
    }
  }
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

export type OwnedCount = {
  count: number;
  id: string;
  irrelevant?: boolean;
};
