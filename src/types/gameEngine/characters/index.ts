import { round } from "lodash";

import { chanceOfEvent, randomNumber, unvue } from "utils";

import { iStats, iStatsCheck, Stats } from "./stats";
import { StatusEffect } from "./statusEffects";
import { Ability, ActiveAbility } from "./abilities";
import { IUnit, Unit } from "types/unit";
import characterList from "../characterScripts";
import { Log } from "./log";

import { gameEngine } from "../gameEngine";

export class Character {
  public stats: Stats;
  public statusEffect: StatusEffect;
  public id: string;
  public name: string;
  private _tm: number = 0;
  private basicAbility: ActiveAbility | null = null;
  private specialAbilities: ActiveAbility[] = [];
  // private _activeAbilities: (iBasicAbility | iSpecialAbility)[] = [];
  // private _uniqueAbilities: iUniqueAbility[] = [];
  // private _leaderAbility: iUniqueAbility | null = null;
  public owner: string;
  private _alignment: IUnit["alignment"];
  // private _role: IUnit["role"];
  // private _primaryStat: IUnit["primaryStat"];
  private _categories: string[];
  // private _triggers: iTrigger[] = [];
  public teammates: Character[] = [];
  public opponents: Character[] = [];
  public isLeader: boolean = false;

  constructor(data: Unit, owner: string) {
    this.stats = new Stats(data, this);
    this.statusEffect = new StatusEffect(this);

    this.name = data.name;
    this.id = data.id;
    this.owner = owner;
    this._alignment = data.alignment;
    this._categories = data.categories;

    const abilityList = characterList[this.id];
    data.abilities.forEach((x) => {
      const abilityClass = abilityList.get(x.id);
      if (abilityClass) {
        if (x.id.includes("basic")) {
          this.basicAbility = new abilityClass(this);
        } else {
          this.specialAbilities.push(new abilityClass(this));
        }
      }
    });
    // this._role = data.role;
    // this._primaryStat = data.primaryStat;
  }

  /** Checks if the provided character is the same as this character */
  public isSelf(char?: Character) {
    return this.id === char?.id && this.owner === char?.owner;
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
   *
   * @amount - The amount the turn meter will be changed. Positive number will add turn meter, negative number will remove turn meter
   */
  public changeTurnMeter(amount: number, srcAbility?: ActiveAbility) {
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

    // return new Log({
    //   character: this,
    //   effects: {
    //     turnMeter: round(amount > 0 ? diff : 0 - diff, 2),
    //   },
    //   ability: {
    //     source: srcAbility,
    //   },
    // });
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

  public reset(teammates: Character[], opponents: Character[]) {
    // this._triggers = [];
    this.teammates = teammates;
    this.opponents = opponents;
  }
  public initialize() {
    this.stats.initialize();
    this.specialAbilities.forEach((ability) => {
      ability.initialize();
    });
    this.statusEffect.initialize();

    this._tm = 0;

    // this._uniqueAbilities.forEach((ability) => {
    //   ability.triggers?.forEach((trigger) => {
    //     const { targetList } = this.findTargets(trigger?.targets ?? {});
    //     targetList.forEach((target) => {
    //       target.addTrigger(trigger, ability as iAbility);
    //     });
    //   });
    // });

    // if (this.isLeader && this._leaderAbility) {
    //   this._leaderAbility.triggers?.forEach((trigger) => {
    //     const { targetList } = this.findTargets(trigger?.targets ?? {});
    //     targetList.forEach((target) => {
    //       target.addTrigger(trigger, this._leaderAbility as iAbility);
    //     });
    //   });
    // }

    // this._triggers.forEach((trigger) => {
    //   if (trigger?.triggerData?.count !== undefined) {
    //     trigger.triggerData.count = trigger.triggerData.limit;
    //   }
    //   if (trigger.triggerData?.units) {
    //     trigger.triggerData.units = [];
    //   }
    // });
  }

  /** Is the character dead */
  public get isDead() {
    return this.stats.health <= 0;
  }
  /** Checks if the character is dead and if so removes any related effects todo */
  private checkDeath(targetCharacter: Character) {
    // if (targetCharacter.stats.health <= 0) {
    //   logs
    //     .push
    //     // new Log({
    //     //   character: this,
    //     //   target: targetCharacter,
    //     //   effects: { defeated: true },
    //     // })
    //     ();
    //   // logs.push(
    //   //   ...targetCharacter.executePassiveTriggers([
    //   //     {
    //   //       triggerType: "death",
    //   //     },
    //   //   ])
    //   // );
    //   // targetCharacter.removePassiveTriggers();
    // }
    // return logs;
  }
  /** Does the character have any effect that is forcing them to be targeted */
  public get hasTauntEffect(): boolean {
    return (
      this.statusEffect.hasBuff("Taunt") ||
      this.statusEffect.hasDebuff(["Marked", "Deathmark"])
    );
  }

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

      // if (ability) {
      //   logs.push(...this.useAbility(ability));
      // } else {
      //   console.warn("no ability");
      // }
    }

    // return {
    //   logs,
    //   endOfTurnLogs: this.endOfTurn(ability),
    // };
  }

  public startOfTurn() {
    this.statusEffect.debuffs.forEach((debuff) => {
      debuff.isNew = false;
    });
    this.statusEffect.buffs.forEach((debuff) => {
      debuff.isNew = false;
    });
  }

  public endOfTurn(ability: ActiveAbility | null) {
    this.statusEffect.endOfTurn();
    // const logs: Log[] = [];
    // const { debuffsRemoved } = this.statusEffect.debuffs.reduce(
    //   (
    //     acc: {
    //       debuffsRemoved: tDebuff[];
    //     },
    //     debuff: iDebuff
    //   ) => {
    //     if (debuff.isNew) {
    //       debuff.isNew = false;
    //     } else {
    //       debuff.duration--;
    //     }

    //     if (debuff.duration <= 0) {
    //       acc.debuffsRemoved.push(debuff.name);
    //     }
    //     return acc;
    //   },
    //   { debuffsRemoved: [] }
    // );

    // const { buffsRemoved } = this.statusEffect.buffs.reduce(
    //   (
    //     acc: {
    //       buffsRemoved: tBuff[];
    //     },
    //     buff: iBuff
    //   ) => {
    //     if (buff.isNew) {
    //       buff.isNew = false;
    //     } else {
    //       buff.duration--;
    //     }

    //     if (buff.duration <= 0) {
    //       acc.buffsRemoved.push(buff.name);
    //     }
    //     return acc;
    //   },
    //   { buffsRemoved: [] }
    // );

    // debuffsRemoved.forEach((debuff) => {
    //   logs.push(...this.statusEffect.removeDebuff(debuff));
    // });
    // buffsRemoved.forEach((buff) => {
    //   logs.push(...this.statusEffect.removeBuff(buff));
    // });

    this.specialAbilities.forEach((a) => {
      if (ability?.id !== a.id && "turnsRemaining" in a) {
        a.turnsRemaining = Math.max(a.turnsRemaining - 1, 0);
      }
    });

    // this._tempStats = this._tempStats.reduce(
    //   (list: iStatsCheck[], t: iStatsCheck) => {
    //     if (t.expires && t.expires.frequency === "turn") {
    //       if (t.expires.count > 1) {
    //         list.push(t);
    //       }
    //     } else {
    //       list.push(t);
    //     }
    //     return list;
    //   },
    //   []
    // );

    // return logs;
  }

  public chooseAbility(abilityId?: string): ActiveAbility | null {
    if (this.statusEffect.hasDebuff("Stun")) {
      return null;
    } else if (this.statusEffect.hasDebuff("Ability Block")) {
      return this.basicAbility;
    } else if (abilityId === this.basicAbility?.id) {
      return this.basicAbility;
    } else if (this.specialAbilities.every((a) => a.turnsRemaining > 0)) {
      return this.basicAbility;
    }

    const ability = this.specialAbilities.find((a) => {
      if (abilityId) {
        return a.id === abilityId;
      } else {
        return a.turnsRemaining <= 0;
      }
    });

    if (ability) {
      ability.turnsRemaining = ability.cooldown;
    }
    return ability ?? null;
  }

  /** Heals the character for a determined amount of health or protection
   *
   * @healData (iEffect["heal"]) - The data that determines how much and what type of healing to do
   * @ability (iGeneralAbility | null) - The ability that has the heal effect
   * @amountSource (number) - The amount to be healed
   */
  // public heal(
  //   healData: iEffect["heal"],
  //   ability?: iGeneralAbility | null,
  //   amountSource?: number
  // ): Log[] {
  //   const logs: Log[] = [];

  //   if (healData && !this.isDead) {
  //     const { healthType, amountType, amount: healAmount } = healData;

  //     if (!amountSource) {
  //       amountSource =
  //         healthType === "health"
  //           ? this.stats.maxHealth
  //           : this.stats.maxProtection;
  //     }

  //     const maxStat =
  //       healthType === "health"
  //         ? this.stats.maxHealth
  //         : this.stats.maxProtection;

  //     const finalAmount =
  //       amountType === "multiplicative"
  //         ? (healAmount ?? 1) * amountSource
  //         : healAmount ?? 0;

  //     let diff = 0;
  //     if (this[healthType] + finalAmount > maxStat) {
  //       diff = maxStat - this[healthType];
  //     } else {
  //       diff = finalAmount;
  //     }
  //     this[healthType] += finalAmount;

  //     if (diff > 0) {
  //       // logs.push(
  //       //   new Log({
  //       //     character: this,
  //       //     heal: { amount: round(diff), type: healthType },
  //       //     ability: { source: ability as iAbility },
  //       //   })
  //       // );
  //     }
  //   }
  //   return logs;
  // }
  public counterAttack(
    targetCharacter: Character,
    canBeCountered: boolean = true
  ) {
    if (canBeCountered && !targetCharacter.isDead) {
      if (
        chanceOfEvent(this.stats.counterChance * 100) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        // logs.push(
        //   new Log({
        //     character: this,
        //     effects: { countered: true },
        //   })
        // );

        // const basicAbility: iAbility = unvue(this.basicAbility);
        // basicAbility.actions?.forEach((action) => {
        //   action.targets = { filters: [{ primary: true }] };
        // });
        this.basicAbility?.execute();
        // logs.push(
        //   ...this.useAbility(
        //     basicAbility,
        //     {
        //       statToModify: "offense",
        //       amount: this.counterDamage,
        //       modifiedType: "multiplicative",
        //     },
        //     targetCharacter,
        //     false
        //   )
        // );
      }
    }
  }
  /** Recieves damage mitigated by armor
   *
   * @damageType - The type of damage being dealt (physical, special, or true)
   * @damageAmount - The amount of damage being dealt (before armor or other reductions)
   * @armorPen - The amount of armor that is ignored (armor penetration)
   * @critChance - The chance of receving a critical hit
   * @critDamage - The amount to be modified on a critical hit (decimal)
   * @stats - An array of stats to modify the starting stat value
   */
  public receiveDamage(
    damageType: "physical" | "special" | "true",
    damageAmount: number,
    armorPen: number,
    critChance: number,
    critDamage: number,
    stats?: iStatsCheck[]
  ): { isCrit: boolean; damageTotal: number } {
    const { armor, critAvoid } = this.stats.getCombatStats(damageType, stats);
    const modifiedArmor = Math.max(armor - armorPen, 0);
    const damageReduction =
      (modifiedArmor * 100) / (modifiedArmor + 637.5) / 100;
    const damageTaken = damageAmount * (1 - damageReduction);

    const isCrit =
      damageType === "true"
        ? false
        : chanceOfEvent((critChance - critAvoid) * 100);

    const damageTotal = Math.max(
      Math.round(damageTaken * (isCrit ? critDamage : 1)),
      1
    );
    return { isCrit, damageTotal };
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
      return this._alignment === tag;
    } else {
      return tag === this.id;
    }
  }

  public getLogs(): any {
    return {
      name: this.name,
      owner: this.owner,
      health: { current: this.stats.health, max: this.stats.maxHealth },
      protection: {
        current: this.stats.protection,
        max: this.stats.maxProtection,
      },
      activeAbilities: [],
      buffs: [],
      debuffs: [],
      statusEffects: [],
      physical: [],
      special: [],
      general: [],
      // triggers: [],
      otherEffects: { ignoreTaunt: false, immunity: {} },
      turnMeter: this.turnMeter,
    };
    // return {
    //   name: this.name,
    //   owner: this.owner,
    //   health: {
    //     current: round(this.health, 0),
    //     max: round(this.maxHealth, 0),
    //   },
    //   protection: {
    //     current: round(this.protection, 0),
    //     max: round(this.maxProtection, 0),
    //   },
    //   activeAbilities: unvue(this._activeAbilities),
    //   buffs: unvue(this._buffs),
    //   debuffs: unvue(this._debuffs),
    //   statusEffects: unvue(this._statusEffects),
    //   physical: [
    //     {
    //       label: "Offense",
    //       value: round(this.physical.offense, 2),
    //       base: round(this._baseStats.physical.offense, 2),
    //     },
    //     {
    //       label: "Crit Chance",
    //       value: round(this.physical.critChance * 100, 2),
    //       base: round(this._baseStats.physical.critChance * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Armor",
    //       value: round(
    //         (this.physical.armor * 100) / (this.physical.armor + 637.5),
    //         2
    //       ),
    //       base: round(
    //         (this._baseStats.physical.armor * 100) /
    //           (this._baseStats.physical.armor + 637.5),
    //         2
    //       ),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Armor Pen",
    //       value: round(this.physical.armorPen, 2),
    //       base: round(this._baseStats.physical.armorPen, 2),
    //     },
    //     {
    //       label: "Accuracy",
    //       value: round(this.physical.accuracy * 100, 2),
    //       base: round(this._baseStats.physical.accuracy * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Dodge (Evasion)",
    //       value: round(this.physical.dodge * 100, 2),
    //       base: round(this._baseStats.physical.dodge * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Crit Avoidance",
    //       value: round(this.physical.critAvoid * 100, 2),
    //       base: round(this._baseStats.physical.critAvoid * 100, 2),
    //       isPercent: true,
    //     },
    //   ],
    //   special: [
    //     {
    //       label: "Offense",
    //       value: round(this.special.offense, 2),
    //       base: round(this._baseStats.special.offense, 2),
    //     },
    //     {
    //       label: "Crit Chance",
    //       value: round(this.special.critChance * 100, 2),
    //       base: round(this._baseStats.special.critChance * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Resistance",
    //       value: round(
    //         (this.special.armor * 100) / (this.special.armor + 637.5),
    //         2
    //       ),
    //       base: round(
    //         (this._baseStats.special.armor * 100) /
    //           (this._baseStats.special.armor + 637.5),
    //         2
    //       ),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Resistance Pen",
    //       value: round(this.special.armorPen, 2),
    //       base: round(this._baseStats.special.armorPen, 2),
    //     },
    //     {
    //       label: "Accuracy",
    //       value: round(this.special.accuracy * 100, 2),
    //       base: round(this._baseStats.special.accuracy * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Deflection (Evasion)",
    //       value: round(this.special.dodge * 100, 2),
    //       base: round(this._baseStats.special.dodge * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Crit Avoidance",
    //       value: round(this.special.critAvoid * 100, 2),
    //       base: round(this._baseStats.special.critAvoid * 100, 2),
    //       isPercent: true,
    //     },
    //   ],
    //   general: [
    //     {
    //       label: "Speed",
    //       value: round(this.speed, 2),
    //       base: round(this._baseStats.speed, 2),
    //     },
    //     {
    //       label: "Mastery",
    //       value: 0,
    //       base: 0,
    //     },
    //     {
    //       label: "Crit Damage",
    //       value: round(this.critDamage * 100, 2),
    //       base: round(this._baseStats.critDamage * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Tenacity",
    //       value: round(this.tenacity * 100, 2),
    //       base: round(this._baseStats.tenacity * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Potency",
    //       value: round(this.potency * 100, 2),
    //       base: round(this._baseStats.potency * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Health Steal",
    //       value: round(this.stats.healthSteal * 100, 2),
    //       base: round(this.stats._baseStats.healthSteal * 100, 2),
    //       isPercent: true,
    //     },
    //     {
    //       label: "Defense Pen",
    //       value: 0,
    //       base: 0,
    //       isPercent: true,
    //     },
    //     {
    //       label: "Counter Chance",
    //       value: round(this.stats.counterChance * 100, 2),
    //       base: 0,
    //       isPercent: true,
    //     },
    //     {
    //       label: "Counter Damage",
    //       value: round(this.stats.counterDamage * 100, 2),
    //       base: 100,
    //       isPercent: true,
    //     },
    //   ],
    //   triggers: [],
    //   otherEffects: unvue({ ...this.effects, immunity: this.statusEffect.immunity }),
    //   turnMeter: round(this.turnMeter, 0),
    // };
  }
}
