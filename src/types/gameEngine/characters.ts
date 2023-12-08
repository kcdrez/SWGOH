import { v4 as uuid } from "uuid";
import { round } from "lodash";
import _ from "lodash";

import { randomNumber, unvue } from "utils";
import abilities from "types/abilities";
import { Ability, IUnit, Unit } from "types/unit";
import {
  iBuff,
  iDebuff,
  iStatusEffect,
  tStatusEffect,
  tBuff,
  tDebuff,
} from "./statusEffects";
import {
  iBasicAbility,
  iSpecialAbility,
  iUniqueAbility,
  iGeneralAbility,
  iAbility,
} from "./abilities";
import {
  iTrigger,
  iEffect,
  iCondition,
  iTriggerData,
  iAction,
  gameEngine,
  Log,
  tLogData,
} from "./gameEngine";

export interface iStats {
  /** The maximum amount of health */
  maxHealth: number;
  /** The current health, used to determine if the unit is dead or not */
  health: number;
  /** The maximum amount of protection */
  maxProtection: number;
  /** The current protection, which is depleted first before health */
  protection: number;
  /** How soon a unit takes a turn */
  speed: number;
  /** The physical attributes */
  physical: {
    /** Used to determine how much damage will be dealt for physical attacks */
    offense: number;
    /** Used to determine how much of the opponent's physical offense will be mitigated prior to calculating damage. TODO: check if this is a percent or flat value */
    armor: number;
    /** The amount of the opponent's armor will be ignored */
    armorPen: number;
    /** The chances of scoring a critical hit (decimal) */
    critChance: number;
    /** The amount of the opponent's dodge that is ignored */
    accuracy: number;
    /** The chances of evading an attack/effect (decimal) */
    dodge: number;
    /** The amount of the opponent's critChance that will be mitigated (decimal) */
    critAvoid: number;
  };
  /** The special attributes */
  special: {
    /** Used to determine how much damage will be dealt for special attacks */
    offense: number;
    /** Used to determine how much of the opponent's special offense will be mitigated prior to calculating damage. (aka resistance). TODO: check if this is a percent or flat value */
    armor: number;
    /** The amount of the opponent's armor (resistance) will be ignored */
    armorPen: number;
    /** The chances of scoring a critical hit (decimal) */
    critChance: number;
    /** The amount of the opponent's dodge that is ignored */
    accuracy: number;
    /** The chances of evading an attack/effect (decimal) */
    dodge: number;
    /** The amount of the opponent's critChance that will be mitigated (decimal) */
    critAvoid: number;
  };
  /** How much extra damage a critical hit will deal (decimal) */
  critDamage: number;
  /** The chances of resisting a negative status effect (decimal) */
  tenacity: number;
  /** The chances of successfulling inflicing a negative status effect (decimal) */
  potency: number;
  /** The amount of health that will be healed when dealing damage (decimal) */
  healthSteal: number;
  /** The amount of mastery that a unit has which will scale other stats based on role */
  mastery: number;
}

export interface iStatsCheck {
  /** The stat that will be modified
   *
   * armor: Increases the amount of offense to mitigate
   *
   * counterChance: The chances of counter attacking (as a decimal)
   *
   * counterDamage: The amount of damage used to scale offense (as a decimal; e.g. 1.5 would be 150% damage)
   *
   * critAvoid: The chances to mitigate a critical hit (as a decimal)
   *
   * critChance: The chances of getting a critical hit (as a decimal)
   *
   * dodge: The chances of missing an attack/effect
   *
   * health: The amount of health
   *
   * maxHealth/maxProtection: The max health or protection
   *
   * offense: The amount of damage an attack deals
   *
   * potency: The chances a negative status effect will successful be inflicted
   *
   * protection: The amount of protection
   *
   * tenacity: The chances to mitigate a negative status effect
   */
  statToModify:
    | "baseTenacity"
    | "baseHealth"
    | "baseArmor"
    | "baseProtection"
    | "baseOffense"
    | "basePotency"
    | "armor"
    | "counterChance"
    | "counterDamage"
    | "critAvoid"
    | "critChance"
    | "dodge"
    | "health"
    | "maxHealth"
    | "maxProtection"
    | "offense"
    | "potency"
    | "protection"
    | "resistance"
    | "tenacity";
  /** The amount that the stat will be modified */
  amount: number;
  /** Determines if the stat will added to the existing stat (additive) or multiplied together (multiplicative) */
  modifiedType: "additive" | "multiplicative";
  /** Todo: whats this? */
  amountType?: "greater" | "less";
  /** Determines when the effect will expire and thus be removed */
  expires?: {
    /** How many cycles before the effect is removed */
    count: number;
    /** How often the effect is checked to see if it should be removed */
    frequency: "turn";
  };
  /** Todo: whats this for? */
  stacking?: boolean;
}

/** Used to determine if another unit should assist */
export interface iAssist {
  /** The condition in which the assist should occur */
  condition?: iCondition;
  /** The chance that the assist will occur. Use a decimal (e.g. 0.4 would be a 40% chance of assisting) */
  chance: number;
  /** Modify the stats being used to increase or decrease the damage being dealt */
  modifier: {
    /** The stats in which should be modified */
    stats: iStatsCheck;
    /** The condition to check if the damage should be modified */
    condition?: iCondition;
  };
  /** Who are valid targets to call for the assist */
  targets?: iTargetData;
}

/** Various filters used to determine who should be targeted */
export interface iTargetData {
  filters?: {
    /** A list of specific characters that should be targeted */
    targetIds?: string[];
    /** A list of tags (such as Rebel or Light Side) used to determine who should be targetted. Can use '!' (not) or '&' (and) to combine with any other tags */
    tags?: string[];
    /** Determines if any units should be targeted with specific status effects */
    statusEffects?: tStatusEffect[];
    /** Determines if any units should be targeted with specific debuffs */
    debuffs?: tDebuff[];
    /** Determines if any units should be targeted with specific buffs */
    buffs?: tBuff[];
    /** Determines if a specific number of stacks exists on target for a given buff, debuff, or status effect */
    stacks?: number;
    /** Determines if a buff, debuff, or status effect has a certain number of turns left before it is removed */
    duration?: number;
    /** Determines if the target is the leader or not */
    isLeader?: boolean;
    /** Determines if the primary target should be targetted again */
    primary?: boolean;
  }[];
  /** Determines if the weakest unit should be targeted */
  weakest?: boolean;
  /** Determines how many units of the given filters should be selected */
  targetCount?: number;
  /** Determines if the filtering should ignore any taunt effects */
  ignoreTaunt?: boolean;
  /** Determines if the character itself should be targeted */
  self?: boolean;
  /** Determines if the character's allies should be targeted */
  allies?: boolean;
}

export class Character {
  private _baseStats: iStats;
  private _name: string;
  private _id: string;
  private _tm: number = 0;
  private _buffs: iBuff[];
  private _debuffs: iDebuff[];
  private _statusEffects: iStatusEffect[] = [];
  private _activeAbilities: (iBasicAbility | iSpecialAbility)[];
  private _uniqueAbilities: iUniqueAbility[];
  private _leaderAbility: iUniqueAbility | null;
  private _owner: string;
  private _tempStats: iStatsCheck[] = [];
  private _alignment: IUnit["alignment"];
  private _role: IUnit["role"];
  private _primaryStat: IUnit["primaryStat"];
  private _categories: string[];
  private _triggers: iTrigger[] = [];
  private _teammates: Character[] = [];
  private _opponents: Character[] = [];
  public isLeader: boolean = false;

  constructor(data: Unit, owner: string, isLeader?: boolean) {
    this._baseStats = {
      maxHealth: data.health,
      health: data.health,
      maxProtection: data.protection,
      protection: data.protection,
      speed: data.speed,
      physical: {
        offense: data.offense.physical,
        armor: (data.physicalArmor * 637.5) / (100 - data.physicalArmor),
        armorPen: data.armorPen,
        critChance: data.critChance.physical / 100,
        accuracy: data.physicalAccuracy / 100,
        dodge: data.physicalDodge / 100,
        critAvoid: data.physicalCritAvoid / 100,
      },
      special: {
        offense: data.offense.special,
        armor: (data.armor.special * 637.5) / (100 - data.armor.special),
        armorPen: data.resistancePen,
        critChance: data.critChance.special / 100,
        accuracy: data.specialAccuracy / 100,
        dodge: data.specialDodge / 100,
        critAvoid: data.specialCritAvoid / 100,
      },
      critDamage: data.critDamage / 100,
      tenacity: data.tenacity / 100,
      potency: data.potency / 100,
      healthSteal: data.healthSteal,
      mastery: data.mastery,
    };

    this._name = data.name;
    this._id = data.id;
    this._buffs = [];
    this._debuffs = [];
    this._activeAbilities = [
      ...data.specialAbilities,
      data.basicAbility,
    ].reduce(
      (
        acc: (iBasicAbility | iSpecialAbility)[],
        ability: Ability | undefined
      ) => {
        const abilitiesMap = abilities[data.id];
        const abilityId = ability?.id ?? "";
        if (abilityId && abilityId in abilitiesMap) {
          acc.push(_.cloneDeep(abilitiesMap[abilityId]));
        }
        return acc;
      },
      []
    );

    this._uniqueAbilities = data.uniqueAbilities
      .reduce((acc: iUniqueAbility[], ability: Ability | undefined) => {
        const abilitiesMap = abilities[data.id];
        const abilityId = ability?.id ?? "";
        if (abilityId && abilityId in abilitiesMap) {
          acc.push(_.cloneDeep(abilitiesMap[abilityId]));
        }
        return acc;
      }, [])
      .sort(function (a, b) {
        if (a.sort && b.sort) {
          return a.sort > b.sort ? 1 : -1;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      });
    this._leaderAbility = (() => {
      const abilitiesMap = abilities[data.id];
      const abilityId = data.leaderAbility?.id ?? "";
      if (abilityId && abilityId in abilitiesMap) {
        return _.cloneDeep(abilitiesMap[abilityId]);
      }
      return null;
    })();
    this._owner = owner;
    this._alignment = data.alignment;
    this._categories = data.categories;
    this._role = data.role;
    this._primaryStat = data.primaryStat;
    this.isLeader = isLeader ?? false;
  }

  /** The maximum amount of Protection, modified by effects */
  public get maxProtection() {
    return this.getModifiedStats(
      [],
      this.baseProtection,
      this.getTempStat("maxProtection")
    );
  }
  /** The amount of Protection, adjusted by mastery */
  public get baseProtection() {
    let stat = this._baseStats.maxProtection;

    if (this.role === "Tank") {
      if (this._primaryStat === "str") {
        stat += 220 * this.mastery;
      } else if (this._primaryStat === "agi") {
        stat += 200 * this.mastery;
      } else if (this._primaryStat === "tac") {
        stat += 230 * this.mastery;
      }
    }

    return stat;
  }
  /** The maximum amount of Health, modified by effects */
  public get maxHealth() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Health Down"),
          value: -0.2,
        },
        {
          hasEffect: this.hasBuff("Health Up"),
          value: 0.15,
        },
        {
          hasEffect: this.hasBuff("Translation"),
          value: 0.3,
        },
      ],
      this.baseHealth,
      this.getTempStat("maxHealth")
    );
  }
  /** The amount of Health, adjusted by mastery */
  public get baseHealth() {
    let stat = this._baseStats.maxHealth;

    if (this.role === "Tank") {
      if (this._primaryStat === "agi") {
        stat += 120 * this.mastery;
      }
    } else if (this.role === "Healer") {
      if (this._primaryStat === "str") {
        stat += 420 * this.mastery;
      } else if (this._primaryStat === "agi") {
        stat += 225 * this.mastery;
      } else if (this._primaryStat === "tac") {
        stat += 300 * this.mastery;
      }
    }

    return stat;
  }
  /** The current Health */
  public get health() {
    return this._baseStats.health;
  }
  /** Adjust the amount of current Health */
  public set health(val) {
    this._baseStats.health = Math.max(val, 0);
    if (this._baseStats.health > this._baseStats.maxHealth) {
      this._baseStats.health = this._baseStats.maxHealth;
    }
  }
  /** The current Protection */
  public get protection() {
    return this._baseStats.protection;
  }
  /** Adjust the amount of current Protection */
  public set protection(val) {
    if (val < 0) {
      this.health += val;
      this._baseStats.protection = 0;
    } else {
      this._baseStats.protection = Math.max(val, 0);
    }

    if (this._baseStats.protection > this._baseStats.maxProtection) {
      this._baseStats.protection = this._baseStats.maxProtection;
    }
  }
  /** Is the character dead */
  public get isDead() {
    return this.health <= 0;
  }
  /** Does the character have a Taunt effect (Taunt, Marked, Deathmark) */
  public get hasTauntEffect(): boolean {
    return (
      this.hasBuff("Taunt") ||
      this.hasDebuff(["Marked"]) ||
      this.hasDebuff(["Deathmark"])
    );
  }
  /** Heals the character for a determined amount of health or protection
   *
   * @healData (iEffect["heal"]) - The data that determines how much and what type of healing to do
   * @ability (iGeneralAbility | null) - The ability that has the heal effect
   * @amountSource (number) - The amount to be healed
   */
  public heal(
    healData: iEffect["heal"],
    ability?: iGeneralAbility | null,
    amountSource?: number
  ): Log[] {
    const logs: Log[] = [];

    if (healData && !this.isDead) {
      const { healthType, amountType, amount: healAmount } = healData;

      if (!amountSource) {
        amountSource =
          healthType === "health" ? this.maxHealth : this.maxProtection;
      }

      const maxStat =
        healthType === "health" ? this.maxHealth : this.maxProtection;

      const finalAmount =
        amountType === "multiplicative"
          ? (healAmount ?? 1) * amountSource
          : healAmount ?? 0;

      let diff = 0;
      if (this[healthType] + finalAmount > maxStat) {
        diff = maxStat - this[healthType];
      } else {
        diff = finalAmount;
      }
      this[healthType] += finalAmount;

      if (diff > 0) {
        logs.push(
          new Log({
            character: this,
            heal: { amount: round(diff), type: healthType },
            ability: { source: ability as iAbility },
          })
        );
      }
    }
    return logs;
  }
  /** The current Health Steal (decimal), adjusted by effects */
  public get healthSteal() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Health Steal Down"),
          value: -0.5,
        },
        {
          hasEffect: this.hasBuff("Health Steal Up"),
          value: 0.5,
        },
      ],
      this.baseHealthSteal,
      this.getTempStat("healthSteal")
    );
  }
  /** The base Health Steal (decimal), adjusted by mastery */
  public get baseHealthSteal() {
    let stat = this._baseStats.healthSteal;

    if (this.role === "Tank") {
      if (this._primaryStat === "str") {
        stat += 0.0015 * this.mastery;
      }
    } else if (this.role === "Healer") {
      if (this._primaryStat === "str") {
        stat *= 0.0015 * this.mastery;
      }
    }
    return stat;
  }
  /** The current Speed, adjusted by effects  */
  public get speed() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Speed Down"),
          value: -0.25,
        },
        {
          hasEffect: this.hasBuff("Speed Up"),
          value: 0.25,
        },
      ],
      this._baseStats.speed,
      this.getTempStat("speed"),
      true
    );
  }
  /** The Base Speed with no effects */
  public get baseSpeed() {
    return this._baseStats.maxProtection;
  }
  public get mastery() {
    return this.getModifiedStats(
      [],
      this._baseStats.mastery,
      this.getTempStat("mastery"),
      true
    );
  }
  /** The current Critical Damage (decimal), adjusted by effects */
  public get critDamage() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasBuff("Call to Action"),
          value: 0.5,
        },
        {
          hasEffect: this.hasDebuff("Critical Damage Down"),
          value: -0.5,
        },
        {
          hasEffect: this.hasBuff("Critical Damage Up"),
          value: 0.5,
        },
      ],
      this.baseCritDamage,
      this.getTempStat("critDamage")
    );
  }
  /** The base Critical Damage (decimal), adjusted by mastery */
  public get baseCritDamage() {
    let stat = this._baseStats.critDamage;

    if (this.role === "Attacker") {
      if (this._primaryStat === "agi") {
        stat += 0.003 * this.mastery;
      }
    } else if (this.role === "Support") {
      if (this._primaryStat === "agi") {
        stat *= 0.003 * this.mastery;
      }
    }
    return stat;
  }
  /** The current Tenacity (decimal), adjusted by effects */
  public get tenacity() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Tenacity Down"),
          value: -Infinity,
        },
        {
          hasEffect: this.hasBuff("Tenacity Up"),
          value: Infinity,
        },
      ],
      this._baseStats.tenacity,
      this.getTempStat("tenacity")
    );
  }
  /** The base Tenacity (decimal) with no effects */
  public get baseTenacity() {
    return this._baseStats.tenacity;
  }
  /** The current Potency (decimal), adjusted by effects */
  public get potency() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Potency Down"),
          value: -0.5,
        },
        {
          hasEffect: this.hasBuff("Potency Up"),
          value: 0.5,
        },
      ],
      this._baseStats.potency,
      this.getTempStat("potency")
    );
  }
  /** The base Potency (decimal) with no effects */
  public get basePotency() {
    return this._baseStats.potency;
  }
  /** The likelyhood (decimal) of counter attacking */
  public get counterChance() {
    if (this.hasDebuff("Stun") || this.hasDebuff("Daze")) {
      return 0;
    }

    const chance = this.getModifiedStats(
      [],
      0,
      this.getTempStat("counterChance")
    );
    return chance;
  }
  /** The amount of damage (decimal) that a counter attack will be increased by */
  public get counterDamage() {
    const damageAmount = this.getModifiedStats(
      [],
      1,
      this.getTempStat("counterDamage")
    );
    return damageAmount;
  }
  /** Call an ally to assist with their basic attack
   *
   * @param assistData - The data in which is used to determine how to assist
   * @param targetCharacter - The character in which is being attacked
   * @returns - A array of logs of what occurred
   */
  private callAllyToAssist(
    assistData: iAssist,
    targetCharacter: Character
  ): Log[] {
    const logs: Log[] = [];
    if (assistData && !targetCharacter.isDead) {
      if (chanceOfEvent(assistData.chance * 100)) {
        const { targetList } = this.findTargets(
          assistData?.targets ?? {},
          targetCharacter,
          { assisting: false }
        );
        targetList.forEach((ally) => {
          logs.push(
            ...ally.assist(
              assistData.modifier,
              targetCharacter.owner === this.owner ? null : targetCharacter
            )
          );
        });
      }
    }
    return logs;
  }

  /** Assists with their basic attack
   *
   * @param modifier - Data to check if the assist should trigger and how to modify the damage if applicable
   * @param targetCharacter - The character in which is being attacked
   * @returns - A array of logs of what occurred
   */
  public assist(
    modifier: iAssist["modifier"],
    targetCharacter: Character | null
  ): Log[] {
    const logs: Log[] = [];

    if (this.basicAbility) {
      if (!modifier || this.checkCondition(modifier.condition, this)) {
        const basicAbility: iAbility = unvue(this.basicAbility);
        basicAbility.actions?.forEach((action) => {
          action.targets = { filters: [{ primary: true }] };
        });

        logs.push(new Log({ character: this, effects: { assisted: true } }));
        if (!this.hasDebuff("Stun") && !this.hasDebuff("Daze")) {
          logs.push(
            ...this.useAbility(
              basicAbility,
              modifier.stats,
              targetCharacter,
              false
            )
          );
        }
      }
    }
    return logs;
  }

  /** The physical stats of a character */
  public get physical() {
    const self = this;
    return {
      /** Current Physical offense, adjusted for all effects */
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          this.baseOffense,
          self.getTempStat("offense"),
          true
        );
      },
      /** Base Physical Offense, adjusted for mastery increases */
      get baseOffense() {
        let stat = self._baseStats.physical.offense;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "agi") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 27 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 12 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Crit Chance (decimal), adjusted for all effects */
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
            { hasEffect: self.hasBuff("Advantage"), value: Infinity },
            {
              hasEffect: self.hasBuff("Translation", undefined, 2),
              value: 0.15,
            },
          ],
          this.baseCritChance,
          self.getTempStat("critChance")
        );
      },
      /** Base Physical Crit Chance, adjusted for mastery increases */
      get baseCritChance() {
        let stat = self._baseStats.physical.critChance;

        if (self.role === "Attacker") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Armor (flat number), adjusted for all effects */
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          this.baseArmor,
          self.getTempStat("armor"),
          true
        );
      },
      /** Base Physical Armor (flat number), adjusted for mastery increases */
      get baseArmor() {
        let stat = self._baseStats.physical.armor;

        if (self.role === "Tank") {
          if (self._primaryStat === "str") {
            stat *= 0.1 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "str") {
            stat *= 0.06 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Armor Penetration, adjusted for all effects */
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          this.baseArmorPen,
          self.getTempStat("armorPen")
        );
      },
      /** Base Physical Armor Pen, adjusted for mastery increases */
      get baseArmorPen() {
        let stat = self._baseStats.physical.armorPen;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Accuracy (decimal), adjusted for all effects */
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
            { hasEffect: self.hasDebuff("Blind"), value: -Infinity },
            {
              hasEffect: self.hasBuff("Call to Action"),
              value: 0.5,
            },
          ],
          this.baseAccuracy,
          self.getTempStat("accuracy")
        );
      },
      /** Base Physical Accuracy (decimal), adjusted for mastery increases */
      get baseAccuracy() {
        let stat = self._baseStats.physical.accuracy;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Dodge Chance (decimal), adjusted for all effects */
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          this.baseDodge,
          self.getTempStat("dodge")
        );
      },
      /** Base Physical Dodge/Evasion (decimal), adjusted for mastery increases */
      get baseDodge() {
        let stat = self._baseStats.physical.dodge;

        if (self.role === "Tank") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Physical Critical Avoidance (decimal), adjusted for all effects */
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -Infinity,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: Infinity,
            },
          ],
          this.baseCritAvoid,
          self.getTempStat("critAvoid")
        );
      },
      /** Base Physical Crit Avoidance (decimal), adjusted for mastery increases */
      get baseCritAvoid() {
        let stat = self._baseStats.physical.critAvoid;

        if (self.role === "Tank") {
          if (self._primaryStat === "tac") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
    };
  }
  /** The special stats of a character */
  public get special() {
    const self = this;
    return {
      /** Current Special Offense, adjusted for all effects */
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          this.baseOffense,
          self.getTempStat("offense"),
          true
        );
      },
      /** Base Special Offense, adjusted for mastery increases */
      get baseOffense() {
        let stat = self._baseStats.special.offense;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "agi") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 27 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 12 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Special Crit chance (decimal), adjusted for all effects */
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
          ],
          this.baseCritChance,
          self.getTempStat("critChance")
        );
      },
      /** Base Special Crit Chance, adjusted for mastery increases */
      get baseCritChance() {
        let stat = self._baseStats.special.critChance;

        if (self.role === "Attacker") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Armor/Resistance (flat number), adjusted for all effects */
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          this.baseArmor,
          self.getTempStat("armor"),
          true
        );
      },
      /** Base Armor/Resistance (flat number), adjusted for mastery */
      get baseArmor() {
        let stat = self._baseStats.special.armor;

        if (self.role === "Tank") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Special Armor/Resistance Penetration, adjusted for all effects */
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          this.baseArmorPen,
          self.getTempStat("armorPen")
        );
      },
      /** Base Special Armor/Resistance Penetration, adjusted for mastery increases */
      get baseArmorPen() {
        let stat = self._baseStats.special.armorPen;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Special Accuracy (decimal), adjusted for all effects  */
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
          ],
          this.baseAccuracy,
          self.getTempStat("accuracy")
        );
      },
      /** Base Special Accuracy (decimal), adjusted for mastery increases */
      get baseAccuracy() {
        let stat = self._baseStats.special.accuracy;

        if (self.role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Special Dodge/Evasion (decimal), adjusted for all effects */
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          this.baseDodge,
          self.getTempStat("dodge")
        );
      },
      /** Base Special Dodge/Evasion (decimal), adjusted for mastery increases */
      get baseDodge() {
        let stat = self._baseStats.special.dodge;

        if (self.role === "Tank") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        }
        return stat;
      },
      /** Current Special Crit Avoidance (decimal), adjusted for all effects */
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -Infinity,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: Infinity,
            },
          ],
          this.baseCritAvoid,
          self.getTempStat("critAvoid")
        );
      },
      /** Base Special Crit Avoidance (decimal), adjusted for mastery increases */
      get baseCritAvoid() {
        let stat = self._baseStats.special.critAvoid;

        if (self.role === "Tank") {
          if (self._primaryStat === "tac") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self.role === "Healer") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self.role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }
        return stat;
      },
    };
  }
  /** Gets the temporary stats changes (if any) that are sometimes granted by a special case or effect
   *
   * @param statName (string): The stat to be checked
   * @returns iStatsCheck[]: An array of stats that have been adjusted (todo)
   */
  private getTempStat(statName: string): iStatsCheck[] {
    const tempStatMapping: Record<string, iStatsCheck[]> =
      this._tempStats.reduce((statsMapping, stat) => {
        if (stat.statToModify in statsMapping) {
          statsMapping[stat.statToModify].push(stat);
        } else {
          statsMapping[stat.statToModify] = [stat];
        }
        return statsMapping;
      }, {});

    const finalMapping: Record<string, iStatsCheck[]> = this._triggers.reduce(
      (statsMapping, trigger) => {
        if (trigger.triggerType === "always") {
          trigger.actions?.forEach((action) => {
            const { targetList } = this.findTargets(action.targets);
            targetList.forEach((target) => {
              if (target.id === this.id) {
                action.effects?.forEach(({ condition, stats }) => {
                  if (
                    stats &&
                    stats.statToModify &&
                    this.checkCondition(condition, this)
                  ) {
                    if (stats.statToModify in statsMapping) {
                      statsMapping[stats.statToModify].push(stats);
                    } else {
                      statsMapping[stats.statToModify] = [stats];
                    }
                  }
                });
              }
            });
          });
        }
        return statsMapping;
      },
      tempStatMapping
    );

    return finalMapping[statName] ?? [];
  }
  /** Gets a mapping of all the effects that the character is immune to
   *
   * @returns Record<string, boolean>: A mapping of effects that are immune as key (string) and value (boolean)
   */
  private get immunity(): Record<string, boolean> {
    const mapping: Record<string, boolean> = {};

    if (this.hasStatusEffect("Guard")) {
      mapping.Daze = true;
      mapping.Stun = true;
    }

    if (this.hasDebuff("Confuse", undefined, 2)) {
      if (this.hasTags("Galactic Legend", this.id)) {
        //todo
      } else {
        mapping.assisting = true;
        mapping.counterAttacking = true;
        mapping["TM Increase"] = true;
      }
    }

    return this._triggers.reduce(
      (immuneMapping: Record<string, boolean>, trigger) => {
        if (trigger.triggerType === "always") {
          trigger.actions?.forEach((action) => {
            action.effects?.forEach((effect) => {
              if (effect.immune) {
                if (this.checkCondition(effect.condition, this)) {
                  effect.immune.negativeStatusEffects?.forEach((x) => {
                    immuneMapping[x] = true;
                  });
                  effect.immune.positiveStatusEffects?.forEach((x) => {
                    immuneMapping[x] = true;
                  });
                  if (effect.immune.assisting) {
                    immuneMapping.assisting = true;
                  }
                  if (effect.immune.counterAttacking) {
                    immuneMapping.counterAttacking = true;
                  }
                }
              }
            });
          });
        }
        return immuneMapping;
      },
      mapping
    );
  }
  /** Get the amount that a stat has been modified from other effects
   *
   * @param statusEffectConfig - An array of map objects that may have an effect to change the stat and by how much (such as a buff or debuff)
   * @param baseStat - The original stat to be used as a starting value
   * @param tempStats - A list of stats that should be changed and by how much
   * @param isMultiplicative - Determines if the stat should be multiplied (true) or added (false)
   * @returns number: The amount the given stat has been increased
   */
  private getModifiedStats(
    statusEffectConfig: { hasEffect: boolean; value: number }[],
    baseStat: number,
    tempStats: iStatsCheck[],
    isMultiplicative: boolean = false
  ): number {
    let newStat = baseStat;

    tempStats
      .sort((a: iStatsCheck, b: iStatsCheck) => {
        if (
          a.modifiedType === "multiplicative" &&
          b.modifiedType === "multiplicative"
        ) {
          return 0;
        } else if (a.modifiedType === "multiplicative") {
          return 1;
        } else if (b.modifiedType === "multiplicative") {
          return -1;
        }
        return 0;
      })
      .forEach((stat) => {
        if (stat?.modifiedType === "multiplicative") {
          newStat *= 1 + stat?.amount ?? 0;
        } else {
          newStat += stat?.amount ?? 0;
        }
      });

    let amountIncrease = 0;

    statusEffectConfig.forEach((effect) => {
      if (effect.hasEffect) {
        amountIncrease += effect.value;
      }
    });

    if (isMultiplicative) {
      return newStat * (1 + amountIncrease);
    } else {
      return newStat + amountIncrease;
    }
  }

  /* The amount of turn meter the character has */
  public get turnMeter() {
    return this._tm;
  }
  /* The ratio in which is used to determine how much the turn meter should be adjusted when another character takes a turn */
  public get turnMeterRatio() {
    return (100 - this._tm) / this.speed;
  }
  /** Manipulates the unit's turn meter by a certain amount
   *
   * @param amount - The amount the turn meter will be changed. Positive number will add turn meter, negative number will remove turn meter
   * @returns - A Log of what occurred (if any)
   */
  public changeTurnMeter(amount: number, srcAbility?: iAbility): Log | null {
    if (amount === 0) {
      return null;
    }
    let diff = 0;

    if (this._tm >= 100 && amount < 0) {
      diff = Math.abs(amount);
      this._tm = 100 + amount; //note this will remove tm since val is a negative number
    } else {
      diff = amount < 0 ? Math.min(Math.abs(amount), this._tm) : amount;
      this._tm += amount;
    }

    if (this._tm < 0) {
      this._tm = 0;
    }

    return new Log({
      character: this,
      effects: {
        turnMeter: round(amount > 0 ? diff : 0 - diff, 2),
      },
      ability: {
        source: srcAbility,
      },
    });
  }
  /** Compares the current turn meter of that with another character
   *
   * @param opponent - The opponent of who's turn meter will be compared to see who goes first between the two
   * @returns - An object that contains which character goes next (either this character or the opponent) and the amount of turn meter that was gained
   */
  public compareTm(opponent: Character): {
    character: Character;
    amount: number;
  } {
    const results = {
      character: this as Character,
      amount: 0,
    };

    if (opponent.turnMeter >= 100 && this.turnMeter >= 100) {
      results.amount = 0;
      if (opponent.turnMeter > this.turnMeter) {
        results.character = opponent;
      } else if (opponent.turnMeter === this.turnMeter) {
        if (opponent.speed > this.speed) {
          results.character = opponent;
        } else if (this.speed === opponent.speed) {
          const rand = randomNumber(0, 1);
          if (rand === 1) {
            results.character = opponent;
          }
        }
      }
    } else if (this.turnMeterRatio < opponent.turnMeterRatio) {
      results.amount = 100 - this.turnMeter;
      results.character = this;
    } else if (opponent.turnMeterRatio < this.turnMeterRatio) {
      results.amount = 100 - opponent.turnMeter;
      results.character = opponent;
    } else {
      const rand = randomNumber(0, 1);
      const c = rand === 0 ? this : opponent;
      results.amount = 100 - c.turnMeter;
      results.character = c;
    }
    return results;
  }

  /* A list of all the debuffs that are on the character */
  public get debuffs() {
    return this._debuffs;
  }
  /* A list of all the buffs that are on the character */
  public get buffs() {
    return this._buffs;
  }
  /* A list of all the status effects that are on the character */
  public get statusEfects() {
    return this._statusEffects;
  }
  /** Checks to see if the character has any of the listed debuffs
   *
   * @param name - The list (or string) of debuffs to check. If an array, checks that ALL of the ones listed are present
   * @param duration - The length of the debuff to be compared to see if a new one should be applied
   * @param numOfStacks - The number of stacks to check
   * @returns boolean - True if the character has the debuff(s), otherwise false
   */
  public hasDebuff(
    name: tDebuff | tDebuff[] | iDebuff | iDebuff[],
    duration?: number,
    numOfStacks?: number
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tDebuff | iDebuff)[]).every((x) =>
        this.hasDebuff(x, duration, numOfStacks)
      );
    } else {
      if (numOfStacks) {
        const amountOfStacks = this.debuffs.filter((debuff) => {
          return debuff.name === name;
        }).length;
        return amountOfStacks <= numOfStacks;
      }

      return this.debuffs.some((d) => {
        if (typeof name === "string") {
          if (d.name === name) {
            if (duration) {
              return duration <= d.duration;
            }
            return true;
          }
          return false;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  /** Checks to see if the character has any of the listed buffs
   *
   * @param name - The list (or string) of buff to check. If an array, checks that ALL of the ones listed are present
   * @param duration (optional) - The length of the buff to be compared to see if a new one should be applied
   * @param numOfStacks - The number of stacks to check
   * @returns boolean - True if the player has the buff(s), otherwise false
   */
  public hasBuff(
    name: tBuff | tBuff[] | iBuff | iBuff[],
    duration?: number,
    numOfStacks?: number
  ) {
    if (Array.isArray(name)) {
      return (name as (tBuff | iBuff)[]).every((x) =>
        this.hasBuff(x, duration)
      );
    } else {
      if (numOfStacks) {
        const amountOfStacks = this.buffs.filter((buff) => {
          return buff.name === name;
        }).length;
        return amountOfStacks <= numOfStacks;
      }

      return this.buffs.some((b) => {
        if (typeof name === "string") {
          if (b.name === name) {
            if (duration) {
              return duration <= b.duration;
            }
            return true;
          }
          return false;
        } else {
          return b.id === name.id;
        }
      });
    }
  }
  /** Checks to see if the character has any of the listed status effects
   *
   * @param name - The list (or string) of status effect to check. If an array, checks that ALL of the ones listed are present
   * @param duration (optional) - The length of the status effect to be compared to see if a new one should be applied
   * @param numOfStacks - The number of stacks to check
   * @returns boolean - True if the player has the status effect(s), otherwise false
   */
  public hasStatusEffect(
    name: tStatusEffect | tStatusEffect[] | iStatusEffect | iStatusEffect[],
    duration?: number,
    numOfStacks?: number
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tStatusEffect | iStatusEffect)[]).every((x) =>
        this.hasStatusEffect(x, duration)
      );
    } else {
      if (numOfStacks) {
        const amountOfStacks = this._statusEffects.filter((statusEffect) => {
          return statusEffect.name === name;
        }).length;
        return amountOfStacks <= numOfStacks;
      }

      return this._statusEffects.some((d) => {
        if (typeof name === "string") {
          if (d.name === name) {
            if (duration) {
              return duration <= d.duration;
            }
            return true;
          }
          return false;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  /** Checks to see if the character is immune to the provided effect
   *
   * @param statusEffect - The status effect or string to check
   * @returns boolean - True if the player is immune, otherwise false
   */
  public isImmune(statusEffect: iStatusEffect | string): boolean {
    if (typeof statusEffect === "string") {
      return this.immunity[statusEffect];
    } else {
      return this.immunity[statusEffect.name];
    }
  }
  public addBuff(
    buff: iBuff | iBuff[],
    isNew: boolean,
    scalar: number,
    ability: iAbility | null
  ): Log[] {
    if (Array.isArray(buff)) {
      return buff.reduce((arr: Log[], b) => {
        arr.push(...this.addBuff(b, isNew, scalar, ability));
        return arr;
      }, []);
    } else if (buff.name === "TM Increase") {
      if (scalar > 0 && !this.isImmune("TM Increase")) {
        const log = this.changeTurnMeter(
          buff.duration * scalar,
          ability ?? undefined
        );
        return log ? [log] : [];
      }
    } else if (
      (this.hasDebuff("Buff Immunity") || this.hasDebuff("Confuse")) &&
      !buff.cantPrevent
    ) {
      let preventSrc = this.hasDebuff("Buff Immunity") ? "Buff Immunity" : "";
      preventSrc = this.hasDebuff("Confuse") ? "Confuse" : preventSrc;
      return [
        new Log({
          character: this,
          statusEffects: { prevented: preventSrc, list: [buff], type: "buff" },
        }),
      ];
    } else if (!this.hasDebuff("Buff Immunity")) {
      if (
        (!this.hasBuff(buff.name, buff.duration) || buff.isStackable) &&
        !this.isImmune(buff)
      ) {
        if (scalar > 0) {
          const newDuration = buff.duration * scalar;

          const match = this.buffs.find((x) => x.name === buff.name);

          if (buff.isStackable || !match) {
            this._buffs.push({
              ...unvue(buff),
              duration: newDuration,
              isNew: true,
            });
          } else {
            match.duration = newDuration;
            match.isNew = true;
          }

          return [
            new Log({
              character: this,
              ability: { source: ability },
              statusEffects: {
                type: "buff",
                list: [buff],
                duration: newDuration,
              },
            }),
          ];
        }
      }
    }
    return [];
  }
  /** Removes a buff from the character
   *
   * @param buff - The buff to be removed. If its a string (tBuff), it will be removed if any of the buffs match. If it is an object (iBuff), then the exact match will be removed (i.e. only if the id matches). If an array of either, then it will recursively remove everything in the array
   * @param opponent - The optional opponent that is causing the removal to occur. If itself, it will always be removed even if it cannot be dispelled
   *
   * @returns - A list of Logs of what happened
   */
  private removeBuff(
    buff: iBuff | iBuff[] | tBuff | tBuff[] | null,
    opponent?: Character
  ): Log[] {
    const listOfRemovedBuffs: iBuff[] = [];
    const logs: Log[] = [];
    if (Array.isArray(buff)) {
      logs.push(
        ...(buff as (iBuff | tBuff)[]).reduce((arr: Log[], b) => {
          arr.push(...this.removeBuff(b, opponent));
          return arr;
        }, [])
      );
    } else {
      let buffToRemove: iBuff | null = null;
      if (typeof buff === "string") {
        buffToRemove = {
          name: buff,
          id: uuid(),
          duration: 1,
        };
      } else {
        buffToRemove = buff;
      }

      this._buffs = this._buffs.filter((b) => {
        if (
          b.name === buffToRemove?.name ||
          buffToRemove?.name === "all" ||
          b.id === buffToRemove?.id
        ) {
          if (b.cantDispel && !this.isSelf(opponent)) {
            return true;
          }
          listOfRemovedBuffs.push(b);
          return false;
        }
        return true;
      });

      if (listOfRemovedBuffs.length > 0) {
        if (opponent && !this.isSelf(opponent)) {
          //opponent removed them
          logs.push(
            new Log({
              character: opponent,
              target: this,
              statusEffects: {
                type: "buff",
                list: listOfRemovedBuffs,
                removed: true,
              },
            })
          );
        } else {
          //was naturally removed
          logs.push(
            new Log({
              character: this,
              statusEffects: {
                type: "buff",
                list: listOfRemovedBuffs,
                removed: true,
              },
            })
          );
        }
        listOfRemovedBuffs.forEach((buff) => {
          buff.triggers?.forEach((trigger) => {
            if (trigger.triggerType === "expires") {
              logs.push(...this.executeTrigger(trigger));
            }
          });
        });
      }
    }
    return logs;
  }
  private inflictDebuff(
    debuffs: iDebuff[],
    targetCharacter: Character,
    scalar: number = 1,
    ability?: iAbility | null
  ): Log[] {
    if (targetCharacter.isDead) {
      return [];
    }

    const logs: Log[] = [];

    debuffs.forEach((debuff) => {
      const canApplyStacks =
        debuff.isStackable &&
        this.hasDebuff(debuff.name, undefined, debuff.maxStacks);

      if (targetCharacter.isImmune(debuff)) {
        logs.push(
          new Log({
            character: targetCharacter,
            statusEffects: {
              type: "debuff",
              immune: true,
              list: [debuff],
            },
          })
        );
      } else if (
        !targetCharacter.hasDebuff(debuff.name, debuff.duration) ||
        canApplyStacks
      ) {
        if (chanceOfEvent(debuff.chance ?? 0)) {
          return;
        }

        const newAmount = debuff.duration * scalar;

        if (newAmount != 0) {
          const resistedChance = Math.max(
            targetCharacter.tenacity - this.potency,
            0.15
          );

          if (
            !chanceOfEvent(resistedChance) ||
            debuff.cantResist ||
            debuff.name === "Tenacity Down" ||
            this.isSelf(targetCharacter)
          ) {
            if (debuff.name === "TM Decrease") {
              const log = targetCharacter.changeTurnMeter(
                newAmount,
                ability ?? undefined
              );
              if (log) {
                logs.push(log);
              }
            } else {
              if (
                !targetCharacter.hasDebuff(debuff.name, newAmount) ||
                canApplyStacks
              ) {
                const match = targetCharacter.debuffs.find(
                  (x) => x.name === debuff.name
                );

                if (!match || debuff.isStackable) {
                  targetCharacter.debuffs.push({
                    ...unvue(debuff),
                    duration: newAmount,
                    isNew: true,
                  });
                } else {
                  match.duration = newAmount;
                  match.isNew = true;
                }

                logs.push(
                  new Log({
                    character: targetCharacter,
                    statusEffects: {
                      list: [debuff],
                      duration: newAmount,
                      type: "debuff",
                    },
                    ability: {
                      source: ability,
                    },
                  })
                );
                logs.push(
                  ...this.executeTriggers(this._triggers, [
                    {
                      triggerType: "inflictDebuff",
                      ability: ability ?? null,
                      target: targetCharacter,
                      debuff,
                    },
                  ])
                );
              }
            }
          } else {
            logs.push(
              new Log({
                character: targetCharacter,
                statusEffects: {
                  resisted: true,
                  list: [debuff],
                  type: "debuff",
                },
              })
            );
            const triggerList: iTriggerData[] = [
              {
                triggerType: "resistDetrimentalEffect",
                debuff,
                target: targetCharacter,
                ability: ability ?? null,
              },
            ];
            logs.push(
              ...targetCharacter.executeTriggers(
                targetCharacter.triggers,
                triggerList
              )
            );
            logs.push(
              ...this.executeTriggers(debuff.triggers ?? [], triggerList)
            );
          }
        }
      }
    });
    return logs;
  }
  /** Removes a debuff from the character
   *
   * @param buff - The debuff to be removed. If its a string (tDebuff), it will be removed if any of the buffs match. If it is an object (iDebuff), then the exact match will be removed (i.e. only if the id matches). If an array of either, then it will recursively remove everything in the array
   * @param opponent - The optional opponent that is causing the removal to occur.
   *
   * @returns - A list of Logs of what happened
   */
  private removeDebuff(
    debuff: iDebuff | iDebuff[] | tDebuff | tDebuff[] | null,
    opponent?: Character
  ): Log[] {
    const listOfRemovedDebuffs: iDebuff[] = [];
    const logs: Log[] = [];

    if (Array.isArray(debuff)) {
      logs.push(
        ...(debuff as (iDebuff | tDebuff)[]).reduce(
          (arr: Log[], d: iDebuff | tDebuff) => {
            arr.push(...this.removeDebuff(d, opponent));
            return arr;
          },
          []
        )
      );
    } else {
      let debuffData: iDebuff | null = null;
      if (typeof debuff === "string") {
        debuffData = {
          name: debuff,
          id: uuid(),
          duration: 1,
        };
      } else {
        debuffData = debuff;
      }

      this._debuffs = unvue(this._debuffs).filter((debuff: iDebuff) => {
        if (
          debuff.name === debuffData?.name ||
          debuffData?.name === "all" ||
          debuff.id === debuffData?.id
        ) {
          listOfRemovedDebuffs.push(debuff);
          return false;
        }
        return true;
      });

      if (listOfRemovedDebuffs.length > 0) {
        if (opponent && !this.isSelf(opponent)) {
          logs.push(
            new Log({
              character: opponent,
              target: this,
              statusEffects: {
                list: listOfRemovedDebuffs,
                removed: true,
                type: "debuff",
              },
            })
          );
        } else {
          logs.push(
            new Log({
              character: this,
              statusEffects: {
                list: listOfRemovedDebuffs,
                removed: true,
                type: "debuff",
              },
            })
          );
        }

        listOfRemovedDebuffs.forEach((buff) => {
          buff.triggers?.forEach((trigger) => {
            if (trigger.triggerType === "expires") {
              logs.push(...this.executeTrigger(trigger));
            }
          });
        });
      }
    }
    return logs;
  }
  private addStatusEffect(
    effect: iStatusEffect | iStatusEffect[],
    ability: iAbility | null
  ): Log[] {
    if (Array.isArray(effect)) {
      return effect.reduce((arr: Log[], e) => {
        arr.push(...this.addStatusEffect(e, ability));
        return arr;
      }, []);
    } else {
      if (
        (!this.hasStatusEffect(effect, effect.duration) ||
          effect.isStackable) &&
        !this.isImmune(effect)
      ) {
        const match = this._statusEffects.find((x) => x.name === effect.name);

        if (effect.isStackable || !match) {
          this._buffs.push({
            ...unvue(effect),
            isNew: true,
          });
        } else {
          match.duration = effect.duration;
          match.isNew = true;
        }

        this._statusEffects.push(effect);
        return [
          new Log({
            character: this,
            statusEffects: {
              list: [effect],
              type: "statusEffect",
              duration: effect.duration,
            },
            ability: {
              source: ability,
            },
          }),
        ];
      }
    }
    return [];
  }
  private removeStatusEffect(
    statusEffect:
      | iStatusEffect
      | iStatusEffect[]
      | tStatusEffect
      | tStatusEffect[]
      | null
  ): Log[] {
    const logs: Log[] = [];
    if (Array.isArray(statusEffect)) {
      logs.push(
        ...(statusEffect as (iStatusEffect | tStatusEffect)[]).reduce(
          (arr: Log[], d) => {
            arr.push(...this.removeStatusEffect(d));
            return arr;
          },
          []
        )
      );
    } else {
      const listOfRemovedStatusEffects: iStatusEffect[] = [];
      let statusEffectData: iStatusEffect | null = null;
      if (typeof statusEffect === "string") {
        statusEffectData = {
          name: statusEffect,
          id: uuid(),
          duration: 1,
        };
      } else {
        statusEffectData = statusEffect;
      }

      this._statusEffects = unvue(this._statusEffects).filter(
        (statusEffect: iStatusEffect) => {
          if (
            statusEffect.name === statusEffectData?.name ||
            statusEffectData?.name === "all" ||
            statusEffect.id === statusEffectData?.id
          ) {
            listOfRemovedStatusEffects.push(statusEffect);
            return false;
          }
          return true;
        }
      );

      if (listOfRemovedStatusEffects.length > 0) {
        logs.push(
          new Log({
            target: this,
            statusEffects: {
              list: listOfRemovedStatusEffects,
              removed: true,
              type: "debuff",
            },
          })
        );
        listOfRemovedStatusEffects.forEach((buff) => {
          buff.triggers?.forEach((trigger) => {
            if (trigger.triggerType === "expires") {
              logs.push(...this.executeTrigger(trigger));
            }
          });
        });
      }
    }
    return logs;
  }

  //Abilities
  public get activeAbilities() {
    return this._activeAbilities;
  }
  public get basicAbility() {
    return this.activeAbilities.find((a) => {
      return a.id.startsWith("basic");
    });
  }
  public get hasLeaderAbility() {
    return !!this._leaderAbility;
  }
  public chooseAbility(abilityId?: string): iAbility | null {
    if (this.hasDebuff("Stun")) {
      return null;
    } else if (this.hasDebuff("Ability Block")) {
      return (this.basicAbility as iAbility) ?? null;
    }

    const ability = this._activeAbilities.find((a) => {
      if (abilityId) {
        return a.id === abilityId;
      } else if ("turnsRemaining" in a) {
        return a.turnsRemaining <= 0;
      } else {
        return a;
      }
    });

    if (ability && "turnsRemaining" in ability) {
      ability.turnsRemaining = ability.cooldown;
    }
    return (ability as iAbility) ?? null;
  }
  /**
   *
   * @param targetData - The target data used to determine how to find valid targets
   * @param target - Used in the case that the targetData should use an already selected target (such as for an assist)
   * @param include - Used to ignore specific attributes, such as dead characters. By default, these characters are not considered for selection
   * @returns targetList - List of valid targets, primaryTarget - primary opponent target
   */
  public findTargets(
    targetData: iTargetData,
    target?: Character | null,
    include?: {
      // paralysisDebuff?: boolean;
      // daze?: boolean;
      assisting?: boolean;
      dead?: boolean;
    }
  ): { targetList: Character[]; primaryTarget: Character | null } {
    let primaryTarget: Character | null = null;
    let filteredList: Character[] = [];
    let validTargets: Character[] = [];

    if (targetData.allies) {
      validTargets = this._teammates;
    } else if (targetData.allies === false) {
      validTargets = this._opponents;
    } else {
      validTargets = [...this._teammates, ...this._opponents];
    }

    validTargets = validTargets.filter((char: Character) => {
      let shouldInclude = true;

      if (char.isDead) {
        shouldInclude = include?.dead ?? false;
      }
      if (include?.assisting === false) {
        return !char.isImmune("assisting");
      }
      // if (ignore?.paralysisDebuff) {
      //   shouldExclude = char.hasDebuff("Stun") || shouldExclude;
      // }
      // if (ignore?.daze) {
      //   shouldExclude = char.hasDebuff("Daze") || shouldExclude;
      // }
      return shouldInclude;
    });

    if (targetData.self) {
      filteredList = [this];
    } else {
      filteredList = validTargets.filter((char) => {
        if (targetData.self === false) {
          if (this.isSelf(char)) {
            return false;
          }
        }

        if (!targetData.filters) {
          return true;
        }
        //todo i dont think this will work if we're looking for opponents with filters but its still an aoe
        if (char.owner !== this.owner && char.hasBuff("Stealth")) {
          if (!this._opponents.every((x) => x.hasBuff("Stealth"))) {
            return false;
          }
        }

        return targetData.filters?.every((targetFilter) => {
          if (targetFilter.buffs) {
            return char.hasBuff(
              targetFilter.buffs,
              targetFilter.duration,
              targetFilter.stacks
            );
          } else if (targetFilter.debuffs) {
            return char.hasDebuff(
              targetFilter.debuffs,
              targetFilter.duration,
              targetFilter.stacks
            );
          } else if (targetFilter.isLeader) {
            return char.isLeader;
          } else if (targetFilter.statusEffects) {
            return char.hasStatusEffect(targetFilter.statusEffects);
          } else if (targetFilter.tags) {
            return anyTagsMatch(char, targetFilter.tags, this.id);
          } else if (targetFilter.primary) {
            return char.isSelf(target ?? undefined);
          } else if (targetFilter.targetIds) {
            return anyTagsMatch(char, targetFilter.targetIds, this.id);
          }
          return false;
        });
      });
    }

    if (targetData.weakest) {
      let tempList: Character[] = [];
      filteredList.forEach((cur) => {
        if (tempList.length === 0) {
          tempList.push(cur);
        } else {
          const totalStatsCur = cur.health + cur.protection;
          const isWeakest = tempList.every(
            (c) => totalStatsCur < c.health + c.protection
          );
          if (isWeakest) {
            tempList = [cur];
          }
        }
      });
      filteredList = tempList;
    } else if (targetData.targetCount) {
      const tempList: Character[] = [];
      do {
        const rand: number = randomNumber(0, filteredList.length - 1);
        const el = filteredList[rand];
        const exists = tempList.some((x) => x.id === el.id);
        if (!exists) {
          tempList.push(filteredList[rand]);
        }
      } while (
        tempList.length < targetData.targetCount &&
        filteredList.length >= targetData.targetCount
      );
      filteredList = tempList;
    }

    filteredList = filteredList.filter((x) => !!x);
    const opponentsList = filteredList.filter((x) => x.owner !== this.owner);
    const tauntingList = this._opponents.filter((t) => t.hasTauntEffect);

    if (tauntingList.length > 0 && !targetData.ignoreTaunt) {
      const randIndex = randomNumber(0, tauntingList.length - 1);
      primaryTarget = tauntingList[randIndex];
    } else if (opponentsList.length > 0) {
      const randIndex = randomNumber(0, opponentsList.length - 1);
      primaryTarget = opponentsList[randIndex];
    } else {
      const randIndex = randomNumber(0, this._opponents.length - 1);
      primaryTarget = this._opponents[randIndex];
    }
    return { targetList: filteredList, primaryTarget };
  }

  //other properties
  public get owner() {
    return this._owner;
  }
  public get name() {
    return this._name;
  }
  public get id() {
    return this._id;
  }
  public get alignment() {
    return this._alignment;
  }
  public get role() {
    return this._role;
  }
  public get effects() {
    const self = this;
    return {
      get ignoreTaunt() {
        return self.hasBuff("Call to Action");
      },
    };
  }

  //Methods
  public getCombatStats(
    damageType?: "physical" | "special" | "true",
    stats?: iStatsCheck[]
  ) {
    if (damageType === "physical") {
      const baseStat = this.physical;
      return {
        offense: modifyStat(baseStat.offense, "offense", stats),
        critChance: modifyStat(baseStat.critChance, "critChance", stats),
        armorPen: modifyStat(baseStat.armorPen, "armorPen", stats),
        armor: modifyStat(baseStat.armor, "armor", stats),
        dodge: modifyStat(baseStat.dodge, "dodge", stats),
        accuracy: modifyStat(baseStat.accuracy, "accuracy", stats),
        critAvoid: modifyStat(baseStat.critAvoid, "critAvoid", stats),
        maxHealth: this.maxHealth,
        health: this.health,
        maxProtection: this.maxProtection,
        protection: this.protection,
      };
    } else if (damageType === "special") {
      const baseStat = this.special;
      return {
        offense: modifyStat(baseStat.offense, "offense", stats),
        critChance: modifyStat(baseStat.critChance, "critChance", stats),
        armorPen: modifyStat(baseStat.armorPen, "armorPen", stats),
        armor: modifyStat(baseStat.armor, "armor", stats),
        dodge: modifyStat(baseStat.dodge, "dodge", stats),
        accuracy: modifyStat(baseStat.accuracy, "accuracy", stats),
        critAvoid: modifyStat(baseStat.critAvoid, "critAvoid", stats),
        maxHealth: this.maxHealth,
        health: this.health,
        maxProtection: this.maxProtection,
        protection: this.protection,
      };
    } else {
      //todo: handle true damage
      return {
        offense: 0,
        critChance: 0,
        armorPen: 0,
        armor: 0,
        dodge: 0,
        accuracy: 0,
        critAvoid: 0,
        maxHealth: this.maxHealth,
        health: this.health,
        maxProtection: this.maxProtection,
        protection: this.protection,
      };
    }
  }
  public dealDamageWithAttack(
    targetCharacter: Character,
    damageData: iEffect["damage"],
    stats?: iStatsCheck[],
    srcAbility?: iAbility | null
  ) {
    const logs: Log[] = [];

    const { isCrit, damageTotal } = this.calculateDamage(
      targetCharacter,
      damageData,
      stats
    );

    targetCharacter.protection -= damageTotal;

    logs.push(
      new Log({
        target: targetCharacter,
        damage: {
          isCrit,
          amount: round(damageTotal, 0),
        },
      })
    );

    logs.push(
      ...this.heal(
        {
          amountType: "additive",
          amount: damageTotal * this.healthSteal,
          healthType: "health",
        },
        {
          id: uuid(),
          name: "Health Steal",
          gameText:
            "The percentage amount of the damage that this character heals whenever they deal damage.",
        }
      )
    );

    logs.push(
      ...targetCharacter.executePassiveTriggers([
        {
          triggerType: "receiveDamage",
          damageDealt: damageTotal,
          isCrit,
          ability: srcAbility,
          target: targetCharacter,
        },
      ]),
      ...targetCharacter.executePassiveTriggers([
        {
          triggerType: "receiveDamageFromAttack",
          damageDealt: damageTotal,
          isCrit,
          ability: srcAbility,
          target: targetCharacter,
        },
      ]),
      ...this.executePassiveTriggers([
        {
          triggerType: "dealDamageWithAttack",
          damageDealt: damageTotal,
          isCrit,
          ability: srcAbility,
          target: targetCharacter,
        },
      ]),
      ...this.executePassiveTriggers([
        {
          triggerType: "dealDamage",
          damageDealt: damageTotal,
          isCrit,
          ability: srcAbility,
          target: targetCharacter,
        },
      ])
    );

    if (isCrit) {
      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "criticalHit",
            damageDealt: damageTotal,
            isCrit,
            ability: srcAbility,
            target: targetCharacter,
          },
        ])
      );
      logs.push(...this.removeBuff("Advantage", this));
    }

    logs.push(...this.checkDeath(targetCharacter));
    logs.push(...targetCharacter.counterAttack(this));

    return { damageTotal, isCrit, logs };
  }
  public dealBonusDamage(
    targetCharacter: Character,
    damageTotal: number,
    srcAbility: iAbility | null = null
  ) {
    const logs: Log[] = [];
    targetCharacter.protection -= damageTotal;

    logs.push(
      new Log({
        target: targetCharacter,
        ability: { source: srcAbility },
        damage: {
          amount: round(damageTotal, 0),
          bonus: true,
        },
      })
    );

    logs.push(
      ...targetCharacter.executePassiveTriggers([
        {
          triggerType: "receiveDamage",
          damageDealt: damageTotal,
          ability: srcAbility,
          target: targetCharacter,
        },
      ]),
      ...this.executePassiveTriggers([
        {
          triggerType: "dealDamage",
          damageDealt: damageTotal,
          ability: srcAbility,
          target: targetCharacter,
        },
      ])
    );

    logs.push(...this.checkDeath(targetCharacter));

    return { logs, damageTotal };
  }
  private calculateDamage(
    targetCharacter: Character,
    damageData: iEffect["damage"],
    stats?: iStatsCheck[]
  ): { isCrit: boolean; damageTotal: number } {
    const abilityModifier = damageData?.modifier.value ?? 0;
    const variance = damageData?.variance ?? 5;
    const { offense, critChance, armorPen } = this.getCombatStats(
      damageData?.damageType,
      stats
    );
    const { armor, critAvoid } = targetCharacter.getCombatStats(
      damageData?.damageType,
      stats
    );
    const varianceOffense =
      offense * (1 - randomNumber(0 - variance, variance) / 100);

    const modifiedArmor = Math.max(armor - armorPen, 0);
    const damageReduction =
      (modifiedArmor * 100) / (modifiedArmor + 637.5) / 100;
    const damageTaken =
      varianceOffense * abilityModifier * (1 - damageReduction);

    const isCrit = chanceOfEvent((critChance - critAvoid) * 100);

    const damageTotal = Math.max(
      Math.round(damageTaken * (isCrit ? targetCharacter.critDamage : 1)),
      1
    );
    return { isCrit, damageTotal };
  }
  private combineStats(statsList: (iStatsCheck | undefined)[]): iStatsCheck[] {
    return statsList.reduce(
      (list: iStatsCheck[], stats: iStatsCheck | undefined) => {
        if (stats) {
          const exists = list.find(
            (x) => x.statToModify === stats.statToModify
          );
          if (exists) {
            if (
              exists.modifiedType === "multiplicative" &&
              stats.modifiedType === "multiplicative"
            ) {
              exists.amount *= stats.amount;
            } else if (
              exists.modifiedType === "additive" &&
              stats.modifiedType === "additive"
            ) {
              exists.amount += stats.amount;
            } else {
              console.warn(
                "Cannot combine two kinds of stat changes",
                exists,
                stats
              );
            }
          } else {
            list.push(stats);
          }
        }
        return list;
      },
      []
    );
  }
  private checkDeath(targetCharacter: Character): Log[] {
    const logs: Log[] = [];
    if (targetCharacter.health <= 0) {
      logs.push(
        new Log({
          character: this,
          target: targetCharacter,
          effects: { defeated: true },
        })
      );
      logs.push(
        ...targetCharacter.executePassiveTriggers([
          {
            triggerType: "death",
          },
        ])
      );
      targetCharacter.removePassiveTriggers();
    }
    return logs;
  }
  public counterAttack(
    targetCharacter: Character,
    canBeCountered: boolean = true
  ): Log[] {
    const logs: Log[] = [];
    if (
      canBeCountered &&
      !targetCharacter.isDead &&
      !this.isImmune("counterAttacking")
    ) {
      if (
        chanceOfEvent(this.counterChance * 100) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        logs.push(
          new Log({
            character: this,
            effects: { countered: true },
          })
        );

        const basicAbility: iAbility = unvue(this.basicAbility);
        basicAbility.actions?.forEach((action) => {
          action.targets = { filters: [{ primary: true }] };
        });
        logs.push(
          ...this.useAbility(
            basicAbility,
            {
              statToModify: "offense",
              amount: this.counterDamage,
              modifiedType: "multiplicative",
            },
            targetCharacter,
            false
          )
        );
      }
    }
    return logs;
  }
  private checkCondition(
    condition: iEffect["condition"],
    targetCharacter: Character
  ): boolean {
    if (!condition) {
      return true;
    }

    const { buffs, debuffs, stats, inverted, isNew, tags, tm, onTurn } =
      condition;
    let results = false;
    if (buffs) {
      const hasBuffs = buffs.every((buff) => {
        const match = this._buffs.find((x) => x.name === buff);
        if (match) {
          return isNew === false ? !match.isNew : true;
        } else return false;
      });
      results = hasBuffs || results;
    }
    if (debuffs) {
      const hasDebuffs = debuffs.every((status) => {
        const match = this.debuffs.find((x) => x.name === status);
        if (match) {
          return isNew ? match.isNew : true;
        }
        return false;
      });

      results = hasDebuffs || results;
    }
    if (stats) {
      let meetsStatRequirement = false;
      const stat = targetCharacter[stats.statToModify];
      if (!isNaN(stat)) {
        //if it is a number
        const num = Number(stat);
        if (
          stats.statToModify === "health" &&
          stats.modifiedType === "multiplicative"
        ) {
          const percent = num / targetCharacter.maxHealth;
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < percent
              : stats.amount > percent;
        } else if (
          stats.statToModify === "protection" &&
          stats.modifiedType === "multiplicative"
        ) {
          const percent = num / targetCharacter.maxProtection;
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount > percent
              : stats.amount < percent;
        } else {
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < num
              : stats.amount > num;
        }
      } else {
        console.warn(
          `Could not find stat ${stat.type} on ${targetCharacter.name}`
        );
      }

      results = meetsStatRequirement || results;
    }
    if (tags) {
      results = anyTagsMatch(targetCharacter, tags, this.id) || results;
    }
    if (tm) {
      if (tm.greaterThan) {
        results = targetCharacter.turnMeter > tm.amount || results;
      } else {
        results = targetCharacter.turnMeter < tm.amount || results;
      }
    }
    if (onTurn) {
      results =
        this.isSelf(gameEngine.currentCharactersTurn ?? undefined) || results;
    }
    return inverted ? !results : results;
  }
  /**
   * Change an ability's cooldown
   *
   * @param effect The effect that is causing the cooldown change
   * @param srcAbility The source ability that is causing the cooldown change
   * @returns Log of what happened
   */
  public changeCooldown(effect: iEffect, srcAbility: iAbility | null): Log[] {
    if (effect.cooldown) {
      const { amount, id } = effect.cooldown;
      const name = amount > 0 ? "Cooldown Increase" : "Cooldown Decrease";
      if (
        this.isImmune({
          name,
          id: uuid(),
          duration: amount,
        })
      ) {
        return [
          new Log({
            character: this,
            statusEffects: {
              immune: true,
              type: "buff",
              list: [{ name, duration: amount, id: id ?? uuid() }],
            },
          }),
        ];
      } else {
        return this._activeAbilities.reduce(
          (logs: Log[], ability: iBasicAbility | iSpecialAbility) => {
            if ("turnsRemaining" in ability) {
              if (ability.id === id || !id) {
                let finalAmount = amount;
                if (amount < 0) {
                  if (ability.turnsRemaining <= 0) {
                    return logs;
                  }
                  finalAmount = Math.max(amount, 0 - ability.turnsRemaining);
                }
                ability.turnsRemaining += finalAmount;

                logs.push(
                  new Log({
                    character: this,
                    ability: { source: srcAbility },
                    effects: { cooldown: { ability, amount: finalAmount } },
                  })
                );
              }
            }
            return logs;
          },
          []
        );
      }
    }
    return [];
  }
  public checkEvade(
    effect: iEffect,
    opponent: Character,
    stats?: iStatsCheck[]
  ) {
    if (effect.cantMiss || this.isSelf(opponent)) {
      return false;
    } else {
      const { dodge } = this.getCombatStats(effect.damage?.damageType);
      const { accuracy } = opponent.getCombatStats(effect.damage?.damageType);

      const chanceToDodge =
        modifyStat(dodge, "dodge", stats) -
        modifyStat(accuracy, "accuracy", stats);
      return chanceOfEvent(chanceToDodge * 100);
    }
  }
  public startOfTurn() {
    this._debuffs.forEach((debuff) => {
      debuff.isNew = false;
    });
    this._buffs.forEach((debuff) => {
      debuff.isNew = false;
    });
  }
  public takeAction(): { logs: Log[]; endOfTurnLogs: Log[] } {
    this.startOfTurn();
    this._tm = 0;
    const logs: Log[] = [];
    let ability: iAbility | null = null;
    if (this.hasDebuff("Stun")) {
      logs.push(new Log({ character: this, effects: { stunned: true } }));
    } else {
      ability = this.chooseAbility();

      if (ability) {
        logs.push(...this.useAbility(ability));
      } else {
        console.warn(
          "Could not find an ability to use",
          this.id,
          this.activeAbilities
        );
      }
    }

    return {
      logs,
      endOfTurnLogs: this.endOfTurn(ability),
    };
  }
  public useAbility(
    ability: iAbility,
    stats?: iStatsCheck,
    targetCharacter?: Character | null,
    canBeCountered: boolean = true
  ): Log[] {
    const logs: Log[] = [];
    logs.push(new Log({ character: this, ability: { used: ability } }));

    ability.actions?.forEach((action) => {
      const actionResults = this.processAction(
        action,
        ability,
        targetCharacter,
        canBeCountered,
        undefined,
        stats
      );
      logs.push(...actionResults.logs);
      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "useAbility",
            ability,
            target: actionResults.primaryTarget ?? targetCharacter,
          },
        ])
      );
    });

    return logs;
  }
  private processAction(
    action: iAction,
    ability: iAbility | null,
    targetCharacter?: Character | null,
    canBeCountered: boolean = true,
    data?: iTriggerData,
    stats?: iStatsCheck
  ): { logs: Log[]; primaryTarget: Character | null } {
    const logs: Log[] = [];

    const { targetList, primaryTarget } = this.findTargets(
      action?.targets ?? [],
      targetCharacter
    );
    let shouldCounter = false;
    action.effects?.forEach((effect) => {
      targetList.forEach((target) => {
        const {
          logs: effectLogs,
          targetTriggers,
          characterTriggers,
        } = this.processEffect(effect, target, ability, data, stats);
        logs.push(...effectLogs);
        logs.push(...target.executePassiveTriggers(targetTriggers));
        logs.push(...this.executeAbilityTriggers(ability, characterTriggers));
        logs.push(...this.executePassiveTriggers(characterTriggers));

        shouldCounter =
          characterTriggers.some((x) => x.damageDealt) || shouldCounter;
      });
    });
    return { logs, primaryTarget };
  }
  public processEffect(
    effect: iEffect,
    targetCharacter: Character,
    ability: iAbility | null,
    data?: iTriggerData,
    stats?: iStatsCheck
  ) {
    const logs: Log[] = [];
    const characterTriggers: iTriggerData[] = [];
    const targetTriggers: iTriggerData[] = [];

    if (this.checkCondition(effect.condition, targetCharacter)) {
      const attackMissed = targetCharacter.checkEvade(
        effect,
        this,
        this.combineStats([effect?.stats, stats])
      );

      if (attackMissed) {
        logs.push(
          new Log({ character: targetCharacter, damage: { evaded: true } })
        );
        targetTriggers.push({ triggerType: "dodge" });
      } else {
        if (effect.dispel) {
          logs.push(
            ...targetCharacter.removeBuff(effect.dispel?.buffs ?? null, this)
          );

          logs.push(
            ...targetCharacter.removeDebuff(
              effect.dispel?.debuffs ?? null,
              this
            )
          );

          if (effect.dispel.debuffs) {
            logs.push(
              ...this.executePassiveTriggers([
                {
                  triggerType: "dispelDebuff",
                  ability,
                  target: targetCharacter,
                },
              ])
            );
          }
        }

        if (effect.cooldown) {
          if (this.targetSelf(effect.cooldown.target)) {
            const logs = this.changeCooldown(effect, ability);
            logs.push(...logs);
          } else {
            //todo add chance to resist
            const resistedChance = Math.max(
              targetCharacter.tenacity - this.potency,
              0.15
            );

            if (!chanceOfEvent(resistedChance) || effect.cooldown.cantResist) {
              const logs = targetCharacter.changeCooldown(effect, ability);
              logs.push(...logs);
            } else {
              logs.push(
                new Log({
                  character: targetCharacter,
                  statusEffects: {
                    resisted: true,
                    list: [
                      {
                        name: "Cooldown Increase",
                        id: uuid(),
                        duration: effect.cooldown.amount,
                      },
                    ],
                    type: "debuff",
                  },
                })
              );
              logs.push(
                ...targetCharacter.executeTriggers(targetCharacter.triggers, [
                  {
                    triggerType: "resistDetrimentalEffect",
                    debuff: {
                      name: "Cooldown Increase",
                      id: uuid(),
                      duration: effect.cooldown.amount,
                    },
                    target: targetCharacter,
                    ability: ability ?? null,
                  },
                ])
              );
            }
          }
        }

        if (effect.heal) {
          let maxAmount: undefined | number = undefined;
          if (effect.scalesBy) {
            if (effect.scalesBy.damage) {
              maxAmount = data?.damageDealt;
            } else {
              console.warn(
                "Unknown scaling heal amount",
                effect.scalesBy,
                data
              );
            }
          }
          logs.push(...targetCharacter.heal(effect.heal, ability, maxAmount));
        }

        if (effect.stats) {
          targetCharacter._tempStats.push(effect.stats);
        }

        if (effect.assist) {
          logs.push(...this.callAllyToAssist(effect.assist, targetCharacter));
        }

        if (effect.damage) {
          if (effect.damage.damageType === "true") {
            const { targetList } = this.findTargets(
              effect.scalesBy?.targets ?? {
                filters: [{ primary: true }],
              },
              targetCharacter
            );
            targetList.forEach((target) => {
              const amount = target.getScalar(effect.scalesBy, 0);
              const { logs: damageLogs } = this.dealBonusDamage(
                targetCharacter,
                amount,
                ability
              );
              logs.push(...damageLogs);
            });
          } else {
            const { logs: damageLogs } = this.dealDamageWithAttack(
              targetCharacter,
              effect.damage,
              this.combineStats([effect.damage.modifier.stats, stats]),
              ability
            );

            logs.push(...damageLogs);
          }
        }

        if (effect.buffs) {
          logs.push(
            ...targetCharacter.addBuff(
              effect.buffs ?? [],
              true,
              this.getScalar(effect.scalesBy, 0),
              ability
            )
          );
        }

        if (effect.debuffs) {
          //it looks backwards from the other logic but its not
          logs.push(
            ...this.inflictDebuff(
              effect.debuffs,
              targetCharacter,
              this.getScalar(effect.scalesBy, 0),
              ability
            )
          );
        }

        if (effect.statusEffects) {
          logs.push(
            ...targetCharacter.addStatusEffect(effect.statusEffects, ability)
          );
        }

        if (effect.ability) {
          const { abilityTrigger, abilityToUse } = effect.ability;
          if (abilityTrigger === data?.ability?.id || !abilityTrigger) {
            if (abilityToUse) {
              const abilityMatch = this.chooseAbility(abilityToUse);
              if (abilityMatch) {
                const copyAbility: iAbility = unvue(abilityMatch);
                if (copyAbility?.actions && effect.ability?.actionId) {
                  const matchAction = copyAbility.actions.find(
                    (a) => a.id === effect.ability?.actionId
                  );
                  if (matchAction) {
                    if (effect.ability.effects) {
                      matchAction.effects?.push(...effect.ability.effects);
                    }

                    if (effect.ability.replaceTargets) {
                      matchAction.targets = effect.ability.replaceTargets;
                    }
                  }
                } else {
                  console.warn(
                    "Unknown action to modify",
                    copyAbility,
                    effect.ability
                  );
                }
                logs.push(
                  ...this.useAbility(copyAbility, effect.stats, targetCharacter)
                );
              } else if (this.hasDebuff("Stun")) {
                logs.push(new Log({ character: this }));
              }
            }
          }
        }

        if (effect.triggers) {
          if (ability) {
            effect.triggers.forEach((t) => {
              targetCharacter.addTrigger(t, ability);
            });
          } else {
            console.warn("No ability to add to the trigger");
          }
        }

        if (effect.reset) {
          if (effect.reset.debuffs) {
            effect.reset?.debuffs?.forEach((debuff) => {
              let shouldLog = false;
              targetCharacter._debuffs.forEach((d) => {
                if (d.name === debuff && effect.reset?.duration) {
                  d.duration = effect.reset?.duration;
                  shouldLog = true;
                }
              });
              if (shouldLog) {
                logs.push(
                  new Log({
                    character: targetCharacter,
                    statusEffects: {
                      reset: 3,
                      list: [
                        {
                          id: uuid(),
                          name: debuff,
                          duration: effect.reset?.duration ?? 1,
                        },
                      ],
                      type: "debuff",
                    },
                    ability: {
                      source: ability,
                    },
                  })
                );
              }
            });
          }
        }
      }
    }
    return { logs, targetTriggers, characterTriggers };
  }

  public hasTags(tag: string, id: string): boolean {
    if (this._categories.includes(tag)) {
      return true;
    } else if (tag === "Self") {
      return this.id === id;
    } else if (
      tag === "Light Side" ||
      tag === "Dark Side" ||
      tag === "Neutral"
    ) {
      return this.alignment === tag;
    } else {
      return tag === this.id;
    }
  }
  private getScalar(
    scalesBy: iEffect["scalesBy"],
    initialValue: number
  ): number {
    let scalar: number | null = null;
    if (scalesBy?.buffs) {
      scalar = scalar ?? 0;
      scalesBy.buffs.forEach((buff) => {
        const { targetList } = this.findTargets(scalesBy.targets ?? {});
        targetList.forEach((target) => {
          target.buffs.forEach((x) => {
            if (x.name === buff) {
              scalar = scalar === null ? 1 : scalar + 1;
            }
          });
        });
      });
    }
    if (scalesBy?.debuffs) {
      scalar = scalar ?? 0;
      scalesBy.debuffs.forEach((debuff) => {
        const { targetList } = this.findTargets(scalesBy.targets ?? {});
        targetList.forEach((target) => {
          target.buffs.forEach((x) => {
            if (x.name === debuff) {
              scalar = scalar === null ? 1 : scalar + 1;
            }
          });
        });
      });
    }
    if (scalesBy?.damage) {
      scalar = scalar === null ? initialValue : scalar + initialValue;
    }
    if (scalesBy?.stat) {
      const stats: number | undefined = this.getCombatStats(scalesBy.stat.type)[
        scalesBy.stat.name
      ];
      if (stats) {
        if (scalesBy.stat.percent) {
          scalar =
            scalar === null ? stats : scalar + stats * scalesBy.stat.percent;
        } else {
          scalar = scalar === null ? stats : scalar + stats;
        }
      }
    }
    return scalar ?? 1;
  }
  private targetSelf(targetData?: iTargetData): boolean {
    const tagsMatch = (targetData?.filters ?? []).every((t) => {
      return t?.tags ? anyTagsMatch(this, t.tags, this.id) : false;
    });

    return targetData?.self || (!!targetData?.allies && tagsMatch);
  }
  private isSelf(char?: Character) {
    return this.id === char?.id && this.owner === char?.owner;
  }
  public get triggers() {
    return this._triggers;
  }
  public addTrigger(trigger: iTrigger, ability: iAbility) {
    const match = this._triggers.find((t) => t.id === trigger.id);
    if (!match) {
      this._triggers.push({ ...unvue(trigger), srcAbility: unvue(ability) });

      const targets = this.findTargets(trigger.targets);
      targets.targetList.forEach((target) => {
        if (!this.isSelf(target) && trigger.triggerType === "always") {
          const copy: iTrigger = unvue(trigger);
          copy.actions.forEach((action) => {
            action.effects?.forEach((effect) => {
              if (effect.stats && effect.scalesBy?.targets?.self) {
                if (
                  effect.stats.modifiedType === "multiplicative" &&
                  effect.scalesBy.stat?.name
                ) {
                  if (effect.scalesBy.stat.type === "physical") {
                    effect.stats.amount *=
                      this.physical[effect.scalesBy.stat?.name];
                  } else if (effect.scalesBy.stat.type === "special") {
                    effect.stats.amount *=
                      this.special[effect.scalesBy.stat?.name];
                  } else {
                    effect.stats.amount *= this[effect.scalesBy.stat?.name];
                  }
                  effect.stats.modifiedType = "additive";
                  delete effect.scalesBy.targets;
                }
              }
            });
          });
          target.addTrigger(copy, ability);
        }
      });
    }
  }
  public removeTrigger(trigger: iTrigger): Log[] {
    const logs: Log[] = [];
    // logs.push(...this.removeEvents([trigger])); //todo
    // logs.push(...this.removeEvents(trigger?.events));

    const index = this._triggers.findIndex((t) => t.id === trigger.id);
    if (index > -1) {
      this._triggers.splice(index, 1);
    }
    return logs;
  }
  /**
   * Execute all triggers that are contained within this._triggers
   * @param types The types of triggers that should occur
   * @returns An array of logs
   */
  public executePassiveTriggers(types: iTriggerData[]): Log[] {
    return this.executeTriggers(this._triggers, types);
  }
  /**
   * Execute all triggers that are contained within the ability
   * @param ability The ability in which the triggers are happening
   * @param types The types of triggers that should occur
   * @returns An array of logs
   */
  public executeAbilityTriggers(
    ability: iAbility | null,
    types: iTriggerData[]
  ) {
    return this.executeTriggers(ability?.triggers ?? [], types, ability);
  }
  /**
   * Execute a list of triggers
   * @param triggers The triggers that are occuring
   * @param types The types of triggers that should occur
   * @param ability The source ability that is causing the triggers to occur
   * @returns
   */
  public executeTriggers(
    triggers: iTrigger[],
    types: iTriggerData[],
    ability?: iAbility | null
  ): Log[] {
    const logs: Log[] = [];
    triggers.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (this.checkCondition(trigger.condition, type.target ?? this)) {
            if (this.checkTriggerCount(trigger, type.target, type.ability)) {
              logs.push(
                ...this.executeTrigger(
                  trigger,
                  ability ?? trigger.srcAbility, //order is important
                  type
                )
              );
            }
          }
        }
      });
    });
    return logs;
  }
  public executeTrigger(
    trigger: iTrigger,
    srcAbility?: iAbility | null,
    triggerData?: iTriggerData
  ): Log[] {
    const logs: Log[] = [];
    trigger.actions.forEach((action) => {
      const actionData = this.processAction(
        action,
        srcAbility ?? null,
        triggerData?.target,
        true,
        triggerData
      );
      logs.push(...actionData.logs);
    });
    return logs;
  }
  private checkTriggerCount(
    trigger: iTrigger,
    target?: Character | null,
    ability?: iAbility | null
  ): boolean {
    if (trigger.triggerData?.count !== undefined) {
      if (trigger.triggerData.count >= 1) {
        trigger.triggerData.count--;
      } else {
        return false;
      }
    } else if (trigger.triggerData?.units && target?.id) {
      const exists = trigger.triggerData.units.find((u) => u.id === target?.id);
      if (exists) {
        if (exists.count >= (trigger.triggerData?.limit ?? 0)) {
          return false;
        } else {
          exists.count++;
        }
      } else {
        trigger.triggerData.units.push({
          count: 1,
          id: target?.id,
        });
      }
    } else if (trigger.triggerData?.excludeAbilities) {
      return !trigger.triggerData?.excludeAbilities.some(
        (a) => a === ability?.id
      );
    }
    return true;
  }
  private removePassiveTriggers() {
    this._uniqueAbilities.forEach((ability) => {
      this.removeAllTriggers(ability.triggers);
    });
  }
  private removeAllTriggers(triggers?: iTrigger[]) {
    const logs: Log[] = [];
    triggers?.forEach((trigger) => {
      [...this._teammates, ...this._opponents].forEach((target) => {
        logs.push(...target.removeTrigger(trigger));
      });
    });
  }
  public resetTriggers(type: string) {
    this._triggers.forEach((t) => {
      if (t.triggerData) {
        if (t.triggerData.frequency === type) {
          t.triggerData.count = t.triggerData.limit;
        }
        if (t.triggerData.units) {
          t.triggerData.units = [];
        }
      }
    });
  }
  public endOfTurn(ability: iAbility | null): Log[] {
    const logs: Log[] = [];
    const { debuffsRemoved } = this._debuffs.reduce(
      (
        acc: {
          debuffsRemoved: tDebuff[];
        },
        debuff: iDebuff
      ) => {
        if (debuff.isNew) {
          debuff.isNew = false;
        } else {
          debuff.duration--;
        }

        if (debuff.duration <= 0) {
          acc.debuffsRemoved.push(debuff.name);
        }
        return acc;
      },
      { debuffsRemoved: [] }
    );

    const { buffsRemoved } = this._buffs.reduce(
      (
        acc: {
          buffsRemoved: tBuff[];
        },
        buff: iBuff
      ) => {
        if (buff.isNew) {
          buff.isNew = false;
        } else {
          buff.duration--;
        }

        if (buff.duration <= 0) {
          acc.buffsRemoved.push(buff.name);
        }
        return acc;
      },
      { buffsRemoved: [] }
    );

    debuffsRemoved.forEach((debuff) => {
      logs.push(...this.removeDebuff(debuff));
    });
    buffsRemoved.forEach((buff) => {
      logs.push(...this.removeBuff(buff));
    });

    this._activeAbilities.forEach((a) => {
      if (ability?.id !== a.id && "turnsRemaining" in a) {
        a.turnsRemaining = Math.max(a.turnsRemaining - 1, 0);
      }
    });

    this._tempStats = this._tempStats.reduce(
      (list: iStatsCheck[], t: iStatsCheck) => {
        if (t.expires && t.expires.frequency === "turn") {
          if (t.expires.count > 1) {
            list.push(t);
          }
        } else {
          list.push(t);
        }
        return list;
      },
      []
    );

    return logs;
  }
  public reset(teammates: Character[], opponents: Character[]) {
    this._triggers = [];
    this._teammates = teammates;
    this._opponents = opponents;
  }
  public initialize() {
    this._activeAbilities.forEach((a) => {
      if ("turnsRemaining" in a) {
        a.turnsRemaining = 0;
      }
    });
    this._debuffs = [];
    this._buffs = [];
    this._statusEffects = [];
    this._tm = 0;

    this._uniqueAbilities.forEach((ability) => {
      ability.triggers?.forEach((trigger) => {
        const { targetList } = this.findTargets(trigger?.targets ?? {});
        targetList.forEach((target) => {
          target.addTrigger(trigger, ability as iAbility);
        });
      });
    });

    if (this.isLeader && this._leaderAbility) {
      this._leaderAbility.triggers?.forEach((trigger) => {
        const { targetList } = this.findTargets(trigger?.targets ?? {});
        targetList.forEach((target) => {
          target.addTrigger(trigger, this._leaderAbility as iAbility);
        });
      });
    }

    this._triggers.forEach((trigger) => {
      if (trigger?.triggerData?.count !== undefined) {
        trigger.triggerData.count = trigger.triggerData.limit;
      }
      if (trigger.triggerData?.units) {
        trigger.triggerData.units = [];
      }
    });
  }
  public getLogs(): tLogData {
    return {
      name: this.name,
      owner: this.owner,
      health: {
        current: round(this.health, 0),
        max: round(this.maxHealth, 0),
        base: round(this._baseStats.maxHealth, 0),
      },
      protection: {
        current: round(this.protection, 0),
        max: round(this.maxProtection, 0),
        base: round(this._baseStats.maxProtection, 0),
      },
      activeAbilities: unvue(this._activeAbilities),
      buffs: unvue(this._buffs),
      debuffs: unvue(this._debuffs),
      statusEffects: unvue(this._statusEffects),
      physical: [
        {
          label: "Offense",
          value: round(this.physical.offense, 2),
          base: round(this._baseStats.physical.offense, 2),
        },
        {
          label: "Crit Chance",
          value: round(this.physical.critChance * 100, 2),
          base: round(this._baseStats.physical.critChance * 100, 2),
          isPercent: true,
        },
        {
          label: "Armor",
          value: round(
            (this.physical.armor * 100) / (this.physical.armor + 637.5),
            2
          ),
          base: round(
            (this._baseStats.physical.armor * 100) /
              (this._baseStats.physical.armor + 637.5),
            2
          ),
          isPercent: true,
        },
        {
          label: "Armor Pen",
          value: round(this.physical.armorPen, 2),
          base: round(this._baseStats.physical.armorPen, 2),
        },
        {
          label: "Accuracy",
          value: round(this.physical.accuracy * 100, 2),
          base: round(this._baseStats.physical.accuracy * 100, 2),
          isPercent: true,
        },
        {
          label: "Dodge (Evasion)",
          value: round(this.physical.dodge * 100, 2),
          base: round(this._baseStats.physical.dodge * 100, 2),
          isPercent: true,
        },
        {
          label: "Crit Avoidance",
          value: round(this.physical.critAvoid * 100, 2),
          base: round(this._baseStats.physical.critAvoid * 100, 2),
          isPercent: true,
        },
      ],
      special: [
        {
          label: "Offense",
          value: round(this.special.offense, 2),
          base: round(this._baseStats.special.offense, 2),
        },
        {
          label: "Crit Chance",
          value: round(this.special.critChance * 100, 2),
          base: round(this._baseStats.special.critChance * 100, 2),
          isPercent: true,
        },
        {
          label: "Resistance",
          value: round(
            (this.special.armor * 100) / (this.special.armor + 637.5),
            2
          ),
          base: round(
            (this._baseStats.special.armor * 100) /
              (this._baseStats.special.armor + 637.5),
            2
          ),
          isPercent: true,
        },
        {
          label: "Resistance Pen",
          value: round(this.special.armorPen, 2),
          base: round(this._baseStats.special.armorPen, 2),
        },
        {
          label: "Accuracy",
          value: round(this.special.accuracy * 100, 2),
          base: round(this._baseStats.special.accuracy * 100, 2),
          isPercent: true,
        },
        {
          label: "Deflection (Evasion)",
          value: round(this.special.dodge * 100, 2),
          base: round(this._baseStats.special.dodge * 100, 2),
          isPercent: true,
        },
        {
          label: "Crit Avoidance",
          value: round(this.special.critAvoid * 100, 2),
          base: round(this._baseStats.special.critAvoid * 100, 2),
          isPercent: true,
        },
      ],
      general: [
        {
          label: "Speed",
          value: round(this.speed, 2),
          base: round(this._baseStats.speed, 2),
        },
        {
          label: "Mastery",
          value: round(this.mastery, 2),
          base: round(this._baseStats.mastery, 2),
        },
        {
          label: "Crit Damage",
          value: round(this.critDamage * 100, 2),
          base: round(this._baseStats.critDamage * 100, 2),
          isPercent: true,
        },
        {
          label: "Tenacity",
          value: round(this.tenacity * 100, 2),
          base: round(this._baseStats.tenacity * 100, 2),
          isPercent: true,
        },
        {
          label: "Potency",
          value: round(this.potency * 100, 2),
          base: round(this._baseStats.potency * 100, 2),
          isPercent: true,
        },
        {
          label: "Health Steal",
          value: round(this.healthSteal * 100, 2),
          base: round(this._baseStats.healthSteal * 100, 2),
          isPercent: true,
        },
        {
          label: "Defense Pen",
          value: 0,
          base: 0,
          isPercent: true,
        },
        {
          label: "Counter Chance",
          value: round(this.counterChance * 100, 2),
          base: 0,
          isPercent: true,
        },
        {
          label: "Counter Damage",
          value: round(this.counterDamage * 100, 2),
          base: 100,
          isPercent: true,
        },
      ],
      triggers: unvue(this._triggers),
      otherEffects: unvue({ ...this.effects, immunity: this.immunity }),
      turnMeter: round(this.turnMeter, 0),
    };
  }
  public resetHealth() {
    this._baseStats.health = this.maxHealth;
    this._baseStats.protection = this.maxProtection;
  }
}

//todo: combine these functions with /teams.js
export function anyTagsMatch(
  character: Character,
  tagsList: string[],
  id: string
): boolean {
  return tagsList.some((tag) => {
    if (tag.includes("&")) {
      const split = tag.split("&");
      return split.every((x) => anyTagsMatch(character, [x.trim()], id));
    } else if (tag.charAt(0) === "!") {
      const value = tag.substring(1);
      return !character.hasTags(value, id);
    } else {
      return character.hasTags(tag, id);
    }
  });
}

function modifyStat(
  baseStat: number,
  statType: string,
  stats?: iStatsCheck[] | null
) {
  let modifiedStat = baseStat;
  if (stats) {
    stats.forEach((s) => {
      if (statType === s?.statToModify) {
        if (s.modifiedType === "multiplicative") {
          modifiedStat *= s.amount;
        } else if (s.modifiedType === "additive") {
          modifiedStat += s.amount;
        }
      }
    });
  }
  return modifiedStat;
}

export const format = {
  characterName(name: string, owner: string) {
    return `<em>${name}</em> (${owner})`;
  },
  recover(
    charName: string,
    owner: string,
    type: "health" | "protection",
    amount: number,
    currentProt: number,
    currentHealth: number,
    ability: iGeneralAbility | null = null
  ) {
    return `${this.characterName(
      charName,
      owner
    )} recovered <b class="${type}">${amount}</b> ${type} (${this.healthStats(
      currentProt,
      currentHealth
    )})${this.abilitySource(ability)}`;
  },
  healthStats(protection: number, health: number) {
    return `Protection: <b class="protection">${round(
      protection
    )}</b> , Health: <b class="health">${round(health)}</b>`;
  },
  buff(buffs: string[]) {
    return this.statusEffects(buffs, "buff");
  },
  debuff(debuffs: string[]) {
    return this.statusEffects(debuffs, "debuff");
  },
  statusEffects(list: string[], type: string) {
    return `<span class="${type}">${list.join(", ")}</span>`;
  },
  damage(
    amount: number,
    targetName: string,
    owner: string,
    isCrit: boolean,
    protection: number,
    health: number
  ) {
    return `<span class="damage">${round(
      amount
    )}</span> damage was dealt to ${this.characterName(
      targetName,
      owner
    )}${this.crit(isCrit)} (${this.healthStats(protection, health)})`;
  },
  crit(isCrit: boolean) {
    return isCrit ? " <span class='crit'>(Crit)</span>" : "";
  },
  useAbility(charName: string, ability: iGeneralAbility, owner: string) {
    return `${this.characterName(charName, owner)} used ${this.ability(
      ability
    )}`;
  },
  ability(ability: iGeneralAbility | null) {
    return `<span class="ability" title="${ability?.gameText}">${ability?.name}</span>`;
  },
  abilitySource(ability: iGeneralAbility | null) {
    return ability ? ` (src: ${this.ability(ability)})` : "";
  },
};

/**
 * Checks the likelihood of something happening
 *
 * @param percentChance - The chances of something happening (can be either decimal or whole number)
 * @returns Whether the event has occurred
 */
function chanceOfEvent(percentChance: number): boolean {
  if (percentChance < 1) {
    percentChance *= 100;
  }
  return percentChance >= randomNumber(1, 100);
}
