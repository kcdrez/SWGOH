import _ from "lodash";

import { maxRelicLevel } from "./relic";
import { Gear, IIngredient, maxGearLevel, getGear } from "./gear";
import store from "vuex-store/store";
import {
  FarmingNode,
  IPrerequisite,
  IPrerequisiteItem,
  NodeCharacter,
  shardMapping,
} from "./shards";
import { round2Decimals } from "utils";
import { CurrencyTypeConfig } from "./currency";
import { anyTagsMatch, tOmicronMode } from "./teams";
import relicMapping from "./relicMapping";
import { iGoalPlayer, iGoalUnit } from "types/goals";

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
  alignment: "Light Side" | "Dark Side" | "Neutral";
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
  crew?: string[];
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
  private _alignment: IUnit["alignment"];
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
  private _crew?: string[];
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
  public get basicAbility() {
    return this._ability_data.find((x) => x.id.startsWith("basicskill"));
  }
  public get specialAbilities() {
    return this._ability_data.filter((x) => x.id.startsWith("specialskill"));
  }
  public get uniqueAbilities() {
    return this._ability_data.filter((x) => x.id.startsWith("uniqueskill"));
  }
  public get leaderAbility() {
    return this._ability_data.find((x) => x.id.startsWith("leaderskill"));
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
    return this._image || `./images/person_light.png`;
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
  public get isLegendary() {
    return [
      "GRANDMASTERYODA",
      "EMPERORPALPATINE",
      "GRANDADMIRALTHRAWN",
      "R2D2_LEGENDARY",
      "BB8",
      "PADMEAMIDALA",
      "COMMANDERLUKESKYWALKER",
      "REYJEDITRAINING",
      "THEMANDALORIANBESKARARMOR",
      "CAPITALCHIMAERA",
      "GRANDINQUISITOR",
      "STARKILLER",
      "JEDIKNIGHTREVAN",
      "DARTHREVAN",
      "CHEWBACCALEGENDARY",
      "C3POLEGENDARY",
      "MILLENNIUMFALCON",
      "DARTHMALAK",
      "GENERALSKYWALKER",
      "JEDIKNIGHTLUKE",
      "CAPITALEXECUTOR",
      "CAPITALPROFUNDITY",
    ].includes(this.id);
  }
  public get isCapitalShip() {
    return this.categories.includes("Capital Ship");
  }
  public get zetas() {
    return this._zeta_abilities ?? [];
  }
  public get omicrons() {
    return this._omicron_abilities ?? [];
  }
  public hasOmicronAbilities(mode?: tOmicronMode) {
    const abilityData = store.state.teams.abilityStatsData[this.id] ?? {};
    const leader = abilityData.leader?.some((ability) => {
      if (mode) {
        return ability.omicron?.mode === mode;
      } else {
        return !!ability.omicron;
      }
    });
    const unique = abilityData.unique?.some((ability) => {
      if (mode) {
        return ability.omicron?.mode === mode;
      } else {
        return !!ability.omicron;
      }
    });
    return leader || unique;
  }
  public get abilityClasses() {
    return this._ability_classes ?? [];
  }
  public get glTier1() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier1 ?? 0;
  }
  public set glTier1(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: val,
      tier2: this.glTier2,
      tier3: this.glTier3,
      tier4: this.glTier4,
      tier5: this.glTier5,
      tier6: this.glTier6,
      id: this.id,
    });
  }
  public get glTier2() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier2 ?? 0;
  }
  public set glTier2(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: this.glTier1,
      tier2: val,
      tier3: this.glTier3,
      tier4: this.glTier4,
      tier5: this.glTier5,
      tier6: this.glTier6,
      id: this.id,
    });
  }
  public get glTier3() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier3 ?? 0;
  }
  public set glTier3(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: this.glTier1,
      tier2: this.glTier2,
      tier3: val,
      tier4: this.glTier4,
      tier5: this.glTier5,
      tier6: this.glTier6,
      id: this.id,
    });
  }
  public get glTier4() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier4 ?? 0;
  }
  public set glTier4(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: this.glTier1,
      tier2: this.glTier2,
      tier3: this.glTier3,
      tier4: val,
      tier5: this.glTier5,
      tier6: this.glTier6,
      id: this.id,
    });
  }
  public get glTier5() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier5 ?? 0;
  }
  public set glTier5(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: this.glTier1,
      tier2: this.glTier2,
      tier3: this.glTier3,
      tier4: this.glTier4,
      tier5: val,
      tier6: this.glTier6,
      id: this.id,
    });
  }
  public get glTier6() {
    return store.state.shards.ownedShards[this.id]?.glFarming?.tier6 ?? 0;
  }
  public set glTier6(val) {
    store.dispatch("shards/glProgressUpdate", {
      tier1: this.glTier1,
      tier2: this.glTier2,
      tier3: this.glTier3,
      tier4: this.glTier4,
      tier5: this.glTier5,
      tier6: val,
      id: this.id,
    });
  }

  public get glTiers() {
    type tGLUnlockMap = {
      [key: string]: {
        [key: string]: {
          tickets: number;
          count: number;
          shards?: number;
          ultMats?: number;
        };
      };
    };

    const glShardsTiers: tGLUnlockMap = {
      JABBATHEHUTT: {
        tier1: {
          tickets: 15,
          count: 6,
          shards: 10,
          ultMats: 0,
        },
        tier2: {
          tickets: 30,
          count: 3,
          shards: 20,
          ultMats: 0,
        },
        tier3: {
          tickets: 60,
          count: 2,
          shards: 50,
          ultMats: 0,
        },
        tier4: {
          tickets: 70,
          count: 2,
          shards: 55,
          ultMats: 0,
        },
        tier5: {
          tickets: 70,
          count: 12,
          ultMats: 1,
        },
        tier6: {
          tickets: 0,
          count: 0,
          shards: 0,
          ultMats: 0,
        },
      },
      JEDIMASTERKENOBI: {
        tier1: {
          tickets: 15,
          count: 8,
          shards: 10,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
        },
        tier3: {
          tickets: 60,
          count: 3,
          shards: 50,
        },
        tier4: {
          tickets: 100, //unknown
          count: 2,
          ultMats: 4,
        },
        tier5: {
          tickets: 100, //unknown
          count: 4,
          ultMats: 4,
        },
        tier6: {
          tickets: 100, //unknown
          count: 4,
          ultMats: 4,
        },
      },
      LORDVADER: {
        tier1: {
          tickets: 15,
          count: 8,
          shards: 10,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
        },
        tier3: {
          tickets: 50, //unknown
          count: 3,
          shards: 50,
        },
        tier4: {
          tickets: 100, //unknown
          count: 2,
          shards: 55,
          ultMats: 4,
        },
        tier5: {
          tickets: 100, //unknown
          count: 4,
          shards: 0,
          ultMats: 4,
        },
        tier6: {
          tickets: 100, //unknown
          count: 4,
          ultMats: 4,
        },
      },
      GRANDMASTERLUKE: {
        1: {
          tickets: 15,
          count: 8,
          shards: 10,
          ultMats: 0,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
          ultMats: 0,
        },
        tier3: {
          tickets: 60,
          count: 3,
          shards: 50,
          ultMats: 0,
        },
        tier4: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier5: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier6: {
          tickets: 70,
          count: 10,
          shards: 0,
          ultMats: 1,
        },
      },
      SUPREMELEADERKYLOREN: {
        tier1: {
          tickets: 15,
          count: 8,
          shards: 10,
          ultMats: 0,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
          ultMats: 0,
        },
        tier3: {
          tickets: 60,
          count: 3,
          shards: 50,
          ultMats: 0,
        },
        tier4: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier5: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier6: {
          tickets: 70,
          count: 10,
          shards: 0,
          ultMats: 1,
        },
      },
      REY: {
        tier1: {
          tickets: 15,
          count: 8,
          shards: 10,
          ultMats: 0,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
          ultMats: 0,
        },
        tier3: {
          tickets: 60,
          count: 3,
          shards: 50,
          ultMats: 0,
        },
        tier4: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier5: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier6: {
          tickets: 70,
          count: 10,
          shards: 0,
          ultMats: 1,
        },
      },
      SITHPALPATINE: {
        tier1: {
          tickets: 15,
          count: 8,
          shards: 10,
          ultMats: 0,
        },
        tier2: {
          tickets: 30,
          count: 4,
          shards: 25,
          ultMats: 0,
        },
        tier3: {
          tickets: 60,
          count: 3,
          shards: 50,
          ultMats: 0,
        },
        tier4: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier5: {
          tickets: 70,
          count: 1,
          shards: 0,
          ultMats: 0,
        },
        tier6: {
          tickets: 70,
          count: 10,
          shards: 0,
          ultMats: 1,
        },
      },
    };
    return glShardsTiers[this.id];
  }

  public get glTicketsForUnlock(): number {
    const { tier1, tier2, tier3, tier4, tier5, tier6 } = this.glTiers;
    const tier1Tickets = tier1.shards
      ? tier1.count * tier1.tickets - this.glTier1 * tier1.tickets
      : 0;
    const tier2Tickets = tier2.shards
      ? tier2.count * tier2.tickets - this.glTier2 * tier2.tickets
      : 0;
    const tier3Tickets = tier3.shards
      ? tier3.count * tier3.tickets - this.glTier3 * tier3.tickets
      : 0;
    const tier4Tickets = tier4.shards
      ? tier4.count * tier4.tickets - this.glTier4 * tier4.tickets
      : 0;
    const tier5Tickets = tier5.shards
      ? tier5.count * tier5.tickets - this.glTier5 * tier5.tickets
      : 0;
    const tier6Tickets = tier6.shards
      ? tier6.count * tier6.tickets - this.glTier6 * tier6.tickets
      : 0;

    return (
      tier1Tickets +
      tier2Tickets +
      tier3Tickets +
      tier4Tickets +
      tier5Tickets +
      tier6Tickets
    );
  }

  public get glTicketsForUlt(): number {
    const { tier1, tier2, tier3, tier4, tier5, tier6 } = this.glTiers;
    const tier1Tickets = tier1.ultMats
      ? tier1.count * tier1.tickets - this.glTier1 * tier1.tickets
      : 0;
    const tier2Tickets = tier2.ultMats
      ? tier2.count * tier2.tickets - this.glTier2 * tier2.tickets
      : 0;
    const tier3Tickets = tier3.ultMats
      ? tier3.count * tier3.tickets - this.glTier3 * tier3.tickets
      : 0;
    const tier4Tickets = tier4.ultMats
      ? tier4.count * tier4.tickets - this.glTier4 * tier4.tickets
      : 0;
    const tier5Tickets = tier5.ultMats
      ? tier5.count * tier5.tickets - this.glTier5 * tier5.tickets
      : 0;
    const tier6Tickets = tier6.ultMats
      ? tier6.count * tier6.tickets - this.glTier6 * tier6.tickets
      : 0;

    return (
      tier1Tickets +
      tier2Tickets +
      tier3Tickets +
      tier4Tickets +
      tier5Tickets +
      tier6Tickets
    );
  }

  public get glTicketsForOther(): number {
    const { tier1, tier2, tier3, tier4, tier5, tier6 } = this.glTiers;
    const tier1Tickets =
      !tier1.ultMats && !tier1.shards
        ? tier1.count * tier1.tickets - this.glTier1 * tier1.tickets
        : 0;
    const tier2Tickets =
      !tier2.ultMats && !tier2.shards
        ? tier2.count * tier2.tickets - this.glTier2 * tier2.tickets
        : 0;
    const tier3Tickets =
      !tier3.ultMats && !tier3.shards
        ? tier3.count * tier3.tickets - this.glTier3 * tier3.tickets
        : 0;
    const tier4Tickets =
      !tier4.ultMats && !tier4.shards
        ? tier4.count * tier4.tickets - this.glTier4 * tier4.tickets
        : 0;
    const tier5Tickets =
      !tier5.ultMats && !tier5.shards
        ? tier5.count * tier5.tickets - this.glTier5 * tier5.tickets
        : 0;
    const tier6Tickets =
      !tier6.ultMats && !tier6.shards
        ? tier6.count * tier6.tickets - this.glTier6 * tier6.tickets
        : 0;

    return (
      tier1Tickets +
      tier2Tickets +
      tier3Tickets +
      tier4Tickets +
      tier5Tickets +
      tier6Tickets
    );
  }

  public get capitalShipRefreshes() {
    return store.state.shards.ownedShards[this.id]?.capitalShipRefreshes ?? 0;
  }

  public set capitalShipRefreshes(val) {
    store.dispatch("shards/capitalShipUpdate", {
      refreshes: val,
      id: this.id,
    });
  }

  public get capitalShipEventFrequency() {
    type tFrequencyMap = {
      [key: string]: number;
    };

    const map: tFrequencyMap = {
      CAPITALFINALIZER: 2,
      CAPITALRADDUS: 2,
      CAPITALMONCALAMARICRUISER: 1,
      CAPITALEXECUTOR: 1,
      CAPITALPROFUNDITY: 1,
      CAPITALJEDICRUISER: 1,
      CAPITALSTARDESTROYER: 1,
    };
    return map[this.id] ?? 1;
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
    const list: number[] = [];
    for (let i = (this.gearLevel || 0) + 1; i <= maxGearLevel; i++) {
      list.push(i);
    }
    return list;
  }

  public get relicOptions() {
    const list: number[] = [];
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
        if (mod.primary_stat.stat_id === 56) {
          percent += mod.primary_stat.value / 100;
        }

        mod.secondary_stats.forEach((stat) => {
          if (stat.stat_id === 28) {
            amount += stat.value / 10000;
          } else if (stat.stat_id === 56) {
            percent += stat.value / 100;
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
        if (mod.primary_stat.stat_id === 55) {
          percent += mod.primary_stat.value / 100;
        }

        mod.secondary_stats.forEach((stat) => {
          if (stat.stat_id === 1) {
            amount += stat.value / 10000;
          }
          if (stat.stat_id === 55) {
            percent += stat.value / 100;
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
  public get healthSteal() {
    return this._stats["27"];
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
  public get armorPen() {
    return this._stats["10"];
  }
  public get resistancePen() {
    return this._stats["11"];
  }
  private getBaseDefense(armor: number): number {
    const defenseFinal = (armor * 637.5) / (100 - armor);
    if (this._mods) {
      let amount = 0;
      let percent = 0;
      percent += this.defenseSetsCount * 25;

      this._mods.forEach((mod) => {
        if (mod.primary_stat.stat_id === 49) {
          percent += mod.primary_stat.value / 100;
        }

        mod.secondary_stats.forEach((stat) => {
          if (stat.stat_id === 42) {
            amount += stat.value / 10000;
          }
          if (stat.stat_id === 49) {
            percent += stat.value / 100;
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
        if (mod.primary_stat.stat_id === 5) {
          amount += mod.primary_stat.value;
        }

        mod.secondary_stats.forEach((stat) => {
          if (stat.stat_id === 5) {
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
      if (mod.primary_stat.stat_id === 48) {
        percent += mod.primary_stat.value;
      }

      mod.secondary_stats.forEach((stat) => {
        if (stat.stat_id === 41) {
          //41 = flat offense, 53 = crit chance, 48 offense percent
          amount += stat.value;
        } else if (stat.stat_id === 48) {
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
      mod.secondary_stats.forEach((stat) => {
        if (stat.stat_id === 53) {
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
      if (mod.primary_stat.stat_id === 56) {
        amount += mod.primary_stat.value;
      }
    });
    return round2Decimals(amount);
  }
  public get baseCritDamage() {
    return this.critDamage - this.modCritDamage;
  }

  public get physicalCritAvoid() {
    return this._stats["39"];
  }
  public get specialCritAvoid() {
    return this._stats["40"];
  }

  public get physicalDodge() {
    return this._stats["12"];
  }
  public get specialDodge() {
    return this._stats["13"];
  }

  public get physicalAccuracy() {
    return this._stats["37"];
  }
  public get specialAccuracy() {
    return this._stats["38"];
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

  public fullSalvageList(gearTarget?: number) {
    let list: Gear[] = [];
    this.fullGearListByLevel.forEach(({ tier, gear: gearList }: any) => {
      if (tier + 1 <= (gearTarget ?? this.gearTarget)) {
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

    this.fullSalvageList().forEach((gear: Gear) => {
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

  public getGearRequiredToUnlock(
    gearIdToFind: string,
    alreadyIncluded: string[] = []
  ) {
    if (alreadyIncluded.includes(this.id)) {
      return 0;
    } else {
      alreadyIncluded.push(this.id);
    }

    const subTotal = (this.gearList ?? []).reduce(
      (totalAmount, unitTier: UnitTier) => {
        unitTier.gear.forEach((gearId: string) => {
          const gearMatch = this.gearData(gearId);
          if (gearMatch) {
            if (gearIdToFind === gearId) {
              totalAmount += gearMatch.totalAmount;
            } else {
              gearMatch.ingredients.forEach((ingredient) => {
                if (ingredient.gear === gearIdToFind) {
                  totalAmount += ingredient.amount;
                }
              });
            }
          }
        });
        return totalAmount;
      },
      0
    );
    const prerequisitesTotal = getPrerequisites(this.id).reduce(
      (total, prerequisite) => {
        const unit = getUnit(prerequisite?.id ?? "");
        if (unit && !alreadyIncluded.includes(unit.id)) {
          total += unit.getGearRequiredToUnlock(gearIdToFind, alreadyIncluded);
        }
        return total;
      },
      0
    );
    return subTotal + prerequisitesTotal;
  }

  public getRelicsRequiredToUnlock(
    relicId: string,
    relicLevel: number = 0,
    alreadyIncluded: string[] = []
  ) {
    if (alreadyIncluded.includes(this.id)) {
      return 0;
    } else {
      alreadyIncluded.push(this.id);
    }

    const mapping = relicMapping[relicId];
    const amountNeeded = mapping.totalAmountNeeded(relicLevel);

    const prerequisitesTotal = getPrerequisites(this.id).reduce(
      (total, prerequisite) => {
        const unit = getUnit(prerequisite?.id ?? "");
        if (
          unit &&
          !alreadyIncluded.includes(unit.id) &&
          prerequisite.requirement?.type === "Relic"
        ) {
          total += unit.getRelicsRequiredToUnlock(
            relicId,
            prerequisite.requirement?.value,
            alreadyIncluded
          );
        }
        return total;
      },
      0
    );

    return amountNeeded + prerequisitesTotal;
  }

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
      } else if (node.id === "guild_events_store3") {
        arr.push("get3");
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
    return getGear(id);
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
  rarity: number; //pips
  character: number;
  reroll_count: number;
  primary_stat: iModPrimaryStat;
  secondary_stats: iModSecondaryStat[];
}

interface iModPrimaryStat {
  stat_id: number;
  value: number;
  name: string;
  display_value: string;
}

interface iModSecondaryStat extends iModPrimaryStat {
  roll: number;
  unscaled_roll_values: number;
  stat_max: number;
  stat_min: number;
  stat_rolls: string[];
}

export interface UnitTier {
  tier: number;
  gear: string[];
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
  item: IPrerequisite,
  prerequisiteType: "requirement" | "recommended",
  playerUnit?: iGoalUnit | null
): number {
  let percentage = 0;
  const type = item[prerequisiteType]?.type ?? item?.requirement?.type;
  const value = item[prerequisiteType]?.value ?? item?.requirement?.value;
  if (item.id) {
    const unit = getUnit(item.id);
    if (unit) {
      percentage = getUnitPercent(unit, type, value, playerUnit);
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

export function getUnitPercent(
  unit: Unit,
  type: string | undefined,
  target: number = 0,
  playerUnit?: iGoalUnit | null
) {
  let power = 0;
  let gearLevel = 0;
  let relicLevel = 0;
  let starsLevel = 0;
  let shardsAmount = 0;
  let gearPieces = 0;
  // const { gearLevel, gearPiecesCount } = unit;

  if (playerUnit) {
    power = playerUnit.power;
    gearLevel = playerUnit.gear_level;
    relicLevel = playerUnit.relic_tier;
    starsLevel = playerUnit.stars;

    for (let i = 1; i <= starsLevel; i++) {
      shardsAmount += shardMapping[i];
    }
  } else if (playerUnit === null) {
    //do nothing, keep everything at 0
  } else {
    power = unit.power;
    power = unit.power;
    gearLevel = unit.gearLevel;
    relicLevel = unit.relicLevel;
    starsLevel = unit.stars;
    shardsAmount = unit.totalOwnedShards;
  }

  if (type === "Power") {
    return (power / target) * 100;
  } else if (type === "Relic") {
    const { gearScale, relicScale, shardsScale } = getScale(gearLevel, target);
    const gearPercent =
      getGearPercent(gearLevel, gearPieces, maxGearLevel) * gearScale;
    const relicPercent = getRelicPercent(unit, target, relicLevel) * relicScale;

    const shardsPercent = ((shardsAmount + 0.01) / 330) * shardsScale;

    return (gearPercent + relicPercent + shardsPercent) * 100;
  } else if (type === "Gear") {
    const { gearScale, shardsScale } = getScale(gearLevel);
    const gearPercent =
      getGearPercent(gearLevel, gearPieces, maxGearLevel) * gearScale;
    const shardsPercent = (shardsAmount + 0.01) / 330;

    return (gearPercent * gearScale + shardsPercent * shardsScale) * 100;
  } else if (type === "Stars") {
    let totalShardsNeeded = 0;
    for (let i = 1; i <= target; i++) {
      totalShardsNeeded += shardMapping[i];
    }
    return Math.min(shardsAmount / totalShardsNeeded, 1) * 100;
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
  const playerUnits = store.state.player.player
    ? store.state.player.player?.units
    : [];
  const otherUnits = store.state.unit.unitList ?? [];
  return [...playerUnits, ...otherUnits].find((x) => x.id === unitId);
}

export function totalProgress(
  prerequisites: IPrerequisite[],
  prerequisiteType: "requirement" | "recommended",
  playerUnits?: iGoalPlayer["units"]
) {
  let progress = 0;
  const typeList = prerequisites.map((x) => x.requirement?.type);
  (prerequisites ?? []).forEach((item) => {
    const scale = getTypeScale(item.requirement?.type, typeList);
    const match = playerUnits?.find((x) => x.base_id === item.id);
    progress +=
      getPercent(
        item,
        prerequisiteType,
        playerUnits ? match ?? null : undefined
      ) * scale;
  });
  return round2Decimals(progress);
}

export function guildGoalProgress(
  prerequisites: IPrerequisite[],
  prerequisiteType: "requirement" | "recommended",
  units: any[]
) {
  let progress = 0;
  const typeList = prerequisites.map((x) => x.requirement?.type);
  (prerequisites ?? []).forEach((item) => {
    const scale = getTypeScale(item.requirement?.type, typeList);
    progress += getPercent(item, prerequisiteType) * scale;
  });
  return round2Decimals(progress);
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

function getGearPercent(
  gearLevel: number = 0,
  gearPiecesCount: number = 0,
  target: number = maxGearLevel
) {
  let progress = 0;

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
    progress += totalScale;
  } else if (gearLevel === 12) {
    if (target <= 12) {
      progress += totalScale;
    } else {
      progress +=
        scales.g5 +
        scales.g8 +
        scales.g11 +
        scales.g12 +
        scales.g13 * (gearPiecesCount / 6);
    }
  } else if (gearLevel === 11) {
    if (target <= 11) {
      progress += totalScale;
    } else {
      progress +=
        scales.g5 + scales.g8 + scales.g11 + scales.g12 * (gearPiecesCount / 6);
    }
  } else if (gearLevel >= 8 && gearLevel < 11) {
    if (target <= gearLevel) {
      progress += totalScale;
    } else {
      //target is 9+, value 8-10, target is greater than value
      const diff = Math.min(target - gearLevel, 11 - 8); //1-3
      const totalPiecesNeeded = diff * 6;
      const totalPiecesEquipped = (gearLevel - 8) * 6 + gearPiecesCount;
      progress +=
        scales.g5 +
        scales.g8 +
        scales.g11 * (totalPiecesEquipped / totalPiecesNeeded);
    }
  } else if (gearLevel >= 5 && gearLevel < 8) {
    if (target <= gearLevel) {
      progress += totalScale;
    } else {
      //target is 6+, value 5-7, target is greater than value
      const diff = Math.min(target - gearLevel, 8 - 5); //1-3
      const totalPiecesNeeded = diff * 6;
      const totalPiecesEquipped = (gearLevel - 5) * 6 + gearPiecesCount;
      progress +=
        scales.g5 + scales.g8 * (totalPiecesEquipped / totalPiecesNeeded);
    }
  } else {
    if (target <= gearLevel) {
      progress += totalScale;
    } else {
      //target is 4+, value 0-4, target is greater than value
      const diff = Math.min(target - gearLevel, 5); //1-5
      const totalPiecesNeeded = diff * 6;
      const totalPiecesEquipped = gearLevel * 6 + gearPiecesCount;
      progress += scales.g5 * (totalPiecesEquipped / totalPiecesNeeded);
    }
  }

  return Math.min(progress / totalScale, 1);
}

function getRelicPercent(
  unit: Unit,
  target: number = maxRelicLevel,
  value: number = 0
): number {
  value = value || unit.relicLevel;
  const { fragmented_white, incomplete_green, flawed_blue } =
    store.state.relic.relicConfig;
  const whiteProgress = fragmented_white.percentApplied(value, target);
  const greenProgress = incomplete_green.percentApplied(value, target);
  const blueProgress = flawed_blue.percentApplied(value, target);

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

function getTypeScale(
  type: IPrerequisiteItem["type"],
  typeList: IPrerequisiteItem["type"][]
): number {
  const hasRelics = typeList.some((x) => x === "Relic");
  const hasGear = typeList.some((x) => x === "Gear");
  const hasStars = typeList.some((x) => x === "Stars");
  const hasPower = typeList.some((x) => x === "Power");

  if (hasRelics && hasGear && hasStars && hasPower) {
    if (type === "Gear") {
      return 0.3 / typeList.filter((x) => x === "Gear").length;
    } else if (type === "Relic") {
      return 0.4 / typeList.filter((x) => x === "Relic").length;
    } else if (type === "Stars") {
      return 0.1 / typeList.filter((x) => x === "Stars").length;
    } else if (type === "Power") {
      return 0.2 / typeList.filter((x) => x === "Power").length;
    }
  } else if (hasGear && hasStars && hasPower) {
    if (type === "Gear") {
      return 0.5 / typeList.filter((x) => x === "Gear").length;
    } else if (type === "Stars") {
      return 0.3 / typeList.filter((x) => x === "Stars").length;
    } else if (type === "Power") {
      return 0.2 / typeList.filter((x) => x === "Power").length;
    }
  } else if (hasRelics && hasStars && hasPower) {
    if (type === "Relic") {
      return 0.8 / typeList.filter((x) => x === "Relic").length;
    } else if (type === "Stars") {
      return 0.1 / typeList.filter((x) => x === "Stars").length;
    } else if (type === "Power") {
      return 0.1 / typeList.filter((x) => x === "Power").length;
    }
  } else if (hasRelics && hasPower) {
    if (type === "Relic") {
      return 0.8 / typeList.filter((x) => x === "Relic").length;
    } else if (type === "Power") {
      return 0.2 / typeList.filter((x) => x === "Power").length;
    }
  } else if (hasRelics && hasStars) {
    if (type === "Relic") {
      return 0.8 / typeList.filter((x) => x === "Relic").length;
    } else if (type === "Stars") {
      return 0.2 / typeList.filter((x) => x === "Stars").length;
    }
  } else if (hasGear && hasPower) {
    if (type === "Gear") {
      return 0.7 / typeList.filter((x) => x === "Gear").length;
    } else if (type === "Power") {
      return 0.3 / typeList.filter((x) => x === "Power").length;
    }
  } else if (hasGear && hasStars) {
    if (type === "Gear") {
      return 0.7 / typeList.filter((x) => x === "Gear").length;
    } else if (type === "Stars") {
      return 0.3 / typeList.filter((x) => x === "Stars").length;
    }
  } else if (hasRelics || hasGear || hasStars || hasPower) {
    return 1 / typeList.length;
  }

  return 0;
}
