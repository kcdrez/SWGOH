import axios from "axios";

import { PlayerResponse } from "../types/player";
import { ConfigType, Gear } from "../types/gear";
import { Unit, UnitBasic } from "../types/unit";
import { OwnedShardsMap } from "../types/shards";
import { RelicConfigType } from "../types/relic";

class ApiClient {
  // baseUrl = "https://vkpnob5w55.execute-api.us-east-1.amazonaws.com/dev";
  // baseUrl = "http://7739-184-96-186-220.ngrok.io";
  baseUrl = "http://localhost:3000/dev";

  constructor() {}

  async fetchPlayer(allyCode: string): Promise<PlayerResponse> {
    const response = await axios.get(`${this.baseUrl}/player/${allyCode}`);
    return response.data;
  }

  async createPlayer(allyCode: string): Promise<PlayerResponse> {
    const response = await axios.post(`${this.baseUrl}/player/${allyCode}`);
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

  async fetchAllUnits(): Promise<UnitBasic[]> {
    const response = await axios.get(`${this.baseUrl}/unit/unitList`);
    return response.data;
  }

  async saveGearData(playerId: string | undefined, gearData: ConfigType) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/gear/${playerId}`, { gear: gearData });
    }
  }

  async saveRelicData(
    playerId: string | undefined,
    relicData: RelicConfigType
  ) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/relic/${playerId}`, {
        relic: relicData,
      });
    }
  }

  async savePlannerData(playerId: string | undefined, plannerData: any) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/planner/${playerId}`, {
        planner: plannerData,
      });
    }
  }

  async saveEnergyData(playerId: string | undefined, energyData: any) {
    if (playerId) {
      await axios.patch(
        `${this.baseUrl}/player/energy/${playerId}`,
        energyData
      );
    }
  }

  async updateTeams(playerId: string | undefined, teams: any[]) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/teams/${playerId}`, { teams });
    }
  }

  async speedData() {
    const response = await axios.get(`${this.baseUrl}/unit/speedAbilities`);
    return response.data;
  }

  async fetchFarmingData() {
    const response = await axios.get(`${this.baseUrl}/unit/shardFarming`);
    return response.data;
  }

  async saveShardFarming(
    playerId: string | undefined,
    shardData: OwnedShardsMap
  ) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/shards/${playerId}`, {
        shards: shardData,
      });
    }
  }
}

const apiClient = new ApiClient();
export { ApiClient, apiClient };
