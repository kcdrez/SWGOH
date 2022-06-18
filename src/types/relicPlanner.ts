import { round2Decimals } from "../utils";
import store from "../vuex-store/store";
import relicMapping from "./relicMapping";

export class RelicPlanner {
  private _id: string;
  private _challengeGear: ChallengeGear[];
  private _storeGear: StoreGear[];
  private _farmData: IFarmingNodeData;

  constructor(
    id: string,
    challengeGear: IChallengeGear[],
    storeGear: IStoreGear[],
    farmingData: IFarmingNodeData
  ) {
    this._id = id;
    this._challengeGear = challengeGear.map(x => new ChallengeGear(x));
    this._storeGear = storeGear.map(x => new StoreGear(x));
    this._farmData = farmingData;
  }

  public get id() {
    return this._id
  }
  public get label() {
    return relicMapping[this.id].name
  }
  public get challengeGear() {
    return this._challengeGear
  }
  public get storeGear() {
    return this._storeGear
  }
  public get farmingNodeData() {
    return this._farmData
  }
  private get relicTarget() {
    return store.state.relic.calculator.relicTarget
  }
  private get timeline() {
    return store.state.relic.calculator.timeline
  }
  private get totalRelicMats() {
    return relicMapping[this._id].amountNeeded([{ level: 0, target: this.relicTarget }])
  }
  public get remainingRelicPieces() {
    const challengesPieces = this._challengeGear.reduce((total, el) => {
      return total + el.relicPiecesTotal;
    }, 0)
    const storePieces = this._storeGear.reduce((total, el) => {
      return total + el.relicPiecesTotal;
    }, 0)
    return Math.max(0, round2Decimals(this.totalRelicMats - challengesPieces - storePieces))
  }
  public get relicPiecesPerDay() {
    return round2Decimals(this.remainingRelicPieces / this.timeline)
  }
  public get remainingGear() {
    return round2Decimals(this.relicPiecesPerDay / this._farmData.relicSalvage * this._farmData.amountForRelicPiece)
  }
  public get remainingGearPerDay() {
    return round2Decimals(this.remainingGear / this._farmData.dropRate)
  }
  public get totalEnergy() {
    return round2Decimals(this._farmData.energyPerNode * this.remainingGearPerDay)
  }
}

interface IChallengeGear {
  ids: string[];
  location: string;
  totalGear: number;
  percentOfRelicPiece: number
}

class ChallengeGear {
  private _ids: string[];
  private _location: string;
  private _totalGear: number;
  private _percentOfRelicPiece: number;

  constructor({ ids, location, totalGear, percentOfRelicPiece }: IChallengeGear) {
    this._ids = ids;
    this._location = location
    this._totalGear = totalGear
    this._percentOfRelicPiece = percentOfRelicPiece
  }

  private get timeline() {
    return store.state.relic.calculator.timeline
  }
  public get ids() {
    return this._ids;
  }
  public get location() {
    return this._location;
  }
  public get totalGear() {
    return this._totalGear;
  }
  public set totalGear(val) {
    this._totalGear = val;
  }
  public get gearPerDay() {
    return round2Decimals(this._totalGear / this.timeline)
  }
  public get relicPiecesPerDay() {
    return round2Decimals(this.gearPerDay * this._percentOfRelicPiece)
  }
  public get relicPiecesTotal() {
    return round2Decimals(this.relicPiecesPerDay * this.timeline)
  }
}

interface IStoreGear {
  ids: string[];
  location: string;
  purchases: number;
  currencyPerPurchase: number;
  percentOfRelicPiece: number;
  gearPerPurchase: number;
}

class StoreGear {
  private _ids: string[];
  private _location: string;
  private _purchases: number;
  private _currencyPerPurchase: number;
  private _gearPerPurchase: number;
  private _percentOfRelicPiece: number;

  constructor({ ids, location, purchases, currencyPerPurchase, gearPerPurchase, percentOfRelicPiece }: IStoreGear) {
    this._ids = ids;
    this._location = location;
    this._purchases = purchases;
    this._currencyPerPurchase = currencyPerPurchase;
    this._gearPerPurchase = gearPerPurchase;
    this._percentOfRelicPiece = percentOfRelicPiece
  }

  private get timeline() {
    return store.state.relic.calculator.timeline
  }
  public get ids() {
    return this._ids;
  }
  public get location() {
    return this._location;
  }
  public get purchases() {
    return this._purchases;
  }
  public set purchases(val) {
    this._purchases = val;
  }
  public get totalCurrency() {
    return round2Decimals(this._purchases * this._currencyPerPurchase)
  }
  public get totalGear() {
    return round2Decimals(this._purchases * this._gearPerPurchase)
  }
  public get relicPiecesPerDay() {
    return round2Decimals(this._purchases * this._gearPerPurchase * this._percentOfRelicPiece)
  }
  public get relicPiecesTotal() {
    return round2Decimals(this.relicPiecesPerDay * this.timeline)
  }
}

interface IFarmingNodeData {
  ids: string[];
  location: string;
  // nodesPerDay: number;
  dropRate: number;
  energyPerNode: number;
  relicSalvage: number;
  amountForRelicPiece: number;
}

export const tableData: RelicPlanner[] = [new RelicPlanner('carbonite_circuit_board', [{
  ids: ['057Salvage'],
  location: 'challenges_tac',
  totalGear: 0,
  percentOfRelicPiece: 2 / 35
},
{
  ids: ['053Salvage'],
  location: 'challenges_agi',
  totalGear: 0,
  percentOfRelicPiece: 2 / 35
}], [{
  ids: ['036', '053', '060'],
  location: 'guild_store',
  purchases: 0,
  currencyPerPurchase: 100,
  percentOfRelicPiece: 6 / 35,
  gearPerPurchase: 10
}, {
  ids: ['002', '025', '035'],
  location: 'squad_arena_store',
  purchases: 0,
  currencyPerPurchase: 100,
  percentOfRelicPiece: 6 / 35,
  gearPerPurchase: 10
}], {
  ids: ['001', '002', '003', '005', '006'],
  location: 'lightside_normal_1e',
  dropRate: 4,
  energyPerNode: 6,
  relicSalvage: 6,
  amountForRelicPiece: 35
}),
new RelicPlanner('bronzium_wiring', [{
  ids: ['101Salvage', '051Salvage'],
  location: 'challenges_agi',
  totalGear: 0,
  percentOfRelicPiece: 4 / 45
},
{
  ids: ['050Salvage', '135Salvage'],
  location: 'challenges_str',
  totalGear: 0,
  percentOfRelicPiece: 4 / 45
},
{
  ids: ['095Salvage', '054Salvage', '130Salvage'],
  location: 'challenges_tac',
  totalGear: 0,
  percentOfRelicPiece: 4 / 45
}], [{
  ids: ['044', '056', '061', '064'],
  location: 'guild_store',
  purchases: 0,
  currencyPerPurchase: 100,
  percentOfRelicPiece: 20 / 45,
  gearPerPurchase: 5
}, {
  ids: ['049Prototype', '055Prototype'],
  location: 'squad_arena_store',
  purchases: 0,
  currencyPerPurchase: (180 + 150) / 2,
  percentOfRelicPiece: 12 / 35,
  gearPerPurchase: 10
}], {
  ids: ['066'],
  location: 'lightside_normal_7b',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 20,
  amountForRelicPiece: 45
}),
new RelicPlanner('chromium_transistor', [{
  ids: ['123Salvage'],
  location: 'challenges_tac',
  totalGear: 0,
  percentOfRelicPiece: 4 / 45
}], [{
  ids: ['073'],
  location: 'guild_store',
  purchases: 0,
  currencyPerPurchase: 150,
  percentOfRelicPiece: 300 / 45,
  gearPerPurchase: 5
}, {
  ids: ['097PrototypeSalvage'],
  location: 'squad_arena_store',
  purchases: 0,
  currencyPerPurchase: 190,
  percentOfRelicPiece: 6 / 45,
  gearPerPurchase: 5
}], {
  ids: ['066'],
  location: 'fleet_normal_2e',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 6,
  amountForRelicPiece: 45
}),
new RelicPlanner('aurodium_heatsink', [{
  ids: ['117PrototypeSalvage'],
  location: 'challenges_tac',
  totalGear: 0,
  percentOfRelicPiece: 10 / 50
}, {
  ids: ['135Salvage'],
  location: 'challenges_str',
  totalGear: 0,
  percentOfRelicPiece: 10 / 50
}], [{
  ids: ['102Salvage'],
  location: 'guild_store',
  purchases: 0,
  currencyPerPurchase: 280,
  percentOfRelicPiece: (500 / 20) / 50,
  gearPerPurchase: 5
}], {
  ids: ['102Salvage'],
  location: 'lightside_normal_9f',
  dropRate: 0.25,
  energyPerNode: 10,
  relicSalvage: 500 / 20,
  amountForRelicPiece: 50
}),
new RelicPlanner('electrium_conductor', [], [{
  ids: ['159PrototypeSalvage', '164PrototypeSalvage', '163PrototypeSalvage', '162PrototypeSalvage'],
  location: 'guild_events_store1',
  purchases: 0,
  currencyPerPurchase: 400,
  percentOfRelicPiece: 15 / 80,
  gearPerPurchase: 5
}, {
  ids: ['159PrototypeSalvage', '164PrototypeSalvage', '163PrototypeSalvage', '162PrototypeSalvage'],
  location: 'shard_store',
  purchases: 0,
  currencyPerPurchase: 360,
  percentOfRelicPiece: 15 / 80,
  gearPerPurchase: 4
}], {
  ids: ['159PrototypeSalvage'],
  location: 'lightside_normal_9a',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 15,
  amountForRelicPiece: 80
}),
new RelicPlanner('zinbiddle_card', [], [{
  ids: ['170PrototypeSalvage', '166PrototypeSalvage', '167PrototypeSalvage'],
  location: 'guild_events_store2',
  purchases: 0,
  currencyPerPurchase: 400,
  percentOfRelicPiece: 18 / 90,
  gearPerPurchase: 4
}, {
  ids: ['170PrototypeSalvage', '166PrototypeSalvage', '167PrototypeSalvage'],
  location: 'shard_store',
  purchases: 0,
  currencyPerPurchase: 720,
  percentOfRelicPiece: 18 / 90,
  gearPerPurchase: 4
}], {
  ids: ['167PrototypeSalvage'],
  location: 'fleet_normal_3a',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 18,
  amountForRelicPiece: 90
}),
new RelicPlanner('impulse_detector', [], [{
  ids: ['165PrototypeSalvage', '158PrototypeSalvage', '160PrototypeSalvage'],
  location: 'guild_events_store1',
  purchases: 0,
  currencyPerPurchase: 400,
  percentOfRelicPiece: 12 / 110,
  gearPerPurchase: 5
}, {
  ids: ['165PrototypeSalvage', '158PrototypeSalvage', '160PrototypeSalvage'],
  location: 'shard_store',
  purchases: 0,
  currencyPerPurchase: 360,
  percentOfRelicPiece: 12 / 110,
  gearPerPurchase: 4
}], {
  ids: ['160PrototypeSalvage'],
  location: 'lightside_normal_9f',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 12,
  amountForRelicPiece: 110
}),
new RelicPlanner('gyrda_keypad', [], [{
  ids: ['171PrototypeSalvage', '168PrototypeSalvage', '169PrototypeSalvage'],
  location: 'guild_events_store1',
  purchases: 0,
  currencyPerPurchase: 400,
  percentOfRelicPiece: 10 / 130,
  gearPerPurchase: 4
}, {
  ids: ['171PrototypeSalvage', '168PrototypeSalvage', '169PrototypeSalvage'],
  location: 'shard_store',
  purchases: 0,
  currencyPerPurchase: 720,
  percentOfRelicPiece: 10 / 130,
  gearPerPurchase: 4
}], {
  ids: ['160PrototypeSalvage'],
  location: 'fleet_normal_3e',
  dropRate: 0.1,
  energyPerNode: 10,
  relicSalvage: 10,
  amountForRelicPiece: 130
})]