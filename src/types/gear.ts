import store from "vuex-store/store";
import { round2Decimals, unvue } from "utils";
import { FarmingNode } from "./shards";

export const maxGearLevel = 13;
export interface IGear {
  id: string;
  image: string;
  name: string;
  // lookupMissionList: Mission[];
  locations: ILocation[];
  tier: number;
  ingredients: IIngredient[];
  mark: string;
  recipes: IRecipe[];
  scavenger?: IScavenger[];
}

export interface IRecipe {
  base_id: string;
  result_id: string;
  cost: number;
  ingredients: IIngredient[];
}

export interface IIngredient {
  gear: string;
  amount: number;
}

export interface INeededBy {
  id: string; //unit id
  name: string; //unit name
  totalAmount: number;
  gearLevels: { amount: number; level: number }[];
}

export interface IScavenger {
  id: string;
  count: number;
  priority?: number;
  nodes?: string[];
  notes?: string;
}

interface ILocationNode extends ILocation {
  nodeData: FarmingNode | null;
}
export class Gear {
  private _id: string;
  private _image: string;
  private _name: string;
  private _mark: string;
  private _totalAmount: number = 0;
  private _locations: ILocationNode[];
  private _tier: number;
  private _neededBy: INeededBy[] = [];
  private _ingredients: IIngredient[];
  private _recipes: IRecipe[];
  private _scavenger?: IScavenger[];

  constructor(data: IGear) {
    this._id = data.id;
    this._image = data.image;
    this._name = data.name;
    this._mark = data.mark;
    this._locations = data.locations.map((location) => {
      const match = store.state.shards.shardFarming.find(
        (x) => x.id === location.id
      );
      if (match) {
        return {
          ...location,
          nodeData: match,
        };
      } else {
        return {
          ...location,
          nodeData: null,
        };
      }
    });
    this._tier = data.tier;
    this._ingredients = data.ingredients;
    this._recipes = data.recipes;
    this._scavenger = data.scavenger;
  }

  public get id() {
    return this._id;
  }
  public get image() {
    return this._image;
  }
  public get name() {
    return this._name;
  }
  public get owned() {
    return store.state.gear.gearConfig[this.id]?.owned || 0;
  }
  public set owned(val) {
    store.dispatch("gear/saveOwnedCount", {
      count: val,
      id: this.id,
      irrelevant: this.irrelevant,
    });
  }
  public get totalAmount() {
    return this._totalAmount;
  }
  public set totalAmount(val) {
    this._totalAmount = val;
  }
  public get progress() {
    return this.owned / this.totalAmount;
  }
  public get percent() {
    const val = this.progress * 100;
    if (val >= 100) {
      return 100;
    } else {
      return round2Decimals(val);
    }
  }
  public get remaining() {
    return this.totalAmount - this.owned;
  }
  public get locations() {
    return this._locations;
  }
  public get locationLabels() {
    return this._locations.map((location) => {
      if (location.nodeData) {
        return `${location.nodeData.label}`;
      } else {
        return `${location.id}`;
      }
      return ``;
    });
  }
  public get tier() {
    return this._tier;
  }
  public get neededBy() {
    return this._neededBy;
  }
  public set neededBy(val) {
    this._neededBy = val;
  }
  public get ingredients() {
    return this._ingredients;
  }
  public get recipes() {
    return this._recipes;
  }
  public get mark() {
    return this._mark;
  }
  public get markLevel() {
    switch (this._mark) {
      case "Mk I":
        return 1;
      case "Mk II":
        return 2;
      case "Mk III":
        return 3;
      case "Mk IV":
        return 4;
      case "Mk V":
        return 5;
      case "Mk VI":
        return 6;
      case "Mk VII":
        return 7;
      case "Mk VIII":
        return 8;
      case "Mk IX":
        return 9;
      case "Mk X":
        return 10;
      case "Mk XI":
        return 11;
      case "Mk XII":
        return 12;
      case "Mk XIII":
        return 13;
      case "Mk XIV":
        return 14;
      case "Mk XV":
        return 15;
      default:
        return 0;
    }
  }
  public get scavenger() {
    return this._scavenger ?? [];
  }
  public get irrelevant(): boolean {
    const gearConfig = store.state.gear.gearConfig;
    if (this.id in gearConfig) {
      return gearConfig[this.id].irrelevant;
    }
    return false;
  }
  public set irrelevant(value) {
    store.dispatch("gear/saveOwnedCount", {
      id: this.id,
      count: this.owned,
      irrelevant: value,
    });
  }

  public get sanitize(): IGear {
    return unvue({
      id: this.id,
      image: this.image,
      name: this.name,
      locations: this._locations,
      tier: this.tier,
      ingredients: this.ingredients,
      mark: this.mark,
      recipes: this.recipes,
    });
  }

  public get timeEstimation(): number {
    if (this.irrelevant) {
      return 0;
    } else if (this.locations.length <= 0) {
      return -1;
    }

    if (this.remaining > 0) {
      let energy = 100;
      let totalDays = 0;

      this._locations.forEach((location) => {
        if (location.nodeData) {
          if (
            ["Light Side", "Dark Side", "Fleet"].includes(
              location.nodeData.table
            )
          ) {
            const missionEnergy = location.nodeData.energy ?? 100;
            if (missionEnergy < energy) {
              const dropRate = location.nodeData.dropRate;
              const refreshes = ["Light Side", "Dark Side"].includes(
                location.nodeData.table
              )
                ? store.state.gear.refreshes?.standard ?? 0
                : store.state.gear.refreshes?.fleet ?? 0;
              const extraEnergy = ["Light Side", "Dark Side"].includes(
                location.nodeData.table
              )
                ? 135
                : 45;
              const otherEnergy = ["Light Side", "Dark Side"].includes(
                location.nodeData.table
              )
                ? store.state.gear.energy?.standard ?? 0
                : store.state.gear.energy?.fleet ?? 0;
              const totalEnergy =
                240 + extraEnergy + 120 * refreshes - otherEnergy;
              const chancesPerDay = totalEnergy / missionEnergy;
              const piecesPerDay = chancesPerDay * dropRate;
              totalDays = this.remaining / piecesPerDay;
              energy = missionEnergy;
            }
          } else if (
            ["challenges_tac", "challenges_str", "challenges_agi"].includes(
              location.nodeData.id
            )
          ) {
            energy = 0;
            totalDays = this.remaining / (60 / 7);
          } else {
            //unfarmable, raid only gear probably
            totalDays = totalDays > 0 ? totalDays : -1;
          }
        }
      });
      return Math.ceil(totalDays);
    } else {
      return 0;
    }
  }

  public clone(data: { totalAmount?: number; neededBy?: INeededBy[] }): Gear {
    const clone = new Gear(this.sanitize);
    clone.totalAmount = data.totalAmount || 0;
    clone.neededBy = data?.neededBy || [];
    return clone;
  }
}

export interface Mission {
  missionIdentifier: MissionNode;
}

export interface ILocation {
  id: string;
  dropRate?: number;
  slot?: number;
  count?: number;
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

export type EnergyType = {
  standard?: number;
  fleet?: number;
  cantina?: number;
};

export type EnergyConfig = {
  energy: EnergyType;
  refreshes: EnergyType;
};
