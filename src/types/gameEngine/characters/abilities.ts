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
 * @abstract @class Ability
 */
export abstract class Ability {
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
   * @param targetData - The target data used to determine how to find valid targets
   * @param forcedTarget - Used in the case that the targetData should use an already selected target (such as for an assist)
   * @param include - Used to ignore specific attributes, such as dead characters. By default, these characters are not considered for selection
   * @returns targetList - List of valid targets, primaryTarget - primary opponent target
   */
  public findTargets(
    targetData: iTargetData,
    forcedTarget?: Character | null,
    include?: {
      dead?: boolean;
    }
  ): { targetList: Character[]; primaryTarget: Character | null } {
    let primaryTarget: Character | null = forcedTarget ?? null;

    const validTargets: Character[] = [
      ...(this._character?.teammates ?? []),
      ...(this._character?.opponents ?? []),
    ].filter((char: Character) => {
      let shouldInclude = true;

      if (char.isDead) {
        shouldInclude = include?.dead ?? false;
      }
      return shouldInclude;
    });

    let filteredList = validTargets.filter((char) => {
      return targetData.filters?.every((targetFilter) => {
        if (targetFilter.allies) {
          return char.owner === this._character?.owner;
        } else if (targetFilter.allies === false) {
          if (targetData.targetCount && !targetData.ignoreTaunt) {
            if (char.owner !== this._character?.owner) {
              const anyForced = validTargets.some((c) => {
                return c.owner !== this._character?.owner && c.hasTauntEffect;
              });
              if (anyForced) {
                return char.hasTauntEffect;
              }
            }
          }
          return char.owner !== this._character?.owner;
        } else if (targetFilter.buffs) {
          return char.statusEffect.hasBuff(targetFilter.buffs);
        } else if (targetFilter.debuffs) {
          return char.statusEffect.hasDebuff(targetFilter.debuffs);
        } else if (targetFilter.isLeader) {
          return char.isLeader;
        } else if (targetFilter.statusEffects) {
          return char.statusEffect.hasStatusEffect(targetFilter.statusEffects);
        } else if (targetFilter.tags) {
          return anyTagsMatch(char, targetFilter.tags, this._character.id);
        } else if (targetFilter.primary) {
          return char.isSelf(forcedTarget ?? undefined);
        } else if (targetFilter.targetIds) {
          return anyTagsMatch(char, targetFilter.targetIds, this._character.id);
        }
        return false;
      });
    });

    if (targetData.weakest) {
      let tempList: Character[] = [];
      filteredList.forEach((cur) => {
        if (tempList.length === 0) {
          tempList.push(cur);
        } else {
          const totalStatsCur = cur.stats.health + cur.stats.protection;
          const isWeakest = tempList.every(
            (c) => totalStatsCur < c.stats.health + c.stats.protection
          );
          if (isWeakest) {
            tempList = [cur];
          }
        }
      });
      filteredList = tempList;
    } else if (targetData.targetCount) {
      const tempList: Character[] = [];
      if (forcedTarget) {
        tempList.push(forcedTarget);
      }

      while (
        tempList.length < targetData.targetCount &&
        filteredList.length >= targetData.targetCount
      ) {
        const rand: number = randomNumber(0, filteredList.length - 1);
        const el = filteredList[rand];
        const exists = tempList.some((x) => x.id === el.id);
        if (!exists) {
          tempList.push(filteredList[rand]);
        }
      }
      filteredList = tempList;
    }

    filteredList = filteredList.filter((x) => !!x);
    const opponentsList = filteredList.filter(
      (x) => x.owner !== this._character?.owner
    );
    const tauntingList = (this._character?.opponents ?? []).filter(
      (t) => t.hasTauntEffect
    );

    if (tauntingList.length > 0 && !targetData.ignoreTaunt) {
      const randIndex = randomNumber(0, tauntingList.length - 1);
      primaryTarget = tauntingList[randIndex];
    } else if (forcedTarget) {
      primaryTarget = forcedTarget;
    } else if (opponentsList.length > 0) {
      const randIndex = randomNumber(0, opponentsList.length - 1);
      primaryTarget = opponentsList[randIndex];
    } else {
      const randIndex = randomNumber(
        0,
        (this._character?.opponents?.length ?? 0) - 1
      );
      primaryTarget = this._character?.opponents[randIndex] ?? null;
    }
    return { targetList: filteredList, primaryTarget };
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
    canBeCountered: boolean = true,
    srcAbility?: Ability
  ) {
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
    canBeCountered: boolean = true,
    additionalEffects: Function = () => {}
  ) {
    gameEngine.addLogs(
      new Log({ character: this._character, ability: { used: this } })
    );

    additionalEffects();

    if (!targetCharacter) {
      const { primaryTarget } = this.findTargets({
        filters: [{ allies: false }],
        targetCount: 1,
      });
      targetCharacter = primaryTarget;
    }

    this._character.dispatchEvent("useAbility", {
      abilityId: this.id,
      target: targetCharacter,
    });
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

      return chanceOfEvent(dodge - accuracy * 100);
    }
    //todo add logging if it misses
    return false;
  }

  /**
   * Change an ability's cooldown
   * @param amount - The amount that the cooldown should be manipulated (negative number decreases the cooldown, positive number increases the cooldown)
   * @param srcAbility - The source ability that is causing the cooldown change
   * @param srcCharacter - The Character that is causing the cooldown change
   */
  public changeCooldown(
    amount: number,
    srcAbility: Ability,
    srcCharacter?: Character
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
      })
    ) {
      gameEngine.addLogs(
        new Log({
          character: this._character,
          statusEffects: {
            immune: true,
            type: amount > 0 ? "debuff" : "buff",
            list: [{ name, duration: amount, id: uuid() }],
          },
        })
      );
    } else {
      if (amount > 0 && !!srcCharacter) {
        const resistedChance = Math.max(
          (this._character?.stats.tenacity ?? 0) - srcCharacter?.stats.potency,
          0.15
        );

        if (chanceOfEvent(resistedChance)) {
          gameEngine.addLogs(
            new Log({
              character: this._character,
              statusEffects: {
                resisted: true,
                list: [{ name, duration: 0, id: uuid() }],
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
      target.stats.tempStats = target.stats.tempStats.filter((stat) => {
        return stat.characterSourceId !== this._character?.uniqueId;
      });
    });

    this._character?.opponents.forEach((target) => {
      target.events = target.events.filter((event) => {
        return event.characterSourceId !== this._character?.uniqueId;
      });
      target.stats.tempStats = target.stats.tempStats.filter((stat) => {
        return stat.characterSourceId !== this._character?.uniqueId;
      });
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
