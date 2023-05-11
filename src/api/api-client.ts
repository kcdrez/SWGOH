import axios from "axios";

import { Player } from "types/player";
import { ConfigType, Gear, IGear } from "types/gear";
import { IUnit, Unit } from "types/unit";
import { Goal, IGoal } from "types/goals";
import { FarmingNode, IFarmingNode, OwnedShardsMap } from "types/shards";
import { OwnedRelicConfig } from "types/relic";
import { ITeam, Match, Team } from "types/teams";
import {
  GuildPayload,
  IGuildUnitMap,
  TerritoryBattleEvent,
  ITerritoryWarEvent,
  iRaidEvent,
} from "types/guild";
import { IDailyCurrency, IWallet } from "types/currency";

class ApiClient {
  baseUrl = "https://vkpnob5w55.execute-api.us-east-1.amazonaws.com/dev";
  // baseUrl = "http://localhost:3001/dev";

  constructor() {}

  async fetchPlayer(allyCode: string): Promise<Player> {
    const response = await axios.get(`${this.baseUrl}/player/${allyCode}`);
    const { data } = response;
    return {
      ...data,
      units: (data?.units ?? []).map((u: IUnit) => new Unit(u)),
      goalList: (data?.goalList ?? []).map((el: IGoal) => new Goal(el)),
    };
  }

  async fetchOpponent(playerId: string | undefined) {
    if (playerId) {
      const response = await axios.get(`${this.baseUrl}/opponent/${playerId}`);
      return response.data;
    }
  }

  async createPlayer(allyCode: string): Promise<Player> {
    const response = await axios.post(`${this.baseUrl}/player/${allyCode}`);
    const { data } = response;
    return {
      ...data,
      units: data.units.map((u: IUnit) => new Unit(u)),
    };
  }

  async fetchGearList(): Promise<Gear[]> {
    const response = await axios.get(`${this.baseUrl}/gear`);
    return response.data.map((x: IGear) => new Gear(x));
  }

  async fetchUnit(unitId: string): Promise<Unit> {
    const response = await axios.get(`${this.baseUrl}/unit/${unitId}`);
    return new Unit(response.data);
  }

  async fetchAllUnits(): Promise<Unit[]> {
    const response = await axios.get(`${this.baseUrl}/unit/unitList`);
    return response.data.map((x: IUnit) => new Unit(x));
  }

  async saveGearData(playerId: string | undefined, gearData: ConfigType) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/gear/${playerId}`, { gear: gearData });
    }
  }

  async saveRelicData(
    playerId: string | undefined,
    relicData: OwnedRelicConfig
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

  async updateTeams(playerId: string | undefined, teams: ITeam[]) {
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
        teams: teams.map((x) => x.sanitize()),
      });
    }
  }

  async updateMatches(playerId: string | undefined, matches: Match[]) {
    if (playerId) {
      const matchPayload = matches.map((x) => x.sanitize());
      await axios.patch(`${this.baseUrl}/opponent/matches/${playerId}`, {
        matches: matchPayload,
      });
    }
  }

  async abilityStats() {
    const response = await axios.get(`${this.baseUrl}/unit/abilityStats`);
    return response.data;
  }

  async fetchFarmingData() {
    const response = await axios.get(`${this.baseUrl}/unit/shardFarming`);
    return response.data.map((x: IFarmingNode) => new FarmingNode(x));
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
    territoryWarEvents: ITerritoryWarEvent[]
  ) {
    if (guildId) {
      const response = await axios.patch(
        `${this.baseUrl}/guild/${guildId}/territoryWar`,
        {
          territoryWarEvents,
        }
      );
      return response.data;
    }
  }

  async updateTerritoryBattleEvents(
    guildId: string,
    territoryBattleEvents: TerritoryBattleEvent[]
  ) {
    if (guildId) {
      const response = await axios.patch(
        `${this.baseUrl}/guild/${guildId}/territoryBattle`,
        {
          territoryBattleEvents,
        }
      );
      return response.data;
    }
  }

  async updateRaidEvents(guildId: string, raidEvents: iRaidEvent[]) {
    if (guildId) {
      const response = await axios.patch(
        `${this.baseUrl}/guild/${guildId}/raidEvents`,
        {
          raidEvents,
        }
      );
      return response.data;
    }
  }

  async saveWallet(playerId: string | undefined, wallet: IWallet) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/wallet/${playerId}`, {
        wallet,
      });
    }
  }
  async saveDailyCurrency(
    playerId: string | undefined,
    currency: IDailyCurrency
  ) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/dailyCurrency/${playerId}`, {
        currency,
      });
    }
  }
  async fetchGuildUnitData(guildId: string, unitId: string) {
    const response = await axios.get(
      `${this.baseUrl}/guild/${guildId}/${unitId}`
    );
    const unitMapping: IGuildUnitMap = {
      zetas: {},
      gearLevels: {},
      relicLevels: {},
      owned: [],
      unowned: [],
    };

    (response?.data ?? []).forEach((player: any) => {
      if (player.unit) {
        const unit = new Unit(player.unit);
        if (unit.gearLevel >= 12) {
          if (unitMapping.gearLevels[unit.gearLevel]) {
            unitMapping.gearLevels[unit.gearLevel]++;
          } else {
            unitMapping.gearLevels[unit.gearLevel] = 1;
          }
        }

        if (unit.relicLevel >= 0) {
          if (unitMapping.relicLevels[unit.relicLevel]) {
            unitMapping.relicLevels[unit.relicLevel]++;
          } else {
            unitMapping.relicLevels[unit.relicLevel] = 1;
          }
        }

        unitMapping.owned.push({
          allyCode: player.allyCode,
          name: player.name,
          stars: unit.stars,
          gearLevel: unit.gearLevel,
          relicLevel: unit.relicLevel,
          zetas: unit.zetas.length,
          omicrons: unit.omicrons.length,
          speed: unit.speed,
          speedMod: unit.modSpeed,
          physicalOffense: unit.offense.physical,
          specialOffense: unit.offense.special,
          protection: unit.protection,
          health: unit.health,
          tenacity: unit.tenacity,
          potency: unit.potency,
          physicalCrit: unit.critChance.physical,
          specialCrit: unit.critChance.special,
          critDamage: unit.critDamage,
          armor: unit.armor.physical,
          resistance: unit.armor.special,
          ultimate: unit.hasUlt,
        });
      } else {
        unitMapping.unowned.push({
          allyCode: player.allyCode,
          name: player.name,
        });
      }
    });

    const speedArr = unitMapping.owned.reduce((acc: number[], u) => {
      if (u.speed) {
        acc.push(u.speed);
      }
      return acc;
    }, []);

    unitMapping.speed = {
      min: Math.min(...speedArr),
      max: Math.max(...speedArr),
      average:
        speedArr.reduce((total, x) => {
          return total + x;
        }, 0) / speedArr.length,
    };

    return unitMapping;
  }
  async fetchGuildUnits(guildId: string, unitIds: string[] | undefined) {
    const response = await axios.post(
      `${this.baseUrl}/guild/${guildId}/units`,
      {
        unitIds,
      }
    );
    return response.data;
  }
  async fetchGuildStats(guildId: string) {
    const response = await axios.post(`${this.baseUrl}/guild/${guildId}/stats`);
    return response.data;
  }
  async saveGoals(playerId: string | undefined, goals: Goal[]) {
    if (playerId) {
      await axios.patch(`${this.baseUrl}/player/goalList/${playerId}`, {
        goalList: goals.map((x) => x.sanitize()),
      });
    }
  }
}

const apiClient = new ApiClient();
export { ApiClient, apiClient };
