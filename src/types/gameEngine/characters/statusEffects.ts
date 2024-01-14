import { v4 as uuid } from "uuid";

import { Character } from "./index";
import { Ability } from "./abilities";
import { unvue, chanceOfEvent } from "utils";
import statusEffectVue from "@/components/gameEngine/statusEffect.vue";

export class StatusEffect {
  private _buffs: iBuff[] = [];
  private _debuffs: iDebuff[] = [];
  private _statusEffects: iStatusEffect[] = [];
  private _character: Character;

  constructor(parentCharacter: Character) {
    this._character = parentCharacter;
  }

  public initialize() {
    this._debuffs = [];
    this._buffs = [];
    this._statusEffects = [];
  }

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

        if (debuff.duration <= 0) {
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

        if (buff.duration <= 0) {
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

    // debuffsRemoved.forEach((debuff) => {
    //   logs.push(...this.statusEffect.removeDebuff(debuff));
    // });
    // buffsRemoved.forEach((buff) => {
    //   logs.push(...this.statusEffect.removeBuff(buff));
    // });
  }

  /* A list of debuffs */
  public get debuffs() {
    return this._debuffs;
  }
  /* A list of buffs */
  public get buffs() {
    return this._buffs;
  }
  /* A list of status effects */
  public get statusEfects() {
    return this._statusEffects;
  }
  /** Checks to see if the character has any of the listed debuffs
   *
   * @name - The list of debuffs to check. If an array, checks that ALL of the ones listed are present
   * @duration - The duration to check if there are any remaining turns left on the debuff
   */
  public hasDebuff(
    name: tDebuff | tDebuff[] | iDebuff | iDebuff[],
    duration?: number
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tDebuff | iDebuff)[]).every((x) =>
        this.hasDebuff(x, duration)
      );
    } else {
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
   * @name - The list of buffs to check. If an array, checks that ALL of the ones listed are present
   * @duration - The duration to check if there are any remaining turns left on the debuff
   */
  public hasBuff(name: tBuff | tBuff[] | iBuff | iBuff[], duration?: number) {
    if (Array.isArray(name)) {
      return (name as (tBuff | iBuff)[]).every((x) =>
        this.hasBuff(x, duration)
      );
    } else {
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
   * @name - The list of status effects to check. If an array, checks that ALL of the ones listed are present
   * @duration - The duration to check if there are any remaining turns left on the debuff
   */
  public hasStatusEffect(
    name: tStatusEffect | tStatusEffect[] | iStatusEffect | iStatusEffect[],
    duration?: number
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tStatusEffect | iStatusEffect)[]).every((x) =>
        this.hasStatusEffect(x, duration)
      );
    } else {
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
  /** Checks to see if the character is immune to the effect
   *
   * @statusEffect - The status effect to check
   */
  public isImmune(statusEffect: iStatusEffect | tStatusEffect): boolean {
    if (typeof statusEffect === "string") {
      return this.immunity[statusEffect];
    } else {
      return this.immunity[statusEffect.name];
    }
  }
  /** Adds a buff to the character
   *
   * @buff - The buff being added
   * @scalar - The amount the duration should be scaled by (usually 1)
   * @sourceAbility - The source ability that is adding the buff
   */
  public addBuff(
    buff: iBuff | iBuff[],
    scalar: number,
    sourceAbility: Ability | null
  ) {
    if (Array.isArray(buff)) {
      buff.forEach((someBuff) => {
        this.addBuff(someBuff, scalar, sourceAbility);
      });
    } else if (this.hasDebuff("Buff Immunity") && !buff.cantPrevent) {
      return [
        // new Log({
        //   character: this,
        //   statusEffects: { prevented: true, list: [buff], type: "buff" },
        // }),
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
            // new Log({
            //   character: this,
            //   ability: { source: sourceAbility },
            //   statusEffects: {
            //     type: "buff",
            //     list: [buff],
            //     duration: newDuration,
            //   },
            // }),
          ];
        }
      }
    }
    return [];
  }
  /** Removes a buff from the character
   *
   * @buff - The buff being added
   * @character - The character that is causing the removal
   */
  public removeBuff(
    buff: iBuff | iBuff[] | tBuff | tBuff[] | null,
    character?: Character
  ) {
    const listOfRemovedBuffs: iBuff[] = [];
    if (Array.isArray(buff)) {
      buff.forEach((b) => this.removeBuff(b));
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
          // logs.push(
          //   new Log({
          //     character,
          //     target: this,
          //     statusEffects: {
          //       type: "buff",
          //       list: listOfRemovedBuffs,
          //       removed: true,
          //     },
          //   })
          // );
        } else {
          //was naturally removed
          // logs.push(
          //   new Log({
          //     character: this,
          //     statusEffects: {
          //       type: "buff",
          //       list: listOfRemovedBuffs,
          //       removed: true,
          //     },
          //   })
          // );
        }
        // listOfRemovedBuffs.forEach((buff) => {
        //   buff.triggers?.forEach((trigger) => {
        //     if (trigger.triggerType === "expires") {
        //       logs.push(...this.executeTrigger(trigger));
        //     }
        //   });
        // });
      }
    }
    // return logs;
  }
  /** Inflicts debuffs on the target character
   *
   * @debuffs - A list of debuffs to be added
   * @targetCharacter - The character receiving the debuffs
   * @scalar - The amount the duration should be scaled by (usually 1)
   * @sourceAbility - The source ability that is adding the debuff
   */
  private inflictDebuff(
    debuffs: iDebuff[],
    targetCharacter: Character,
    scalar: number = 1,
    sourceAbility?: Ability | null
  ) {
    if (targetCharacter.isDead) {
      return;
    }

    debuffs.forEach((debuff) => {
      if (targetCharacter.statusEffect.isImmune(debuff)) {
        // logs.push(
        //   new Log({
        //     character: targetCharacter,
        //     statusEffects: {
        //       type: "debuff",
        //       immune: true,
        //       list: [debuff],
        //     },
        //   })
        // );
      } else if (
        !targetCharacter.statusEffect.hasDebuff(debuff.name, debuff.duration) ||
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

          if (debuff.name === "TM Decrease") {
            // const log = targetCharacter.changeTurnMeter(
            //   debuff.duration * scalar
            // );
            // if (log) {
            //   logs.push(log);
            // }
          } else {
            const newDuration = debuff.duration * scalar;
            if (
              !targetCharacter.statusEffect.hasDebuff(
                debuff.name,
                newDuration
              ) ||
              debuff.isStackable
            ) {
              const match = targetCharacter.statusEffect.debuffs.find(
                (x) => x.name === debuff.name
              );

              if (debuff.isStackable || !match) {
                targetCharacter.statusEffect.debuffs.push({
                  ...unvue(debuff),
                  duration: newDuration,
                  isNew: true,
                });
              } else {
                match.duration = newDuration;
                match.isNew = true;
              }

              // logs
              //   .push
              // new Log({
              //   character: targetCharacter,
              //   statusEffects: {
              //     list: [debuff],
              //     duration: newDuration,
              //     type: "debuff",
              //   },
              //   ability: {
              //     source: ability,
              //   },
              // })
              // ();
              // logs.push(
              //   ...this.executeTriggers(this._triggers, [
              //     {
              //       triggerType: "inflictDebuff",
              //       ability: ability ?? null,
              //       target: targetCharacter,
              //       debuff,
              //     },
              //   ])
              // );
            }
          }
        } else {
          // logs.push(
          //   new Log({
          //     character: targetCharacter,
          //     statusEffects: { resisted: true, list: [debuff], type: "debuff" },
          //   })
          // );
          // const triggerList: iTriggerData[] = [
          //   {
          //     triggerType: "resistDetrimentalEffect",
          //     debuff,
          //     target: targetCharacter,
          //     ability: ability ?? null,
          //   },
          // ];
          // logs.push(
          //   ...targetCharacter.executeTriggers(
          //     targetCharacter.triggers,
          //     triggerList
          //   )
          // );
          // logs.push(
          //   ...this.executeTriggers(debuff.triggers ?? [], triggerList)
          // );
        }
      }
    });
    // return logs;
  }
  /** Removes a debuff from the character
   *
   * @debuff - The debuff being removed
   * @opponent - The character that is causing the removal
   */
  public removeDebuff(
    debuff: iDebuff | iDebuff[] | tDebuff | tDebuff[] | null,
    opponent?: Character
  ) {
    const listOfRemovedDebuffs: iDebuff[] = [];

    if (Array.isArray(debuff)) {
      debuff.forEach((d) => this.removeDebuff(d));
      // logs.push(
      //   ...(debuff as (iDebuff | tDebuff)[]).reduce(
      //     (arr: Log[], d: iDebuff | tDebuff) => {
      //       arr.push(...this.removeDebuff(d, opponent));
      //       return arr;
      //     },
      //     []
      //   )
      // );
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
        if (opponent && !this._character.isSelf(opponent)) {
          // logs.push(
          //   new Log({
          //     character: opponent,
          //     target: this,
          //     statusEffects: {
          //       list: listOfRemovedDebuffs,
          //       removed: true,
          //       type: "debuff",
          //     },
          //   })
          // );
        } else {
          // logs.push(
          //   new Log({
          //     character: this,
          //     statusEffects: {
          //       list: listOfRemovedDebuffs,
          //       removed: true,
          //       type: "debuff",
          //     },
          //   })
          // );
        }

        // listOfRemovedDebuffs.forEach((buff) => {
        //   buff.triggers?.forEach((trigger) => {
        //     if (trigger.triggerType === "expires") {
        //       // logs.push(...this.executeTrigger(trigger));
        //     }
        //   });
        // });
      }
    }
    // return logs;
  }
  /** Adds a status effect to the character
   *
   * @effect - The status effect being added
   * @sourceAbility - The source ability that is adding the buff
   */
  private addStatusEffect(
    effect: iStatusEffect | iStatusEffect[],
    sourceAbility: Ability | null
  ) {
    if (Array.isArray(effect)) {
      effect.forEach((e) => this.addStatusEffect(e, sourceAbility));
      // return effect.reduce((arr: Log[], e) => {
      //   arr.push(...this.addStatusEffect(e, sourceAbility));
      //   return arr;
      // }, []);
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
        // return [
        // new Log({
        //   character: this,
        //   statusEffects: {
        //     list: [effect],
        //     type: "statusEffect",
        //     duration: effect.duration,
        //   },
        //   ability: {
        //     source: ability,
        //   },
        // }),
        // ];
      }
    }
    // return [];
  }
  /** Removes a status effect from the character
   *
   * @statusEffect - The status effect being removed
   */
  private removeStatusEffect(
    statusEffect:
      | iStatusEffect
      | iStatusEffect[]
      | tStatusEffect
      | tStatusEffect[]
      | null
  ) {
    // const logs: Log[] = [];
    if (Array.isArray(statusEffect)) {
      statusEffect.forEach((e) => this.removeStatusEffect(e));
      // logs.push(
      //   ...(statusEffect as (iStatusEffect | tStatusEffect)[]).reduce(
      //     (arr: Log[], d) => {
      //       arr.push(...this.removeStatusEffect(d));
      //       return arr;
      //     },
      //     []
      //   )
      // );
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
        // logs.push(
        //   new Log({
        //     target: this,
        //     statusEffects: {
        //       list: listOfRemovedStatusEffects,
        //       removed: true,
        //       type: "debuff",
        //     },
        //   })
        // );
        // listOfRemovedStatusEffects.forEach((buff) => {
        //   buff.triggers?.forEach((trigger) => {
        //     if (trigger.triggerType === "expires") {
        //       // logs.push(...this.executeTrigger(trigger));
        //     }
        //   });
        // });
      }
    }
    // return logs;
  }
  /** A mapping of status effects that the character cannot gain */
  public get immunity(): Record<string, boolean> {
    return {};
    // return this._triggers.reduce(
    //   (immuneMapping, trigger) => {
    //     if (trigger.triggerType === "always") {
    //       trigger.actions?.forEach((action) => {
    //         action.effects?.forEach((effect) => {
    //           if (effect.immune) {
    //             if (this.checkCondition(effect.condition, this)) {
    //               effect.immune.negativeStatusEffects?.forEach((x) => {
    //                 immuneMapping[x] = true;
    //               });
    //               effect.immune.positiveStatusEffects?.forEach((x) => {
    //                 immuneMapping[x] = true;
    //               });
    //             }
    //           }
    //         });
    //       });
    //     }
    //     return immuneMapping;
    //   },
    //   {
    //     Daze: this.hasStatusEffect("Guard"),
    //     Stun: this.hasStatusEffect("Guard"),
    //   }
    // );
  }
}

export interface iBuff extends iStatusEffect {
  name: tBuff;
}

export interface iDebuff extends iStatusEffect {
  name: tDebuff;
}

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

export type tBuff =
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
export type tStatusEffect = "Guard";

/** A generic status effect, usually a buff or debuff */
export interface iStatusEffect {
  /** The name of the effect */
  name: tBuff | tDebuff | tStatusEffect;
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
  // cantMiss?: boolean;
  /** Determines if the effect is unique */
  unique?: boolean;
  /** Triggers that will occur at a certain time */
  // triggers?: iTrigger[];
  /** Unique identifier */
  id: string;
  /** The original source of the effect */
  sourceAbility?: Ability | null;
  /** Determines if more than one of the effect can be applied to a target */
  isStackable?: boolean;
  /** How many stacks of the effect the unit has */
  stacks?: number;
  maxStacks?: number;
}
