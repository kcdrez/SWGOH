import store from "../vuex-store/store";
import { round2Decimals, unvue } from "../utils";
import {
  challenges,
  difficultyIds,
  mapIds,
  missionIds,
  tableIds,
} from "./locationMapping";

export const maxGearLevel = 13;
export interface IGear {
  id: string;
  image: string;
  name: string;
  lookupMissionList: Mission[];
  tier: number;
  ingredients: IIngredient[];
  mark: string;
  recipes: IRecipe[];
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
  id: string;
  name: string;
  amount: number;
}

export class Gear {
  private _id: string;
  private _image: string;
  private _name: string;
  private _mark: string;
  private _amount: number = 0;
  private _lookupMissionList: Mission[];
  private _tier: number;
  private _neededBy: INeededBy[] = [];
  private _ingredients: IIngredient[];
  private _recipes: IRecipe[];

  constructor(data: IGear) {
    this._id = data.id;
    this._image = data.image;
    this._name = data.name;
    this._mark = data.mark;
    this._lookupMissionList = data.lookupMissionList;
    this._tier = data.tier;
    this._ingredients = data.ingredients;
    this._recipes = data.recipes;
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
  public get amount() {
    return this._amount;
  }
  public set amount(val) {
    this._amount = val;
  }
  public get progress() {
    return this.owned / this.amount;
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
    return this.amount - this.owned;
  }
  public get missionList() {
    return this._lookupMissionList;
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
      lookupMissionList: this.missionList,
      tier: this.tier,
      ingredients: this.ingredients,
      mark: this.mark,
      recipes: this.recipes,
    });
  }

  public get locations(): string[] {
    const locations: string[] = [];

    this.missionList.forEach((mission) => {
      const {
        campaignId,
        campaignNodeDifficulty,
        campaignMapId,
        campaignMissionId,
        campaignNodeId,
      } = mission.missionIdentifier;
      const difficulty: any = difficultyIds[campaignNodeDifficulty];
      const table: any = tableIds[campaignId];
      const level: any = mapIds[campaignMapId];
      const node: any = missionIds[campaignMissionId];

      if (campaignMapId === "CHALLENGES") {
        const label = `Daily Challenges (${challenges[campaignNodeId]})`;
        if (!locations.includes(label)) {
          locations.push(label);
        }
      } else if (table) {
        locations.push(`${table} ${level}-${node} (${difficulty})`);
      }
    });
    return locations.sort((a, b) => (a > b ? 1 : -1));
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

      this.missionList.forEach((mission) => {
        const {
          campaignId,
          campaignNodeDifficulty,
          campaignMapId,
          campaignMissionId,
          campaignNodeId,
        } = mission.missionIdentifier;

        if (["C01SP", "C01D", "C01L"].includes(campaignId)) {
          let missionEnergy = 1;
          const node = Number(campaignMissionId.replace(/\D/g, ""));

          if (node <= 4) {
            missionEnergy = 6;
          } else if (node >= 6) {
            missionEnergy = 8;
          } else if (node >= 9) {
            missionEnergy = 10;
          }

          if (campaignNodeDifficulty === 5) {
            missionEnergy *= 2;
          }

          if (missionEnergy < energy) {
            const dropRate = 0.2; //todo
            const refreshes = ["C01D", "C01L"].includes(campaignId)
              ? store.state.gear.refreshes.standard
              : store.state.gear.refreshes.fleet;
            const extraEnergy = ["C01D", "C01L"].includes(campaignId)
              ? 135
              : 45;
            const otherEnergy = ["C01D", "C01L"].includes(campaignId)
              ? store.state.gear.energy.standard
              : store.state.gear.energy.fleet;
            const totalEnergy =
              240 + extraEnergy + 120 * refreshes - otherEnergy;

            const chancesPerDay = totalEnergy / missionEnergy;
            const piecesPerDay = chancesPerDay * dropRate;
            totalDays = this.remaining / piecesPerDay;
            energy = missionEnergy;
          }
        } else if (campaignMapId === "CHALLENGES") {
          energy = 0;
          totalDays = this.remaining / (60 / 7);
        }
      });
      return Math.ceil(totalDays);
    } else {
      return 0;
    }
  }

  public clone(data: { amount?: number; neededBy?: INeededBy[] }): Gear {
    const clone = new Gear(this.sanitize);
    clone.amount = data.amount || 0;
    clone.neededBy = data?.neededBy || [];
    return clone;
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
