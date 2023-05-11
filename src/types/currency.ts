import _ from "lodash";

import { apiClient } from "../api/api-client";
import store from "vuex-store/store";
import { Unit, unitsByPriority } from "./unit";

export const currencyTypeList: CurrencyTypeConfig[] = [
  "get1",
  "get2",
  "get3",
  "shardCurrency",
  "cantinaBattleCurrency",
  "guildStoreCurrency",
  "squadArenaCurrency",
  "galacticWarCurrency",
  "fleetArenaCurrency",
  "raid1",
  "raid2",
  "raid3",
];

export type CurrencyTypeConfig =
  | "get1"
  | "get2"
  | "get3"
  | "shardCurrency"
  | "cantinaBattleCurrency"
  | "guildStoreCurrency"
  | "squadArenaCurrency"
  | "galacticWarCurrency"
  | "fleetArenaCurrency"
  | "raid1"
  | "raid2"
  | "raid3";
export interface IWallet {
  get1?: number;
  get2?: number;
  get3?: number;
  shardCurrency?: number;
  cantinaBattleCurrency?: number;
  guildStoreCurrency?: number;
  squadArenaCurrency?: number;
  galacticWarCurrency?: number;
  fleetArenaCurrency?: number;
  raid1?: number;
  raid2?: number;
  raid3?: number;
}

export class Wallet {
  private _get1?: number;
  private _get2?: number;
  private _get3?: number;
  private _shardCurrency?: number;
  private _cantinaBattleCurrency?: number;
  private _guildStoreCurrency?: number;
  private _squadArenaCurrency?: number;
  private _galacticWarCurrency?: number;
  private _fleetArenaCurrency?: number;
  private _raid1?: number;
  private _raid2?: number;
  private _raid3?: number;

  constructor(data: IWallet) {
    this._get1 = data?.get1;
    this._get2 = data?.get2;
    this._get3 = data?.get3;
    this._shardCurrency = data?.shardCurrency;
    this._cantinaBattleCurrency = data?.cantinaBattleCurrency;
    this._guildStoreCurrency = data?.guildStoreCurrency;
    this._squadArenaCurrency = data?.squadArenaCurrency;
    this._galacticWarCurrency = data?.galacticWarCurrency;
    this._fleetArenaCurrency = data?.fleetArenaCurrency;
    this._raid1 = data?.raid1;
    this._raid2 = data?.raid2;
    this._raid3 = data?.raid3;
  }

  public get get1() {
    return this._get1 || 0;
  }
  public set get1(val) {
    this._get1 = val;
    this.save();
  }
  public get get2() {
    return this._get2 || 0;
  }
  public set get2(val) {
    this._get2 = val;
    this.save();
  }
  public get get3() {
    return this._get3 || 0;
  }
  public set get3(val) {
    this._get3 = val;
    this.save();
  }
  public get shardCurrency() {
    return this._shardCurrency;
  }
  public set shardCurrency(val) {
    this._shardCurrency = val;
    this.save();
  }
  public get cantinaBattleCurrency() {
    return this._cantinaBattleCurrency;
  }
  public set cantinaBattleCurrency(val) {
    this._cantinaBattleCurrency = val;
    this.save();
  }
  public get guildStoreCurrency() {
    return this._guildStoreCurrency;
  }
  public set guildStoreCurrency(val) {
    this._guildStoreCurrency = val;
    this.save();
  }
  public get squadArenaCurrency() {
    return this._squadArenaCurrency;
  }
  public set squadArenaCurrency(val) {
    this._squadArenaCurrency = val;
    this.save();
  }
  public get galacticWarCurrency() {
    return this._galacticWarCurrency;
  }
  public set galacticWarCurrency(val) {
    this._galacticWarCurrency = val;
    this.save();
  }
  public get fleetArenaCurrency() {
    return this._fleetArenaCurrency;
  }
  public set fleetArenaCurrency(val) {
    this._fleetArenaCurrency = val;
    this.save();
  }
  public get raid1() {
    return this._raid1;
  }
  public set raid1(val) {
    this._raid1 = val;
    this.save();
  }
  public get raid2() {
    return this._raid2;
  }
  public set raid2(val) {
    this._raid2 = val;
    this.save();
  }
  public get raid3() {
    return this._raid3;
  }
  public set raid3(val) {
    this._raid3 = val;
    this.save();
  }

  private save = _.debounce(() => {
    apiClient.saveWallet(store.state.player.player?.id, this.sanitize());
  }, 500);

  private sanitize(): IWallet {
    return {
      get1: this.get1,
      get2: this.get2,
      get3: this.get3,
      shardCurrency: this.shardCurrency,
      cantinaBattleCurrency: this.cantinaBattleCurrency,
      guildStoreCurrency: this.guildStoreCurrency,
      squadArenaCurrency: this.squadArenaCurrency,
      galacticWarCurrency: this.galacticWarCurrency,
      fleetArenaCurrency: this.fleetArenaCurrency,
      raid1: this.raid1,
      raid2: this.raid2,
      raid3: this.raid3,
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
    return store.getters["currency/dailyAvgGET1"];
  }
  public get get2(): number {
    return store.getters["currency/dailyAvgGET2"];
  }
  public get get3(): number {
    return store.getters["currency/dailyAvgGET3"];
  }
  public get shardCurrency() {
    return this._shardCurrency || 0;
  }
  public set shardCurrency(val) {
    this._shardCurrency = val;
    this.save();
  }
  public get cantinaBattleCurrency() {
    return this._cantinaBattleCurrency || 0;
  }
  public set cantinaBattleCurrency(val) {
    this._cantinaBattleCurrency = val;
    this.save();
  }
  public get guildStoreCurrency() {
    return this._guildStoreCurrency || 0;
  }
  public set guildStoreCurrency(val) {
    this._guildStoreCurrency = val;
    this.save();
  }
  public get squadArenaCurrency() {
    return this._squadArenaCurrency || 0;
  }
  public set squadArenaCurrency(val) {
    this._squadArenaCurrency = val;
    this.save();
  }
  public get galacticWarCurrency() {
    return this._galacticWarCurrency || 0;
  }
  public set galacticWarCurrency(val) {
    this._galacticWarCurrency = val;
    this.save();
  }
  public get fleetArenaCurrency() {
    return this._fleetArenaCurrency || 0;
  }
  public set fleetArenaCurrency(val) {
    this._fleetArenaCurrency = val;
    this.save();
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
}

export function estimatedTime(
  unit: Unit,
  currencyTypes: CurrencyTypeConfig[],
  tableNames: string[],
  unitList: Unit[]
): number {
  let totalDays = 0;
  const unitListByPriority = unitsByPriority(unitList, tableNames);
  (currencyTypes as CurrencyTypeConfig[]).forEach((currency) => {
    if (unit.currencyTypes.includes(currency)) {
      const index = unitListByPriority.findIndex((u) => u.id === unit.id);
      const priority = unit.tablePriority(tableNames);

      let currentWallet = store.state.currency.wallet[currency] ?? 0;

      const alreadyCheckedPriorities: number[] = [];

      for (let i = index - 1; i >= 0; i--) {
        const el = unitListByPriority[i];
        const prevPriority = el.tablePriority(tableNames);
        if (
          priority > prevPriority &&
          !alreadyCheckedPriorities.includes(prevPriority) &&
          el.currencyTypes.includes(currency)
        ) {
          const { days, totalCost } = unitEstimated(
            el,
            currentWallet,
            currency
          );
          totalDays += days;
          currentWallet = Math.max(currentWallet - totalCost, 0);
          alreadyCheckedPriorities.push(prevPriority);
        }
      }

      const { days } = unitEstimated(unit, currentWallet, currency);
      totalDays += days;
    }
  });

  return totalDays;
}

function unitEstimated(
  unit: Unit,
  wallet: number,
  currencyType: CurrencyTypeConfig
) {
  let shardsPerDay = 0;
  let costPerShard = 0;
  let totalCost = 0;
  const location = unit.whereToFarm.find(
    (l) => l.currencyType === currencyType
  );
  if (location) {
    const character = location.characters.find((c) => c.id === unit.id);
    if (character && character.shardCount && character.cost) {
      costPerShard = character.cost / character.shardCount;
    }
    totalCost = unit.remainingShards * costPerShard;

    const totalRemainingCost = Math.max(totalCost - wallet, 0);

    const daysToUnlock =
      totalRemainingCost /
      (store.state.currency.dailyCurrency[currencyType] || 1);

    wallet = Math.max(wallet - totalCost, 0);
    shardsPerDay += unit.remainingShards / daysToUnlock;
  }

  return {
    days:
      shardsPerDay === 0 ? 0 : Math.ceil(unit.remainingShards / shardsPerDay),
    totalCost,
  };
}
