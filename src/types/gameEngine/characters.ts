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
    /** Determines if only the allies or opponents should be targeted */
    allies?: boolean;
    /** Determines if any units should be targeted with specific status effects */
    statusEffects?: tStatusEffect[];
    /** Determines if any units should be targeted with specific debuffs */
    debuffs?: tDebuff[];
    /** Determines if any units should be targeted with specific buffs */
    buffs?: tBuff[];
    /** Determines if the target is the leader or not */
    isLeader?: boolean;
  }[];
  /** Determines if the weakest unit should be targeted */
  weakest?: boolean;
  /** Determines how many units of the given filters should be selected */
  targetCount?: number;
  /** Determines if the filtering should ignore any taunt effects */
  ignoreTaunt?: boolean;
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
  private _categories: string[];
  private _triggers: iTrigger[] = [];
  private _teammates: Character[] = [];
  private _opponents: Character[] = [];
  public isLeader: boolean = false;

  constructor(data: Unit, owner: string) {
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
  }

  /** The modified maximum amount of Protection */
  public get maxProtection() {
    return this.getModifiedStats(
      [],
      this._baseStats.maxProtection,
      this.getTempStat("maxProtection")
    );
  }
  public set maxProtection(val) {
    this._baseStats.maxProtection = val;
  }
  /** The modified maximum amount of Health */
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
      ],
      this._baseStats.maxHealth,
      this.getTempStat("maxHealth")
    );
  }
  public set maxHealth(val) {
    this._baseStats.maxHealth = val;
  }
  /** The current Health */
  public get health() {
    return this._baseStats.health;
  }
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

    if (this.health <= 0) {
      this.removePassiveTriggers();
    }
  }
  /** Is the character dead */
  public get isDead() {
    return this.health <= 0;
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
  ): string[] {
    const logs: string[] = [];

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
          `${format.recover(
            this.name,
            this.owner,
            healthType,
            round(diff),
            this.protection,
            this.health,
            ability
          )}`
        );
      }
    }
    return logs;
  }
  /** The current Health Steal */
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
      this._baseStats.healthSteal,
      this.getTempStat("healthSteal")
    );
  }
  /** The current Speed */
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
  public set speed(val) {
    this._baseStats.speed = val;
  }
  /** The current Critical Damage (decimal) */
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
      this._baseStats.critDamage,
      this.getTempStat("critDamage")
    );
  }
  /** The current Tenacity (decimal) */
  public get tenacity() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Tenacity Down"),
          value: -1000,
        },
        {
          hasEffect: this.hasBuff("Tenacity Up"),
          value: 99999,
        },
      ],
      this._baseStats.tenacity,
      this.getTempStat("tenacity")
    );
  }
  public set tenacity(val) {
    this._baseStats.tenacity = val;
  }
  /** The current Potency (decimal) */
  public get potency() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Potency Down"),
          value: -50,
        },
        {
          hasEffect: this.hasBuff("Potency Up"),
          value: 50,
        },
      ],
      this._baseStats.potency,
      this.getTempStat("potency")
    );
  }
  public set potency(val) {
    this._baseStats.potency = val;
  }
  /**
   * The likelyhood (decimal) of counter attacking
   */
  public get counterChance() {
    if (this.hasDebuff("Stun")) {
      return 0;
    }

    const chance = this.getModifiedStats(
      [],
      0,
      this.getTempStat("counterChance")
    );
    return chance;
  }
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
   * @assistData - The data in which is used to determine how to assist
   * @targetCharacter - The character in which is being attacked
   */
  private callAllyToAssist(
    assistData: iAssist,
    targetCharacter: Character
  ): string[] {
    const logs: string[] = [];
    if (assistData && !targetCharacter.isDead) {
      if (chanceOfEvent(assistData.chance * 100)) {
        this.findTargets(assistData?.targets ?? {}).forEach((ally) => {
          logs.push(
            `${format.characterName(ally.name, ally.owner)} is called to assist`
          );
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
   * @modifier - Data to check if the assist should trigger and how to modify the damage if applicable
   * @targetCharacter - The character in which is being attacked
   */
  public assist(
    modifier: iAssist["modifier"],
    targetCharacter: Character | null
  ): string[] {
    const logs: string[] = [];

    if (this.basicAbility) {
      if (!modifier || this.checkCondition(modifier.condition, this)) {
        const basicAbility: iAbility = unvue(this.basicAbility);
        basicAbility.actions?.forEach((action) => {
          action.targets = { filters: [{ targetIds: ["target"] }] };
        });

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
    return logs;
  }

  /** The physical stats of a character */
  public get physical() {
    const self = this;
    return {
      /** Physical Offense */
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          self._baseStats.physical.offense,
          self.getTempStat("offense"),
          true
        );
      },
      set offense(val) {
        self._baseStats.physical.offense = val;
      },
      /** Physical Crit Chance (decimal) */
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
            { hasEffect: self.hasBuff("Advantage"), value: 100 },
          ],
          self._baseStats.physical.critChance,
          self.getTempStat("critChance")
        );
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      /** Physical Armor (flat number) */
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          self._baseStats.physical.armor,
          self.getTempStat("armor"),
          true
        );
      },
      set armor(val) {
        self._baseStats.physical.armor = val;
      },
      /** Physical Armor Penetration */
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          self._baseStats.physical.armorPen,
          self.getTempStat("armorPen")
        );
      },
      set armorPen(val) {
        self._baseStats.physical.armorPen = val;
      },
      /** Physical Accuracy (decimal) */
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
            { hasEffect: self.hasDebuff("Blind"), value: -999 },
            {
              hasEffect: self.hasBuff("Call to Action"),
              value: 0.5,
            },
          ],
          self._baseStats.physical.accuracy,
          self.getTempStat("accuracy")
        );
      },
      set accuracy(val) {
        self._baseStats.physical.accuracy = val;
      },
      /** Physical Dodge Chance (decimal) */
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          self._baseStats.physical.dodge,
          self.getTempStat("dodge")
        );
      },
      set dodge(val) {
        self._baseStats.physical.dodge = val;
      },
      /** Physical Critical Avoice (decimal) */
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -999,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: 1000000,
            },
          ],
          self._baseStats.physical.critAvoid,
          self.getTempStat("critAvoid")
        );
      },
      set critAvoid(val) {
        self._baseStats.physical.critAvoid = val;
      },
    };
  }
  public get special() {
    const self = this;
    return {
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          self._baseStats.special.offense,
          self.getTempStat("offense"),
          true
        );
      },
      set offense(val) {
        self._baseStats.special.offense = val;
      },
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
          ],
          self._baseStats.special.critChance,
          self.getTempStat("critChance")
        );
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          self._baseStats.special.armor,
          self.getTempStat("armor"),
          true
        );
      },
      set armor(val) {
        self._baseStats.special.armor = val;
      },
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          self._baseStats.special.armorPen,
          self.getTempStat("armorPen")
        );
      },
      set armorPen(val) {
        self._baseStats.special.armorPen = val;
      },
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
          ],
          self._baseStats.special.accuracy,
          self.getTempStat("accuracy")
        );
      },
      set accuracy(val) {
        self._baseStats.special.accuracy = val;
      },
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          self._baseStats.special.dodge,
          self.getTempStat("dodge")
        );
      },
      set dodge(val) {
        self._baseStats.special.dodge = val;
      },
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -999,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: 1000000,
            },
          ],
          self._baseStats.special.critAvoid,
          self.getTempStat("critAvoid")
        );
      },
      set critAvoid(val) {
        self._baseStats.special.critAvoid = val;
      },
    };
  }
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
            const targets = this.findTargets(action.targets);
            targets.forEach((target) => {
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
  private get immunity(): Record<string, boolean> {
    return this._triggers.reduce(
      (immuneMapping, trigger) => {
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
                }
              }
            });
          });
        }
        return immuneMapping;
      },
      {
        Daze: this.hasStatusEffect("Guard"),
        Stun: this.hasStatusEffect("Guard"),
      }
    );
  }
  private getModifiedStats(
    statusEffectConfig: { hasEffect: boolean; value: number }[],
    baseStat: number,
    tempStats: iStatsCheck[],
    isMultiplicative: boolean = false
  ) {
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

  //Turn Meter and turn order logic
  public get turnMeter() {
    return this._tm;
  }
  public get turnMeterRatio() {
    return (100 - this._tm) / this.speed;
  }
  /** Manipulates the unit's turn meter by a certain amount
   *
   * @amount - The amount the turn meter will be changed. Positive number will add turn meter, negative number will remove turn meter
   */
  public changeTurnMeter(amount: number): string {
    if (amount === 0) {
      return "";
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

    if (amount > 0) {
      return `${format.characterName(this.name, this.owner)} gained ${round(
        diff,
        2
      )}% turn meter (${round(this._tm, 2)}%)`;
    } else {
      return `${round(
        diff,
        2
      )}% turn meter was removed from ${format.characterName(
        this.name,
        this.owner
      )} (${round(this._tm, 2)}%)`;
    }
  }
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

  //Status Effects
  public get debuffs() {
    return this._debuffs;
  }
  public get buffs() {
    return this._buffs;
  }
  public get statusEfects() {
    return this._statusEffects;
  }
  public hasDebuff(name: tDebuff | tDebuff[] | iDebuff | iDebuff[]) {
    if (Array.isArray(name)) {
      return (name as (tDebuff | iDebuff)[]).every((x) => this.hasDebuff(x));
    } else {
      return this.debuffs.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public hasBuff(name: tBuff | tBuff[] | iBuff | iBuff[]) {
    if (Array.isArray(name)) {
      return (name as (tBuff | iBuff)[]).every((x) => this.hasBuff(x));
    } else {
      return this.buffs.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public hasStatusEffect(
    name: tStatusEffect | tStatusEffect[] | iStatusEffect | iStatusEffect[]
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tStatusEffect | iStatusEffect)[]).every((x) =>
        this.hasStatusEffect(x)
      );
    } else {
      return this._statusEffects.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public isImmune(statusEffect: iStatusEffect | tStatusEffect): boolean {
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
  ): string[] {
    if (Array.isArray(buff)) {
      return buff.reduce((arr: string[], b) => {
        arr.push(...this.addBuff(b, isNew, scalar, ability));
        return arr;
      }, []);
    } else if (buff.name === "TM Increase") {
      if (scalar > 0) {
        return [
          this.changeTurnMeter(buff.duration * scalar) +
            `${format.abilitySource(ability)}`,
        ];
      }
    } else if (this.hasDebuff("Buff Immunity") && !buff.cantPrevent) {
      return [
        `${format.characterName(
          this.name,
          this.owner
        )} could not gain ${format.buff([buff.name])} due to ${format.debuff([
          "Buff Immunity",
        ])}`,
      ];
    } else if (!this.hasDebuff("Buff Immunity")) {
      if ((!this.hasBuff(buff) || buff.isStackable) && !this.isImmune(buff)) {
        if (scalar > 0) {
          this._buffs.push({
            ...buff,
            duration: buff.duration * scalar,
            isNew,
            sourceAbility: ability,
          });
          return [
            `${format.characterName(
              this.name,
              this.owner
            )} gained ${format.buff([buff.name])} for <b>${
              buff.duration * scalar
            }</b> turns${format.abilitySource(ability)}`,
          ];
        }
      }
    }
    return [];
  }
  private removeBuff(
    buff: iBuff | iBuff[] | tBuff | tBuff[] | null,
    opponent?: Character
  ): string[] {
    const listOfRemovedBuffs: iBuff[] = [];
    const logs: string[] = [];
    if (Array.isArray(buff)) {
      logs.push(
        ...(buff as (iBuff | tBuff)[]).reduce((arr: string[], b) => {
          arr.push(...this.removeBuff(b, opponent));
          return arr;
        }, [])
      );
    } else {
      let buffData: iBuff | null = null;
      if (typeof buff === "string") {
        buffData = {
          name: buff,
          id: uuid(),
          duration: 1,
        };
      } else {
        buffData = buff;
      }

      this._buffs = this._buffs.filter((b) => {
        if (
          (b.name === buffData?.name ||
            buffData?.name === "all" ||
            b.id === buffData?.id) &&
          !this.isSelf(opponent) &&
          !b.cantDispel
        ) {
          listOfRemovedBuffs.push(b);
          return false;
        }
        return true;
      });

      if (listOfRemovedBuffs.length > 0) {
        if (opponent && !this.isSelf(opponent)) {
          logs.push(
            `${format.characterName(
              opponent.name,
              opponent.owner
            )} removed ${format.buff(
              listOfRemovedBuffs.map((x) => x.name)
            )} from ${format.characterName(this.name, this.owner)}`
          );
        } else {
          logs.push(
            `${format.buff(listOfRemovedBuffs.map((x) => x.name))} ${
              listOfRemovedBuffs.length <= 1 ? "was" : "were"
            } removed from ${format.characterName(this.name, this.owner)}`
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
  ): string[] {
    const logs: string[] = [];

    debuffs.forEach((debuff) => {
      if (targetCharacter.isImmune(debuff)) {
        logs.push(
          `${format.characterName(
            targetCharacter.name,
            targetCharacter.owner
          )} is immune to ${debuff.name}`
        );
      } else if (
        !targetCharacter.hasDebuff(debuff.name) ||
        debuff.isStackable
      ) {
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
          if (chanceOfEvent(debuff.chance ?? 0)) {
            return;
          }

          if (debuff.name === "TM Decrease") {
            logs.push(
              targetCharacter.changeTurnMeter(debuff.duration * scalar)
            );
          } else {
            if (!targetCharacter.hasDebuff(debuff) || debuff.isStackable) {
              const amount = debuff.duration * scalar;

              targetCharacter.debuffs.push({
                ...unvue(debuff),
                isNew: true,
              });
              logs.push(
                `${format.characterName(
                  targetCharacter.name,
                  targetCharacter.owner
                )} was inflicted with ${format.debuff([
                  debuff.name,
                ])} for ${amount} turn${
                  amount > 1 ? "s" : ""
                } ${format.abilitySource(ability as iGeneralAbility)}`
              );
              logs.push(
                ...this.executeTriggers(this.triggers, [
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
            `${format.characterName(
              targetCharacter.name,
              targetCharacter.owner
            )} resisted ${format.debuff([debuff.name])}`
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
    });
    return logs;
  }
  private removeDebuff(
    debuff: iDebuff | iDebuff[] | tDebuff | tDebuff[] | null,
    opponent?: Character
  ): string[] {
    const listOfRemovedDebuffs: iDebuff[] = [];
    const logs: string[] = [];

    if (Array.isArray(debuff)) {
      logs.push(
        ...(debuff as (iDebuff | tDebuff)[]).reduce(
          (arr: string[], d: iDebuff | tDebuff) => {
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
            `${format.characterName(
              opponent.name,
              opponent.owner
            )} removed ${format.debuff(
              listOfRemovedDebuffs.map((x) => x.name)
            )} from ${format.characterName(this.name, this.owner)}`
          );
        } else {
          logs.push(
            `${format.debuff(listOfRemovedDebuffs.map((x) => x.name))} ${
              listOfRemovedDebuffs.length <= 1 ? "was" : "were"
            } removed from ${format.characterName(this.name, this.owner)}`
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
  ): string[] {
    if (Array.isArray(effect)) {
      return effect.reduce((arr: string[], e) => {
        arr.push(...this.addStatusEffect(e, ability));
        return arr;
      }, []);
    } else {
      if (
        (!this.hasStatusEffect(effect) || effect.isStackable) &&
        !this.isImmune(effect)
      ) {
        this._statusEffects.push(effect);
        return [
          `${format.characterName(this.name, this.owner)} gained ${format.buff([
            effect.name,
          ])} ${format.abilitySource(ability)}`,
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
  ): string[] {
    const logs: string[] = [];
    if (Array.isArray(statusEffect)) {
      logs.push(
        ...(statusEffect as (iStatusEffect | tStatusEffect)[]).reduce(
          (arr: string[], d) => {
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
          `${format.debuff(listOfRemovedStatusEffects.map((x) => x.name))} ${
            listOfRemovedStatusEffects.length <= 1 ? "was" : "were"
          } removed`
        );
        listOfRemovedStatusEffects.forEach((buff) => {
          buff.triggers?.forEach((trigger) => {
            if (trigger.triggerType === "expires") {
              // logs.push(...this.executeTrigger(trigger));
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
   * @param ignore - Used to ignore specific attributes, such as dead characters. By default, these characters are not considered for selection
   * @returns Character[]
   */
  public findTargets(
    targetData: iTargetData,
    target?: Character | null,
    ignore?: {
      // paralysisDebuff?: boolean;
      // daze?: boolean;
      // noAssist?: boolean;
      dead?: boolean;
    }
  ): Character[] {
    const validTargets: Character[] = [
      ...this._teammates,
      ...this._opponents,
    ].filter((char: Character) => {
      let shouldExclude = false;

      if (char.isDead && !ignore?.dead) {
        shouldExclude = true;
      }
      // if (ignore?.paralysisDebuff) {
      //   shouldExclude = char.hasDebuff("Stun") || shouldExclude;
      // }
      // if (ignore?.daze) {
      //   shouldExclude = char.hasDebuff("Daze") || shouldExclude;
      // }
      return !shouldExclude;
    });

    let filteredList = validTargets.filter((char) => {
      return targetData.filters?.every((targetFilter) => {
        if (targetFilter.allies) {
          return char.owner === this.owner;
        } else if (targetFilter.allies === false) {
          if (targetData.targetCount && !targetData.ignoreTaunt) {
            if (char.owner !== this.owner) {
              const forcedEffects = ["Taunt", "Marked", "Deathmarked"];
              const anyForced = validTargets.some((c) => {
                return (
                  c.owner !== this.owner &&
                  [...c.buffs, ...c.debuffs].some((b) =>
                    forcedEffects.includes(b.name)
                  )
                );
              });
              if (anyForced) {
                const charIsForced = [...char.buffs, ...char.debuffs].some(
                  (b) => forcedEffects.includes(b.name)
                );
                return charIsForced;
              }
            }
          }
          return char.owner !== this.owner;
        } else if (targetFilter.buffs) {
          return char.hasBuff(targetFilter.buffs);
        } else if (targetFilter.debuffs) {
          return char.hasDebuff(targetFilter.debuffs);
        } else if (targetFilter.isLeader) {
          return char.isLeader;
        } else if (targetFilter.statusEffects) {
          return char.hasStatusEffect(targetFilter.statusEffects);
        } else if (targetFilter.tags) {
          return anyTagsMatch(char, targetFilter.tags, this.id);
        } else if (targetFilter.targetIds) {
          let shouldInclude = false;
          if (target instanceof Character) {
            shouldInclude =
              targetFilter.targetIds.includes("target") && char.isSelf(target);
          }
          return (
            anyTagsMatch(char, targetFilter.targetIds, this.id) || shouldInclude
          );
        }
      });
    });

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
    return filteredList.filter((x) => !!x);
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
    stats?: iStatsCheck | null
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
  public dealDamage(
    targetCharacter: Character,
    damageData: iEffect["damage"],
    stats?: iStatsCheck | null,
    srcAbility?: iAbility | null
  ) {
    const logs: string[] = [];

    const { isCrit, damageTotal } = this.calculateDamage(
      targetCharacter,
      damageData,
      stats
    );
    const { logs: _logs } = this.dealTrueDamage(
      targetCharacter,
      damageTotal,
      isCrit,
      srcAbility
    );

    logs.push(..._logs);

    return { damageTotal, isCrit, logs };
  }
  public dealTrueDamage(
    targetCharacter: Character,
    damageTotal: number,
    isCrit: boolean = false,
    srcAbility: iAbility | null = null
  ) {
    const logs: string[] = [];
    targetCharacter.protection -= damageTotal;

    logs.push(
      format.damage(
        damageTotal,
        targetCharacter.name,
        targetCharacter.owner,
        isCrit,
        targetCharacter.protection,
        targetCharacter.health
      )
    );

    logs.push(
      ...this.heal({
        amountType: "additive",
        amount: damageTotal * this.healthSteal,
        healthType: "health",
      })
    );

    logs.push(
      ...this.executePassiveTriggers([
        {
          triggerType: "dealDamage",
          damageDealt: damageTotal,
          isCrit,
          ability: srcAbility,
          target: targetCharacter,
        },
      ]),
      ...targetCharacter.executePassiveTriggers([
        {
          triggerType: "receiveDamage",
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
    }

    if (targetCharacter.health <= 0) {
      logs.push(
        `${format.characterName(
          this.name,
          this.owner
        )} defeated ${format.characterName(targetCharacter.name, this.owner)}`
      );
    }
    return { logs, isCrit, damageTotal };
  }
  private calculateDamage(
    targetCharacter: Character,
    damageData: iEffect["damage"],
    stats?: iStatsCheck | null
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
  public counterAttack(
    targetCharacter: Character,
    canBeCountered: boolean = true
  ): string[] {
    const logs: string[] = [];
    if (canBeCountered && !targetCharacter.isDead) {
      if (
        chanceOfEvent(this.counterChance * 100) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        logs.push(
          `${format.characterName(this.name, this.owner)} counter attacked`
        );

        const basicAbility: iAbility = unvue(this.basicAbility);
        basicAbility.actions?.forEach((action) => {
          action.targets = { filters: [{ targetIds: ["target"] }] };
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

    const { buffs, debuffs, stats, inverted, isNew, tags, tm } = condition;
    let results = false;
    if (buffs) {
      const hasBuffs = buffs.every((buff) => {
        const match = this._buffs.find((x) => x.name === buff);
        if (inverted) {
          return !match;
        } else if (match) {
          return isNew === false ? !match.isNew : true;
        } else return false;
      });
      results = hasBuffs || results;
    }
    if (debuffs) {
      const hasDebuffs = debuffs.every((status) => {
        const match = this.buffs.find((x) => x.name === status);
        if (match) {
          return isNew ? match.isNew : true;
        }
        return false;
      });

      results =
        (hasDebuffs && !inverted) || (!hasDebuffs && inverted) || results;
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

      results =
        (meetsStatRequirement && !inverted) ||
        (!meetsStatRequirement && inverted) ||
        results;
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
    return results;
  }
  /**
   * Change an ability's cooldown
   *
   * @param effect The effect that is causing the cooldown change
   * @param srcAbility The source ability that is causing the cooldown change
   * @returns Log of what happened
   */
  public changeCooldown(effect: iEffect, srcAbility: iAbility | null): string {
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
        return `${format.characterName(
          this.name,
          this.owner
        )} is immune to ${format.buff([name])}`;
      } else {
        const ability = this._activeAbilities.find((a) => a.id === id);
        if (ability && "turnsRemaining" in ability) {
          let finalAmount = amount;
          if (amount < 0) {
            if (ability.turnsRemaining <= 0) {
              return "";
            }
            finalAmount = Math.max(amount, 0 - ability.turnsRemaining);
          }
          ability.turnsRemaining += finalAmount;

          return `${format.characterName(
            this.name,
            this.owner
          )}'s ${format.ability(ability)}'s cooldown was ${
            finalAmount > 0 ? "increased" : "decreased"
          } by ${Math.abs(finalAmount)} ${format.abilitySource(srcAbility)} (${
            ability.turnsRemaining
          })`;
        } else {
          console.warn(
            `Could not change the cooldown of ${id}`,
            this._activeAbilities
          );
        }
      }
    }
    return "";
  }
  public checkEvade(effect: iEffect, opponent: Character, stats?: iStatsCheck) {
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
  public takeAction(): { logs: string[]; endOfTurnLogs: string[] } {
    this.startOfTurn();
    this._tm = 0;
    const logs: string[] = [];
    let ability: iAbility | null = null;
    if (this.hasDebuff("Stun")) {
      logs.push(
        `${format.characterName(
          this.name,
          this.owner
        )} is stunned and took no action`
      );
    } else {
      ability = this.chooseAbility();

      if (ability) {
        logs.push(...this.useAbility(ability));
      } else {
        console.warn("no ability");
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
  ): string[] {
    const logs: string[] = [];
    logs.push(format.useAbility(this.name, ability, this.owner));

    ability.actions?.forEach((action) => {
      logs.push(
        ...this.processAction(action, ability, targetCharacter, canBeCountered)
      );

      // targets.forEach((char) => {
      //   logs.push(
      //     ...this.executePassiveTriggers([
      //       {
      //         triggerType: "useAbility",
      //         id: uuid(),
      //         data: { target: char },
      //         srcAbility: ability,
      //       },
      //     ])
      //   );
      // });

      // const primaryCharIndex = randomNumber(0, targets.length - 1);
    });

    this.resetTriggers();

    return logs;
  }
  private processAction(
    action: iAction,
    ability: iAbility | null,
    targetCharacter?: Character | null,
    canBeCountered: boolean = true,
    data?: iTriggerData
  ): string[] {
    const logs: string[] = [];

    const targets = this.findTargets(action?.targets ?? [], targetCharacter);
    let shouldCounter = false;
    action.effects?.forEach((effect) => {
      targets.forEach((target) => {
        const {
          logs: effectLogs,
          targetTriggers,
          characterTriggers,
        } = this.processEffect(effect, target, ability, data);
        logs.push(...effectLogs);
        logs.push(...target.executePassiveTriggers(targetTriggers));
        logs.push(...this.executeAbilityTriggers(ability, characterTriggers));
        logs.push(...this.executePassiveTriggers(characterTriggers));

        shouldCounter =
          characterTriggers.some((x) => x.damageDealt) || shouldCounter;
      });
    });

    targets.forEach((target) => {
      if (ability) {
        logs.push(
          ...this.executePassiveTriggers([
            {
              triggerType: "useAbility",
              ability,
              target,
            },
          ])
        );
      }

      if (!this.isSelf(target) && shouldCounter) {
        logs.push(...target.counterAttack(this, canBeCountered));
      }
    });

    return logs;
  }
  public processEffect(
    effect: iEffect,
    targetCharacter: Character,
    ability: iAbility | null,
    data?: iTriggerData
  ) {
    const logs: string[] = [];
    const characterTriggers: iTriggerData[] = [];
    const targetTriggers: iTriggerData[] = [];

    if (this.checkCondition(effect.condition, targetCharacter)) {
      const attackMissed = targetCharacter.checkEvade(
        effect,
        this,
        effect.stats
      );

      if (attackMissed) {
        logs.push(
          `${format.characterName(
            targetCharacter.name,
            targetCharacter.owner
          )} evaded`
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
            logs.push(this.changeCooldown(effect, ability));
          } else {
            logs.push(targetCharacter.changeCooldown(effect, ability));
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
            logs.push(
              `${format.characterName(
                targetCharacter.name,
                targetCharacter.owner
              )} was dealt bonus damage from ${format.ability(ability)}`
            );

            const scalarTargets = this.findTargets(
              effect.scalesBy?.targets ?? {
                filters: [{ targetIds: ["target"] }],
              },
              targetCharacter
            );
            scalarTargets.forEach((target) => {
              const amount = target.getScalar(effect.scalesBy, 0);
              const { logs: damageLogs } = this.dealTrueDamage(
                targetCharacter,
                amount,
                false,
                ability
              );
              logs.push(...damageLogs);
            });
          } else {
            const {
              logs: damageLogs,
              isCrit,
              damageTotal,
            } = this.dealDamage(
              targetCharacter,
              effect.damage,
              effect.damage.modifier.stats,
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
          if (abilityTrigger === ability?.id || !abilityTrigger) {
            if (abilityToUse) {
              const abilityMatch = this.chooseAbility(abilityToUse);
              if (abilityMatch) {
                const copyAbility: iAbility = unvue(abilityMatch);
                if (effect.ability.effects) {
                  if (copyAbility?.actions && effect.ability?.actionId) {
                    const matchAction = copyAbility.actions.find(
                      (a) => a.id === effect.ability?.actionId
                    );
                    if (matchAction) {
                      matchAction.effects?.push(...effect.ability.effects);
                    }
                  } else {
                    console.warn(
                      "Unknown action to modify",
                      copyAbility,
                      effect.ability
                    );
                  }
                }
                logs.push(
                  ...this.useAbility(copyAbility, effect.stats, targetCharacter)
                );
              } else if (this.hasDebuff("Stun")) {
                logs.push(
                  `${format.characterName(
                    this.name,
                    this.owner
                  )} is stunned and took no action`
                );
              }
            }
          }
        }
      }
    }
    return { logs, targetTriggers, characterTriggers };
  }
  // private addEffects(
  //   targetCharacter: Character,
  //   effect: iEffect,
  //   isNew: boolean,
  //   ability: iAbility | null,
  //   data?: any
  // ): string[] {
  //   const logs: string[] = [];
  //   if (effect.dispel) {
  //     logs.push(
  //       ...targetCharacter.removeBuff(effect.dispel?.buffs ?? null, this)
  //     );

  //     logs.push(
  //       ...targetCharacter.removeDebuff(effect.dispel?.debuffs ?? null, this)
  //     );
  //   }

  //   if (effect.cooldown) {
  //     if (this.targetSelf(effect.cooldown.target)) {
  //       logs.push(this.changeCooldown(effect, ability));
  //     } else {
  //       logs.push(targetCharacter.changeCooldown(effect, ability));
  //     }
  //   }

  //   if (effect.heal) {
  //     logs.push(
  //       ...targetCharacter.heal(effect.heal, ability, data?.healAmount)
  //     );
  //   }

  //   if (effect.stats) {
  //     this._tempStats.push(effect.stats);
  //   }

  //   if (effect.assist) {
  //     logs.push(...this.callAllyToAssist(effect.assist, targetCharacter));
  //   }

  //   if (effect.damage) {
  //     if (effect.damage.damageType === "true") {
  //       logs.push(
  //         `${format.characterName(
  //           targetCharacter.name,
  //           targetCharacter.owner
  //         )} was dealt bonus damage from ${format.ability(ability?.name)}`
  //       );

  //       const scalarTargets = this.findTargets(
  //         effect.scalesBy?.targets ?? [],
  //         targetCharacter
  //       );
  //       scalarTargets.forEach((target) => {
  //         const amount = this.getScalar(effect.scalesBy, 0);
  //         logs.push(...this.dealTrueDamage(target, amount));
  //       });
  //     } else {
  //       logs.push(
  //         ...this.dealDamage(targetCharacter, effect.damage, effect.stats)
  //       );
  //     }

  //     // const { modifier } = effect.damage;
  //     // if (scale) {
  //     //   this.findTargets(scale.target, targetCharacter).forEach((target) => {
  //     //     const amount = modifyStat(
  //     //       target[scale.stats.statToModify],
  //     //       scale.stats.statToModify,
  //     //       scale?.stats
  //     //     );
  //     //     logs.push(
  //     //       `${format.characterName(
  //     //         target.name,
  //     //         target.owner
  //     //       )} was dealt bonus damage from ${format.ability(ability?.name)}`
  //     //     );
  //     //     logs.push(...this.dealTrueDamage(target, amount));
  //     //   });
  //     // }
  //   }

  //   if (effect.buffs) {
  //     logs.push(
  //       ...targetCharacter.addBuff(
  //         effect.buffs ?? [],
  //         isNew,
  //         this.getScalar(effect.scalesBy, 0),
  //         ability
  //       )
  //     );
  //   }

  //   if (effect.debuffs) {
  //     //it looks backwards from the other logic but its not
  //     logs.push(...this.inflictDebuff(effect.debuffs ?? [], targetCharacter));
  //   }

  //   if (effect.ability) {
  //     const { abilityTrigger, abilityToUse } = effect.ability;
  //     if (abilityTrigger === ability?.id || !abilityTrigger) {
  //       if (abilityToUse) {
  //         const abilityMatch = this.chooseAbility(abilityToUse);
  //         if (abilityMatch) {
  //           const copyAbility: iAbility = unvue(abilityMatch);
  //           if (effect.ability.effects) {
  //             if (copyAbility?.actions && effect.ability?.actionId) {
  //               const matchAction = copyAbility.actions.find(
  //                 (a) => a.id === effect.ability?.actionId
  //               );
  //               if (matchAction) {
  //                 matchAction.effects?.push(...effect.ability.effects);
  //               }
  //             } else {
  //               copyAbility.actions = copyAbility.actions ?? [];
  //               copyAbility.actions.push({
  //                 effects: effect.ability.effects,
  //               });
  //             }
  //           }
  //           logs.push(
  //             ...this.useAbility(copyAbility, effect.stats, targetCharacter)
  //           );
  //         } else if (this.hasDebuff("Stun")) {
  //           logs.push(
  //             `${format.characterName(
  //               this.name,
  //               this.owner
  //             )} is stunned and took no action`
  //           );
  //         }
  //       }
  //     }
  //   }

  //   return logs;
  // }

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
    damageDealt: number
  ): number {
    let scalar = 0;
    if (scalesBy?.buffs) {
      scalesBy.buffs.forEach((buff) => {
        this.buffs.forEach((x) => {
          if (x.name === buff) {
            scalar += x.stacks ?? 1;
          }
        });
      });
    }
    if (scalesBy?.debuffs) {
      scalesBy.debuffs.forEach((debuff) => {
        this.debuffs.forEach((x) => {
          if (x.name === debuff) {
            scalar += x.stacks ?? 1;
          }
        });
      });
    }
    if (scalesBy?.damage) {
      scalar += damageDealt;
    }
    if (scalesBy?.stat) {
      const stats: number | undefined = this.getCombatStats(scalesBy.stat.type)[
        scalesBy.stat.name
      ];
      if (stats) {
        scalar += scalesBy.stat.percent ? stats * scalesBy.stat.percent : stats;
      }
    }
    return scalar || 1;
  }
  private targetSelf(targets?: iTargetData): boolean {
    const allies = targets?.filters?.some((t) => t.allies === true) ?? false;
    const tagsMatch = targets?.filters?.every((t) => {
      if (t.tags) {
        return anyTagsMatch(this, t.tags, this.id);
      } else {
        return true;
      }
    });

    return allies || tagsMatch || false;
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
    }
  }
  public removeTrigger(trigger: iTrigger): string[] {
    const logs: string[] = [];
    // logs.push(...this.removeEvents([trigger]));
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
  public executePassiveTriggers(types: iTriggerData[]): string[] {
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
  ): string[] {
    const logs: string[] = [];
    triggers.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (
            this.checkTriggerCount(
              trigger.triggerData,
              type.target,
              type.ability
            )
          ) {
            logs.push(
              ...this.executeTrigger(
                trigger,
                ability ?? trigger.srcAbility ?? type.ability,
                type
              )
            );
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
  ): string[] {
    const logs: string[] = [];

    trigger.actions.forEach((action) => {
      logs.push(
        ...this.processAction(
          action,
          srcAbility ?? null,
          triggerData?.target,
          true,
          triggerData
        )
      );
    });
    return logs;
  }
  private checkTriggerCount(
    triggerData: iTrigger["triggerData"],
    target?: Character | null,
    ability?: iAbility | null
  ): boolean {
    if (triggerData?.count !== undefined) {
      if (triggerData.count >= 1) {
        triggerData.count--;
      } else {
        return false;
      }
    } else if (triggerData?.units && target?.id) {
      const exists = triggerData.units.find((u) => u.id === target?.id);
      if (exists) {
        if (exists.count >= (triggerData?.limit ?? 0)) {
          return false;
        } else {
          exists.count++;
        }
      } else {
        triggerData.units.push({
          count: 1,
          id: target?.id,
        });
      }
    } else if (triggerData?.excludeAbilities) {
      return !triggerData?.excludeAbilities.some((a) => a === ability?.id);
    }
    return true;
  }
  private removePassiveTriggers() {
    this._uniqueAbilities.forEach((ability) => {
      this.removeAllTriggers(ability.triggers);
    });
  }
  private removeAllTriggers(triggers?: iTrigger[]) {
    const logs: string[] = [];
    triggers?.forEach((trigger) => {
      [...this._teammates, ...this._opponents].forEach((target) => {
        logs.push(...target.removeTrigger(trigger));
      });
    });
  }
  private resetTriggers() {
    this._triggers.forEach((t) => {
      if (t.triggerData) {
        if (t.triggerData.frequency === "turn") {
          t.triggerData.count = t.triggerData.limit;
        }
        if (t.triggerData.units) {
          t.triggerData.units = [];
        }
      }

      //   t.events?.forEach((e) => {
      //     if (e.triggerData) {
      //       if (e.triggerData.frequency === "turn") {
      //         e.triggerData.count = e.triggerData.limit;
      //       }
      //     }
      //   });
    });
  }
  public endOfTurn(ability: iAbility | null): string[] {
    const logs: string[] = [];
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

    // if (debuffsRemoved.length > 0) {
    //   logs.push(`
    //     ${format.debuff(debuffsRemoved)}
    //     ${
    //       debuffsRemoved.length <= 1 ? "was" : "were"
    //     } removed at the end of the turn`);
    // }
    // if (buffsRemoved.length > 0) {
    //   logs.push(`${format.buff(buffsRemoved)}
    //     ${
    //       buffsRemoved.length <= 1 ? "was" : "were"
    //     } removed at the end of the turn`);
    // }

    debuffsRemoved.forEach((debuff) => {
      logs.push(...this.removeDebuff(debuff));
    });
    buffsRemoved.forEach((buff) => {
      logs.push(...this.removeBuff(buff));
    });
    // this._debuffs = newDebuffList;
    // this._buffs = newBuffList;

    // const expiredList = [...expireDebuffs, ...expiredBuffs];
    // expiredList.forEach((x) => {
    //   if (x.expires) {
    //     logs.push(
    //       ...this.processAction(x.expires, this, x.sourceAbility ?? null, false)
    //     );
    //   }
    // });

    this._activeAbilities.forEach((a) => {
      if (ability?.id !== a.id && "turnsRemaining" in a) {
        a.turnsRemaining--;
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
    this._baseStats.health = this._baseStats.maxHealth;
    this._baseStats.protection = this._baseStats.maxProtection;
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
        this.findTargets(trigger?.targets ?? {}).forEach((target) => {
          target.addTrigger(trigger, ability as iAbility);
        });
      });
    });

    if (this.isLeader && this._leaderAbility) {
      this._leaderAbility.triggers?.forEach((trigger) => {
        this.findTargets(trigger?.targets ?? {}).forEach((target) => {
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
  public getLogs() {
    return {
      name: this.name,
      owner: this.owner,
      health: {
        current: this.health,
        max: this.maxHealth,
      },
      protection: {
        current: this.protection,
        max: this.maxProtection,
      },
      buffs: unvue(this._buffs),
      debuffs: unvue(this._debuffs),
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
          value: 0,
          base: 0,
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
    };
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
  stats?: iStatsCheck | null
) {
  if (statType === stats?.statToModify) {
    if (stats.modifiedType === "multiplicative") {
      return baseStat * stats.amount;
    } else if (stats.modifiedType === "additive") {
      return baseStat + stats.amount;
    }
  }
  return baseStat;
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