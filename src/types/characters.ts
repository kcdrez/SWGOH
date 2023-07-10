import { v4 as uuid } from "uuid";
import { round, template } from "lodash";
import _ from "lodash";

import { randomNumber, unvue } from "utils";
import abilities from "types/abilities";
import { Ability, IUnit, Unit } from "types/unit";

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

type tDebuff =
  | "Ability Block"
  | "Accuracy Down"
  | "Anguish" //todo
  | "Blind"
  | "Breach" //
  | "Buff Immunity"
  | "Burning" //
  | "Buzz Droids" //
  | "Captive" //
  | "Cooldown Increase"
  | "Concussion Mine" //
  | "Confuse" //
  | "Corrupted Battle Meditation" //
  | "Critical Chance Down"
  | "Critical Damage Down"
  | "Damage Over Time" //
  | "Daze" //
  | "Deathmark" //
  | "Deceived" //
  | "Defense Down" //
  | "Defense Penetration Down"
  | "Demoralized" //
  | "Disarm" //
  | "Doubt" //
  | "Evasion Down"
  | "Expose" //
  | "Fear" //
  | "Ferocity" //
  | "Force Influence" //
  | "Fracture" //
  | "Healing Immunity" //
  | "Health Down" //add check when its applied so current health doesnt exceed it
  | "Health Steal Down"
  | "Hunted" //
  | "Inevitable Failure" //
  | "Marked"
  | "Offense Down"
  | "Overconfident" //
  | "Pain" //
  | "Plague" //
  | "Potency Down"
  | "Protection Disruption" //
  | "Provoked" //
  | "Purge" //
  | "Shatterpoint" //
  | "Shield Disruption" //
  | "Shock" //
  | "Speed Down"
  | "Stagger" //
  | "Stranded" //
  | "Stun"
  | "Target Lock" //
  | "Tenacity Down"
  | "TM Decrease"
  | "Torture" //
  | "Useful Pawn" //
  | "Vulnerable"
  | "all"; //
type tBuff =
  | "Accuracy Up"
  | "Advantage"
  | "Call to Action"
  | "Critical Chance Up"
  | "Critical Damage Up"
  | "Critical Hit Immunity"
  | "Cooldown Decrease"
  | "Defense Penetration Up"
  | "Defense Up"
  | "Evasion Up"
  | "Health Up"
  | "Health Steal Up"
  | "Potency Up"
  | "Offense Up"
  | "Speed Up"
  | "Taunt"
  | "Tenacity Up"
  | "Translation"
  | "TM Increase"
  | "all";
type tStatusEffect = "Guard";

/** A generic status effect, usually a buff or debuff */
export interface iStatusEffect {
  /** The name of the effect */
  name: tBuff | tDebuff | tStatusEffect;
  /** How many turns the effect will last */
  duration: number;
  /** Determines if the effect is new so that it will not be removed at the end of the turn */
  isNew?: boolean;
  /** The likelihood of the effect being applied */
  chance?: number;
  /** Determines if the effect cannot be resisted */
  cantResist?: boolean;
  /** Determines if the effect cannot be prevented (such as with Buff Immunity) */
  cantPrevent?: boolean;
  /** Determines if the effect cannot be dispelled */
  cantDispel?: boolean;
  // cantMiss?: boolean;
  /** Determines if the effect is unique */
  unique?: boolean;
  /** Triggers that will occur at a certain time */
  triggers?: iTrigger[];
  /** Unique identifier */
  id: string;
  /** The original source of the effect */
  sourceAbility?: iAbility | null;
  /** Determines if more than one of the effect can be applied to a target */
  isStackable?: boolean;
}

interface iBuff extends iStatusEffect {
  name: tBuff;
}

interface iDebuff extends iStatusEffect {
  name: tDebuff;
}

// export interface iEffects {
//   ignoreTaunt: boolean;
// }

/** A generic ability container that all abilities share */
interface iGeneralAbility {
  /** A unique identifier */
  id: string;
  /** The name of the ability */
  name: string;
  /** Anything that will happen based on various states or actions being done (such as taking damage) */
  triggers?: iTrigger[];
  /** Sort the ability before or after other abilities */
  sort?: number;
  /** This ability is targeting various other units and causing effects on them (such as buffs or damage) */
  actions?: iAction[];
}
export interface iBasicAbility extends iGeneralAbility {}

/** Special Abilities */
export interface iSpecialAbility extends iGeneralAbility {
  /** How many turns are left before this ability can be used */
  turnsRemaining: number;
  /** Maximum amount that determines how many turns must pass before the ability can be used again */
  cooldown: number;
}
export interface iAbility
  extends iBasicAbility,
    iSpecialAbility,
    iUniqueAbility {}

export interface iUniqueAbility extends iGeneralAbility {}

/** An effect that happens when something else happens */
interface iTrigger extends iAction {
  /**
   * Determines when the effect will occur
   *
   * ability: Unknown
   *
   * always: An effect that will always be present
   *
   * criticalHit: Triggers whenever a criticalHit is scored
   *
   * dealDamage: Triggers whenever damage is dealt
   *
   * death: Triggers whenever the target is defeated
   *
   * defeat: Triggers whenever the target defeats another target
   *
   * dodge: Triggers whenever the target dodges an effect/attack
   *
   * expires: Triggers whenever an effect expires
   *
   * inflictDebuff: Triggers whenever the target inflicts a debuff
   *
   * pregame: Triggers before the game begins
   *
   * receiveDamage: Triggers whenever the target receives damage
   *
   * resistDetrimentalEffect: Triggers whenever the target resists an effect
   *
   * revive: Triggers whenever the target is revived
   *
   * start: Triggers at the start of the game (after pregame)
   *
   * useAbility: Triggers whenever the target uses an ability
   */
  triggerType:
    | "always"
    | "criticalHit"
    | "dealDamage"
    | "death"
    | "defeat"
    | "dodge"
    | "expires"
    | "inflictDebuff"
    | "pregame"
    | "receiveDamage"
    | "resistDetrimentalEffect"
    | "revive"
    | "start"
    | "useAbility";
  /** Misc data to be used for various effects */
  data?: any;
  /** Unique identifier */
  id: string;
  /** The original source that caused the effect(s) to happen */
  srcAbility?: iAbility | null;
  /** Used to determine how often the trigger should happen */
  triggerData?: {
    /** The maximum number of times the effect can trigger in a given frequency */
    limit: number;
    /** A tracker on how many times the trigger has already happened */
    count: number;
    /** The timing of when a trigger should check if it has reached the limit */
    frequency: "match" | "turn";
  };
}

/** Determines who is being targeted and what is happening to them */
interface iAction {
  /** A list of filters, in order, which will be applied to determine who to target */
  targets?: iTargetData[];
  /** The actions themselves that will be applied to the target(s) in order */
  effects?: iEffect[];
  /** The actions will repeat until the conditions are no longer met */
  repeats?: {
    /** How many times the action has been done */
    count: number;
    /** The maximum number of times this action can be done */
    limit: number;
    /** The method in which to set the limit, if a variable amount */
    limitCounter?: "deadOpponents";
    /** When the count should be reset */
    reset: "turn";
  };
}

/** Various filters used to determine who should be targeted */
interface iTargetData {
  /** A list of specific characters that should be targeted */
  targetIds?: string[];
  /** A list of tags (such as Rebel or Light Side) used to determine who should be targetted. Can use '!' (not) or '&' (and) to combine with any other tags */
  tags?: string[];
  /** Determines if only the allies or opponents should be targeted */
  allies?: boolean;
  /** Determines if the weakest unit should be targetted */
  weakest?: boolean;
  /** Determines how many units of the given filters should be selected */
  targetCount?: number;
  /** Determines if the filtering should ignore any taunt effects */
  ignoreTaunt?: boolean;
  /** Determines if any units should be targeted with specific status effects */
  statusEffects?: tStatusEffect[];
  /** Determines if any units should be targeted with specific debuffs */
  debuffs?: tDebuff[];
  /** Determines if any units should be targeted with specific buffs */
  buffs?: tBuff[];
  /** Determines if the target is the leader or not */
  isLeader?: boolean;
}

/** Data used to determine certain things */
interface iCondition {
  /** Checks if a debuff is present */
  debuffs?: tDebuff[];
  /** Checks if a buff is present */
  buffs?: tBuff[];
  /** Checks if a specific stat meets a threshold */
  stats?: iStatsCheck;
  /** Inverts the logic so that all conditions are "Not" */
  inverted?: boolean;
  /** Checks if an effect is new */
  isNew?: boolean;
  /** Checks if a tag is present. Can use '!' (not) or '&' (and) to combine with any other tags */
  tags?: string[];
  /** Checks if turn meter is at a certain threshold */
  tm?: {
    /** The amount of turn meter to check. Use whole numbers (so 100% turn meter would be '100') */
    amount: number;
    /** Checks if the current turn meter should be greater than the amount (true) or less than the amount (false) */
    greaterThan: boolean;
  };
}
/** Various effects that will be applied */
interface iEffect {
  /** Who the effect should target */
  targets?: iTargetData[];
  /** The optional condition to check before applying any of the effects */
  condition?: iCondition;
  /** Determines if the effct cannot miss */
  cantMiss?: boolean;
  /** The debuffs being inflicted */
  debuffs?: iDebuff[];
  /** The buffs being granted */
  buffs?: iBuff[];
  /** The status effects (blue effects) being granted */
  statusEffects?: iStatusEffect[];
  /** The (de)buffs being removed */
  dispel?: {
    debuffs?: tDebuff[] | tDebuff;
    buffs?: tBuff[] | tBuff;
  };
  /** Manipulate the cooldown of an ability */
  cooldown?: {
    /** The ID of the ability being manipulated */
    id: string;
    /** The amount the ability is being manipulated. Positive number increases the cooldown, negative number increases the cooldown */
    amount: number;
    /** The target that the ability belongs to */
    target: iTargetData[];
  };
  /** Heal the target */
  heal?: {
    /** Health or Protection */
    healthType: "health" | "protection";
    /** Determines if the amound should be added to the current health, or scale from the unit's maxHealth/Protection */
    amountType?: "additive" | "multiplicative";
    /** The amount to heal. For percentages, keep the amount a decimal (e.g. 0.4 would be a 40% heal) */
    amount?: number;
    // scale?: number;
  };
  /** Call another unit to assist */
  assist?: iAssist;
  /** Change the target's stats */
  stats?: iStatsCheck;
  /** Deal damage to the target */
  damage?: {
    /** The modifier data used to determine how to calculate damage */
    modifier: {
      /** The amount this ability will scale with offense */
      value: number;
      /** The condition to check if a modifier to the status should be applied */
      condition?: iCondition;
      /** The stats to be applied to modify the damage */
      stats?: iStatsCheck;
    };
    /** The variance amount of damage (usually 5 or 10) */
    variance?: number;
    /** The type of damage being dealt */
    damageType: "physical" | "special" | "true";
  };
  /** Use an ability */
  ability?: {
    abilityTrigger?: string;
    /** The id of the ability that should be used */
    abilityToUse: string;
    /** The stats modification */
    stats?: iStatsCheck;
    /** Any additional effects to add to the use of the ability */
    effects?: iEffect[];
  };
  /** Set the target immune to certain effects */
  immune?: {
    /** The negative status effects or debuffs that cannot be given to the target */
    negativeStatusEffects?: (tDebuff | tStatusEffect)[];
    /** The positive status effects or buffs that cannot be given to the target */
    positiveStatusEffects?: (tBuff | tStatusEffect)[];
    /** The target cannot assist */
    assists?: boolean;
    /** The target cannot counter attack */
    counterAttack?: boolean;
  };
  /** Scale the above effects with various data */
  scalesBy?: {
    /** Scales the effect based on how many stacks of the listed buffs */
    buffs?: tBuff[];
    /** Scales the effect based on how many stacks of the listed debuffs */
    debuffs?: tDebuff[];
    /** Scales the effect based on a certain stat */
    stat?: {
      /** Determines if the physical or special attribute should be used */
      type?: "physical" | "special";
      /** The name of the stat to use as the scale */
      name: string;
      /** How much of the user's stat should be used as the scale (i.e. .3 would be 30% of the user's stat) */
      percent?: number;
      /** Who should be the target used by the scaling (i.e. opponent's health, user's health, etc.) */
      targets?: iTargetData[];
    };
    /** Scales the data based on how much damage was dealt */
    damage?: boolean;
    /** Who to target to check the scale */
    targets?: iTargetData[];
  };
  /** Triggers to add to the target that will occur at a later time */
  triggers?: iTrigger[];
  /** Misc. data used for checking various effects */
  revive?: {
    health: {
      amount: number;
      percent: boolean;
    };
    protection?: {
      amount: number;
      percent: boolean;
    };
  };
  data?: any;
}

interface iStatsCheck {
  /** The stat that will be modified
   *
   * counterChance: The chances of counter attacking (as a decimal)
   *
   * counterDamage: The amount of damage used to scale offense (as a decimal; e.g. 1.5 would be 150% damage)
   *
   * critAvoid: The chances to mitigate a critical hit (as a decimal)
   *
   * critChance: The chances of getting a critical hit (as a decimal)
   *
   * defense: Increases the amount of offense to mitigate
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
    | "counterChance"
    | "counterDamage"
    | "critAvoid"
    | "critChance"
    | "defense"
    | "dodge"
    | "health"
    | "maxHealth"
    | "maxProtection"
    | "offense"
    | "potency"
    | "protection"
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
interface iAssist {
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
  targets?: iTargetData[];
}

interface iHistory {
  resisted: number;
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
  private _history: iHistory = {
    resisted: 0,
  };
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

  //Stats
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
  public get health() {
    return this._baseStats.health;
  }
  public set health(val) {
    this._baseStats.health = Math.max(val, 0);
    if (this._baseStats.health > this._baseStats.maxHealth) {
      this._baseStats.health = this._baseStats.maxHealth;
    }
  }
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
  public get isDead() {
    return this.health <= 0;
  }
  public heal(
    healData: iEffect["heal"],
    ability?: iGeneralAbility | null,
    amount?: number
  ): string[] {
    const logs: string[] = [];

    if (healData && !this.isDead) {
      const { healthType, amountType, amount: healAmount } = healData;
      const maxAmount =
        healthType === "health" ? this.maxHealth : this.maxProtection;
      const finalAmount =
        amountType === "multiplicative"
          ? (healAmount ?? amount ?? 1) * maxAmount
          : healAmount ?? amount ?? 0;

      let diff = 0;
      if (this[healthType] < maxAmount) {
        diff = Math.min(maxAmount - this[healthType], finalAmount);
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
      this.getTempStat("healthSteel")
    );
  }
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
  public get counterChance() {
    if (this.hasDebuff("Stun")) {
      return 0;
    }

    const chance = this.getModifiedStats(
      [],
      0,
      this.getTempStat("counterDamage")
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
        this.findTargets(assistData?.targets ?? []).forEach((ally) => {
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

  public assist(
    modifier: iAssist["modifier"],
    targetCharacter: Character | null
  ): string[] {
    const logs: string[] = [];

    if (this.basicAbility) {
      if (!modifier || this.checkCondition(modifier.condition, this)) {
        logs.push(
          ...this.useAbility(
            this.basicAbility as iAbility,
            modifier.stats,
            targetCharacter,
            false
          )
        );
      }
    }
    return logs;
  }

  public get physical() {
    const self = this;
    return {
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
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
            { hasEffect: self.hasDebuff("Blind"), value: -999 },
          ],
          self._baseStats.physical.accuracy,
          self.getTempStat("accuracy")
        );
      },
      set accuracy(val) {
        self._baseStats.physical.accuracy = val;
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
          self._baseStats.physical.dodge,
          self.getTempStat("dodge")
        );
      },
      set dodge(val) {
        self._baseStats.physical.dodge = val;
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
          trigger.effects?.forEach(({ stats, condition }) => {
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
        return statsMapping;
      },
      tempStatMapping
    );
    return finalMapping[statName] ?? [];
  }
  private get immunity(): Record<string, boolean> {
    return this._triggers.reduce(
      (immuneMapping, trigger) => {
        trigger.effects?.forEach((effect) => {
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
        if (trigger.triggerType === "always") {
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
            } removed`
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
    scalar: number = 1
  ): string[] {
    const logs: string[] = [];

    debuffs.forEach((debuff) => {
      if (!targetCharacter.hasDebuff(debuff.name) || debuff.isStackable) {
        const resistedChance = Math.max(
          targetCharacter.tenacity - this.potency,
          0.15
        );
        if (
          !chanceOfEvent(resistedChance * 100) ||
          debuff.cantResist ||
          debuff.name === "Tenacity Down" ||
          this.isSelf(targetCharacter)
        ) {
          if (targetCharacter.isImmune(debuff)) {
            logs.push(
              `${format.characterName(
                targetCharacter.name,
                targetCharacter.owner
              )} is immune to ${debuff.name}`
            );
          } else {
            if (chanceOfEvent(debuff.chance ?? 0)) {
              return;
            }

            if (debuff.name === "TM Decrease") {
              logs.push(
                targetCharacter.changeTurnMeter(debuff.duration * scalar)
              );
            } else {
              if (
                (!targetCharacter.hasDebuff(debuff) || debuff.isStackable) &&
                !targetCharacter.isImmune(debuff)
              ) {
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
                  ])} for ${amount} turn${amount > 1 ? "s" : ""}`
                );
                logs.push(
                  ...this.executePassiveTriggers([
                    {
                      triggerType: "inflictDebuff",
                      data: { debuff: debuff.name },
                      id: uuid(),
                    },
                  ])
                );
              }
            }
          }
        } else {
          logs.push(
            `${format.characterName(
              targetCharacter.name,
              targetCharacter.owner
            )} resisted ${format.debuff([debuff.name])}`
          );
          logs.push(
            ...targetCharacter.executePassiveTriggers([
              {
                triggerType: "resistDetrimentalEffect",
                data: { debuff: debuff.name },
                id: uuid(),
              },
            ])
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
            } removed`
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
  public findTargets(
    targetList: iTargetData[],
    target?: Character
    // ignore?: {
    //   paralysisDebuff?: boolean;
    //   daze?: boolean;
    //   noAssist?: boolean;
    //   dead?: boolean;
    // }
  ): Character[] {
    const validTargets: Character[] = [
      ...this._teammates,
      ...this._opponents,
    ].filter((char: Character) => {
      let shouldExclude = false;

      // if (char.isDead && !ignore?.dead) {
      //   shouldExclude = true;
      // }
      // if (ignore?.paralysisDebuff) {
      //   shouldExclude = char.hasDebuff("Stun") || shouldExclude;
      // }
      // if (ignore?.daze) {
      //   shouldExclude = char.hasDebuff("Daze") || shouldExclude;
      // }
      return !shouldExclude;
    });

    return targetList.reduce((list: Character[], targetFilter: iTargetData) => {
      validTargets.forEach((char) => {
        if (targetFilter.allies) {
          if (char.owner === this.owner) {
            list.push(char);
          }
        } else if (targetFilter.allies === false) {
          if (char.owner !== this.owner) {
            const forcedEffects = ["Taunt", "Marked", "Deathmarked"];
            const anyForced = validTargets.some((c) => {
              return [...c.buffs, ...c.debuffs].some((b) =>
                forcedEffects.includes(b.name)
              );
            });
            if (anyForced) {
              const charIsForced = [...char.buffs, ...char.debuffs].some((b) =>
                forcedEffects.includes(b.name)
              );
              if (charIsForced) {
                list.push(char);
              }
            } else {
              list.push(char);
            }
          }
        } else if (targetFilter.buffs) {
          if (char.hasBuff(targetFilter.buffs)) {
            list.push(char);
          }
        } else if (targetFilter.debuffs) {
          if (char.hasDebuff(targetFilter.debuffs)) {
            list.push(char);
          }
        } else if (targetFilter.isLeader) {
          if (char.isLeader) {
            list.push(char);
          }
        } else if (targetFilter.statusEffects) {
          if (char.hasStatusEffect(targetFilter.statusEffects)) {
            list.push(char);
          }
        } else if (targetFilter.tags) {
          if (anyTagsMatch(char, targetFilter.tags, this.id)) {
            list.push(char);
          }
        } else if (targetFilter.targetIds) {
          let shouldInclude = false;
          if (target instanceof Character) {
            shouldInclude =
              targetFilter.targetIds.includes("target") && char.isSelf(target);
          }
          shouldInclude =
            anyTagsMatch(char, targetFilter.targetIds, this.id) ||
            shouldInclude;
          if (shouldInclude) {
            list.push(char);
          }
        } else if (targetFilter.targetCount) {
          const tempList: Character[] = [];
          do {
            const rand: number = randomNumber(0, list.length - 1);
            const el = list[rand];
            const exists = tempList.some((x) => x.id === el.id);
            if (!exists) {
              tempList.push(list[rand]);
            }
          } while (
            tempList.length < targetFilter.targetCount &&
            list.length >= targetFilter.targetCount
          );
          return tempList;
        } else if (targetFilter.weakest) {
          const weakest = list.reduce((prev, cur) => {
            const totalStatsPrev = prev.health + prev.protection;
            const totalStatsCur = cur.health + cur.protection;
            return totalStatsPrev < totalStatsCur ? prev : cur;
          }, char);
          return [weakest];
        }
        return targetList;
      });
      return list;
    }, []);
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
      };
    }
  }
  public dealDamage(
    targetCharacter: Character,
    effect: iEffect,
    srcAbility: iAbility | null,
    stats?: iStatsCheck | null
  ) {
    const logs: string[] = [];

    const { isCrit, damageTotal } = this.calculateDamage(
      targetCharacter,
      effect.damage,
      stats ?? effect.stats
    );

    logs.push(...this.dealTrueDamage(targetCharacter, damageTotal, isCrit));

    return { logs, damageDealt: damageTotal, isCrit };
  }
  public dealTrueDamage(
    targetCharacter: Character,
    damageTotal: number,
    isCrit: boolean = false,
    srcAbility: iAbility | null = null
  ): string[] {
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
      ...this.heal(
        {
          amountType: "additive",
          amount: damageTotal * this.healthSteal,
          healthType: "health",
        },
        {
          name: "Health Steal",
          id: "healthSteal",
        }
      )
    );

    if (isCrit) {
      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "criticalHit",
            data: { damageDealt: damageTotal, isCrit, target: targetCharacter },
            id: uuid(),
            srcAbility,
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
    return logs;
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
        chanceOfEvent(this.counterChance) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        logs.push(
          `${format.characterName(this.name, this.owner)} counter attacked`
        );
        logs.push(
          ...this.useAbility(
            this.basicAbility as iAbility,
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
  public inflictEffects(
    effect: iEffect,
    targetCharacter: Character,
    ability: iAbility | null
  ): string[] {
    const logs: string[] = [];
    actions?.forEach((action) => {
      if (this.checkCondition(action.condition, targetCharacter)) {
        logs.push(
          ...this.addEffects(
            targetCharacter,
            action,
            this.targetSelf(target),
            ability
          )
        );
      }
    });
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
      const hasBuffs = buffs.every((status) => {
        const match = this._buffs.find((x) => x.name === status);
        if (match) {
          return isNew === false ? !match.isNew : true;
        }
        return false;
      });
      results = (hasBuffs && !inverted) || (!hasBuffs && inverted) || results;
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
        if (stats.statToModify === "health" && stats.type === "percent") {
          const percent = num / targetCharacter.maxHealth;
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < percent
              : stats.amount > percent;
        } else if (
          stats.statToModify === "protection" &&
          stats.type === "percent"
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
  private addEffects(
    targetCharacter: Character,
    effect: iEffect,
    isNew: boolean,
    ability: iAbility | null,
    data?: any
  ): string[] {
    const logs: string[] = [];
    if (effect.dispel) {
      logs.push(
        ...targetCharacter.removeBuff(effect.dispel?.buffs ?? null, this)
      );

      logs.push(
        ...targetCharacter.removeDebuff(effect.dispel?.debuffs ?? null, this)
      );
    }

    if (effect.cooldown) {
      if (effect.cooldown.target === "Self") {
        logs.push(this.changeCooldown(effect, ability));
      } else {
        logs.push(targetCharacter.changeCooldown(effect, ability));
      }
    }

    if (effect.heal) {
      logs.push(
        ...targetCharacter.heal(effect.heal, ability, data?.healAmount)
      );
    }

    if (effect.stats) {
      this._tempStats.push(effect.stats);
    }

    if (effect.assist) {
      logs.push(...this.callAllyToAssist(effect.assist, targetCharacter));
    }

    if (effect.buffs) {
      logs.push(
        ...targetCharacter.addBuff(
          effect.buffs ?? [],
          isNew,
          this.getScalar(effect.scale),
          ability
        )
      );
    }

    if (effect.debuffs) {
      //it looks backwards from the other logic but its not
      logs.push(...this.inflictDebuff(effect.debuffs ?? [], targetCharacter));
    }

    if (effect.ability) {
      const { abilityTrigger, abilityToUse } = effect.ability;
      if (abilityTrigger === ability?.id || !abilityTrigger) {
        if (abilityToUse) {
          const abilityMatch = this.chooseAbility(abilityToUse);
          if (abilityMatch) {
            const copyAbility: iAbility = unvue(abilityMatch);
            if (effect.ability?.modifiers) {
              copyAbility.targets = copyAbility.targets ?? [];
              effect.ability?.modifiers?.forEach((mod) => {
                copyAbility.targets = copyAbility.targets?.reduce(
                  (modifiedTargets: iTarget[], target) => {
                    modifiedTargets.push({ ...target, ...mod });
                    return modifiedTargets;
                  },
                  []
                );
              });
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

    if (effect.damage) {
      const { scale } = effect.damage;
      if (scale) {
        this.findTargets(scale.target, targetCharacter).forEach((target) => {
          const amount = modifyStat(
            target[scale.stats.statToModify],
            scale.stats.statToModify,
            scale?.stats
          );
          logs.push(
            `${format.characterName(
              target.name,
              target.owner
            )} was dealt bonus damage from ${format.ability(ability?.name)}`
          );
          logs.push(...this.dealTrueDamage(target, amount));
        });
      }
    }

    return logs;
  }
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
          const finalAmount = amount === 0 ? ability.turnsRemaining : amount;
          ability.turnsRemaining += finalAmount;
          return `${format.characterName(
            this.name,
            this.owner
          )}'s ${format.ability(ability.name)}'s cooldown was ${
            finalAmount > 0 ? "increased" : "decreased"
          } by ${Math.abs(finalAmount)} ${format.abilitySource(srcAbility)}`;
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
  public checkEvade(
    { cantMiss, damageType }: iTarget,
    opponent: Character,
    stats?: iStatsCheck
  ) {
    if (cantMiss || this.isSelf(opponent)) {
      return false;
    } else {
      const { dodge } = this.getCombatStats(damageType);
      const { accuracy } = opponent.getCombatStats(damageType);

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
  public takeAction() {
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

    logs.push(...this.endOfTurn(ability));
    return logs.filter((l) => !!l);
  }
  public useAbility(
    ability: iAbility,
    stats?: iStatsCheck,
    targetCharacter?: Character | null,
    canBeCountered?: boolean
  ): string[] {
    const logs: string[] = [];
    logs.push(format.useAbility(this.name, ability.name, this.owner));

    ability.targets?.forEach((targetData) => {
      const targets = targetCharacter
        ? [targetCharacter]
        : this.findTargets(targetData);

      targets.forEach((char) => {
        const attackMissed = char.checkEvade(targetData, this, stats);
        if (attackMissed) {
          logs.push(`${format.characterName(char.name, char.owner)} evaded`);
          logs.push(
            ...char.executePassiveTriggers([
              {
                triggerType: "dodge",
                target: {},
                id: uuid(),
              },
            ])
          );
          return;
        }
        logs.push(
          ...this.processTargets(
            targetData,
            char,
            ability,
            canBeCountered,
            stats
          )
        );
        logs.push(
          ...this.executePassiveTriggers([
            {
              triggerType: "ability",
              target: {},
              id: uuid(),
              data: { target: char },
              srcAbility: ability,
            },
          ])
        );
      });

      const primaryCharIndex = randomNumber(0, targets.length - 1);

      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "useAbility",
            id: uuid(),
            target: {},
            data: { ability, target: targets[primaryCharIndex] },
          },
        ])
      );

      if (targetData.damage) {
        targets.forEach((char) => {
          logs.push(...char.counterAttack(this, canBeCountered));
        });
      }
    });

    this.resetTriggers();

    return logs;
  }
  private processTargets(
    targetData: iTarget,
    targetCharacter: Character,
    ability: iAbility | null,
    isNew?: boolean,
    stats?: iStatsCheck,
    canBeCountered?: boolean
  ): string[] {
    const logs: string[] = [];
    const myTriggers: iTrigger[] = [];
    const opponentTriggers: iTrigger[] = [];
    const { damage, actions, debuffs, buffs, target, statusEffects, triggers } =
      targetData;

    if (targetData?.triggerData?.count) {
      if (targetData.triggerData.count > 0) {
        targetData.triggerData.count--;
      } else {
        return logs;
      }
    }

    if (damage && ability) {
      const _stats = this.checkCondition(
        targetData.modifyDamage?.condition,
        targetCharacter
      )
        ? targetData.modifyDamage?.stats
        : null;
      const {
        logs: damageLogs,
        damageDealt,
        isCrit,
      } = this.dealDamage(
        targetCharacter,
        targetData,
        ability,
        stats ?? _stats
      );
      logs.push(...damageLogs);
      opponentTriggers.push({
        triggerType: "receiveDamage",
        target: {},
        data: { damageDealt, isCrit, ability },
        id: uuid(),
      });
      myTriggers.push({
        triggerType: "dealDamage",
        target: {},
        data: { damageDealt, isCrit, target: targetCharacter },
        id: uuid(),
        // srcAbility: ability,
      });

      if (targetCharacter.health <= 0) {
        opponentTriggers.push({
          triggerType: "death",
          target: {},
          id: uuid(),
          srcAbility: ability,
        });
      }
    }

    if (actions && !targetCharacter.isDead) {
      logs.push(...this.inflictEffects(targetData, targetCharacter, ability));
    }
    if (debuffs && !targetCharacter.isDead) {
      logs.push(...this.inflictDebuff(debuffs, targetCharacter));
    }
    if (buffs && !targetCharacter.isDead) {
      logs.push(
        ...targetCharacter.addBuff(
          buffs,
          isNew === false ? false : this.targetSelf(target),
          targetCharacter.getScalar(target.scale),
          ability
        )
      );
    }
    if (statusEffects) {
      logs.push(...targetCharacter.addStatusEffect(statusEffects, ability));
    }
    if (triggers && ability) {
      triggers.forEach((t) => targetCharacter.addTrigger(t, ability));
    }

    logs.push(...targetCharacter.executePassiveTriggers(opponentTriggers));
    logs.push(...this.executeAbilityTriggers(ability, myTriggers));
    logs.push(...this.executePassiveTriggers(myTriggers));

    return logs;
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
  private getScalar(type: string | number = ""): number {
    if (type === "Resisted") {
      return this._history.resisted;
    } else if (type.toString().includes(" critChance")) {
      const split = type.toString().split(" ");
      if (split[0] === "physical" || split[0] === "special") {
        return this.getCombatStats(split[0])[split[1]];
      }
    } else if (typeof type === "string") {
      return 1;
    }
    return Number(type);
  }
  private targetSelf(target: iTrigger["target"]): boolean {
    const allies = target.allies ?? false;
    const tagsMatch = anyTagsMatch(this, target.tags ?? [], this.id);

    return allies || tagsMatch;
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
      this._triggers.push({ ...unvue(trigger), ability: unvue(ability) });
    }
  }
  public removeTrigger(trigger: iTrigger): string[] {
    const logs: string[] = [];
    logs.push(...this.removeEvents([trigger]));
    logs.push(...this.removeEvents(trigger?.events));

    const index = this._triggers.findIndex((t) => t.id === trigger.id);
    if (index > -1) {
      this._triggers.splice(index, 1);
    }
    return logs;
  }
  public removeEvents(events?: iTarget[]): string[] {
    const logs: string[] = [];
    events?.forEach((event) => {
      [...this._teammates, ...this._opponents].forEach((target) => {
        event.buffs?.forEach((buff) => {
          logs.push(...target.removeBuff(buff));
        });
        event.debuffs?.forEach((debuff) => {
          logs.push(...target.removeDebuff(debuff));
        });
        event.statusEffects?.forEach((s) => {
          logs.push(...target.removeStatusEffect(s));
        });
        event.triggers?.forEach((trigger) => {
          logs.push(...target.removeTrigger(trigger));
        });
      });
    });
    return logs;
  }
  public executePassiveTriggers(types: iTrigger[], data?: any): string[] {
    const logs: string[] = [];
    this._triggers.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (trigger?.triggerData?.count !== undefined) {
            if (trigger.triggerData.count >= 1) {
              trigger.triggerData.count--;
            } else {
              return;
            }
          }
          //order matters
          logs.push(...this.executeTrigger({ data, ...trigger, ...type }));
        }
      });
    });
    return logs;
  }
  public executeAbilityTriggers(ability: iAbility | null, types: iTrigger[]) {
    const logs: string[] = [];
    ability?.triggers?.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (trigger?.triggerData?.count) {
            if (trigger.triggerData.count >= 1) {
              trigger.triggerData.count--;
            } else {
              return;
            }
          }

          logs.push(
            ...this.executeTrigger({
              ...trigger,
              ...type,
              srcAbility: ability,
            })
          );
        }
      });
    });
    return logs;
  }
  public executeTrigger({
    triggerType,
    events,
    actions,
    ability,
    data,
    srcAbility,
  }: iTrigger): string[] {
    const logs: string[] = [];
    events?.forEach((targetData) => {
      const targets = this.findTargets(targetData, data?.target);
      targets.forEach((char) => {
        //if this needs to be switched, then the logic is broken
        logs.push(
          ...this.processTargets(
            targetData,
            char,
            srcAbility ?? ability ?? null
          )
        );
      });
    });

    actions?.forEach((action) => {
      if (triggerType === "dealDamage" && action.heal) {
        data.healAmount = data?.damageDealt * (action?.scale ?? 1);
      }

      logs.push(
        ...this.addEffects(
          data?.target ?? this,
          action,
          true,
          data.ability ?? ability ?? null,
          data
        )
      );
    });
    return logs;
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
      }

      t.events?.forEach((e) => {
        if (e.triggerData) {
          if (e.triggerData.frequency === "turn") {
            e.triggerData.count = e.triggerData.limit;
          }
        }
      });
    });
    this._history = {
      resisted: 0,
    };
  }
  public endOfTurn(ability: iAbility | null): string[] {
    const logs: string[] = [];
    const { newDebuffList, expireDebuffs, debuffsRemoved } =
      this._debuffs.reduce(
        (
          acc: {
            newDebuffList: iDebuff[];
            expireDebuffs: iDebuff[];
            debuffsRemoved: string[];
          },
          debuff: iDebuff
        ) => {
          if (debuff.isNew) {
            debuff.isNew = false;
          } else {
            debuff.duration--;
          }

          if (debuff.duration > 0) {
            acc.newDebuffList.push(debuff);
          } else {
            if (debuff.expires) {
              acc.expireDebuffs.push(debuff);
            }

            acc.debuffsRemoved.push(debuff.name);
          }
          return acc;
        },
        { newDebuffList: [], expireDebuffs: [], debuffsRemoved: [] }
      );

    const { newBuffList, expiredBuffs, buffsRemoved } = this._buffs.reduce(
      (
        acc: {
          newBuffList: iBuff[];
          expiredBuffs: iBuff[];
          buffsRemoved: string[];
        },
        buff: iBuff
      ) => {
        if (buff.isNew) {
          buff.isNew = false;
        } else {
          buff.duration--;
        }

        if (buff.duration > 0) {
          acc.newBuffList.push(buff);
        } else {
          if (buff.expires) {
            acc.expiredBuffs.push(buff);
          }

          acc.buffsRemoved.push(buff.name);
        }
        return acc;
      },
      { newBuffList: [], expiredBuffs: [], buffsRemoved: [] }
    );

    if (debuffsRemoved.length > 0) {
      logs.push(`
        ${format.debuff(debuffsRemoved)}
        ${
          debuffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }
    if (buffsRemoved.length > 0) {
      logs.push(`${format.buff(buffsRemoved)}
        ${
          buffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }

    this._debuffs = newDebuffList;
    this._buffs = newBuffList;

    const expiredList = [...expireDebuffs, ...expiredBuffs];
    expiredList.forEach((x) => {
      if (x.expires) {
        logs.push(
          ...this.processTargets(
            x.expires,
            this,
            x.sourceAbility ?? null,
            false
          )
        );
      }
    });

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
        this.findTargets(trigger).forEach((target) => {
          target.addTrigger(trigger, ability as iAbility);
        });
      });
    });

    if (this.isLeader && this._leaderAbility) {
      this._leaderAbility.triggers?.forEach((trigger) => {
        this.findTargets(trigger).forEach((target) => {
          target.addTrigger(trigger, this._leaderAbility as iAbility);
        });
      });
    }

    this._triggers.forEach((trigger) => {
      if (trigger?.triggerData?.count !== undefined) {
        trigger.triggerData.count = trigger.triggerData.limit;
      }
    });
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
    if (stats.type === "percent") {
      return baseStat * stats.amount;
    } else if (stats.type === "flat") {
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
    return `<span class="damage">${amount}</span> damage was dealt to ${this.characterName(
      targetName,
      owner
    )}${this.crit(isCrit)} (${this.healthStats(protection, health)})`;
  },
  crit(isCrit: boolean) {
    return isCrit ? " <span class='crit'>(Crit)</span>" : "";
  },
  useAbility(charName: string, abilityName: string, owner: string) {
    return `${this.characterName(charName, owner)} used ${this.ability(
      abilityName
    )}`;
  },
  ability(name) {
    return `<span class="ability">${name}</span>`;
  },
  abilitySource(ability: iGeneralAbility | null) {
    return ability ? ` (src: ${format.ability(ability.name)})` : "";
  },
};

function chanceOfEvent(percentChance: number): boolean {
  if (percentChance < 1) {
    percentChance *= 100;
  }
  return percentChance >= randomNumber(1, 100);
}
