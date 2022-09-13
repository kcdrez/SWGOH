import { v4 as uuid } from "uuid";

import store from "vuex-store/store";
import { IPrerequisite, IPrerequisiteItem } from "types/shards";

type tGoalUnit = {
  id: string;
  type: IPrerequisiteItem["type"];
  value: number;
};
export interface IGoal {
  id?: string;
  name: string;
  list?: tGoalUnit[];
}

export class Goal {
  private _id;
  private _name: string;
  private _list: tGoalUnit[];
  public tempName: string = "";
  public isEditing: boolean = false;

  constructor(data: IGoal) {
    this._id = data.id ?? uuid();
    this._name = data.name;
    this.tempName = data.name;
    this._list = data.list ?? [];
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

  public sanitize(): IGoal {
    return {
      id: this._id,
      name: this._name,
      list: this._list,
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
