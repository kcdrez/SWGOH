import { v4 as uuid } from "uuid";

import { Character } from "./index";
import { iStats, iStatsCheck, Stats } from "./stats";
import { tBuff, tDebuff, tStatusEffect } from "./statusEffects";
import { chanceOfEvent, randomNumber, unvue } from "utils";
import { gameEngine } from "types/gameEngine/gameEngine";
import { Log } from "./log";

export abstract class Ability {
  public id: string;
  public name: string;
  public text: string;

  protected _character?: Character;
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter?: Character
  ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this._character = parentCharacter;
  }
}

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
   *
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
    let primaryTarget: Character | null = null;

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
          return anyTagsMatch(char, targetFilter.tags, this.id);
        } else if (targetFilter.primary) {
          return char.isSelf(forcedTarget ?? undefined);
        } else if (targetFilter.targetIds) {
          return anyTagsMatch(char, targetFilter.targetIds, this.id);
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
    const opponentsList = filteredList.filter(
      (x) => x.owner !== this._character?.owner
    );
    const tauntingList = (this._character?.opponents ?? []).filter(
      (t) => t.hasTauntEffect
    );

    if (tauntingList.length > 0 && !targetData.ignoreTaunt) {
      const randIndex = randomNumber(0, tauntingList.length - 1);
      primaryTarget = tauntingList[randIndex];
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
}
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

  public initialize() {
    if (this.cooldown) {
      this.turnsRemaining = 0;
    }
  }

  /** Executes all the effects of the ability */
  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered: boolean = true
  ) {
    gameEngine.addLogs(
      new Log({ character: this._character, ability: { used: this } })
    );
  }

  public checkEvade(
    damageType: "physical" | "special",
    opponent: Character,
    stats?: iStatsCheck[]
  ) {
    if (this._character?.isSelf(opponent)) {
      return false;
    } else if (this._character) {
      const { dodge } = this._character.stats.getCombatStats(damageType, stats);
      const { accuracy } = opponent.stats.getCombatStats(damageType, stats);

      return chanceOfEvent(dodge - accuracy * 100);
    }
  }

  /**
   * Change an ability's cooldown
   *
   * @param amount - The amount that the cooldown should be manipulated
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
          this._character?.dispatchEvent("resisted", {});
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

  /** Deals damage to a target
   *
   * @damageType - The type of damage being dealt (physical, special, or true)
   * @targetCharacter - The character to receive the damage
   * @abilityModifier - The modifier for the specific ability
   * @variance - The amount of variance that the damage can be
   * @stats - An array of stats to modify the starting stat value
   */
  public dealDamage(
    damageType: "physical" | "special" | "true",
    targetCharacter: Character,
    abilityModifier: number = 0,
    variance: number = 5,
    stats?: iStatsCheck[],
    canBeCountered: boolean = true
  ) {
    if (this._character) {
      const { offense, critChance, armorPen } =
        this._character.stats.getCombatStats(damageType, stats);
      const varianceOffense =
        offense * (1 - randomNumber(0 - variance, variance) / 100);

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
            amount: damageTotal,
            isCrit,
          },
        }),
      ]);

      this._character.heal(
        {
          amountType: "additive",
          amount: damageTotal * this._character.stats.healthSteal,
          healthType: "health",
        },
        {
          id: uuid(),
          name: "Health Steal",
          text: "The percentage amount of the damage that this character heals whenever they deal damage.",
        }
      );

      targetCharacter.dispatchEvent("receiveDamage", {
        damageAmount: damageTotal,
        isCrit,
        damageType,
      });

      targetCharacter.counterAttack(this._character, canBeCountered);
    }
  }
}

export abstract class PassiveAbility extends CharacterAbility {
  constructor(
    id: string,
    name: string,
    text: string,
    parentCharacter: Character
  ) {
    super(id, name, text, parentCharacter);
  }

  /** Adds all of the given events, stat increases, and other effects */
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
