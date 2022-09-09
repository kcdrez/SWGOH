import { maxRelicLevel } from "./relic";
import { Gear, IIngredient, maxGearLevel } from "./gear";
import store from "vuex-store/store";
import {
  FarmingNode,
  IPrerequisite,
  NodeCharacter,
  shardMapping,
} from "./shards";
import { round2Decimals } from "utils";
import { CurrencyTypeConfig } from "./currency";
import _ from "lodash";
import { anyTagsMatch } from "./teams";

interface IStatMultiplier {
  speed: number;
  health: number;
  protection: number;
  physicalDamage: number;
  critRating: number;
  specialDamage: number;
  specialCritRating: number;
  potency: number;
  tenacity: number;
  baseSpeed: number;
  baseHealth: number;
  baseProtection: number;
  baseDamage: number;
  baseCrit: number;
  baseSpecialDamage: number;
  baseSpecialCrit: number;
  basePotency: number;
  baseTenacity: number;
}
export interface IUnit {
  id: string;
  name: string;
  aliases?: string[];
  image: string;
  gear_levels?: UnitTier[]; //doesnt exist on ships
  categories: string[];
  ability_classes: string[];
  role: string;
  alignment: string;
  statMultipliers?: IStatMultiplier;

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
  crew?: ICrew[];
  stars?: number;
  is_ship?: boolean;
  zeta_abilities: string[];
  omicron_abilities: string[];

  //comes from .gg API
  stat_diffs?: any; //looks the same as stats
}

export class Unit {
  private _gear_level;
  private _name: string;
  private _aliases: string[];
  private _current_level_gear: UnitGear[];
  private _ability_data: Ability[];
  private _relic_tier: number;
  private _mods: Mod[];

  private _stars: number;
  private _level: number;
  private _categories: string[];
  private _ability_classes: string[];
  private _role: string;
  private _alignment: string;
  private _is_ship: boolean;
  private _id: string;
  private _image: string;
  private _gear_list?: UnitTier[];
  private _stats: any;
  private _stat_diffs: any;
  private _power?: number;
  private _zeta_abilities?: string[];
  private _omicron_abilities?: string[];
  private _has_ultimate?: boolean;
  private _crew?: ICrew[];
  private _stat_multipliers?: IStatMultiplier;

  private _estimatedTime: number = 0;

  constructor(payload: IUnit) {
    this._id = payload.id;
    this._name = payload.name;
    this._aliases = payload.aliases ?? [];
    this._gear_level = payload.gear_level ?? 0;
    this._current_level_gear = payload?.gear ?? [];
    this._ability_data = payload?.ability_data ?? [];
    this._relic_tier = payload?.relic_tier ?? 0;
    this._mods = payload?.mods ?? [];
    this._stars = payload?.stars ?? 0;
    this._level = payload.level ?? 0;
    this._categories = payload.categories;
    this._ability_classes = payload.ability_classes;
    this._role = payload.role;
    this._alignment = payload.alignment;
    this._is_ship = payload.is_ship ?? false;
    this._image = payload.image;
    this._gear_list = payload.gear_levels;
    this._stats = payload.stats;
    this._power = payload.power;
    this._zeta_abilities = payload.zeta_abilities;
    this._omicron_abilities = payload.omicron_abilities;
    this._has_ultimate = payload.has_ultimate;
    this._stat_diffs = payload.stat_diffs ?? null;
    this._crew = payload.crew ?? [];
    this._stat_multipliers = payload.statMultipliers;
  }

  public get id() {
    return this._id;
  }
  public get estimatedTime() {
    return this._estimatedTime;
  }
  public set estimatedTime(val) {
    this._estimatedTime = val;
  }
  public get gearLevel() {
    return this._gear_level;
  }
  public get level() {
    return this._level;
  }
  public get name() {
    return this._name;
  }
  public get crew() {
    return this._crew ?? [];
  }
  public get aliases() {
    return this._aliases;
  }
  public get power() {
    return this._power ?? 0;
  }
  public get abilities() {
    return this._ability_data;
  }
  public get hasUlt() {
    return this._has_ultimate ?? false;
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
  public get unitType() {
    return this._is_ship ? "Ship" : "Unit";
  }
  public get stars() {
    return this._stars;
  }
  public get currentLevelGear() {
    return this._current_level_gear;
  }
  public get gearPiecesCount() {
    return this._current_level_gear.filter((x) => x.is_obtained).length;
  }
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
  public get isGL() {
    return this.categories.includes("Galactic Legend");
  }
  public get zetas() {
    return this._zeta_abilities ?? [];
  }
  public get omicrons() {
    return this._omicron_abilities ?? [];
  }
  public get abilityClasses() {
    return this._ability_classes ?? [];
  }
  public get glTier4() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier4 || false;
  }
  public set glTier4(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier4: val,
      tier5: !val ? false : this.glTier5,
      ultMats: this.glUltMats,
      id: this.id,
    });
  }
  public get glTier5() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier5 || false;
  }
  public set glTier5(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier4: val ? true : this.glTier4,
      tier5: val,
      ultMats: this.glUltMats,
      id: this.id,
    });
  }
  public get glUltMats() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.ultMats || 0;
  }
  public set glUltMats(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier4: this.glTier4,
      tier5: this.glTier5,
      ultMats: val,
      id: this.id,
    });
  }

  public get hasSpeedSet() {
    return this.mods.filter((x) => x.set === 4).length >= 4;
  }
  public get healthSetsCount() {
    return Math.floor(this.mods.filter((x) => x.set === 1).length / 2);
  }
  public get defenseSetsCount() {
    return Math.floor(this.mods.filter((x) => x.set === 3).length / 2);
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
    for (let i = this.relicLevel; i <= maxRelicLevel; i++) {
      list.push(i);
    }
    return list;
  }

  public get statMultipliers() {
    return this._stat_multipliers;
  }
  public get protection() {
    return this._stats["28"];
  }
  public get baseProtection() {
    if (this._stat_diffs) {
      return this.protection - (this._stat_diffs["56"] ?? 0);
    } else if (this._mods) {
      let amount = 0;
      let percent = 0;
      this._mods.forEach((mod) => {
        if (mod.primaryStat.unitStat === 56) {
          percent += mod.primaryStat.value;
        }

        mod.secondaryStat.forEach((stat) => {
          if (stat.unitStat === 28) {
            amount += stat.value;
          } else if (stat.unitStat === 56) {
            percent += stat.value;
          }
        });
      });

      percent = percent / 100;

      return Math.ceil((this.protection - amount) / (1 + percent));
    } else {
      return 0;
    }
  }
  public get health() {
    return this._stats["1"];
  }
  public get baseHealth() {
    if (this._stat_diffs) {
      return this.health - (this._stat_diffs["1"] ?? 0);
    } else if (this._mods) {
      let amount = 0;
      let percent = 0;
      percent += this.healthSetsCount * 10;

      this._mods.forEach((mod) => {
        if (mod.primaryStat.unitStat === 55) {
          percent += mod.primaryStat.value;
        }

        mod.secondaryStat.forEach((stat) => {
          if (stat.unitStat === 1) {
            amount += stat.value;
          }
          if (stat.unitStat === 55) {
            percent += stat.value;
          }
        });
      });

      percent = percent / 100;

      return Math.ceil((this.health - amount) / (1 + percent));
    } else {
      return 0;
    }
  }
  public get bonusStats() {
    const abilityData = store.state.teams.abilityStatsData[this.id];

    const data = {
      health: {
        flat: 0,
        percent: 0,
      },
      protection: {
        flat: 0,
        percent: 0,
      },
      defense: {
        flat: 0,
        percent: 0,
      },
      speed: { flat: 0, percent: 0 },
      "damage mitigation": { flat: 0, percent: 0 },
      "protection up": { flat: 0, percent: 0 },
    };
    (abilityData?.unique ?? []).forEach((ability) => {
      if (
        anyTagsMatch(this, this.id, ability?.tags ?? []) &&
        !ability.conditions &&
        ["health", "protection", "defense"].includes(ability.type)
      ) {
        if (ability.flat) {
          data[ability.type].flat += ability.value ?? 0;
        } else {
          data[ability.type].percent += ability.value ?? 0;
        }
      }
    });
    return data;
  }
  public get tenacity() {
    return round2Decimals(this._stats["18"] * 100);
  }
  public get potency() {
    return round2Decimals(this._stats["17"] * 100);
  }
  public get armor() {
    return {
      physical: round2Decimals(this._stats["8"]),
      special: round2Decimals(this._stats["9"]),
    };
  }
  public get physicalArmor() {
    return this.armor.physical;
  }
  private getBaseDefense(armor: number): number {
    const defenseFinal = (armor * 637.5) / (100 - armor);
    if (this._mods) {
      let amount = 0;
      let percent = 0;
      percent += this.defenseSetsCount * 25;

      this._mods.forEach((mod) => {
        if (mod.primaryStat.unitStat === 49) {
          percent += mod.primaryStat.value;
        }

        mod.secondaryStat.forEach((stat) => {
          if (stat.unitStat === 42) {
            amount += stat.value;
          }
          if (stat.unitStat === 49) {
            percent += stat.value;
          }
        });
      });

      percent = percent / 100;
      return Math.ceil((defenseFinal - amount) / (1 + percent));
    } else {
      return 0;
    }
  }
  public get baseArmor() {
    const defense = this.getBaseDefense(this.physicalArmor);
    return round2Decimals((defense * 100) / (defense + 637.5));
  }
  public get specialArmor() {
    return this.armor.special;
  }
  public get baseResistance() {
    const defense = this.getBaseDefense(this.specialArmor);
    return round2Decimals((defense * 100) / (defense + 637.5));
  }
  public get speed() {
    return this._stats["5"];
  }
  public get baseSpeed() {
    if (this._stat_diffs) {
      return this.speed - (this._stat_diffs["5"] ?? 0);
    } else if (this._mods) {
      let amount = 0;
      let percent = 0;
      if (this.hasSpeedSet) {
        const modSet = this._mods.filter((mod) => mod.set === 4);
        percent += modSet.every((mod) => mod.level === 15) ? 10 : 5;
      }
      this._mods.forEach((mod) => {
        if (mod.primaryStat.unitStat === 5) {
          amount += mod.primaryStat.value;
        }

        mod.secondaryStat.forEach((stat) => {
          if (stat.unitStat === 5) {
            amount += stat.value;
          }
        });
      });

      percent = percent / 100;

      return Math.ceil((this.speed - amount) / (1 + percent));
    }
  }
  public get modSpeed() {
    if (this._stat_diffs) {
      return this._stat_diffs["5"];
    } else {
      return this.speed - (this.baseSpeed ?? 0);
    }
  }

  public get offense() {
    return {
      physical: this._stats["6"],
      special: this._stats["7"],
    };
  }
  public get physicalOffense() {
    return this.offense.physical;
  }
  public get specialOffense() {
    return this.offense.special;
  }
  public get modOffense() {
    let amount = 0;
    let percent = 0;
    const modSet = this._mods.filter((mod) => mod.set === 2); //2 is offense, 5 is crit chance
    if (modSet.length >= 4) {
      percent += modSet.every((mod) => mod.level === 15) ? 15 : 7.5;
    }

    this._mods.forEach((mod) => {
      if (mod.primaryStat.unitStat === 48) {
        percent += mod.primaryStat.value;
      }

      mod.secondaryStat.forEach((stat) => {
        if (stat.unitStat === 41) {
          //41 = flat offense, 53 = crit chance, 48 offense percent
          amount += stat.value;
        } else if (stat.unitStat === 48) {
          percent += stat.value;
        }
      });
    });
    return {
      amount: round2Decimals(amount),
      percent: round2Decimals(percent / 100),
    };
  }
  public get baseOffense() {
    return {
      physical: round2Decimals(
        (this.offense.physical - this.modOffense.amount) /
          (1 + this.modOffense.percent)
      ),
      special: round2Decimals(
        (this.offense.special - this.modOffense.amount) /
          (1 + this.modOffense.percent)
      ),
    };
  }

  public get critChance() {
    return {
      physical: round2Decimals(this._stats["14"]),
      special: round2Decimals(this._stats["15"]),
    };
  }
  public get physicalCritChance() {
    return this.critChance.physical;
  }
  public get specialCritChance() {
    return this.critChance.special;
  }
  public get modCritChance() {
    let amount = 0;
    let maxed = 0;
    let notMaxed = 0;
    this._mods.forEach((mod) => {
      if (mod.set === 5) {
        if (mod.level === 15) {
          maxed++;
        } else {
          notMaxed++;
        }

        if (maxed === 2) {
          amount += 8;
          maxed = 0;
        } else if (notMaxed === 2) {
          amount += 4;
          notMaxed = 0;
        }
      }
    });

    this._mods.forEach((mod) => {
      mod.secondaryStat.forEach((stat) => {
        if (stat.unitStat === 53) {
          //41 = flat offense, 53 = crit chance, 48 offense percent
          amount += stat.value;
        }
      });
    });
    return round2Decimals(amount);
  }
  public get baseCritChance() {
    return {
      physical: round2Decimals(this.critChance.physical - this.modCritChance),
      special: round2Decimals(this.critChance.special - this.modCritChance),
    };
  }

  public get critDamage() {
    return round2Decimals(this._stats["16"] * 100);
  }
  public get modCritDamage() {
    let amount = 0;
    const modSet = this._mods.filter((mod) => mod.set === 6); //2 is offense, 5 is crit chance, 6 crit damage
    if (modSet.length >= 4) {
      amount += modSet.every((mod) => mod.level === 15) ? 30 : 15;
    }

    this._mods.forEach((mod) => {
      if (mod.primaryStat.unitStat === 56) {
        amount += mod.primaryStat.value;
      }
    });
    return round2Decimals(amount);
  }
  public get baseCritDamage() {
    return this.critDamage - this.modCritDamage;
  }

  public get gearTarget() {
    return (
      store.state.planner.targetConfig[this.id]?.gear.target ?? maxGearLevel
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
      store.state.planner.targetConfig[this.id]?.relic.target ?? maxRelicLevel
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
    const futureGear = (this.gearList ?? []).filter(
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
                const exists = list.find((x: Gear) => x.id === matchGear.id);
                if (exists) {
                  exists.totalAmount += amount;
                  exists.neededBy[0].totalAmount += amount;
                  const levelElement = exists.neededBy[0].gearLevels.find(
                    (x) => x.level === tier
                  );
                  if (levelElement) {
                    levelElement.amount += amount;
                  } else {
                    exists.neededBy[0].gearLevels.push({ amount, level: tier });
                  }
                } else {
                  list.push(
                    matchGear.clone({
                      totalAmount: amount,
                      neededBy: [
                        {
                          id: this.id,
                          name: this.name,
                          totalAmount: amount,
                          gearLevels: [{ amount, level: tier }],
                        },
                      ],
                    })
                  );
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
      const isChallenge = gear.locations.some(
        (x) => x.nodeData?.table === "Challenge"
      );
      const isFleet = gear.locations.some((x) => x.nodeData?.table === "Fleet");
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
    return Object.values(store.state.relic.relicConfig).reduce((acc, relic) => {
      const days = relic.timeEstimation([
        { level: this.relicLevel ?? 0, target: this.relicTarget },
      ]);
      return days > 0 ? acc + days : acc;
    }, 0);
  }

  // private get totalRemainingShards() {
  //   let amount = 0;
  //   for (let i = this.stars + 1; i <= 7; i++) {
  //     amount += shardMapping[i];
  //   }
  //   return amount;
  // }
  public get ownedShards() {
    return store.state.shards.ownedShards[this.id]?.owned || 0;
  }
  public set ownedShards(value) {
    store.dispatch("shards/saveShardsCount", { count: value, id: this.id });
  }
  public get totalOwnedShards() {
    let amount = 0;
    for (let i = 1; i <= this.stars; i++) {
      amount += shardMapping[i];
    }
    return Math.min(amount + this.ownedShards, 330);
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
}

export interface UnitGear {
  base_id: string;
  is_obtained: boolean;
  slot: number;
}

export interface Ability {
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

interface ICrew {
  unitId: string;
  slot: number;
  skillReferenceList: ICrewSkill[];
  skilllessCrewAbilityId: string;
  gp: number;
  cp: number;
}

interface ICrewSkill {
  skillId: string;
  requiredTier: number;
  requiredRarity: number;
  requiredRelicTier: number;
}

export function unitsByPriority(
  unitsList: Unit[],
  tableNames: string[]
): Unit[] {
  return unitsList.sort((a: Unit, b: Unit) => {
    const priorityA = a.tablePriority(tableNames);
    const priorityB = b.tablePriority(tableNames);

    if (priorityA <= 0) {
      return 1;
    } else if (priorityB <= 0) {
      return -1;
    } else {
      return priorityA > priorityB ? 1 : -1;
    }
  });
}

export function getPercent(
  item: any,
  prerequisiteType: "requirement" | "recommended"
): number {
  let percentage = 0;
  const type = item[prerequisiteType]?.type ?? item.requirement.type;
  const value = item[prerequisiteType]?.value ?? item.requirement.value;
  if (item.id) {
    const unit = getUnit(item.id);
    if (unit) {
      percentage = getUnitPercent(unit, type, value);
    }
  } else if (item.tags) {
    const list = getUnitsByTag(item.tags).map((u) => {
      return getUnitPercent(u, type, value);
    });

    const amountNeeded = item.count ?? 1;
    if (list.length >= amountNeeded) {
      percentage = 100;
    } else {
      for (let i = list.length; i < amountNeeded; i++) {
        list.push(0);
      }
      percentage =
        list.reduce((partialSum, a) => partialSum + a, 0) / list.length;
    }
  }

  if (percentage > 100) {
    return 100;
  } else if (percentage < 0) {
    return 0;
  } else {
    return round2Decimals(percentage);
  }
}

export function getUnitPercent(unit: Unit, type: string, target: number) {
  if (type === "Power") {
    return (unit.power / target) * 100;
  } else if (type === "Relic") {
    const { gearScale, relicScale, shardsScale } = getScale(
      unit.gearLevel,
      target
    );
    const gearPercent = getGearPercent(unit) * gearScale;
    const relicPercent = getRelicPercent(unit, target) * relicScale;
    const shardsPercent = ((unit.totalOwnedShards + 0.01) / 330) * shardsScale;

    return (gearPercent + relicPercent + shardsPercent) * 100;
  } else if (type === "Gear") {
    const { gearScale, shardsScale } = getScale(unit.gearLevel);
    const gearPercent = getGearPercent(unit, target);
    const shardsPercent = (unit.totalOwnedShards + 0.01) / 330;

    return (gearPercent * gearScale + shardsPercent * shardsScale) * 100;
  } else if (type === "Stars") {
    let shardsAmount = 0;
    for (let i = 1; i <= target; i++) {
      shardsAmount += shardMapping[i];
    }
    return Math.min(unit.totalOwnedShards / shardsAmount, 1) * 100;
  }
  return 0;
}

export function getUnitsByTag(
  tags: string[],
  parentIds: string[] = [],
  excludeUnitId: string | null = null
): Unit[] {
  const playerUnits = store.state.player.player?.units ?? [];
  const otherUnits = store.state.unit.unitList;

  return [...playerUnits, ...otherUnits]
    .filter((u: Unit) => {
      if (parentIds.includes(u.id) || u.id === excludeUnitId) {
        return false;
      } else {
        return tags.every((tag) => {
          if (tag === "is_ship") {
            return u.isShip;
          } else if (tag.includes("!")) {
            const notTag = tag.replace("!", "");
            if (notTag === "is_ship") {
              return !u.isShip;
            } else {
              return !u.categories.includes(notTag);
            }
          } else {
            return u.categories.includes(tag);
          }
        });
      }
    })
    .reduce((acc, el) => {
      const match = acc.find((x: any) => x.id === el.id);
      if (!match) {
        acc.push(el);
      }
      return acc;
    }, [] as Unit[]);
}

export function getUnit(unitId: string) {
  const playerUnits = store.state.player.player?.units ?? [];
  const otherUnits = store.state.unit.unitList;
  return [...playerUnits, ...otherUnits].find((x) => x.id === unitId);
}

export function totalProgress(
  prerequisites: IPrerequisite[],
  prerequisiteType: "requirement" | "recommended"
) {
  let list: number[] = [];
  (prerequisites ?? []).forEach((item) => {
    list.push(getPercent(item, prerequisiteType));
  });
  return round2Decimals(
    list.reduce((partialSum, a) => partialSum + a, 0) / list.length
  );
}

export function getPrerequisites(unitId: string) {
  const legendaryUnits: NodeCharacter[] =
    store.state.shards.shardFarming.reduce(
      (characterList: NodeCharacter[], x: FarmingNode) => {
        if (x.id === "legendary" || x.id === "galactic_legends") {
          characterList.push(...x.characters);
        }
        return characterList;
      },
      []
    );
  return legendaryUnits?.find((x) => x.id === unitId)?.prerequisites ?? [];
}

function getGearPercent(unit: Unit, target: number = maxGearLevel) {
  let progress = 0;
  const { gearLevel, gearPiecesCount } = unit;
  const scales = {
    g5: 0.1,
    g8: 0.15,
    g11: 0.2,
    g12: 0.25,
    g13: 0.3,
  };
  let totalScale = 0;
  if (target >= maxGearLevel) {
    totalScale = scales.g13 + scales.g12 + scales.g11 + scales.g8 + scales.g5;
  } else if (target >= 12) {
    totalScale = scales.g12 + scales.g11 + scales.g8 + scales.g5;
  } else if (target >= 11) {
    totalScale = scales.g11 + scales.g8 + scales.g5;
  } else if (target >= 8) {
    totalScale = scales.g8 + scales.g5;
  } else {
    totalScale = scales.g5;
  }

  if (gearLevel >= maxGearLevel) {
    if ((gearLevel - 12) * 6 + gearPiecesCount <= 6) {
      //gear level 12
      progress +=
        (((gearLevel - 12) * 6 + gearPiecesCount) / 6) *
        (scales.g13 / totalScale);
    } else {
      progress += scales.g13;
    }
  }

  if (gearLevel >= 12) {
    if ((gearLevel - 11) * 6 + gearPiecesCount <= 6) {
      //gear level 11
      progress +=
        (((gearLevel - 11) * 6 + gearPiecesCount) / 6) *
        (scales.g12 / totalScale);
    } else {
      progress += scales.g12;
    }
  }

  if (gearLevel >= 11) {
    if ((gearLevel - 8) * 6 + gearPiecesCount <= 18) {
      //gear level 8-10
      progress +=
        (((gearLevel - 8) * 6 + gearPiecesCount) / 6) *
        (scales.g11 / totalScale);
    } else {
      progress += scales.g11;
    }
  }

  if (gearLevel >= 8) {
    if ((gearLevel - 5) * 6 + gearPiecesCount <= 18) {
      //gear level 5-7
      progress +=
        (((gearLevel - 5) * 6 + gearPiecesCount) / 6) *
        (scales.g8 / totalScale);
    } else {
      progress += scales.g8;
    }
  }

  if (gearLevel >= 5) {
    if (gearLevel * 6 + gearPiecesCount <= 30) {
      //gear level 0-4
      progress +=
        ((gearLevel * 6 + gearPiecesCount) / 6) * (scales.g5 / totalScale);
    } else {
      progress += scales.g5;
    }
  }

  return progress / totalScale;
}

function getRelicPercent(unit: Unit, target: number = maxRelicLevel): number {
  const { fragmented_white, incomplete_green, flawed_blue } =
    store.state.relic.relicConfig;
  const whiteProgress = fragmented_white.percentApplied(
    unit.relicLevel,
    target
  );
  const greenProgress = incomplete_green.percentApplied(
    unit.relicLevel,
    target
  );
  const blueProgress = flawed_blue.percentApplied(unit.relicLevel, target);

  return (whiteProgress + greenProgress + blueProgress + 0.01) / 100 / 3;
}

function getScale(gearLevel: number, relicLevel: number | null = null) {
  type tRangeMap = {
    [key: number]: number;
  };

  if (relicLevel) {
    const relicScales: tRangeMap = {
      0: 0,
      1: 0.2,
      2: 0.25,
      3: 0.31,
      4: 0.38,
      5: 0.46,
      6: 0.55,
      7: 0.65,
      8: 0.8,
      9: 1,
      //update when maxRelicLevel changes
    };
    const gearScales: tRangeMap = {
      0: 0,
      1: 0.02,
      2: 0.03,
      3: 0.04,
      4: 0.06,
      5: 0.08,
      6: 0.11,
      7: 0.16,
      8: 0.24,
      9: 0.34,
      10: 0.45,
      11: 0.6,
      12: 0.78,
      13: 1,
      //update if maxGearLevel changes
    };

    const gearRelative = 0.5;
    const relicRelative = 0.4;
    const totalRelative = gearRelative + relicRelative;

    const relicScale =
      (relicScales[relicLevel] /
        relicScales[1] /
        (gearScales[maxGearLevel] / relicScales[1])) *
      relicRelative;
    const gearScale = totalRelative - relicScale;

    return {
      gearScale,
      relicScale,
      shardsScale: 0.1,
    };
  } else {
    if (gearLevel === 12) {
      return {
        gearScale: 0.5,
        relicScale: 0,
        shardsScale: 0.5,
      };
    } else if (gearLevel === 13) {
      return {
        gearScale: 0.57,
        relicScale: 0,
        shardsScale: 0.43,
      };
    } else {
      return {
        gearScale: 1,
        relicScale: 0,
        shardsScale: 0,
      };
    }
  }
}
