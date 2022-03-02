import { apiClient } from "../api/api-client"
import store from "../vuex-store/store";

export interface IWallet {
  get1?: number;
  get2?: number;
}

export class Wallet {
  private _get1?: number
  private _get2?: number

  constructor(data: IWallet) {
    this._get1 = data?.get1
    this._get2 = data?.get2
  }

  public get get1() {
    return this._get1 || 0
  }
  public set get1(val) {
    this._get1 = val;
    this.save();
  }
  public get get2() {
    return this._get2 || 0
  }
  public set get2(val) {
    this._get2 = val;
    this.save();
  }

  private save() {
    apiClient.saveWallet(store.state.player.player?.id, this.sanitize());
  }
  private sanitize(): IWallet {
    return {
      get1: this.get1,
      get2: this.get2
    }
  }
}