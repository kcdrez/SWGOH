import axios from "axios";

import { Player } from "../types/player";
import { Gear } from "../types/gear";
import { Unit } from "../types/unit";

class ApiClient {
  baseUrl = "https://7ly6sjvvj1.execute-api.us-east-1.amazonaws.com/dev";
  // baseUrl = "http://7739-184-96-186-220.ngrok.io";

  constructor() {}

  async fetchPlayer(allyCode: string): Promise<Player> {
    const response = await axios.get(`${this.baseUrl}/player/${allyCode}`);
    return response.data;
  }

  async fetchGearList(): Promise<Gear[]> {
    const response = await axios.get(`${this.baseUrl}/gear`);
    return response.data;
  }

  async fetchUnit(unitId: string): Promise<Unit> {
    const response = await axios.get(`${this.baseUrl}/unit/${unitId}`);
    return response.data;
  }
}

const apiClient = new ApiClient();
export { ApiClient, apiClient };
