import axios from "axios";

import { PlayerResponse } from "../types/player";
import { ConfigType, Gear } from "../types/gear";
import { Unit, UnitBasic } from "../types/unit";
import { OwnedShardsMap } from "../types/shards";
import { RelicConfigType } from "../types/relic";
import { Match, Team } from "../types/teams";
import { GuildPayload, TerritoryWarEvent } from "../types/guild";

class ApiClient {
  baseUrl = "https://vkpnob5w55.execute-api.us-east-1.amazonaws.com/dev";
  // baseUrl = "http://localhost:3000/dev";

  constructor() {}

  async fetchPlayer(allyCode: string): Promise<PlayerResponse> {
    const response = await axios.get(`${this.baseUrl}/player/${allyCode}`);
    return response.data;
  }

  async fetchOpponent(playerId: string | undefined) {
    if (playerId) {
      const response = await axios.get(`${this.baseUrl}/opponent/${playerId}`);
      return response.data;
    }
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

  async updateTeams(playerId: string | undefined, teams: Team[]) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/teams/${playerId}`, { teams });
    }
  }

  async updateOpponentTeams(
    playerId: string | undefined,
    opponentAllyCode: string,
    teams: Team[]
  ) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/opponent/teams/${playerId}`, {
        opponentAllyCode,
        teams,
      });
    }
  }

  async updateMatches(playerId: string | undefined, matches: Match[]) {
    if (playerId) {
      const matchPayload = matches.map(
        ({ opponentTeamId, playerTeamId, gameMode }) => {
          return {
            opponentTeamId,
            playerTeamId,
            gameMode,
          };
        }
      );
      await axios.patch(`${this.baseUrl}/opponent/matches/${playerId}`, {
        matches: matchPayload,
      });
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

  async deleteOpponent(playerId: string | undefined) {
    if (playerId) {
      await axios.delete(`${this.baseUrl}/opponent/${playerId}`);
    }
  }

  async createGuild(guildId: string) {
    const response = await axios.post(`${this.baseUrl}/guild/${guildId}`);
    return response.data;
  }

  async fetchGuild(guildId: string): Promise<GuildPayload> {
    const response = await axios.get(`${this.baseUrl}/guild/${guildId}`);
    return response.data;
  }

  async fetchAccessLevel(
    guildId: string,
    allyCode: string
  ): Promise<{ role: number }> {
    const response = await axios.get(
      `${this.baseUrl}/guild/access/${guildId}/${allyCode}`
    );
    return response.data;
  }

  async updateTerritoryWarEvents(
    guildId: string,
    territoryWarEvents: TerritoryWarEvent[]
  ) {
    if (guildId) {
      await axios.patch(`${this.baseUrl}/guild/${guildId}/territoryWar`, {
        territoryWarEvents,
      });
    }
  }
}

const apiClient = new ApiClient();
export { ApiClient, apiClient };
