import { round } from "lodash";
import { v4 as uuid } from "uuid";

import { chanceOfEvent, randomNumber, unvue } from "utils";

import { iHeal, iStats, iStatsCheck, Stats } from "./stats";
import { StatusEffect } from "./statusEffects";
import { Ability, ActiveAbility, PassiveAbility } from "./abilities";
import { IUnit, Unit } from "types/unit";
import characterList from "../characterScripts";
import { Log, tLogData } from "./log";

import { gameEngine, iCondition } from "../gameEngine";

/**
 * A type to determine what events are supported
 * @type tEventType
 */
type tEventType =
  | "dealDamage"
  | "endOfTurn"
  | "inflicted"
  | "matchSetup"
  | "matchStart"
  | "receiveDamage"
  | "revive"
  | "resisted"
  | "useAbility";

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
  private _basicAbility: ActiveAbility | null = null;
  private _specialAbilities: ActiveAbility[] = [];
  private _uniqueAbilities: PassiveAbility[] = [];
  private _leaderAbility: PassiveAbility | null = null;
  public owner: string;
  private _alignment: IUnit["alignment"];
  private _categories: string[];
  public teammates: Character[] = [];
  public opponents: Character[] = [];
  public isLeader: boolean = false;
  public events: {
    eventType: tEventType;
    characterSourceId?: string;
    callback: Function;
  }[] = [];

  constructor(data: Unit, owner: string, isLeader?: boolean) {
    this.stats = new Stats(data, this);
    this.statusEffect = new StatusEffect(this);

    this.name = data.name;
    this.id = data.id;
    this.owner = owner;
    this._alignment = data.alignment;
    this._categories = data.categories;
    this.isLeader = isLeader ?? false;

    const abilityList = characterList[this.id];
    data.abilities.forEach((x) => {
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

  /** A list of abilities including the basic ability and specials */
  public get activeAbilities() {
    const arr: ActiveAbility[] = [];
    if (this._basicAbility) {
      arr.push(this._basicAbility);
    }
    arr.push(...this._specialAbilities);
    return arr;
  }

  /** A map of different effects that may exist on the character */
  public get effects() {
    const self = this;
    return {
      get ignoreTaunt() {
        return self.statusEffect.hasBuff("Call to Action");
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
    if (amount === 0) {
      return null;
    }
    let diff = 0;

    if (this._tm >= 100 && amount < 0) {
      const resistedChance = Math.max(
        this.stats.tenacity - (srcCharacter?.stats.potency ?? 0),
        0.15
      );
      if (chanceOfEvent(resistedChance)) {
        gameEngine.addLogs(
          new Log({
            character: this,
            statusEffects: {
              resisted: true,
              list: [{ name: "TM Decrease", duration: amount, id: uuid() }],
              type: "debuff",
            },
          })
        );
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
      gameEngine.addLogs(
        new Log({
          character: this,
          effects: {
            turnMeter: round(amount > 0 ? diff : 0 - diff, 2),
          },
          ability: {
            source: srcAbility,
          },
        })
      );
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
      gameEngine.addLogs(
        new Log({
          character: this,
          target: targetCharacter,
          effects: { defeated: true },
        })
      );
      this._uniqueAbilities.forEach((a) => a.deactivate());
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
      gameEngine.addLogs(
        new Log({ character: this, effects: { stunned: true } })
      );
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
        (a) => a.turnsRemaining !== null && a.turnsRemaining > 0
      )
    ) {
      return this._basicAbility;
    }

    const ability = this._specialAbilities.find((a) => {
      if (abilityId) {
        return a.id === abilityId;
      } else {
        return a.turnsRemaining !== null && a.turnsRemaining <= 0;
      }
    });

    if (ability) {
      ability.turnsRemaining = ability.cooldown;
    }
    return ability ?? null;
  }

  /** Checks if the user has any leader abilities */
  public get hasLeaderAbility() {
    return !!this._leaderAbility;
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
    if (this._basicAbility) {
      if (this.statusEffect.isImmune("Assisting")) {
        gameEngine.addLogs(
          new Log({
            character: this,
            effects: { assisted: false },
            ability: { source: srcAbility },
          })
        );
      } else {
        console.log(this.uniqueId, "is assisting", targetCharacter?.uniqueId);
        gameEngine.addLogs(
          new Log({
            character: this,
            effects: { assisted: true },
            ability: { source: srcAbility },
          })
        );
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
      this.stats[healthType] += finalAmount;

      if (diff > 0) {
        gameEngine.addLogs(
          new Log({
            character: this,
            heal: { amount: round(diff), type: healthType },
            ability: { source: sourceAbility },
          })
        );
      }
    }
  }
  /**
   * Counter attacks, using the character's basic ability if able
   * @param targetCharacter - The target character that is being attacked
   * @param canBeCountered - Determines if this character is allowed to counter attack
   */
  public counterAttack(targetCharacter: Character, canBeCountered: boolean) {
    if (canBeCountered && !targetCharacter.isDead) {
      if (
        chanceOfEvent(this.stats.counterChance * 100) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        if (this.statusEffect.isImmune("CounterAttacking")) {
          gameEngine.addLogs(
            new Log({
              character: this,
              effects: { countered: false },
            })
          );
        } else {
          gameEngine.addLogs(
            new Log({
              character: this,
              effects: { countered: true },
            })
          );

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
    if (damageType === "true") {
      this.stats.protection -= damageAmount;
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

      this.stats.protection -= damageTotal;
      return { isCrit, damageTotal };
    }
  }

  /**
   * Revives the character with a certain amount of protection and health
   * @param protection - The amount of protection that should be set as the current amount
   * @param health - The amount of health that should be set as the current amount
   */
  public revive(protection: number, health: number) {
    if (this.isDead) {
      this.stats.protection = protection;
      this.stats.health = health;

      gameEngine.addLogs(
        new Log({
          character: this,
          effects: { revived: true },
        })
      );

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
   * @param condition - The data that is used to determine if it is true or not
   * @returns True if the condition has been met, otherwise false
   */
  public checkCondition(condition?: iCondition): boolean {
    if (!condition) {
      return true;
    }

    const { buffs, debuffs, stats, inverted, isNew, tags, tm, onTurn } =
      condition;
    let results = false;
    if (buffs) {
      const hasBuffs = buffs.every((buff) => {
        const match = this.statusEffect.buffs.find((x) => x.name === buff);
        if (match) {
          return isNew === false ? !match.isNew : true;
        } else return false;
      });
      results = hasBuffs || results;
    }
    if (debuffs) {
      const hasDebuffs = debuffs.every((status) => {
        const match = this.statusEffect.debuffs.find((x) => x.name === status);
        if (match) {
          return isNew ? match.isNew : true;
        }
        return false;
      });

      results = hasDebuffs || results;
    }
    if (stats) {
      let meetsStatRequirement = false;
      const stat = this.stats[stats.statToModify];
      if (!isNaN(stat)) {
        //if it is a number
        const num = Number(stat);
        if (
          stats.statToModify === "health" &&
          stats.modifiedType === "multiplicative"
        ) {
          const percent = num / this.stats.maxHealth;
          // meetsStatRequirement =
          //   stats.amountType === "greater"
          //     ? stats.amount < percent
          //     : stats.amount > percent;
        } else if (
          stats.statToModify === "protection" &&
          stats.modifiedType === "multiplicative"
        ) {
          const percent = num / this.stats.maxProtection;
          // meetsStatRequirement =
          //   stats.amountType === "greater"
          //     ? stats.amount > percent
          //     : stats.amount < percent;
        } else {
          // meetsStatRequirement =
          //   stats.amountType === "greater"
          //     ? stats.amount < num
          //     : stats.amount > num;
        }
      } else {
        console.warn(`Could not find stat ${stat.type} on ${this.name}`);
      }

      results = meetsStatRequirement || results;
    }
    if (tags) {
      results = anyTagsMatch(this, tags, this.id) || results;
    }
    if (tm) {
      if (tm.greaterThan) {
        results = this.turnMeter > tm.amount || results;
      } else {
        results = this.turnMeter < tm.amount || results;
      }
    }
    if (onTurn) {
      results =
        this.isSelf(gameEngine.currentCharactersTurn ?? undefined) || results;
    }
    return inverted ? !results : results;
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
      },
      protection: {
        current: round(this.stats.protection, 0),
        max: round(this.stats.maxProtection, 0),
      },
      activeAbilities: this.activeAbilities.map((a) => {
        return { id: a.id, name: a.name, cooldown: a.turnsRemaining };
      }),
      buffs: unvue(this.statusEffect.buffs),
      debuffs: unvue(this.statusEffect.debuffs),
      statusEffects: unvue(this.statusEffect.statusEffects),
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
          label: "Dodge (Evasion)",
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
          label: "Deflection (Evasion)",
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
          value: 0,
          base: 0,
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
        {
          label: "Defense Pen",
          value: 0,
          base: 0,
          isPercent: true,
        },
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
      otherEffects: unvue({
        ...this.effects,
        immunity: unvue(this.statusEffect.immunity),
      }),
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
