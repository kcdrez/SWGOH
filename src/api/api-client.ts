import axios from "axios";

import { PlayerResponse } from "../types/player";
import { ConfigType, Gear } from "../types/gear";
import { Unit } from "../types/unit";
import { RelicConfigType } from "../types/relic";
import { Team } from "../types/speed";

class ApiClient {
  baseUrl = "https://vkpnob5w55.execute-api.us-east-1.amazonaws.com/dev";
  // baseUrl = "http://7739-184-96-186-220.ngrok.io";
  // baseUrl = "http://localhost:3000/dev";

  constructor() { }

  async fetchPlayer(allyCode: string): Promise<PlayerResponse> {
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

  async saveGearData(playerId: string, gearData: ConfigType) {
    await axios.patch(`${this.baseUrl}/gear/${playerId}`, { gear: gearData });
  }

  async saveRelicData(playerId: string, relicData: RelicConfigType) {
    await axios.patch(`${this.baseUrl}/relic/${playerId}`, {
      relic: relicData,
    });
  }

  async savePlannerData(playerId: string, plannerData: any) {
    await axios.patch(`${this.baseUrl}/player/planner/${playerId}`, {
      planner: plannerData,
    });
  }

  async saveEnergyData(playerId: string, energyData: any) {
    if (!!playerId) {
      await axios.patch(
        `${this.baseUrl}/player/energy/${playerId}`,
        energyData
      );
    }
  }

  async updateTeams(playerId: string, teams: any[]) {
    if (!!playerId) {
      await axios.patch(`${this.baseUrl}/player/teams/${playerId}`, { teams });
    }
  }
}

const apiClient = new ApiClient();
export { ApiClient, apiClient };
