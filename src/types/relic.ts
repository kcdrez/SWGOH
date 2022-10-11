import { round2Decimals } from "utils";
import store from "vuex-store/store";

export const maxRelicLevel = 9;

export interface IRelic {
  id: string;
  location: ILocation;
  dropRate?: number;
  amount: AmountConfigType;
  image: string;
  name: string;
  rarity: number;
  neededBy?: { name: string; id: string; amount: number }[];
}

export class Relic {
  private _id: string;
  private _location: ILocation;
  private _dropRate?: number;
  private _amount: AmountConfigType;
  private _image: string;
  private _name: string;
  private _rarity: number;
  private _neededBy?: { name: string; id: string; amount: number }[];

  constructor(data: IRelic) {
    this._id = data.id;
    this._location = data.location;
    this._dropRate = data.dropRate;
    this._amount = data.amount;
    this._image = data.image;
    this._name = data.name;
    this._rarity = data.rarity;
    this._neededBy = data.neededBy || [];
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
  public get rarity() {
    return this._rarity;
  }
  public get location() {
    return this._location;
  }
  public get amount() {
    return this._amount;
  }
  public get dropRate() {
    return this._dropRate;
  }
  public get neededBy() {
    return this._neededBy;
  }
  public set neededBy(val) {
    this._neededBy = val;
  }
  public get owned() {
    return store.state.relic.ownedRelics[this.id] || 0;
  }
  public set owned(val) {
    store.dispatch("relic/saveOwnedCount", {
      count: val,
      id: this.id,
    });
  }

  public addNeededBy(unit: { id: string; name: string; amount: number }) {
    const match = this._neededBy?.find((x) => x.id === unit.id);
    if (!match) {
      this._neededBy?.push(unit);
    }
  }

  public progress(arr: ITargetRange[]) {
    return this.owned / this.amountNeeded(arr);
  }

  public percent(arr: ITargetRange[]) {
    if (this.amountNeeded(arr) <= 0) {
      return 100;
    }

    const val = (this.owned / this.amountNeeded(arr)) * 100;
    if (val >= 100) {
      return 100;
    } else {
      return round2Decimals(val);
    }
  }

  public timeEstimation(arr: ITargetRange[]): number {
    const amountNeeded: number = this.amountNeeded(arr);
    const remaining: number = amountNeeded - this.owned;

    if (remaining > 0) {
      const totalEnergy =
        120 +
        45 +
        120 * store.state.relic.refreshes.cantina -
        store.state.relic.energy.cantina;
      const triesPerDay = this.location.energy
        ? totalEnergy / this.location.energy
        : 0;
      const amountPerDay = this.dropRate ? triesPerDay * this.dropRate : 0;
      return amountPerDay === 0 ? -1 : Math.ceil(remaining / amountPerDay);
    } else if (amountNeeded === 0 && remaining > 0) {
      return -1;
    } else {
      return 0;
    }
  }

  public amountNeeded(arr: ITargetRange[]) {
    let amount = 0;

    arr.forEach(({ level, target }) => {
      for (let i = level + 1; i <= target; i++) {
        if (i in this.amount) {
          amount += this.amount[i];
        }
      }
    });
    return amount;
  }

  public totalAmountNeeded(target: number) {
    let amount = 0;
    // console.log(this.id, target, this.amount);

    for (let i = 0; i <= target; i++) {
      if (i in this.amount) {
        amount += this.amount[i];
      }
    }
    return amount;
  }

  public percentApplied(curLevel: number, target: number) {
    const totalNeeded = this.totalAmountNeeded(target);
    const currentApplied = this.totalAmountNeeded(curLevel);
    const dropRate = this?.dropRate ?? 1;

    if (totalNeeded <= 0) {
      return 100;
    } else if (currentApplied >= totalNeeded) {
      return 100;
    } else {
      return (currentApplied / dropRate / (totalNeeded / dropRate)) * 100;
    }
  }
}

export type RelicConfigType = {
  [key: string]: Relic;
};

export type OwnedRelicConfig = {
  [key: string]: number;
};

type AmountConfigType = {
  [key: number]: number;
};

interface ILocation {
  node: string;
  energy?: number;
}

export interface ITargetRange {
  level: number;
  target: number;
}
