import { v4 as uuid } from "uuid";
import moment from "moment";

import store from "vuex-store/store";
import { IPrerequisite, IPrerequisiteItem } from "types/shards";
import { unvue } from "utils";

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

interface ISettings {
  startPercent: number;
  startDate: string;
  assaultBattles: number;
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
      assaultBattles: 0,
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
    console.log(this.sanitize());
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
