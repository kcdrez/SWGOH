import { round, cloneDeep } from "lodash";
import { v4 as uuid } from "uuid";

import { chanceOfEvent, randomNumber } from "./utils";

import { iHeal, iStatsCheck, Stats } from "./stats";
import { StatusEffect } from "./statusEffects";
import { Ability, ActiveAbility, PassiveAbility } from "./abilities";
import { abilitiesList } from "../characterScripts/abilitiesList";
import { Log, tLogData } from "./log";
import { Engine } from "../gameEngine";

/**
 * A type to determine what events are supported
 * @type tEventType
 */
type tEventType =
  | "beforeUseAbility"
  | "buffed"
  | "dealDamage"
  | "death"
  | "dispel"
  | "endOfTurn"
  | "gainStatusEffect"
  | "inflicted"
  | "loseHealth"
  | "loseProtection"
  | "matchSetup"
  | "matchStart"
  | "receiveDamage"
  | "revive"
  | "resisted"
  | "startOfTurn"
  | "useAbility";

export interface iUnit {
  id: string;
  name: string;
  aliases?: string[];
  categories: string[];
  ability_classes: string[];
  role: "Attacker" | "Tank" | "Support" | "Healer";
  alignment: "Light Side" | "Dark Side" | "Neutral";
  primaryStat: "str" | "agi" | "tac";
  isLeader?: boolean;

  tier?: number;
  stats: Record<string, number>;
  ability_data: { id: string; name: string }[];
  relic_tier?: number;
  has_ultimate?: boolean;
  is_ship?: boolean;
  zeta_abilities: string[];
  omicron_abilities: string[];
}

/**
 * A Character, otherwise known as unit or toon, that can have abilities and affect the flow of the game
 * @class Character
 */
export class Character {
  public stats: Stats;
  public statusEffect: StatusEffect;
  public id: string;
  public name: string;
  private _tm: number = 0;
  public relicLevel: number = 0;
  private _basicAbility: ActiveAbility | null = null;
  private _specialAbilities: ActiveAbility[] = [];
  protected _hiddenAbilities: ActiveAbility[] = [];
  private _uniqueAbilities: PassiveAbility[] = [];
  private _leaderAbility: PassiveAbility | null = null;
  public owner: string;
  private _alignment: "Light Side" | "Dark Side" | "Neutral";
  private _categories: string[];
  public teammates: Character[] = [];
  public opponents: Character[] = [];
  public isLeader: boolean = false;
  public events: {
    eventType: tEventType;
    characterSourceId?: string;
    callback: Function;
    id?: string;
  }[] = [];
  public keywords: string[] = [];
  public hasBonusTurn: boolean = false;
  public gameEngine: Engine;

  constructor(
    data: iUnit,
    owner: string,
    isLeader: boolean,
    gameEngine: Engine
  ) {
    this.gameEngine = gameEngine;
    this.stats = new Stats(data, this);
    this.statusEffect = new StatusEffect(this);

    this.name = data.name;
    this.id = data.id;
    this.owner = owner;
    this._alignment = data.alignment;
    this._categories = data.categories;
    this.isLeader = isLeader ?? false;
    this.relicLevel = data.relic_tier ?? 0;

    const abilityList = abilitiesList[this.id];
    data.ability_data.forEach((x) => {
      if (x.id.includes("basic")) {
        const abilityClass = abilityList.basicAbility.get(x.id);
        if (abilityClass) {
          this._basicAbility = new abilityClass(this);
        }
      } else if (x.id.includes("special")) {
        const abilityClass = abilityList.specialAbilities.get(x.id);
        if (abilityClass) {
          this._specialAbilities.push(new abilityClass(this));
        }
      } else if (x.id.includes("unique")) {
        const abilityClass = abilityList.uniqueAbilities.get(x.id);
        if (abilityClass) {
          this._uniqueAbilities.push(new abilityClass(this));
        }
      } else if (x.id.includes("leader")) {
        const abilityClass = abilityList.leaderAbility.get(x.id);
        if (abilityClass) {
          this._leaderAbility = new abilityClass(this);
        }
      }
    });
  }

  /** A unique identifier based on the character id and owner */
  public get uniqueId() {
    return this.id + this.owner;
  }

  /** Checks if the provided character is the same as this character */
  public isSelf(char?: Character) {
    return this.id === char?.id && this.owner === char?.owner;
  }

  /** The character's basic ability */
  public get basicAbility() {
    return this._basicAbility;
  }

  /** The character's special abilities */
  public get specialAbilities() {
    return this._specialAbilities;
  }

  /** The character's hidden abilities */
  public get hiddenAbilities() {
    return this._hiddenAbilities;
  }

  /** A list of abilities including the basic ability and specials */
  public get activeAbilities() {
    const arr: ActiveAbility[] = [];
    if (this._basicAbility) {
      arr.push(this._basicAbility);
    }
    arr.push(...this._specialAbilities);
    return arr;
  }

  /** A list of unique abilities */
  public get uniqueAbilities() {
    return this._uniqueAbilities;
  }

  /** Adds a new granted ability */
  public addGrantedAbility(ability: ActiveAbility) {
    this._specialAbilities.push(ability);
  }

  /** A map of different effects that may exist on the character */
  public get effects() {
    const self = this;
    return {
      get ignoreTaunt() {
        return (
          self.statusEffect.hasBuff("Call to Action") ||
          self.statusEffect.hasBuff("Jedi Legacy")
        );
      },
    };
  }

  /* How much turn meter the character currently has */
  public get turnMeter() {
    return this._tm;
  }

  /* The ratio of turn meter. Used to compare to other characters' turn meter ratio to determine who goes next */
  public get turnMeterRatio() {
    return (100 - this._tm) / this.stats.speed;
  }

  /** Manipulates the unit's turn meter by a certain amount
   * @param amount - The amount the turn meter will be changed. Positive number will add turn meter, negative number will remove turn meter
   * @param srcAbility - The ability source that is causing the turn meter to change
   * @param srcCharacter - The character that is causing the turn meter to change
   */
  public changeTurnMeter(
    amount: number,
    srcAbility?: Ability,
    srcCharacter?: Character
  ) {
    if (amount === 0 || this.isDead) {
      return;
    }
    let diff = 0;
    if (this._tm >= 100 && amount < 0) {
      const resistedChance = Math.max(
        this.stats.tenacity - (srcCharacter?.stats.potency ?? 0),
        0.15
      );
      if (chanceOfEvent(resistedChance)) {
        this.gameEngine.addLogs({
          characterLogData: this.getLogs(),
          statusEffects: {
            resisted: true,
            list: [
              {
                name: "TM Decrease",
                duration: amount,
                sourceAbility: srcAbility?.sanitize(),
              },
            ],
            type: "debuff",
          },
        });
        this.dispatchEvent("resisted", { effect: "TM Decrease" });
        return;
      }
      diff = Math.abs(amount);
      this._tm = 100 + amount; //note this will remove tm since amount is a negative number
    } else {
      diff = amount < 0 ? Math.min(Math.abs(amount), this._tm) : amount;
      this._tm += amount;
    }
    if (this._tm < 0) {
      this._tm = 0;
    }
    if (srcAbility) {
      this.gameEngine.addLogs({
        characterLogData: this.getLogs(),
        effects: {
          turnMeter: round(amount > 0 ? diff : 0 - diff, 2),
        },
        ability: {
          source: srcAbility.sanitize(),
        },
      });
    }
  }
  /**
   * A utility function to determine who's turn meter is higher: This character or the provided opponent
   * @param opponent - The opponent to compare turn meter to
   * @returns An object containing the character who's turm meter is higher (either this character or the provided opponent) and the amount of turn meter that is gained
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
        if (opponent.stats.speed > this.stats.speed) {
          results.character = opponent;
        } else if (this.stats.speed === opponent.stats.speed) {
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

  /**
   * Resets all abilities, stats, and other effects
   * @param teammates - A list of characters that are this character's teammates
   * @param opponents - A list of characters that are this character's opponents
   */
  public reset(teammates: Character[], opponents: Character[]) {
    this.teammates = teammates;
    this.opponents = opponents;
    this._uniqueAbilities.forEach((a) => a.deactivate());
    this._leaderAbility?.deactivate();
    this.stats.reset();
    this.statusEffect.reset();
  }

  /**
   * An initializer function that resets various properties and applies passive abilities
   */
  public initialize() {
    this.stats.initialize();
    this._specialAbilities.forEach((ability) => {
      ability.initialize();
    });
    this._uniqueAbilities.forEach((ability) => {
      ability.activate();
    });
    if (this.isLeader) {
      this._leaderAbility?.activate();
    }
    this.statusEffect.initialize();

    this._tm = 0;
  }

  /** Is the character's health at 0 or less */
  public get isDead() {
    return this.stats.health <= 0;
  }

  /** Checks if the character is dead and if so removes any related effects
   * @param targetCharacter - Checks if the character is dead and removes any effects
   */
  public checkDeath(targetCharacter: Character) {
    if (targetCharacter.isDead) {
      this.gameEngine.addLogs({
        characterLogData: this.getLogs(),
        targetLogData: targetCharacter.getLogs(),
        effects: { defeated: true },
      });
      targetCharacter._uniqueAbilities.forEach((a) => a.deactivate());
      targetCharacter.dispatchEvent("death");
    }
  }
  /** Does the character have any effect that is forcing them to be targeted */
  public get hasTauntEffect(): boolean {
    return (
      this.statusEffect.hasBuff("Taunt") ||
      this.statusEffect.hasDebuff(["Marked", "Deathmark"])
    );
  }

  /** The character takes an action and uses an ability if possible */
  public takeAction() {
    this.startOfTurn();
    this._tm = 0;
    let ability: ActiveAbility | null = null;
    if (this.statusEffect.hasDebuff("Stun")) {
      this.gameEngine.addLogs({
        characterLogData: this.getLogs(),
        effects: { stunned: true },
      });
    } else {
      ability = this.chooseAbility();
      ability?.execute();
    }

    this.endOfTurn(ability);
  }

  /** Triggers any effects at the start of the turn */
  public startOfTurn() {
    this.statusEffect.debuffs.forEach((debuff) => {
      debuff.isNew = false;
    });
    this.statusEffect.buffs.forEach((debuff) => {
      debuff.isNew = false;
    });
    this.dispatchEvent("startOfTurn", {
      characterId: this.id,
      owner: this.owner,
    });
  }

  /**
   * Triggers all end of turn effects and resets various pieces of data
   * @param ability - The ability that was used on the turn
   */
  public endOfTurn(ability: ActiveAbility | null) {
    this.statusEffect.endOfTurn();
    this.stats.endOfTurn();

    this._specialAbilities.forEach((a) => {
      if (ability?.id !== a.id && a.turnsRemaining !== null) {
        a.turnsRemaining = Math.max(a.turnsRemaining - 1, 0);
      }
    });
    this.hasBonusTurn = false;
  }

  /**
   * Picks an ability that is able to be used
   * @param abilityId - The ability ID that must be used if able
   * @returns An ability that can be used
   */
  public chooseAbility(abilityId?: string): ActiveAbility | null {
    if (this.statusEffect.hasDebuff("Stun")) {
      return null;
    } else if (this.statusEffect.hasDebuff("Ability Block")) {
      return this._basicAbility;
    } else if (abilityId === this._basicAbility?.id) {
      return this._basicAbility;
    } else if (
      this._specialAbilities.every(
        (a) =>
          (a.turnsRemaining !== null && a.turnsRemaining > 0) || !a.canBeUsed
      )
    ) {
      return this._basicAbility;
    }

    const ability = this._specialAbilities.find((a) => {
      if (abilityId) {
        return a.id === abilityId;
      } else {
        return (
          a.turnsRemaining !== null && a.turnsRemaining <= 0 && a.canBeUsed
        );
      }
    });

    return ability ?? null;
  }

  /** Checks if the user has any leader abilities */
  public get hasLeaderAbility() {
    return !!this._leaderAbility;
  }

  /** Gets the leader ability */
  public get leaderAbility() {
    return this.leaderAbility;
  }

  /** Assists with their basic attack
   * @param modifiers - A list of stats to change the outcome of the damage
   * @param targetCharacter - The character in which is being attacked
   * @param srcAbility - The ability source that is calling the assist
   */
  public assist(
    modifiers: iStatsCheck[],
    targetCharacter?: Character,
    srcAbility?: Ability
  ) {
    if (this._basicAbility && !targetCharacter?.isDead) {
      if (this.statusEffect.isImmune("Assisting")) {
        this.gameEngine.addLogs({
          characterLogData: this.getLogs(),
          effects: { assisted: false },
          ability: {
            source:
              this.statusEffect.immunity.Assisting.sourceAbility?.sanitize(),
          },
        });
      } else {
        this.gameEngine.addLogs({
          characterLogData: this.getLogs(),
          effects: { assisted: true },
          ability: { source: srcAbility?.sanitize() },
        });
        this._basicAbility.execute(targetCharacter, modifiers, false);
      }
    }
  }

  /** Heals the character for a determined amount of health or protection
   * @param healData - The data that determines how much and what type of healing to do
   * @param sourceAbility - The ability that has the heal effect
   * @param amountSource - The source value when healing a multiplicative amount (defaults to max value)
   */
  public heal(
    healData: iHeal,
    sourceAbility?: Ability | null,
    amountSource?: number
  ) {
    if (healData && !this.isDead) {
      const { healthType, amountType, amount } = healData;

      if (!amountSource) {
        amountSource =
          healthType === "health"
            ? this.stats.maxHealth
            : this.stats.maxProtection;
      }

      const maxStat =
        healthType === "health"
          ? this.stats.maxHealth
          : this.stats.maxProtection;

      const finalAmount =
        amountType === "multiplicative"
          ? (amount ?? 1) * amountSource
          : amount ?? 0;

      let diff = 0;
      if (this.stats[healthType] + finalAmount > maxStat) {
        diff = maxStat - this.stats[healthType];
      } else {
        diff = finalAmount;
      }
      this.stats.gainHealth(finalAmount, healthType);

      if (round(diff) > 0) {
        this.gameEngine.addLogs({
          characterLogData: this.getLogs(),
          heal: { amount: round(diff), type: healthType },
          ability: { source: sourceAbility?.sanitize() },
        });
      }
    }
  }
  /**
   * Counter attacks, using the character's basic ability if able
   * @param targetCharacter - The target character that is being attacked
   * @param canBeCountered - Determines if this character is allowed to counter attack
   */
  public counterAttack(targetCharacter: Character, canBeCountered?: boolean) {
    if (canBeCountered !== false && !targetCharacter.isDead) {
      if (
        chanceOfEvent(this.stats.counterChance * 100) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        if (this.statusEffect.isImmune("CounterAttacking")) {
          this.gameEngine.addLogs({
            characterLogData: this.getLogs(),
            effects: { countered: false },
            ability: {
              source:
                this.statusEffect.immunity.CounterAttacking.sourceAbility?.sanitize(),
            },
          });
        } else {
          this.gameEngine.addLogs({
            characterLogData: this.getLogs(),
            effects: { countered: true },
          });

          this._basicAbility?.execute(
            targetCharacter,
            [
              {
                statToModify: "physicalOffense",
                amount: this.stats.counterDamage,
                modifiedType: "multiplicative",
              },
              {
                statToModify: "specialOffense",
                amount: this.stats.counterDamage,
                modifiedType: "multiplicative",
              },
            ],
            false
          );
        }
      }
    }
  }

  /** Recieves damage mitigated by armor
   * @param damageType - The type of damage being dealt (physical, special, or true)
   * @param damageAmount - The amount of damage being dealt (before armor or other reductions)
   * @param armorPen - The amount of armor that is ignored (armor penetration)
   * @param critChance - The chance of receving a critical hit
   * @param critDamage - The amount to be modified on a critical hit (decimal)
   * @param stats - An array of stats to modify the starting stat value
   */
  public receiveDamage(
    damageType: "physical" | "special" | "true",
    damageAmount: number,
    armorPen: number,
    critChance: number,
    critDamage: number,
    stats?: iStatsCheck[]
  ): { isCrit: boolean; damageTotal: number } {
    if (this.isDead) {
      return { isCrit: false, damageTotal: 0 };
    } else if (damageType === "true") {
      this.stats.loseHealth(damageAmount);
      return { isCrit: false, damageTotal: damageAmount };
    } else {
      const { armor, critAvoid } = this.stats.getCombatStats(damageType, stats);
      const modifiedArmor = Math.max(armor - armorPen, 0);
      const damageReduction =
        (modifiedArmor * 100) / (modifiedArmor + 637.5) / 100;
      const damageTaken = damageAmount * (1 - damageReduction);

      const isCrit = chanceOfEvent((critChance - critAvoid) * 100);

      const damageTotal = Math.max(
        Math.round(damageTaken * (isCrit ? critDamage : 1)),
        1
      );

      this.stats.loseHealth(damageTotal);
      return { isCrit, damageTotal };
    }
  }

  /**
   * Revives the character with a certain amount of protection and health
   * @param protection - The amount of protection that should be set as the current amount
   * @param health - The amount of health that should be set as the current amount
   */
  public revive(protection: number, health: number) {
    if (this.isDead && !this.statusEffect.isImmune("Revive")) {
      this.initialize();
      this.stats.gainHealth(protection, "protection");
      this.stats.gainHealth(health, "health");

      this.gameEngine.addLogs({
        characterLogData: this.getLogs(),
        effects: { revived: true },
      });

      this.dispatchEvent("revive", { target: this });
    }
  }

  /**
   * Triggers any events on the character that matches a particular event type
   * @param eventType - The type of event that should be triggered
   * @param context - Additional data that can be used to pass down to the event
   */
  public dispatchEvent(eventType: tEventType, context?: any) {
    this.events.forEach((event) => {
      if (event.eventType === eventType) {
        event.callback(context);
      }
    });
  }

  /**
   * Checks whether a condition is true
   * @param condition - A function to be ran when a condition should be checked
   * @returns True if the condition has been met, otherwise false
   */
  public checkCondition(condition?: Function): boolean {
    if (!condition) {
      return true;
    } else {
      return condition();
    }
  }

  /**
   * Checks whether the character has any of the provided tags (including character id, categories, or alignment)
   * @param tag - The string used to check
   * @param id - The id used to check if this is the same as this character's id
   * @returns true if this character has the tag or has otherwise been met
   */
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
      return this._alignment === tag;
    } else {
      return tag === this.id;
    }
  }

  /**
   * A utility function used to output the current state of the character stats
   * @returns A map of various pieces of data used to log out the characters stats
   */
  public getLogs(): tLogData {
    return {
      name: this.name,
      owner: this.owner,
      health: {
        current: round(this.stats.health, 0),
        max: round(this.stats.maxHealth, 0),
        base: round(this.stats.baseStats.maxHealth, 0),
      },
      protection: {
        current: round(this.stats.protection, 0),
        max: round(this.stats.maxProtection, 0),
        base: round(this.stats.baseStats.maxProtection, 0),
        bonus: round(this.stats.bonusProtection, 0),
      },
      activeAbilities: this.activeAbilities.map((a) => {
        return {
          ...a.sanitize(),
          cooldown: a.turnsRemaining,
        };
      }),
      buffs: this.statusEffect.buffs.map((buff) => {
        return {
          name: buff.name ?? "",
          duration: buff.duration,
          cantDispel: buff.cantDispel,
          cantPrevent: buff.cantPrevent,
          cantResist: buff.cantResist,
          unique: buff.unique,
        };
      }),
      debuffs: this.statusEffect.debuffs.map((debuff) => {
        return {
          name: debuff.name ?? "",
          duration: debuff.duration,
          cantDispel: debuff.cantDispel,
          cantPrevent: debuff.cantPrevent,
          cantResist: debuff.cantResist,
          unique: debuff.unique,
        };
      }),
      statusEffects: this.statusEffect.statusEffects.map((effect) => {
        return {
          name: effect.name ?? "",
          duration: effect.duration,
          cantDispel: effect.cantDispel,
          cantPrevent: effect.cantPrevent,
          cantResist: effect.cantResist,
          unique: effect.unique,
        };
      }),
      physical: [
        {
          label: "Offense",
          value: round(this.stats.physical.offense, 2),
          base: round(this.stats.baseStats.physical.offense, 2),
        },
        {
          label: "Crit Chance",
          value: round(this.stats.physical.critChance * 100, 2),
          base: round(this.stats.baseStats.physical.critChance * 100, 2),
          isPercent: true,
        },
        {
          label: "Armor",
          value: round(
            (this.stats.physical.armor * 100) /
              (this.stats.physical.armor + 637.5),
            2
          ),
          base: round(
            (this.stats.baseStats.physical.armor * 100) /
              (this.stats.baseStats.physical.armor + 637.5),
            2
          ),
          isPercent: true,
        },
        {
          label: "Armor Pen",
          value: round(this.stats.physical.armorPen, 2),
          base: round(this.stats.baseStats.physical.armorPen, 2),
        },
        {
          label: "Accuracy",
          value: round(this.stats.physical.accuracy * 100, 2),
          base: round(this.stats.baseStats.physical.accuracy * 100, 2),
          isPercent: true,
        },
        {
          label: "Dodge",
          value: round(this.stats.physical.dodge * 100, 2),
          base: round(this.stats.baseStats.physical.dodge * 100, 2),
          isPercent: true,
        },
        {
          label: "Crit Avoidance",
          value: round(this.stats.physical.critAvoid * 100, 2),
          base: round(this.stats.baseStats.physical.critAvoid * 100, 2),
          isPercent: true,
        },
      ],
      special: [
        {
          label: "Offense",
          value: round(this.stats.special.offense, 2),
          base: round(this.stats.baseStats.special.offense, 2),
        },
        {
          label: "Crit Chance",
          value: round(this.stats.special.critChance * 100, 2),
          base: round(this.stats.baseStats.special.critChance * 100, 2),
          isPercent: true,
        },
        {
          label: "Resistance",
          value: round(
            (this.stats.special.armor * 100) /
              (this.stats.special.armor + 637.5),
            2
          ),
          base: round(
            (this.stats.baseStats.special.armor * 100) /
              (this.stats.baseStats.special.armor + 637.5),
            2
          ),
          isPercent: true,
        },
        {
          label: "Resistance Pen",
          value: round(this.stats.special.armorPen, 2),
          base: round(this.stats.baseStats.special.armorPen, 2),
        },
        {
          label: "Accuracy",
          value: round(this.stats.special.accuracy * 100, 2),
          base: round(this.stats.baseStats.special.accuracy * 100, 2),
          isPercent: true,
        },
        {
          label: "Deflection",
          value: round(this.stats.special.dodge * 100, 2),
          base: round(this.stats.baseStats.special.dodge * 100, 2),
          isPercent: true,
        },
        {
          label: "Crit Avoidance",
          value: round(this.stats.special.critAvoid * 100, 2),
          base: round(this.stats.baseStats.special.critAvoid * 100, 2),
          isPercent: true,
        },
      ],
      general: [
        {
          label: "Speed",
          value: round(this.stats.speed, 2),
          base: round(this.stats.baseStats.speed, 2),
        },
        {
          label: "Mastery",
          value: round(this.stats.mastery, 2),
          base: round(this.stats.baseStats.mastery, 2),
        },
        {
          label: "Crit Damage",
          value: round(this.stats.critDamage * 100, 2),
          base: round(this.stats.baseStats.critDamage * 100, 2),
          isPercent: true,
        },
        {
          label: "Tenacity",
          value: round(this.stats.tenacity * 100, 2),
          base: round(this.stats.baseStats.tenacity * 100, 2),
          isPercent: true,
        },
        {
          label: "Potency",
          value: round(this.stats.potency * 100, 2),
          base: round(this.stats.baseStats.potency * 100, 2),
          isPercent: true,
        },
        {
          label: "Health Steal",
          value: round(this.stats.healthSteal * 100, 2),
          base: round(this.stats.baseStats.healthSteal * 100, 2),
          isPercent: true,
        },
        // {
        //   label: "Defense Pen",
        //   value: 0,
        //   base: 0,
        //   isPercent: true,
        // },
        {
          label: "Counter Chance",
          value: round(this.stats.counterChance * 100, 2),
          base: 0,
          isPercent: true,
        },
        {
          label: "Counter Damage",
          value: round(this.stats.counterDamage * 100, 2),
          base: 100,
          isPercent: true,
        },
      ],
      otherEffects: {
        ...this.effects,
        immunity: this.statusEffect.sanitizeImmunity(),
      },
      turnMeter: round(this.turnMeter, 0),
    };
  }
}

//todo: combine these functions with /teams.js
/**
 * Checks if any of the tags provided match with a character. Can use `&` or `!` notation too
 * @param character - The character to check the tags on
 * @param tagsList - The list of tags that should be checked
 * @param id - The ID used to check if its the same as the character
 * @returns True if the tags match, false if they dont
 */
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
