import { v4 as uuid } from "uuid";
import _ from "lodash";

import { Character } from "./index";
import { Ability } from "./abilities";
import { chanceOfEvent } from "./utils";
import { Log, tLogData } from "./log";

/** A container class used to hold all of a character's status effects (buffs, debuffs, etc.) any utility functions */
export class StatusEffect {
  private _buffs: iBuff[] = [];
  private _debuffs: iDebuff[] = [];
  private _statusEffects: iStatusEffect[] = [];
  private _character: Character;
  private _immunity: {
    sourceId: string;
    value: boolean;
    effect: string;
    condition?: Function;
    sourceAbility?: Ability;
  }[] = [];

  constructor(parentCharacter: Character) {
    this._character = parentCharacter;
  }

  /** An initializer function that resets various properties */
  public initialize() {
    this._debuffs = [];
    this._buffs = [];
    this._statusEffects = [];
  }

  /** Removes any effects that shouldnt be present any more after the turn has ended */
  public endOfTurn() {
    const { debuffsRemoved } = this.debuffs.reduce(
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

        if (debuff.duration <= 0 && debuff.name) {
          acc.debuffsRemoved.push(debuff.name);
        }
        return acc;
      },
      { debuffsRemoved: [] }
    );

    const { buffsRemoved } = this.buffs.reduce(
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

        if (buff.duration <= 0 && buff.name) {
          acc.buffsRemoved.push(buff.name);
        }
        return acc;
      },
      { buffsRemoved: [] }
    );

    const { statusEffectsRemoved } = this._statusEffects.reduce(
      (
        acc: {
          statusEffectsRemoved: tStatusEffect[];
        },
        statusEffect: iStatusEffect
      ) => {
        if (statusEffect.isNew) {
          statusEffect.isNew = false;
        } else {
          statusEffect.duration--;
        }

        // if (statusEffect.duration <= 0) {
        //   acc.statusEffectsRemoved.push(statusEffect);
        // }
        return acc;
      },
      { statusEffectsRemoved: [] }
    );

    debuffsRemoved.forEach((debuff) => {
      this.removeDebuff(debuff);
    });
    buffsRemoved.forEach((buff) => {
      this.removeBuff(buff);
    });
    statusEffectsRemoved.forEach((effect) => {
      this.removeStatusEffect(effect);
    });
    // buffsRemoved.forEach((buff) => {
    //   logs.push(...this.statusEffect.removeBuff(buff));
    // });
  }

  /* A list of debuffs currently on the character */
  public get debuffs() {
    return this._debuffs;
  }

  /* A list of buffs currently on the character */
  public get buffs() {
    return this._buffs;
  }

  /* A list of status effects currently on the character */
  public get statusEffects() {
    return this._statusEffects;
  }

  /** Checks to see if the character has any of the listed debuffs
   * @param debuffs - The list of debuffs to check. If an array, checks that ALL of the ones listed are present
   * @param duration - The duration to check if there are any remaining turns left on the debuff
   * @param stacks - The number to check if there are at least this many stacks of the given buffs
   * @returns true if the character has the debuffs
   */
  public hasDebuff(
    debuffs: tDebuff | tDebuff[] | iDebuff | iDebuff[] | null,
    duration?: number,
    stacks?: number
  ): boolean {
    if (Array.isArray(debuffs)) {
      return (debuffs as (tDebuff | iDebuff)[]).every((x) =>
        this.hasDebuff(x, duration)
      );
    } else {
      let stacksCount = 0;
      return this.debuffs.some((d) => {
        if (typeof debuffs === "string") {
          if (d.name === debuffs) {
            if (duration) {
              return duration <= d.duration;
            } else if (stacks) {
              stacksCount++;
              return stacks <= stacksCount;
            }
            return true;
          }
          return false;
        } else {
          return d.id === debuffs?.id;
        }
      });
    }
  }

  /** Checks to see if the character has any of the listed buffs
   * @param buffs - The list of buffs to check. If an array, checks that ALL of the ones listed are present
   * @param duration - The duration to check if there are any remaining turns left on the buff
   * @param stacks - The number to check if there are at least this many stacks of the given buffs
   * @param isNew - Checks if the buff is new this turn or not
   * @returns true if the character has the buffs
   */
  public hasBuff(
    buffs: tBuff | tBuff[] | iBuff | iBuff[] | null,
    duration?: number,
    stacks?: number,
    isNew?: boolean
  ) {
    if (Array.isArray(buffs)) {
      return (buffs as (tBuff | iBuff)[]).every((x) =>
        this.hasBuff(x, duration, stacks, isNew)
      );
    } else {
      let stacksCount = 0;
      return this.buffs.some((b) => {
        if (typeof buffs === "string") {
          if (b.name === buffs) {
            if (duration) {
              return duration <= b.duration;
            } else if (stacks) {
              stacksCount++;
              return stacks <= stacksCount;
            } else if (isNew !== undefined) {
              return b.isNew === isNew;
            }
            return true;
          }
          return false;
        } else {
          return b.id === buffs?.id;
        }
      });
    }
  }

  /** Checks to see if the character has any of the listed status effects
   * @param statusEffects - The list of status effects to check. If an array, checks that ALL of the ones listed are present
   * @param duration - The duration to check if there are any remaining turns left on the debuff
   */
  public hasStatusEffect(
    statusEffects:
      | tStatusEffect
      | tStatusEffect[]
      | iStatusEffect
      | iStatusEffect[],
    duration?: number
  ): boolean {
    if (Array.isArray(statusEffects)) {
      return (statusEffects as (tStatusEffect | iStatusEffect)[]).every((x) =>
        this.hasStatusEffect(x, duration)
      );
    } else {
      return this._statusEffects.some((d) => {
        if (typeof statusEffects === "string") {
          if (d.name === statusEffects) {
            if (duration) {
              return duration <= d.duration;
            }
            return true;
          }
          return false;
        } else {
          return d.id === statusEffects.id;
        }
      });
    }
  }

  /** Changes the duration of all stacks of a particular status effect
   * @param effect - The name of the effect that should be changed
   * @param duration - The duration to change the effect to
   * @param type - The type of effect (buff, debuff, or status effect)
   * @param srcAbility - The source ability that is causing the effect to be reset
   */
  public resetDuration(
    effect: iStatusEffect["name"],
    duration: number,
    type: "buff" | "debuff" | "statusEffect",
    srcAbility?: Ability
  ) {
    let shouldLog: {
      name: string;
      duration: number;
      sourceAbility?: { id: string; name: string; text: string };
    }[] = [];

    [...this._buffs, ...this._debuffs, ...this._statusEffects].forEach(
      (statusEffect) => {
        if (statusEffect.name === effect) {
          statusEffect.duration = duration;
          shouldLog.push({
            name: statusEffect.name ?? "",
            duration: statusEffect.duration,
            sourceAbility: statusEffect.sourceAbility?.sanitize(),
          });
        }
      }
    );

    if (shouldLog.length > 0) {
      this._character.gameEngine.addLogs({
        characterLogData: this._character.getLogs(),
        statusEffects: {
          type,
          list: shouldLog,
          reset: duration,
        },
        ability: { source: srcAbility?.sanitize() },
      });
    }
  }

  /** Checks to see if the character is immune to the effect
   * @param statusEffect - The status effect to check
   * @returns true if the character is currently immune to the effect
   */
  public isImmune(statusEffect: iStatusEffect | string): boolean {
    if (typeof statusEffect === "string") {
      return this.immunity[statusEffect]?.value ?? false;
    } else {
      return this.immunity[statusEffect?.name ?? ""]?.value ?? false;
    }
  }

  /** Adds a buff to the character
   * @param buff - The buff being added
   * @param scalar - The amount the duration should be scaled by (usually 1)
   * @param sourceAbility - The source ability that is adding the buff
   * @param maxStacks - The maximum amount of stacks that can be applied for this debuff
   */
  public addBuff(
    buff: iBuff | iBuff[],
    scalar: number,
    sourceAbility: Ability | null,
    maxStacks?: number
  ) {
    const hasBuffImmunity = this.hasDebuff("Buff Immunity");
    const hasConfuse = this.hasDebuff("Confuse");

    if (Array.isArray(buff)) {
      buff.forEach((someBuff) => {
        this.addBuff(someBuff, scalar, sourceAbility);
      });
    } else if ((hasBuffImmunity || hasConfuse) && !buff.cantPrevent) {
      let preventedSource = "";
      if (hasBuffImmunity) {
        preventedSource = "Buff Immunity";
      } else if (hasConfuse) {
        preventedSource = "Confused";
      }

      this._character.gameEngine.addLogs({
        characterLogData: this._character.getLogs(),
        statusEffects: {
          prevented: preventedSource,
          list: [
            {
              name: buff.name ?? "",
              duration: buff.duration,
              sourceAbility: buff.sourceAbility?.sanitize(),
            },
          ],
          type: "buff",
        },
      });
    } else {
      const logAndDispatch = () => {
        this._character.gameEngine.addLogs({
          characterLogData: this._character.getLogs(),
          ability: { source: sourceAbility?.sanitize() },
          statusEffects: {
            type: "buff",
            list: [
              {
                name: buff.name ?? "",
                duration: buff.duration,
                sourceAbility: buff.sourceAbility?.sanitize(),
              },
            ],
            duration: buff.duration,
          },
        });

        this._character.dispatchEvent("buffed", { buff });
      };

      if (this.isImmune(buff)) {
        this._character.gameEngine.addLogs({
          characterLogData: this._character.getLogs(),
          statusEffects: {
            type: "buff",
            immune: true,
            list: [
              {
                name: buff.name ?? "",
                duration: buff.duration,
                sourceAbility: buff.sourceAbility?.sanitize(),
              },
            ],
          },
        });
      } else if (this.hasBuff(buff.name, undefined, maxStacks)) {
        if (buff.name === "Protection Up") {
          if (buff.isStackable) {
            this.buffs.push(buff);
            logAndDispatch();
            return;
          } else {
            const match = this.buffs.find(
              (b) => b.sourceAbility === buff.sourceAbility
            );

            if (match) {
              match.value = Math.max(buff?.value ?? 0, match?.value ?? 0);
              match.duration = Math.max(
                buff?.duration ?? 0,
                match?.duration ?? 0
              );
              logAndDispatch();
              return;
            }
          }
        }

        this.buffs.forEach((b) => {
          if (b.name === buff.name) {
            this.resetDuration(
              buff.name,
              Math.max(b.duration, buff.duration),
              "buff",
              sourceAbility ?? undefined
            );
            this._character.dispatchEvent("buffed", { buff });
          }
        });
      }

      this._buffs.push({
        ..._.cloneDeep(buff),
        isNew: true,
      });
      logAndDispatch();
    }
  }

  /** Removes a buff from the character
   * @param buff - The buff being removed
   * @param character - The character that is causing the removal
   * @param sourceAbility - The ability that is causing the removal
   */
  public removeBuff(
    buff: iBuff | iBuff[] | tBuff | tBuff[] | null,
    character?: Character,
    sourceAbility?: Ability
  ) {
    const listOfRemovedBuffs: iBuff[] = [];
    if (Array.isArray(buff)) {
      buff.forEach((b) => this.removeBuff(b, character, sourceAbility));
    } else {
      let buffToRemove: iBuff | null = null;
      if (typeof buff === "string") {
        buffToRemove = {
          name: buff,
          id: uuid(),
          duration: 1,
          sourceAbility: sourceAbility ?? null,
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
          if (b.cantDispel && !this._character.isSelf(character)) {
            return true;
          }
          listOfRemovedBuffs.push(b);
          return false;
        }
        return true;
      });

      if (listOfRemovedBuffs.length > 0) {
        if (character && !this._character.isSelf(character)) {
          //opponent removed them
          this._character.gameEngine.addLogs({
            characterLogData: character.getLogs(),
            targetLogData: this._character.getLogs(),
            ability: { source: sourceAbility?.sanitize() },
            statusEffects: {
              type: "buff",
              list: listOfRemovedBuffs.map((b) => {
                return {
                  name: b.name ?? "",
                  duration: b.duration,
                  sourceAbility: b.sourceAbility?.sanitize(),
                };
              }),
              removed: true,
            },
          });
        } else {
          //was naturally removed
          this._character.gameEngine.addLogs(
            {
              characterLogData: this._character.getLogs(),
              ability: { source: sourceAbility?.sanitize() },
              statusEffects: {
                type: "buff",
                list: listOfRemovedBuffs.map((b) => {
                  return {
                    name: b.name ?? "",
                    duration: b.duration,
                    sourceAbility: b.sourceAbility?.sanitize(),
                  };
                }),
                removed: true,
              },
            },
            character == undefined
          );
        }

        this._character.dispatchEvent("dispel", {
          effects: listOfRemovedBuffs,
        });
      }
    }
  }

  /** Inflicts debuffs on the target character
   * @param debuffs - A list of debuffs to be added
   * @param targetCharacter - The character receiving the debuffs
   * @param scalar - The amount the duration should be scaled by (usually 1)
   * @param sourceAbility - The source ability that is adding the debuff
   * @param maxStacks - The maximum amount of stacks that can be applied for this debuff
   */
  public inflictDebuff(
    debuffs: iDebuff[],
    targetCharacter: Character,
    scalar: number = 1,
    sourceAbility?: Ability | null,
    maxStacks?: number
  ) {
    if (targetCharacter.isDead) {
      return;
    }
    debuffs.forEach((debuff) => {
      if (targetCharacter.statusEffect.isImmune(debuff)) {
        this._character.gameEngine.addLogs({
          characterLogData: targetCharacter.getLogs(),
          statusEffects: {
            type: "debuff",
            immune: true,
            list: [
              {
                name: debuff.name ?? "",
                duration: debuff.duration,
                sourceAbility: debuff.sourceAbility?.sanitize(),
              },
            ],
          },
        });
      } else if (
        !targetCharacter.statusEffect.hasDebuff(
          debuff.name,
          debuff.duration,
          maxStacks
        ) ||
        debuff.isStackable
      ) {
        const resistedChance = Math.max(
          targetCharacter.stats.tenacity - this._character.stats.potency,
          0.15
        );

        if (
          !chanceOfEvent(resistedChance) ||
          debuff.cantResist ||
          debuff.name === "Tenacity Down" ||
          this._character.isSelf(targetCharacter)
        ) {
          if (chanceOfEvent(debuff.chance ?? 0)) {
            return;
          }

          const newDuration = debuff.duration * scalar;
          if (
            !targetCharacter.statusEffect.hasDebuff(
              debuff?.name,
              newDuration
            ) ||
            debuff.isStackable
          ) {
            const match = targetCharacter.statusEffect.debuffs.find(
              (x) => x.name === debuff.name
            );

            if (debuff.isStackable || !match) {
              targetCharacter.statusEffect.debuffs.push({
                ..._.cloneDeep(debuff), //todo this loses the source ability
                duration: newDuration,
                isNew: true,
              });
            } else {
              match.duration = newDuration;
              match.isNew = true;
            }

            this._character.gameEngine.addLogs({
              characterLogData: targetCharacter.getLogs(),
              statusEffects: {
                list: [
                  {
                    name: debuff.name ?? "",
                    duration: debuff.duration,
                    sourceAbility: debuff.sourceAbility?.sanitize(),
                  },
                ],
                duration: newDuration,
                type: "debuff",
              },
              ability: {
                source: sourceAbility?.sanitize(),
              },
            });
            this._character.dispatchEvent("inflicted", { effect: debuff.name });
          }
        } else {
          this._character.gameEngine.addLogs({
            characterLogData: targetCharacter.getLogs(),
            statusEffects: {
              resisted: true,
              list: [
                {
                  name: debuff.name ?? "",
                  duration: debuff.duration,
                  sourceAbility: debuff.sourceAbility?.sanitize(),
                },
              ],
              type: "debuff",
            },
          });
          targetCharacter.dispatchEvent("resisted", { effect: debuff.name });
        }
      }
    });
  }

  /** Removes a debuff from the character
   * @param debuff - The debuff being removed
   * @param opponent - The character that is causing the removal
   * @param sourceAbility - The ability that is causing the removal
   */
  public removeDebuff(
    debuff: iDebuff | iDebuff[] | tDebuff | tDebuff[] | null,
    opponent?: Character,
    sourceAbility?: Ability
  ) {
    const listOfRemovedDebuffs: iDebuff[] = [];

    if (Array.isArray(debuff)) {
      debuff.forEach((d) => this.removeDebuff(d, opponent, sourceAbility));
    } else {
      let debuffData: iDebuff | null = null;
      if (typeof debuff === "string") {
        debuffData = {
          name: debuff,
          id: uuid(),
          duration: 1,
          sourceAbility: sourceAbility ?? null,
        };
      } else {
        debuffData = debuff;
      }

      this._debuffs = _.cloneDeep(this._debuffs).filter((debuff: iDebuff) => {
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
        if (opponent && !this._character.isSelf(opponent)) {
          this._character.gameEngine.addLogs(
            {
              characterLogData: opponent.getLogs(),
              targetLogData: this._character.getLogs(),
              ability: { source: sourceAbility?.sanitize() },
              statusEffects: {
                list: listOfRemovedDebuffs.map((debuff) => {
                  return {
                    name: debuff.name ?? "",
                    duration: debuff.duration,
                    sourceAbility: debuff.sourceAbility?.sanitize(),
                  };
                }),
                removed: true,
                type: "debuff",
              },
            },
            false
          );
        } else {
          this._character.gameEngine.addLogs(
            {
              characterLogData: this._character.getLogs(),
              ability: { source: sourceAbility?.sanitize() },
              statusEffects: {
                list: listOfRemovedDebuffs.map((debuff) => {
                  return {
                    name: debuff.name ?? "",
                    duration: debuff.duration,
                    sourceAbility: debuff.sourceAbility?.sanitize(),
                  };
                }),
                removed: true,
                type: "debuff",
              },
            },
            opponent === undefined
          );
        }
      }
    }
  }

  /** Adds a status effect to the character
   * @param effect - The status effect being added
   * @param srcAbility - The source ability that is adding the buff
   */
  public addStatusEffect(
    effect: iStatusEffect | iStatusEffect[],
    srcAbility: Ability | null
  ) {
    if (Array.isArray(effect)) {
      effect.forEach((e) => this.addStatusEffect(e, srcAbility));
    } else {
      if (
        (!this.hasStatusEffect(effect, effect.duration) ||
          effect.isStackable) &&
        !this.isImmune(effect)
      ) {
        const match = this._statusEffects.find((x) => x.name === effect.name);

        if (effect.isStackable || !match) {
          this._statusEffects.push({
            ..._.cloneDeep(effect),
            isNew: true,
          });
        } else {
          match.duration = effect.duration;
          match.isNew = true;
        }
        this._character.dispatchEvent("gainStatusEffect", {
          statusEffect: effect,
        });

        this._character.gameEngine.addLogs({
          characterLogData: this._character.getLogs(),
          statusEffects: {
            list: [
              {
                name: effect.name ?? "",
                duration: effect.duration,
                sourceAbility: effect.sourceAbility?.sanitize(),
              },
            ],
            type: "statusEffect",
            duration: effect.duration,
          },
          ability: {
            source: srcAbility?.sanitize(),
          },
        });
      }
    }
  }

  /** Removes a status effect from the character
   * @param statusEffect - The status effect being removed
   * @param srcAbility - The ability that is causing the removal
   * @param srcCharacter - The character that is causing the removal
   */
  public removeStatusEffect(
    statusEffect:
      | iStatusEffect
      | iStatusEffect[]
      | tStatusEffect
      | tStatusEffect[]
      | null,
    srcAbility?: Ability,
    srcCharacter?: Character
  ) {
    if (Array.isArray(statusEffect)) {
      statusEffect.forEach((e) => this.removeStatusEffect(e, srcAbility));
    } else {
      const listOfRemovedStatusEffects: iStatusEffect[] = [];
      let statusEffectData: iStatusEffect | null = null;
      if (typeof statusEffect === "string") {
        statusEffectData = {
          name: statusEffect,
          id: uuid(),
          duration: 1,
          sourceAbility: srcAbility ?? null,
        };
      } else {
        statusEffectData = statusEffect;
      }

      this._statusEffects = _.cloneDeep(this._statusEffects).filter(
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
        this._character.gameEngine.addLogs({
          characterLogData: srcCharacter?.getLogs(),
          targetLogData: this._character.getLogs(),
          ability: { source: srcAbility?.sanitize() },
          statusEffects: {
            list: listOfRemovedStatusEffects.map((effect) => {
              return {
                name: effect.name ?? "",
                duration: effect.duration,
                sourceAbility: effect.sourceAbility?.sanitize(),
              };
            }),
            removed: true,
            type: "statusEffect",
          },
        });
      }
    }
  }

  /** A mapping of status effects that the character cannot gain */
  public get immunity(): Record<
    string,
    { value: boolean; sourceAbility?: Ability }
  > {
    return this._immunity.reduce(
      (map, el) => {
        if (el.effect in map) {
          if (this._character.checkCondition(el.condition)) {
            map[el.effect] = { value: true, sourceAbility: el.sourceAbility };
          }
        }
        return map;
      },
      {
        Daze: {
          value: this.hasStatusEffect("Guard"),
          sourceAbility: new Ability(
            "Guard",
            "Guard",
            "Can't be Critically Hit, immune to Daze and Stun, +25% Critical Chance",
            this._character
          ),
        },
        Stun: {
          value: this.hasStatusEffect("Guard"),
          sourceAbility: new Ability(
            "Guard",
            "Guard",
            "Can't be Critically Hit, immune to Daze and Stun, +25% Critical Chance",
            this._character
          ),
        },
        Assisting: {
          value: this.hasDebuff("Daze") || this.hasDebuff("Stun"),
          sourceAbility: new Ability(
            this.hasDebuff("Daze") ? "Daze" : "Stun",
            this.hasDebuff("Daze") ? "Daze" : "Stun",
            "Can't assist, counter attack, or gain bonus Turn Meter",
            this._character
          ),
        },
        CounterAttacking: {
          value: this.hasDebuff("Daze") || this.hasDebuff("Stun"),
          sourceAbility: new Ability(
            this.hasDebuff("Daze") ? "Daze" : "Stun",
            this.hasDebuff("Daze") ? "Daze" : "Stun",
            "Can't assist, counter attack, or gain bonus Turn Meter",
            this._character
          ),
        },
        "Jedi Lessons": {
          value: this.hasBuff("Jedi Legacy"),
          sourceAbility: new Ability(
            "Jedi Legacy",
            "Jedi Legacy",
            "Can't gain Jedi Lessons because this unit has Jedi Legacy",
            this._character
          ),
        },
      }
    );
  }

  public sanitizeImmunity(): Record<
    string,
    {
      value: boolean;
      sourceAbility?: { id: string; name: string; text: string };
    }
  > {
    const map = {};
    Object.entries(this.immunity).forEach(([key, value]) => {
      map[key] = {
        value: value.value,
        sourceAbility: value.sourceAbility?.sanitize(),
      };
    });
    return map;
  }

  /**
   * Add an effect that the character is now immune to
   * @param sourceId - The unique key that is used to reference the immunity
   * @param effect - The effect that the user is now immune to
   * @param condition - A condition to check if the immune effect should be added
   * @param sourceAbility - The ability source that is adding the immune effect
   */
  public addImmune(
    sourceId: string,
    effect: string,
    condition?: Function,
    sourceAbility?: Ability
  ) {
    this._immunity.push({
      sourceId,
      value: true,
      effect,
      condition,
      sourceAbility,
    });
  }

  /**
   * Remove an existing effect that the character is now no longer immune to
   * @param sourceId - The unique key that is used to reference the immunity
   * @param effect - The effect that the user should no longer be immune to
   */
  public removeImmune(sourceId: string, effect: string) {
    const index = this._immunity.findIndex(
      (x) => x.sourceId === sourceId && effect === x.effect
    );

    if (index > -1) {
      this._immunity.splice(index, 1);
    }
  }

  /** Resets all temporary status effect lists and immunities  */
  public reset() {
    this._buffs = [];
    this._debuffs = [];
    this._statusEffects = [];
    this._immunity = [];
  }
}

/** An interface used to hold various buff data */
export interface iBuff extends iStatusEffect {
  name: tBuff | null;
}

/** An interface used to hold various debuff data */
export interface iDebuff extends iStatusEffect {
  name: tDebuff | null;
}
/** A type for all of the available debuff names */
export type tDebuff =
  | "Ability Block"
  | "Accuracy Down"
  | "Anguish" //todo
  | "Blind"
  | "Breach" //
  | "Buff Immunity"
  | "Burning" //
  | "Buzz Droids" //
  | "Captive" //
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
  | "Torture" //
  | "Useful Pawn" //
  | "Vulnerable"
  | "all"; //

/** A type for all of the available buff names */
export type tBuff =
  | "Accuracy Up"
  | "Advantage"
  | "Call to Action"
  | "Critical Chance Up"
  | "Critical Damage Up"
  | "Critical Hit Immunity"
  | "Defense Penetration Up"
  | "Defense Up"
  | "Evasion Up"
  | "Health Up"
  | "Health Steal Up"
  | "Jedi Lessons"
  | "Jedi Legacy"
  | "Potency Up"
  | "Protection Up"
  | "Offense Up"
  | "Speed Up"
  | "Stealth"
  | "Taunt"
  | "Tenacity Up"
  | "TM Decrease"
  | "TM Increase"
  | "Translation"
  | "all";

/** A type for all of the available status effect names */
export type tStatusEffect = "Guard" | "Armor Shred" | "Advance" | "Cover";

/** A generic status effect, usually a buff or debuff, that contains various data used to apply it correctly */
export interface iStatusEffect {
  /** The name of the effect */
  name:
    | tBuff
    | tDebuff
    | tStatusEffect
    | "Cooldown Increase"
    | "Cooldown Decrease"
    | null;
  /** How many turns the effect will last */
  duration: number;
  /** Determines if the effect is new so that it will not be removed at the end of the turn */
  isNew?: boolean;
  /** The likelihood of the effect being applied (as decimal) */
  chance?: number;
  /** Determines if the effect cannot be resisted */
  cantResist?: boolean;
  /** Determines if the effect cannot be prevented (such as with Buff Immunity) */
  cantPrevent?: boolean;
  /** Determines if the effect cannot be dispelled */
  cantDispel?: boolean;
  /** Determines if the effect is unique */
  unique?: boolean;
  /** Unique identifier */
  id: string;
  /** The original source of the effect */
  sourceAbility: Ability | null;
  /** Determines if more than one of the effect can be applied to a target */
  isStackable?: boolean;
  /** Generic value for holding information, such as the amount for Protection Up */
  value?: number;
  /** The maximum number of stacks that can be present */
  // maxStacks?: number;
}
