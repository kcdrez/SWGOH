import { v4 as uuid } from "uuid";
import _ from "lodash";

import { Character, anyTagsMatch } from "./index";
import { iStatsCheck } from "./stats";
import { tBuff, tDebuff, tStatusEffect } from "./statusEffects";
import { chanceOfEvent, randomNumber } from "utils";
import { gameEngine } from "types/gameEngine/gameEngine";
import { Log } from "./log";

/**
 * A generic abstract class for any type of ability
 */
export class Ability {
  public id: string;
  public name: string;
  public text: string;

  protected _character: Character;
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter: Character
  ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this._character = parentCharacter;
  }
}

/**
 * A generic abstract class for any type of ability that can exist on a character
 * @abstract @class CharacterAbility
 * @extends Ability
 */
abstract class CharacterAbility extends Ability {
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter: Character
  ) {
    super(id, name, text, parentCharacter);
  }

  /**
   * Finds a valid target from the provided list with the ability to ignore certain effects (like taunt)
   * @param validTargets - A List of all the valid targets to select from
   * @param forcedTarget - The target that must be selected, if able
   * @param include - A configuration to ignore certain effects
   * @returns The character target or null if no valid targets exist
   */
  public findTargets(
    validTargets: Character[],
    forcedTarget?: Character,
    ignore: {
      taunt?: boolean;
      stealth?: boolean;
      death?: boolean;
    } = { taunt: false, stealth: false, death: false }
  ): Character | null {
    if (forcedTarget && (!forcedTarget.isDead || ignore.death)) {
      if (forcedTarget.owner === this._character.owner) {
        return forcedTarget;
      } else {
        const tauntingAllies = forcedTarget.teammates.filter(
          (ally) => ally.hasTauntEffect
        );

        if (tauntingAllies.length > 0 && !ignore.taunt) {
          const randIndex = randomNumber(0, tauntingAllies.length - 1);
          return tauntingAllies[randIndex];
        }

        if (forcedTarget.statusEffect.hasBuff("Stealth") && !ignore.stealth) {
          const alliesWithOutStealth = forcedTarget.teammates.filter((ally) => {
            return !ally.statusEffect.hasBuff("Stealth");
          });

          if (alliesWithOutStealth.length > 0) {
            const randIndex = randomNumber(0, alliesWithOutStealth.length - 1);
            return alliesWithOutStealth[randIndex];
          }
        }
      }
      return forcedTarget;
    }

    if (validTargets.length > 0) {
      const targetList = validTargets.filter((target) => {
        if (target.isDead) {
          return ignore.death;
        }
        return true;
      });

      const randIndex = randomNumber(0, targetList.length - 1);
      return targetList[randIndex];
    } else {
      return null;
    }
  }

  /**
   * Finds a random enemy to target
   * @param forcedTarget - The target that must be selected, if able
   * @param ignoreTaunt - If true, ignores the taunt effects and can select any valid enemy
   * @returns The character target or null if no valid targets exist
   */
  public findRandomEnemy(forcedTarget?: Character, ignoreTaunt?: boolean) {
    return this.findTargets(
      this._character.opponents.filter(
        (c) => !c.statusEffect.isImmune("Targeting")
      ),
      forcedTarget,
      {
        taunt: ignoreTaunt ?? this._character.effects.ignoreTaunt,
      }
    );
  }

  /**
   * Finds a random ally to target
   * @param forcedTarget - The target that must be selected, if able
   * @returns The character target or null if no valid targets exist
   */
  public findRandomAlly(forcedTarget?: Character) {
    return this.findTargets(
      this._character.teammates.filter((ally) => !this._character.isSelf(ally)),
      forcedTarget,
      {
        taunt: true,
        stealth: true,
      }
    );
  }

  /** Deals damage to a target
   * @param damageType - The type of damage being dealt (physical, special, or true)
   * @param targetCharacter - The character to receive the damage
   * @param abilityModifier - The modifier for the specific ability which will be multplied by the variance to determine the amount of damage dealt
   * @param variance - The amount of variance that the damage can be
   * @param stats - An array of stats to modify the starting stat value
   * @param srcAbility - The optional ability that is causing the damage
   */
  public dealDamage(
    damageType: "physical" | "special" | "true",
    targetCharacter: Character,
    abilityModifier: number = 0,
    variance: number = 5,
    stats?: iStatsCheck[],
    canBeCountered?: boolean,
    srcAbility?: Ability
  ) {
    if (targetCharacter.isDead) {
      return;
    }

    const { offense, critChance, armorPen } =
      this._character.stats.getCombatStats(damageType, stats);
    const varianceOffense =
      damageType === "true"
        ? 1
        : offense * (1 - randomNumber(0 - variance, variance) / 100);

    const { isCrit, damageTotal } = targetCharacter.receiveDamage(
      damageType,
      varianceOffense * abilityModifier,
      armorPen,
      critChance,
      this._character.stats.critDamage,
      stats
    );

    gameEngine.addLogs([
      new Log({
        target: targetCharacter,
        damage: {
          amount: _.round(damageTotal, 0),
          isCrit,
        },
        ability: { source: srcAbility },
      }),
    ]);

    this._character.heal(
      {
        amountType: "additive",
        amount: damageTotal * this._character.stats.healthSteal,
        healthType: "health",
      },
      new HealthSteal(this._character)
    );

    this._character?.checkDeath(targetCharacter);

    this._character.dispatchEvent("dealDamage", {
      damageAmount: damageTotal,
      isCrit,
      damageType,
      target: targetCharacter,
    });

    targetCharacter.dispatchEvent("receiveDamage", {
      damageAmount: damageTotal,
      isCrit,
      damageType,
      attackSource: this.id,
    });

    targetCharacter.counterAttack(this._character, canBeCountered);
  }
}

/**
 * A generic abstract class for any type of ability can be activated (such as basic or special abilities)
 * @abstract @class ActiveAbility
 * @extends CharacterAbility
 */
export abstract class ActiveAbility extends CharacterAbility {
  public turnsRemaining: number | null = null;
  public cooldown: number | null = null;
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter: Character
  ) {
    super(id, name, text, parentCharacter);
  }

  /** Determines if this ability can be used */
  public get canBeUsed() {
    return true;
  }

  /** Initializes the ability */
  public initialize() {
    if (this.cooldown) {
      this.turnsRemaining = 0;
    }
  }

  /** Executes all the effects of the ability
   * @param targetCharacter - The character that the ability is affecting
   * @param stats - A list of stats what will affect the results of the ability (such as damage)
   * @param canBeCountered - Determines if the ability can be countered or not
   * @param additionalEffects - A callback funtion on any additional effects that should be ran
   */
  public execute(
    targetCharacter?: Character | null,
    stats?: iStatsCheck[],
    canBeCountered?: boolean,
    additionalEffects: Function = () => {}
  ) {
    if (targetCharacter) {
      gameEngine.addLogs(
        new Log({ character: this._character, ability: { used: this } })
      );
      this._character.dispatchEvent("beforeUseAbility", {
        abilityId: this.id,
        target: targetCharacter,
      });

      additionalEffects();

      if (this.cooldown) {
        this.turnsRemaining = this.cooldown;
      }

      this._character.dispatchEvent("useAbility", {
        abilityId: this.id,
        target: targetCharacter,
      });
    } else {
      console.error("Could not find a valid target for ", this.id);
    }
  }

  /** Checks if the effect should be evaded
   * @param damageType - Used to determine if physical or special stats should be used
   * @param targetCharacter - The character that is the target for the attack
   * @param stats - A list of stats what will affect the results of the ability (such as damage)
   * @returns True if the effect is evaded, false if it is not evaded
   */
  public checkEvade(
    damageType: "physical" | "special",
    targetCharacter: Character,
    stats?: iStatsCheck[]
  ) {
    if (this._character?.isSelf(targetCharacter)) {
      return false;
    } else if (this._character) {
      const { dodge } = targetCharacter.stats.getCombatStats(damageType, stats);
      const { accuracy } = this._character.stats.getCombatStats(
        damageType,
        stats
      );

      const attackMissed = chanceOfEvent(dodge - accuracy * 100);

      if (attackMissed) {
        gameEngine.addLogs(
          new Log({
            character: targetCharacter,
            damage: { evaded: true },
          })
        );
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  /**
   * Change an ability's cooldown
   * @param amount - The amount that the cooldown should be manipulated (negative number decreases the cooldown, positive number increases the cooldown)
   * @param srcAbility - The source ability that is causing the cooldown change
   * @param srcCharacter - The Character that is causing the cooldown change
   * @param cantResist - The effect cannot be resisted
   */
  public changeCooldown(
    amount: number,
    srcAbility: Ability,
    srcCharacter?: Character,
    cantResist?: boolean
  ) {
    if (this.turnsRemaining === null) {
      return;
    }

    const name = amount > 0 ? "Cooldown Increase" : "Cooldown Decrease";
    if (
      this._character?.statusEffect.isImmune({
        name,
        id: uuid(),
        duration: amount,
        sourceAbility: srcAbility,
      })
    ) {
      gameEngine.addLogs(
        new Log({
          character: this._character,
          statusEffects: {
            immune: true,
            type: amount > 0 ? "debuff" : "buff",
            list: [
              { name, duration: amount, id: uuid(), sourceAbility: srcAbility },
            ],
          },
        })
      );
    } else {
      if (amount > 0 && !!srcCharacter) {
        const resistedChance = Math.max(
          (this._character?.stats.tenacity ?? 0) - srcCharacter?.stats.potency,
          0.15
        );

        if (chanceOfEvent(resistedChance) && !cantResist) {
          gameEngine.addLogs(
            new Log({
              character: this._character,
              statusEffects: {
                resisted: true,
                list: [
                  { name, duration: 0, id: uuid(), sourceAbility: srcAbility },
                ],
                type: "debuff",
              },
            })
          );
          this._character?.dispatchEvent("resisted", {
            effect: "Cooldown Increase",
          });
          return;
        }
      }

      let finalAmount = amount;
      if (amount < 0) {
        if (this.turnsRemaining <= 0) {
          return;
        }
        finalAmount = Math.max(amount, 0 - this.turnsRemaining);
      }
      this.turnsRemaining += finalAmount;

      gameEngine.addLogs(
        new Log({
          character: this._character,
          ability: { source: srcAbility },
          effects: { cooldown: { ability: this, amount: finalAmount } },
        })
      );
    }
  }
}

/**
 * A generic abstract class for any type of ability is passive and cannot be activated (such as unique or leader)
 * @abstract @class PassiveAbility
 * @extends CharacterAbility
 */
export abstract class PassiveAbility extends CharacterAbility {
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter: Character
  ) {
    super(id, name, text, parentCharacter);
  }

  /** Applies all of the given events, stat increases, and other effects */
  public activate() {}

  /** Removes all of the given events, stat increases, and other effects from all teammates and opponents */
  public deactivate() {
    this._character?.teammates.forEach((target) => {
      target.events = target.events.filter((event) => {
        return event.characterSourceId !== this._character?.uniqueId;
      });
      target.stats.removeTempStats(this._character?.uniqueId);
    });

    this._character?.opponents.forEach((target) => {
      target.events = target.events.filter((event) => {
        return event.characterSourceId !== this._character?.uniqueId;
      });
      target.stats.removeTempStats(this._character?.uniqueId);
    });
  }
}

/**
 * A class specifically used for the Health Steal mechanic when dealing damage
 * @class PassiveAbility
 * @extends CharacterAbility
 */
export class HealthSteal extends Ability {
  constructor(character: Character) {
    super(
      "healthSteal",
      "Health Steal",
      "The percentage amount of the damage that this character heals whenever they deal damage.",
      character
    );
  }
}

/** Various filters used to determine how to target a specific character(s)
 * @interface iTargetData
 */
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
    /** Determines if the primary target should be targetted again */
    primary?: boolean;
  }[];
  /** Determines if the weakest unit should be targeted */
  weakest?: boolean;
  /** Determines how many units of the given filters should be selected */
  targetCount?: number;
  /** Determines if the filtering should ignore any taunt effects */
  ignoreTaunt?: boolean;
}
