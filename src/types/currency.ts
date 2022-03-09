import _ from "lodash";

import { apiClient } from "../api/api-client";
import store from "../vuex-store/store";
import { Unit } from "./unit";

export const currencyTypeList: CurrencyTypeConfig[] = [
  "get1",
  "get2",
  "shardCurrency",
  "cantinaBattleCurrency",
  "guildStoreCurrency",
  "squadArenaCurrency",
  "galacticWarCurrency",
  "fleetArenaCurrency",
];

export type CurrencyTypeConfig =
  | "get1"
  | "get2"
  | "shardCurrency"
  | "cantinaBattleCurrency"
  | "guildStoreCurrency"
  | "squadArenaCurrency"
  | "galacticWarCurrency"
  | "fleetArenaCurrency";
export interface IWallet {
  get1?: number;
  get2?: number;
  shardCurrency?: number;
  cantinaBattleCurrency?: number;
  guildStoreCurrency?: number;
  squadArenaCurrency?: number;
  galacticWarCurrency?: number;
  fleetArenaCurrency?: number;
}

export class Wallet {
  private _get1?: number;
  private _get2?: number;
  private _shardCurrency?: number;
  private _cantinaBattleCurrency?: number;
  private _guildStoreCurrency?: number;
  private _squadArenaCurrency?: number;
  private _galacticWarCurrency?: number;
  private _fleetArenaCurrency?: number;

  constructor(data: IWallet) {
    this._get1 = data?.get1;
    this._get2 = data?.get2;
    this._shardCurrency = data?.shardCurrency;
    this._cantinaBattleCurrency = data?.cantinaBattleCurrency;
    this._guildStoreCurrency = data?.guildStoreCurrency;
    this._squadArenaCurrency = data?.squadArenaCurrency;
    this._galacticWarCurrency = data?.galacticWarCurrency;
    this._fleetArenaCurrency = data?.fleetArenaCurrency;
  }

  public get get1() {
    return this._get1 || 0;
  }
  public set get1(val) {
    this._get1 = val;
    this.save();
    updateUnits("get1");
  }
  public get get2() {
    return this._get2 || 0;
  }
  public set get2(val) {
    this._get2 = val;
    this.save();
    updateUnits("get2");
  }
  public get shardCurrency() {
    return this._shardCurrency;
  }
  public set shardCurrency(val) {
    this._shardCurrency = val;
    this.save();
    updateUnits("get1");
  }
  public get cantinaBattleCurrency() {
    return this._cantinaBattleCurrency;
  }
  public set cantinaBattleCurrency(val) {
    this._cantinaBattleCurrency = val;
    this.save();
    updateUnits("cantinaBattleCurrency");
  }
  public get guildStoreCurrency() {
    return this._guildStoreCurrency;
  }
  public set guildStoreCurrency(val) {
    this._guildStoreCurrency = val;
    this.save();
    updateUnits("guildStoreCurrency");
  }
  public get squadArenaCurrency() {
    return this._squadArenaCurrency;
  }
  public set squadArenaCurrency(val) {
    this._squadArenaCurrency = val;
    this.save();
    updateUnits("squadArenaCurrency");
  }
  public get galacticWarCurrency() {
    return this._galacticWarCurrency;
  }
  public set galacticWarCurrency(val) {
    this._galacticWarCurrency = val;
    this.save();
    updateUnits("galacticWarCurrency");
  }
  public get fleetArenaCurrency() {
    return this._fleetArenaCurrency;
  }
  public set fleetArenaCurrency(val) {
    this._fleetArenaCurrency = val;
    this.save();
    updateUnits("fleetArenaCurrency");
  }

  private save = _.debounce(() => {
    apiClient.saveWallet(store.state.player.player?.id, this.sanitize());
  }, 500);

  private sanitize(): IWallet {
    return {
      get1: this.get1,
      get2: this.get2,
      shardCurrency: this.shardCurrency,
      cantinaBattleCurrency: this.cantinaBattleCurrency,
      guildStoreCurrency: this.guildStoreCurrency,
      squadArenaCurrency: this.squadArenaCurrency,
      galacticWarCurrency: this.galacticWarCurrency,
      fleetArenaCurrency: this.fleetArenaCurrency,
    };
  }
}

export interface IDailyCurrency {
  shardCurrency?: number;
  cantinaBattleCurrency?: number;
  guildStoreCurrency?: number;
  squadArenaCurrency?: number;
  galacticWarCurrency?: number;
  fleetArenaCurrency?: number;
}
export class DailyCurrency {
  private _shardCurrency?: number;
  private _cantinaBattleCurrency?: number;
  private _guildStoreCurrency?: number;
  private _squadArenaCurrency?: number;
  private _galacticWarCurrency?: number;
  private _fleetArenaCurrency?: number;

  constructor(data: IDailyCurrency) {
    this._shardCurrency = data?.shardCurrency;
    this._cantinaBattleCurrency = data?.cantinaBattleCurrency;
    this._guildStoreCurrency = data?.guildStoreCurrency;
    this._squadArenaCurrency = data?.squadArenaCurrency;
    this._galacticWarCurrency = data?.galacticWarCurrency;
    this._fleetArenaCurrency = data?.fleetArenaCurrency;
  }

  public get get1(): number {
    return store.getters["currency/dailyAvgGET2"];
  }
  public get get2(): number {
    return store.getters["currency/dailyAvgGET1"];
  }
  public get shardCurrency() {
    return this._shardCurrency || 0;
  }
  public set shardCurrency(val) {
    this._shardCurrency = val;
    this.save();
    this.updateUnits("shardCurrency");
  }
  public get cantinaBattleCurrency() {
    return this._cantinaBattleCurrency || 0;
  }
  public set cantinaBattleCurrency(val) {
    this._cantinaBattleCurrency = val;
    this.save();
    this.updateUnits("cantinaBattleCurrency");
  }
  public get guildStoreCurrency() {
    return this._guildStoreCurrency || 0;
  }
  public set guildStoreCurrency(val) {
    this._guildStoreCurrency = val;
    this.save();
    this.updateUnits("guildStoreCurrency");
  }
  public get squadArenaCurrency() {
    return this._squadArenaCurrency || 0;
  }
  public set squadArenaCurrency(val) {
    this._squadArenaCurrency = val;
    this.save();
    this.updateUnits("squadArenaCurrency");
  }
  public get galacticWarCurrency() {
    return this._galacticWarCurrency || 0;
  }
  public set galacticWarCurrency(val) {
    this._galacticWarCurrency = val;
    this.save();
    this.updateUnits("galacticWarCurrency");
  }
  public get fleetArenaCurrency() {
    return this._fleetArenaCurrency || 0;
  }
  public set fleetArenaCurrency(val) {
    this._fleetArenaCurrency = val;
    this.save();
    this.updateUnits("fleetArenaCurrency");
  }

  private save = _.debounce(() => {
    apiClient.saveDailyCurrency(store.state.player.player?.id, this.sanitize());
  }, 500);

  private sanitize(): IWallet {
    return {
      shardCurrency: this.shardCurrency,
      cantinaBattleCurrency: this.cantinaBattleCurrency,
      guildStoreCurrency: this.guildStoreCurrency,
      squadArenaCurrency: this.squadArenaCurrency,
      galacticWarCurrency: this.galacticWarCurrency,
      fleetArenaCurrency: this.fleetArenaCurrency,
    };
  }
  public updateUnits = updateUnits;
}

function updateUnits(currencyType: CurrencyTypeConfig) {
  store.getters["shards/unitFarmingList"].forEach((unit: Unit) => {
    if (unit.currencyTypes.includes(currencyType)) {
      unit.calculateEstimation();
    }
  });
}
