import { v4 as uuid } from "uuid";
import moment from "moment";

import store from "vuex-store/store";
import { IPrerequisite, IPrerequisiteItem } from "types/shards";
import { unvue } from "utils";
import { totalProgress } from "types/unit";

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

export interface ISettings {
  startPercent?: number;
  startDate?: string;
  assaultBattles: {
    ct1: number;
    ct2: number;
    ct3: number;
  };
  conquest: {
    difficulty: "easy" | "normal" | "hard";
    box: "box1" | "box2" | "box3" | "box4" | "box5" | "box6" | "box7";
  };
  gc: {
    box:
      | "box1"
      | "box2"
      | "box3"
      | "box4"
      | "box5"
      | "box6"
      | "box7"
      | "box8"
      | "box9"
      | "box10";
  };
  gac: {
    league: "kyber" | "aurodium" | "chromium" | "bronzium" | "carbonite";
    division: number;
    rank:
      | "rank1"
      | "rank2"
      | "rank3"
      | "rank4"
      | "rank5"
      | "rank6"
      | "rank7"
      | "rank8";
  };
  calculateCompletion?: boolean;
  completionDate?: string;
}

export class Goal {
  private _id;
  private _name: string;
  private _list: tGoalUnit[];
  private _settings?: ISettings;
  public tempName: string = "";
  public isEditing: boolean = false;

  constructor(data: IGoal) {
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
    return {
      id: this._id,
      name: this._name,
      list: this._list,
      settings: this._settings,
    };
  }

  public async save(): Promise<void> {
    await store.dispatch("player/saveGoals");
  }

  public async saveName(): Promise<void> {
    this._name = this.tempName;
    this.isEditing = false;
    await this.save();
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
      this.save();
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
      this.save();
    }
  }

  public remove(id: string) {
    const index = this._list.findIndex((x) => x.id === id);
    if (index > -1) {
      this._list.splice(index, 1);
      this.save();
    }
  }
}
