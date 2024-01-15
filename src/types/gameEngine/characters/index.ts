import { round } from "lodash";

import { chanceOfEvent, randomNumber, unvue } from "utils";

import { iHeal, iStats, iStatsCheck, Stats } from "./stats";
import { StatusEffect } from "./statusEffects";
import { Ability, ActiveAbility, PassiveAbility } from "./abilities";
import { IUnit, Unit } from "types/unit";
import characterList from "../characterScripts";
import { Log, tLogData } from "./log";

import { gameEngine, iCondition } from "../gameEngine";

type tEventType = "resisted" | "inflicted" | "receiveDamage";

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
  // private _role: IUnit["role"];
  // private _primaryStat: IUnit["primaryStat"];
  private _categories: string[];
  // private _triggers: iTrigger[] = [];
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
    // this._role = data.role;
    // this._primaryStat = data.primaryStat;
  }

  /** A unique identifier based on the character id and owner */
  public get uniqueId() {
    return this.id + this.owner;
  }

  /** Checks if the provided character is the same as this character */
  public isSelf(char?: Character) {
    return this.id === char?.id && this.owner === char?.owner;
  }

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
   *
   * @param amount - The amount the turn meter will be changed. Positive number will add turn meter, negative number will remove turn meter
   * @param srcAbility - The ability source that is causing the turn meter to change
   */
  public changeTurnMeter(amount: number, srcAbility?: Ability) {
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
    this.teammates = teammates;
    this.opponents = opponents;
    this._uniqueAbilities.forEach((a) => a.deactivate());
    this._leaderAbility?.deactivate();
    this.stats.reset();
    this.statusEffect.reset();
  }
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

    this._specialAbilities.forEach((a) => {
      if (ability?.id !== a.id && a.turnsRemaining !== null) {
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

  public get hasLeaderAbility() {
    return !!this._leaderAbility;
  }

  /** Heals the character for a determined amount of health or protection
   *
   * @healData - The data that determines how much and what type of healing to do
   * @sourceAbility - The ability that has the heal effect
   * @amountSource - The source value when healing a multiplicative amount (defaults to max value)
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
              statToModify: "offense",
              amount: this.stats.counterDamage,
              modifiedType: "multiplicative",
            },
          ],
          false
        );
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

    this.stats.protection -= damageTotal;
    return { isCrit, damageTotal };
  }

  public dispatchEvent(eventType: tEventType, context: any) {
    this.events.forEach((event) => {
      if (event.eventType === eventType) {
        event.callback(context);
      }
    });
  }

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
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < percent
              : stats.amount > percent;
        } else if (
          stats.statToModify === "protection" &&
          stats.modifiedType === "multiplicative"
        ) {
          const percent = num / this.stats.maxProtection;
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
        immunity: this.statusEffect.immunity,
      }),
      turnMeter: round(this.turnMeter, 0),
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
