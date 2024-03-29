import { v4 as uuid } from "uuid";
import moment from "moment";

import store from "vuex-store/store";
import { IPrerequisite, IPrerequisiteItem } from "types/shards";
import { unvue } from "utils";
import { totalProgress } from "types/unit";
import { ISettings } from "types/player";

type tGoalUnit = {
  id: string;
  type: IPrerequisiteItem["type"];
  value: number;
};
export interface IGoal {
  id?: string;
  name: string;
  list?: tGoalUnit[];
  settings?: ISettings;
}

export class Goal {
  private _id;
  private _name: string;
  private _list: tGoalUnit[];
  private _settings?: ISettings;
  private _type: "player" | "guild";
  public tempName: string = "";
  public isEditing: boolean = false;

  constructor(data: IGoal, type: "player" | "guild" = "player") {
    this._id = data.id ?? uuid();
    this._name = data.name;
    this.tempName = data.name;
    this._list = data.list ?? [];
    this._settings = data.settings ?? {
      startPercent: 0,
      startDate: moment().format("YYYY-MM-DD"),
      assaultBattles: { ct1: 0, ct2: 0, ct3: 0 },
      conquest: {
        difficulty: "easy",
        box: "box1",
      },
      gc: {
        box: "box1",
      },
      gac: {
        league: "carbonite",
        division: 1,
        rank: "rank8",
      },
    };
    this._type = type;
  }

  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public set name(val: string) {
    this._name = val;
  }
  public get list(): IPrerequisite[] {
    return this._list.map((unit) => {
      return {
        id: unit.id,
        requirement: {
          value: unit.value,
          type: unit.type,
        },
        // prerequisites: [] //todo for nested requirements
      };
    });
  }

  public get daysRemaining(): number {
    if (this.settings.calculateCompletion) {
      const today = moment();
      const start = moment(this.settings.startDate);
      const percentPerDay =
        (this.progress - (this.settings?.startPercent ?? 0)) /
        today.diff(start, "days");
      const percentRemaining = 100 - this.progress;
      return Math.round(percentRemaining / percentPerDay);
    } else {
      const x = moment(this.settings.completionDate).diff(moment(), "days");
      return x;
    }
  }

  public get progress() {
    return totalProgress(this.list, "requirement");
  }

  public get settings(): ISettings {
    return unvue(this._settings);
  }

  public sanitize(): IGoal {
    return unvue({
      id: this._id,
      name: this._name,
      list: this._list,
      settings: this._settings,
    });
  }

  public async save(shouldRefresh: boolean = false): Promise<void> {
    await store.dispatch(`${this._type}/saveGoals`, shouldRefresh);
  }

  public async saveName(): Promise<void> {
    this._name = this.tempName;
    this.isEditing = false;
    await this.save(false);
  }

  public saveRequirement(
    unitId: string,
    type: IPrerequisiteItem["type"],
    value: number
  ) {
    const match = this._list.find((x) => x.id === unitId);
    if (match) {
      match.type = type;
      match.value = value;
      this.save(false);
    }
  }

  public async saveSettings(data: any): Promise<void> {
    this._settings = data;
    this.isEditing = false;
    await this.save();
  }

  public addUnit(id: string, type: IPrerequisiteItem["type"], value: number) {
    const exists = this._list.some((x) => x.id === id);

    if (id && type && value && !exists) {
      this._list.push({
        id,
        type,
        value,
      });
      this.save(true);
    }
  }

  public editUnit(id, type: IPrerequisiteItem["type"], value: number) {
    const exists = this._list.find((x) => x.id === id);

    if (exists) {
      exists.type = type;
      exists.value = value;
      this.save(false);
    }
  }

  public remove(id: string) {
    const index = this._list.findIndex((x) => x.id === id);
    if (index > -1) {
      this._list.splice(index, 1);
      this.save(false);
    }
  }
}

export interface iGoalPlayer {
  units: iGoalUnit[];
  name: string;
  allyCode: number;
  totalGP: number;
}

export interface iGoalUnit {
  relic_tier: number;
  stars: number;
  base_id: string;
  name: string;
  gear_level: number;
  power: number;
}
