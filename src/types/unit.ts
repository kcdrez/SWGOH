import { maxRelicLevel } from "../types/relic";
import { Gear, IIngredient, maxGearLevel } from "./gear";
import store from "../vuex-store/store";
import { FarmingNode, shardMapping } from "./shards";
import { round2Decimals } from "../utils";
import {
  CurrencyTypeConfig,
  currencyTypeList,
  DailyCurrency,
  Wallet,
} from "./currency";

export interface IUnit {
  id: string;
  name: string;
  image: string;
  gear_levels: UnitTier[];
  categories: string[];
  ability_classes: string[];
  role: string;
  alignment: string;

  //attributes that only exist when the character is unlocked
  gear_level?: number;
  tier?: number;
  level?: number;
  power?: number;
  gear?: UnitGear[];
  stats?: any; //make map on api?
  ability_data?: Ability[];
  relic_tier?: number;
  has_ultimate?: boolean;
  xp?: number;
  mods?: Mod[];
  crew?: Crew[];
  stars?: number;
  is_ship?: boolean;
}

export class Unit {
  private _gear_level;
  private _name: string;
  private _current_level_gear: UnitGear[];
  private _ability_data: Ability[];
  private _relic_tier: number;
  private _mods: Mod[];
  private _stars: number;
  private _categories: string[];
  private _ability_classes: string[];
  private _role: string;
  private _alignment: string;
  private _is_ship: boolean;
  private _id: string;
  private _image: string;
  private _gear_list: UnitTier[];
  private _stats: any;

  private _7StarUnlockEstimation: number = 0;

  constructor(payload: IUnit) {
    this._id = payload.id;
    this._name = payload.name;
    this._gear_level = payload.gear_level || 0;
    this._current_level_gear = payload?.gear || [];
    this._ability_data = payload?.ability_data || [];
    this._relic_tier = payload?.relic_tier || 0;
    this._mods = payload?.mods || [];
    this._stars = payload?.stars || 0;
    this._categories = payload.categories;
    this._ability_classes = payload.ability_classes;
    this._role = payload.role;
    this._alignment = payload.alignment;
    this._is_ship = payload.is_ship || false;
    this._image = payload.image;
    this._gear_list = payload.gear_levels;
    this._stats = payload.stats;

    this.calculateEstimation();

    store.watch((state) => {
      return state.currency.dailyCurrency
    }, (newVal) => {
      if (this.id === "CAPITALMALEVOLENCE") {
        console.log('currency watcher trigger', newVal)
      }
      if (currencyTypeList.some(c => this.currencyTypes.includes(c))) {
        this.calculateEstimation()
      }
    })
    store.watch((state) => {
      return state.shards.shardFarming
    }, (newVal) => {
      if (this.id === "CAPITALMALEVOLENCE") {
        console.log('shard farming trigger', this.currencyTypes, currencyTypeList.some(c => this.currencyTypes.includes(c)))
      }
      if (currencyTypeList.some(c => this.currencyTypes.includes(c))) {
        if (this.id === "CAPITALMALEVOLENCE") {
          console.log('shard calculate estimate', this.currencyTypes)
        }
        this.calculateEstimation()
      }
    })
  }

  public get id() {
    return this._id;
  }
  public get gearLevel() {
    return this._gear_level;
  }
  public get name() {
    return this._name;
  }
  public get abilities() {
    return this._ability_data;
  }
  public get relicLevel() {
    if (!this._relic_tier) {
      return 0;
    } else {
      return this._relic_tier < 0 ? 0 : this._relic_tier;
    }
  }
  public get image() {
    return this._image;
  }
  public get alignment() {
    return this._alignment;
  }
  public get isShip() {
    return this._is_ship;
  }
  public get stars() {
    return this._stars;
  }
  /*
   * Gets a list of all gear for the current gear level
   */
  public get currentLevelGear() {
    return this._current_level_gear;
  }
  /*
   * Gets a list of all gear (ids) for all gear levels
   */
  public get gearList() {
    return this._gear_list;
  }
  public get mods() {
    return this._mods;
  }
  public get role() {
    return this._role;
  }
  public get categories() {
    return this._categories;
  }

  public get hasSpeedSet() {
    return this.mods.filter((x) => x.set === 4).length >= 4;
  }

  public get gearOptions() {
    const list = [];
    for (let i = (this.gearLevel || 0) + 1; i <= maxGearLevel; i++) {
      list.push(i);
    }
    return list;
  }

  public get relicOptions() {
    const list = [];
    for (let i = this.relicLevel + 1; i <= maxRelicLevel; i++) {
      list.push(i);
    }
    return list;
  }

  public get speed() {
    return this._stats["5"];
  }

  public get gearTarget() {
    return (
      store.state.planner.targetConfig[this.id]?.gear.target || maxGearLevel
    );
  }
  public set gearTarget(value) {
    const payload = {
      type: "gear",
      value,
      unitId: this.id,
    };
    store.dispatch("planner/updatePlannerTarget", payload);
  }

  public get relicTarget() {
    return (
      store.state.planner.targetConfig[this.id]?.relic.target || maxRelicLevel
    );
  }
  public set relicTarget(value) {
    const payload = {
      type: "relic",
      value,
      unitId: this.id,
    };
    store.dispatch("planner/updatePlannerTarget", payload);
  }

  private get fullGearListByLevel() {
    const futureGear = this.gearList.filter(
      ({ tier }: UnitTier) => tier >= this.gearLevel
    );

    return futureGear.map(({ gear, tier }: UnitTier) => {
      return {
        tier,
        gear: gear.reduce((acc: Gear[], id: string, index: number) => {
          let alreadyEquipped = false;
          if (tier === this.gearLevel) {
            alreadyEquipped = this.currentLevelGear[index].is_obtained || false;
          }

          if (!alreadyEquipped) {
            const gearData = this.gearData(id);
            if (gearData) {
              acc.push(gearData);
            }
          }
          return acc;
        }, []),
      };
    });
  }

  public get fullSalvageList() {
    let list: Gear[] = [];
    this.fullGearListByLevel.forEach(({ tier, gear: gearList }: any) => {
      if (tier + 1 <= this.gearTarget) {
        gearList.forEach((gearPiece: Gear) => {
          gearPiece.ingredients.forEach(
            ({ gear: salvageId, amount }: IIngredient) => {
              const matchGear = this.gearData(salvageId);
              if (matchGear) {
                const exists = list.find((x: any) => x.id === matchGear.id);
                if (exists) {
                  exists.amount += amount;
                } else {
                  list.push(matchGear.clone({ amount }));
                }
              }
            }
          );
        });
      }
    });
    return list;
  }

  public get gearTotalDays() {
    let totalStandard = 0;
    let totalFleet = 0;
    let totalChallenges = 0;

    this.fullSalvageList.forEach((gear: Gear) => {
      const isChallenge = gear.missionList.some(
        (x) => x.missionIdentifier.campaignMapId === "CHALLENGES"
      );
      const isFleet = gear.missionList.some(
        (x) => x.missionIdentifier.campaignId === "C01SP"
      );
      const timeToGet = gear.timeEstimation;

      if (gear.irrelevant || timeToGet < 0) {
        //do nothing
      } else if (isChallenge) {
        totalChallenges = Math.max(timeToGet, totalChallenges);
      } else if (isFleet) {
        totalFleet += timeToGet;
      } else {
        totalStandard += timeToGet;
      }
    });
    return Math.max(totalStandard, totalFleet, totalChallenges);
  }

  public get relicTotalDays() {
    const { target } = store.state.planner.targetConfig[this.id].relic;
    return Object.values(store.state.relic.relicConfig).reduce((acc, relic) => {
      const days = relic.timeEstimation([
        { level: this.relicLevel ?? 0, target },
      ]);
      return days > 0 ? acc + days : acc;
    }, 0);
  }

  private get totalRemainingShards() {
    let amount = 0;
    for (let i = this.stars + 1; i <= 7; i++) {
      amount += shardMapping[i];
    }
    return amount;
  }
  public get ownedShards() {
    return store.state.shards.ownedShards[this.id]?.owned || 0;
  }
  public set ownedShards(value) {
    store.dispatch("shards/saveShardsCount", { count: value, id: this.id });
    this.calculateEstimation();
  }
  private get totalOwnedShards() {
    let amount = 0;
    for (let i = 1; i <= this.stars; i++) {
      amount += shardMapping[i];
    }
    return amount + this.ownedShards;
  }
  public get remainingShards() {
    return 330 - this.totalOwnedShards;
  }
  public get shardPercent() {
    const val = (this.totalOwnedShards / 330) * 100;
    if (val >= 100) {
      return 100;
    } else {
      return round2Decimals(val);
    }
  }

  public get whereToFarm() {
    return store.state.shards.shardFarming.filter((node) => {
      return node.characters.some((c) => c.id === this.id);
    });
  }
  public get locations() {
    return this.whereToFarm.map((x) => x.label);
  }
  public get currencyTypes() {
    const arr: CurrencyTypeConfig[] = [];
    this.whereToFarm.forEach((node) => {
      if (node.id === "guild_events_store1") {
        arr.push("get1");
      } else if (node.id === "guild_events_store2") {
        arr.push("get2");
      } else if (node.id === "shard_store") {
        arr.push("shardCurrency");
      } else if (node.id === "cantina_battles_store") {
        arr.push("cantinaBattleCurrency");
      } else if (node.id === "guild_store") {
        arr.push("guildStoreCurrency");
      } else if (node.id === "squad_arena_store") {
        arr.push("squadArenaCurrency");
      } else if (node.id === "galactic_war_store") {
        arr.push("galacticWarCurrency");
      } else if (node.id === "fleet_arena_store") {
        arr.push("fleetArenaCurrency");
      }
    });
    return arr;
  }
  public get showNodesPerDay() {
    return this.whereToFarm.some((node) => {
      return (
        node.table === "Light Side" ||
        node.table === "Dark Side" ||
        node.table === "Cantina" ||
        node.table === "Fleet"
      );
    });
  }
  public get shardDropRate() {
    return (
      this.whereToFarm[0].characters.find((x) => x.id === this.id)?.dropRate ||
      0
    );
  }
  public get shardNodes() {
    return store.state.shards.ownedShards[this.id]?.nodes || [];
  }
  public set shardNodes(val) {
    store.dispatch("shards/saveShardsCount", {
      count: this.ownedShards,
      id: this.id,
      nodes: val,
    });
    this.calculateEstimation();
  }
  public get shardTimeEstimation() {
    return this._7StarUnlockEstimation;
  }
  public get tracking() {
    const match = store.state.shards.ownedShards[this.id];
    if (match) {
      return match.tracking;
    } else {
      return false;
    }
  }
  public set tracking(val) {
    if (val) {
      store.dispatch("shards/addUnit", this.id);
    } else {
      store.dispatch("shards/removeUnit", this.id);
    }
  }

  public gearData(id: string): Gear | undefined {
    return (store.state.gear.gearList as Gear[]).find(
      (el: Gear) => el.id === id
    );
  }

  public tablePriority(tableNames: string[]) {
    const matchFarmingNode = this.whereToFarm.find((node) => {
      return tableNames.includes(node.table);
    });
    const match = this.shardNodes.find((n) => n.id === matchFarmingNode?.id);
    return match?.priority ?? 0;
  }

  public calculateEstimation() {
    let shardsPerDay = 0;

    this.whereToFarm.forEach((location) => {
      if (this.id === "CAPITALMALEVOLENCE") {
        console.log('getting estimate', location.currencyType &&
          currencyTypeList.includes(location.currencyType))
      }
      if (location.table === "Territory Battles") {
        const type =
          this.id === "KIADIMUNDI" || this.id === "IMPERIALPROBEDROID"
            ? "Light"
            : "Dark";
        const avgShardsPerEvent = store.getters["guild/tbAvgShards"](
          type,
          this.id
        );
        shardsPerDay += avgShardsPerEvent / 30;
      } else if (
        location.currencyType &&
        currencyTypeList.includes(location.currencyType)
      ) {
        shardsPerDay += this.calculateCurrencyEstimation(location);
      } else {
        const nodesPerDay =
          this.shardNodes.find((n) => n.id === location.id)?.count ?? 0;

        shardsPerDay += nodesPerDay * 0.33 * this.shardDropRate;
      }
    });

    if (shardsPerDay === 0) {
      this._7StarUnlockEstimation = -1;
    } else {
      this._7StarUnlockEstimation = Math.ceil(
        this.remainingShards / shardsPerDay
      );
    }
  }
  private calculateCurrencyEstimation(location: FarmingNode) {
    let costPerShard = 0;
    let dropRate = 1;
    let shardCountPerPurchase = 0;
    let costOfPack = 0;
    const match = location.characters.find((c) => c.id === this.id);
    if (match && match.shardCount && match.cost) {
      costPerShard = match.cost / match.shardCount;
      dropRate = match.dropRate || 1;
      shardCountPerPurchase = match.shardCount;
      costOfPack = match.cost;
    }

    if (this.id === "CAPITALMALEVOLENCE") {
      console.log(location.currencyType)
    }

    if (location.currencyType) {
      const currentWallet =
        store.state.currency.wallet[location.currencyType] || 0;
      const totalCost = this.remainingShards * costPerShard - currentWallet;
      const avgDailyCurrency =
        store.state.currency.dailyCurrency[location.currencyType] || 1;

      const daysToUnlock = totalCost / avgDailyCurrency

      if (this.id === "CAPITALMALEVOLENCE") {
        console.log(totalCost, avgDailyCurrency, this.remainingShards)
      }
      return this.remainingShards / daysToUnlock
    } else {
      return 0;
    }
  }
}

export interface UnitGear {
  base_id: string;
  is_obtained: boolean;
  slot: number;
}

interface Ability {
  id: string;
  ability_tier: number;
  tier_max: number;
  is_omega: boolean;
  is_zeta: boolean;
  is_omicron: boolean;
  has_omicron_learned: boolean;
  has_zeta_learned: boolean;
  name: string;
}

export interface Mod {
  id: string;
  level: number;
  tier: number;
  slot: number;
  set: number;
  pips: number;
  primaryStat: { unitStat: number; value: number };
  secondaryStat: { unitStat: number; value: number; roll: number }[];
}

export interface UnitTier {
  tier: number;
  gear: string[];
}

interface Crew {
  unitId: string;
  slot: number;
  skillReferenceList: CrewSkill[];
  skilllessCrewAbilityId: string;
  gp: number;
  cp: number;
}

interface CrewSkill {
  skillId: string;
  requiredTier: number;
  requiredRarity: number;
  requiredRelicTier: number;
}
