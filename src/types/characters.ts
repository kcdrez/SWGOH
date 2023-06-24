import { randomNumber, unvue } from "utils";
import abilities from "types/abilities";
import { round } from "lodash";
import _ from "lodash";

interface iCharacter {
  id: string;
  name: string;
  stats: iStats;
  abilities: string[];
  owner: string;
  alignment: "Light Side" | "Dark Side" | "Neutral";
  categories: string[];
}

export interface iStats {
  maxHealth: number;
  health: number;
  maxProtection: number;
  protection: number;
  speed: number;
  physical: {
    offense: number;
    armor: number;
    armorPen: number;
    critChance: number;
    accuracy: number;
    dodge: number;
    critAvoid: number;
  };
  special: {
    offense: number;
    armor: number;
    armorPen: number;
    critChance: number;
    accuracy: number;
    dodge: number;
    critAvoid: number;
  };
  critDamage: number;
  tenacity: number;
  potency: number;
  healthSteal: number;
}

type tDebuff =
  | "Ability Block"
  | "Accuracy Down"
  | "Anguish" //todo
  | "Blind" //todo
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
  | "Health Steal Down" //
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
  | "TM"
  | "Torture" //
  | "Useful Pawn" //
  | "Vulnerable"
  | "all"; //
type tBuff =
  | "Call to Action"
  | "Defense Up"
  | "Potency Up"
  | "Taunt"
  | "TM"
  | "all";
type tStatusEffect = tDebuff | tBuff;

export interface iStatusEffect {
  name: tStatusEffect;
  duration: number;
  isNew?: boolean;
  chance?: number;
  cantResist?: boolean;
  cantPrevent?: boolean;
  cantDispel?: boolean;
  unique?: boolean;
  expires?: iTarget;
  id: string;
}

export interface iEffects {
  ignoreTaunt: boolean;
}

export interface iAbility {
  id: string;
  turnsRemaining: number;
  name: string;
  cooldown: number;
  targets?: iTarget[];
}

interface iTarget {
  target: {
    tags?: string[];
    allies?: boolean;
    all?: boolean;
    count?: number;
    scale?: "Resisted";
  };
  debuffs?: iStatusEffect[];
  buffs?: iStatusEffect[];
  effects?: iEffect[];
  cantMiss?: boolean;
  damage?: number;
  damageVariance?: number;
  damageType?: "physical" | "special";
}

interface iEffect {
  condition?: {
    debuffs?: tDebuff[];
    buffs?: tBuff[];
    stats?: {
      value: string;
      amount: number;
      type: "flat" | "percent";
      amountType?: "greater" | "less";
    };
    inverted?: boolean;
    isNew?: boolean;
  };
  debuffs?: iStatusEffect[];
  buffs?: iStatusEffect[];
  dispel?: {
    debuffs?: tDebuff[] | tDebuff;
    buffs?: tBuff[] | tBuff;
  };
  cooldown?: {
    id: string;
    amount: number;
    target: "Self" | number;
  };
  recover?: {
    healthType: "health" | "protection";
    type: "percent" | "flat";
    amount: number;
  };
  scale?: string;
}

interface iHistory {
  resisted: number;
}

export class Character {
  private _baseStats: iStats;
  private _name: string;
  private _id: string;
  private _tm: number = 0;
  private _buffs: iStatusEffect[];
  private _debuffs: iStatusEffect[];
  private _abilities: iAbility[];
  private _owner: string;
  private _history: iHistory = {
    resisted: 0,
  };
  private _alignment: iCharacter["alignment"];
  private _categories: string[];

  constructor(data: iCharacter) {
    this._baseStats = data.stats;
    this._name = data.name;
    this._id = data.id;
    this._buffs = [];
    this._debuffs = [];
    this._abilities = data.abilities.map((x: string) => {
      return abilities[this._id][x];
    });
    this._owner = data.owner;
    this._alignment = data.alignment;
    this._categories = data.categories;
  }

  //Stats
  public get maxProtection() {
    return this._baseStats.maxProtection;
  }
  public set maxProtection(val) {
    this._baseStats.maxProtection = val;
  }
  public get maxHealth() {
    const { maxHealth } = this._baseStats;
    if (this.hasDebuff("Health Down")) {
      return maxHealth * 0.8;
    }
    return maxHealth;
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
  }
  public heal(healData: iEffect["recover"]): string[] {
    const logs: string[] = [];

    if (healData) {
      const { healthType, type, amount } = healData;
      const maxAmount =
        healthType === "health" ? this.maxHealth : this.maxProtection;
      const finalAmount = type === "percent" ? amount * maxAmount : amount;

      let diff = 0;
      if (this[healthType] < maxAmount) {
        diff = Math.min(maxAmount - this[healthType], finalAmount);
      }
      this[healthType] += finalAmount;

      if (diff > 0) {
        logs.push(
          `<em>${this.name}</em> recovered <b class="${healthType}">${round(
            diff
          )}</b> ${healthType} (Protection: <b class="protection">${
            this.protection
          }</b> , Health: <b class="health">${this.health}</b>)`
        );
      }
    }
    return logs;
  }
  public get healthSteal() {
    return this._baseStats.healthSteal;
  }
  public get speed() {
    const { speed } = this._baseStats;
    if (this.hasDebuff("Speed Down")) {
      return speed * 0.75;
    }
    return speed;
  }
  public set speed(val) {
    this._baseStats.speed = val;
  }
  public get critDamage() {
    const { critDamage } = this._baseStats;
    let amount = critDamage;
    if (this.hasBuff("Call to Action")) {
      amount += 0.5;
    }
    if (this.hasDebuff("Critical Damage Down")) {
      amount = Math.min(amount - 0.5, 0);
    }

    return amount;
  }
  public get tenacity() {
    const { tenacity } = this._baseStats;
    if (this.hasDebuff("Tenacity Down")) {
      return 0;
    }
    return tenacity;
  }
  public set tenacity(val) {
    this._baseStats.tenacity = val;
  }
  public get potency() {
    const { potency } = this._baseStats;
    if (this.hasDebuff("Potency Down") && this.hasDebuff("Potency Down")) {
      return potency;
    } else if (this.hasDebuff("Potency Down")) {
      return Math.max(potency - 50, 0);
    } else if (this.hasBuff("Potency Up")) {
      return Math.max(potency + 50, 0);
    }
    return potency;
  }
  public set potency(val) {
    this._baseStats.potency = val;
  }

  public get physical() {
    const self = this;
    return {
      get offense() {
        const { offense } = self._baseStats.physical;
        if (self.hasDebuff("Offense Down")) {
          return offense * 0.5;
        }
        return offense;
      },
      set offense(val) {
        self._baseStats.physical.offense = val;
      },
      get critChance() {
        const { critChance } = self._baseStats.physical;
        let amount = critChance;
        if (self.hasBuff("Call to Action")) {
          amount += 0.5;
        }
        if (self.hasDebuff("Critical Chance Down")) {
          amount = Math.min(amount - 0.25, 0);
        }

        return amount;
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      get armor() {
        const { armor } = self._baseStats.physical;
        if (self.hasBuff("Defense Up") && self.hasDebuff("Defense Down")) {
          return armor;
        } else if (self.hasDebuff("Defense Down")) {
          return armor * 0.5;
        } else if (self.hasBuff("Defense Up")) {
          return armor * 1.5;
        }
        return armor;
      },
      set armor(val) {
        self._baseStats.physical.armor = val;
      },
      get armorPen() {
        const { armorPen } = self._baseStats.physical;
        if (self.hasDebuff("Defense Penetration Down")) {
          return Math.max(armorPen - 150, 0);
        }
        return armorPen;
      },
      set armorPen(val) {
        self._baseStats.physical.armorPen = val;
      },
      get accuracy() {
        const { accuracy } = self._baseStats.physical;
        let amount = accuracy;
        if (self.hasBuff("Call to Action")) {
          amount += 50;
        }
        if (self.hasDebuff("Accuracy Down")) {
          amount = Math.max(amount - 15, 0);
        }
        return amount;
      },
      set accuracy(val) {
        self._baseStats.physical.accuracy = val;
      },
      get dodge() {
        const { dodge } = self._baseStats.physical;
        if (self.hasDebuff("Evasion Down")) {
          return Math.max(dodge - 25, 0);
        }
        return dodge;
      },
      set dodge(val) {
        self._baseStats.physical.dodge = val;
      },
      get critAvoid() {
        const { critAvoid } = self._baseStats.physical;
        return critAvoid;
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
        const { offense } = self._baseStats.special;
        if (self.hasDebuff("Offense Down")) {
          return offense * 0.5;
        }
        return offense;
      },
      set offense(val) {
        self._baseStats.special.offense = val;
      },
      get critChance() {
        const { critChance } = self._baseStats.special;
        let amount = critChance;
        if (self.hasBuff("Call to Action")) {
          amount += 0.5;
        }
        if (self.hasDebuff("Critical Chance Down")) {
          amount = Math.min(amount - 0.25, 0);
        }

        return amount;
      },
      set critChance(val) {
        self._baseStats.special.critChance = val;
      },
      get armor() {
        const { armor } = self._baseStats.special;
        if (self.hasBuff("Defense Up") && self.hasDebuff("Defense Down")) {
          return armor;
        } else if (self.hasDebuff("Defense Down")) {
          return armor * 0.5;
        } else if (self.hasBuff("Defense Up")) {
          return armor * 1.5;
        }
        return armor;
      },
      set armor(val) {
        self._baseStats.special.armor = val;
      },
      get armorPen() {
        const { armorPen } = self._baseStats.special;
        if (self.hasDebuff("Defense Penetration Down")) {
          return Math.max(armorPen - 150, 0);
        }
        return armorPen;
      },
      set armorPen(val) {
        self._baseStats.special.armorPen = val;
      },
      get accuracy() {
        const { accuracy } = self._baseStats.special;
        let amount = accuracy;
        if (self.hasBuff("Call to Action")) {
          amount += 50;
        }
        if (self.hasDebuff("Accuracy Down")) {
          amount = Math.max(amount - 15, 0);
        }
        return amount;
      },
      set accuracy(val) {
        self._baseStats.special.accuracy = val;
      },
      get dodge() {
        const { dodge } = self._baseStats.special;
        if (self.hasDebuff("Accuracy Down")) {
          return Math.max(dodge - 25, 0);
        }
        return dodge;
      },
      set dodge(val) {
        self._baseStats.special.dodge = val;
      },
      get critAvoid() {
        const { critAvoid } = self._baseStats.special;
        return critAvoid;
      },
      set critAvoid(val) {
        self._baseStats.special.critAvoid = val;
      },
    };
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
      return `<em>${this.name}</em> gained ${round(
        diff,
        2
      )}% turn meter (${round(this._tm, 2)}%)`;
    } else {
      return `${round(diff, 2)}% turn meter was removed from <em>${
        this.name
      }</em> (${round(this._tm, 2)}%)`;
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
  public hasDebuff(name: tStatusEffect) {
    return this.debuffs.some((d) => d.name === name);
  }
  public hasBuff(name: tStatusEffect) {
    return this.buffs.some((d) => d.name === name);
  }
  public hasStatusEffect(name: tStatusEffect) {
    return [...this.debuffs, ...this.buffs].some((d) => d.name === name);
  }
  public addBuff(
    buff: iStatusEffect | iStatusEffect[],
    isNew: boolean,
    scalar: number
  ): string[] {
    if (Array.isArray(buff)) {
      return buff.reduce((arr: string[], b) => {
        arr.push(...this.addBuff(b, isNew, scalar));
        return arr;
      }, []);
    } else if (buff.name === "TM") {
      return [this.changeTurnMeter(buff.duration * scalar)];
    } else if (this.hasDebuff("Buff Immunity") && !buff.cantPrevent) {
      return [
        `<em>${this.name}</em> could not gain <span class="buff">${buff.name}</span> due to <span class="debuff">Buff Immunity</span>`,
      ];
    } else if (!this.hasDebuff("Buff Immunity")) {
      this._buffs.push({
        ...buff,
        duration: buff.duration * scalar,
        isNew,
      });
      return [
        `<em>${this.name}</em> gained <span class="buff">${
          buff.name
        }</span> for <b>${buff.duration * scalar}</b> turns`,
      ];
    }
    return [];
  }
  private removeBuff(
    buff: tBuff | tBuff[] | null,
    opponent?: Character
  ): string[] {
    const list: string[] = [];
    const logs: string[] = [];
    if (Array.isArray(buff)) {
      logs.push(
        ...buff.reduce((arr: string[], b) => {
          arr.push(...this.removeBuff(b, opponent));
          return arr;
        }, [])
      );
    } else {
      this._buffs = this._buffs.filter((b) => {
        if (
          (b.name === buff || buff === "all") &&
          (opponent?.id === this.id || !b.cantDispel)
        ) {
          if (b.expires) {
            logs.push(...this.processTargets(b.expires, this, null));
          }
          list.push(b.name);
          return false;
        }
        return true;
      });

      if (list.length > 0) {
        if (opponent?.id === this.id) {
          logs.push(`<span class="buff">${list.join(", ")}</span> was removed`);
        } else if (opponent) {
          logs.push(
            `<em>${opponent.name}</em> removed <span class="buff">${list.join(
              ", "
            )}</span> from ${this.name}`
          );
        } else {
          logs.push(
            `<span class="buff">${list.join(", ")}</span> ${
              list.length <= 1 ? "was" : "were"
            } removed`
          );
        }
      }
    }
    return logs;
  }
  public addDebuff(
    debuffs: iStatusEffect[],
    opponent: Character,
    scalar: number = 1
  ): { logs: string[]; resisted: number } {
    const logs: string[] = [];
    let resisted = 0;
    debuffs.forEach((debuff) => {
      const resistedChance = Math.max(this.tenacity - opponent.potency, 15);
      if (
        resistedChance < randomNumber(0, 100) ||
        debuff.cantResist ||
        debuff.name === "Tenacity Down"
      ) {
        if (randomNumber(0, 100) > (debuff.chance ?? 1) * 100) {
          return;
        }

        if (debuff.name === "TM") {
          logs.push(this.changeTurnMeter(debuff.duration * scalar));
        } else {
          const amount = debuff.duration * scalar;

          this.debuffs.push(unvue(debuff));
          logs.push(
            `<em>${this.name}</em> was inflicted with <span class="debuff">${
              debuff.name
            }</span> for ${amount} turn${amount > 1 ? "s" : ""}`
          );
        }
      } else {
        resisted++;
        logs.push(
          `<em>${this.name}</em> resisted <span class="debuff">${debuff.name}</span>`
        );
      }
    });
    return { logs, resisted };
  }
  private removeDebuff(
    debuff: tDebuff | tDebuff[] | null,
    opponent?: Character
  ): string[] {
    const list: string[] = [];
    const logs: string[] = [];
    if (Array.isArray(debuff)) {
      logs.push(
        ...debuff.reduce((arr: string[], d) => {
          arr.push(...this.removeDebuff(d, opponent));
          return arr;
        }, [])
      );
    } else {
      this._debuffs = unvue(this._debuffs).filter((x) => {
        if (x.name === debuff || debuff === "all") {
          if (x.expires) {
            logs.push(...this.processTargets(x.expires, this, null));
          }
          list.push(x.name);
          return false;
        }
        return true;
      });

      if (list.length > 0) {
        if (opponent) {
          logs.push(
            `${opponent.name} removed <span class="debuff">${list.join(
              ", "
            )}</span> from ${this.name}`
          );
        } else {
          logs.push(
            `<span class="debuff">${list.join(", ")}</span> ${
              list.length <= 1 ? "was" : "were"
            } removed`
          );
        }
      }
    }
    return logs;
  }

  //Abilities
  public get abilities() {
    return this._abilities;
  }
  public chooseAbility(): iAbility | undefined {
    const ability = this._abilities.find((a) => {
      if (this.hasDebuff("Ability Block")) {
        return a.id.startsWith("basic");
      }
      return a.turnsRemaining <= 0;
    });

    if (ability) {
      ability.turnsRemaining = ability.cooldown + 1; //+1 because end of turn decreases all abilities by 1
    }
    return ability;
  }
  public findTargets(
    teammates: Character[],
    opponents: Character[],
    targetSelection: iTarget
  ): Character[] {
    const { allies, count, tags, all } = targetSelection.target;
    if (all) {
      return allies ? teammates : opponents;
    } else if (count) {
      let validTargets: Character[] = [];
      if (allies) {
        validTargets = teammates;
      } else {
        const taunting = opponents.filter((c) => {
          if (this.effects.ignoreTaunt) {
            return false;
          }
          return [...c.buffs, ...c.debuffs].some((b) =>
            ["Taunt", "Marked", "Deathmarked"].includes(b.name)
          );
        });
        validTargets = taunting.length > 0 ? taunting : opponents;
      }
      const arr: Character[] = [];

      do {
        const rand: number = randomNumber(0, validTargets.length - 1);
        const el = validTargets[rand];
        const exists = arr.some((x) => x.id === el.id);
        if (!exists) {
          arr.push(validTargets[rand]);
        }
      } while (arr.length < count);
      return arr;
    } else if (tags) {
      return (allies ? teammates : opponents).filter((char) =>
        anyTagsMatch(char, tags, this.id)
      );
    } else {
      return [];
    }
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
  public getCombatStats(damageType: iTarget["damageType"]) {
    if (damageType === "physical") {
      return this.physical;
    } else if (damageType === "special") {
      return this.special;
    } else {
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
  public takeDamage(character: Character, target: iTarget, ability: iAbility) {
    const abilityModifier = target?.damage ?? 0;
    const variance = target?.damageVariance ?? 5;
    const { offense, critChance, armorPen } = character.getCombatStats(
      target.damageType
    );
    const { armor, critAvoid } = this.getCombatStats(target.damageType);
    const varianceRand = randomNumber(0 - variance, variance) / 100;
    const varianceOffense = offense * (1 - varianceRand);
    const damageTaken =
      (varianceOffense - (armor - armorPen)) * abilityModifier;

    const isCrit = randomNumber(0, 100) <= (critChance - critAvoid) * 100;

    const damageTotal = Math.max(
      Math.round(damageTaken * (isCrit ? character.critDamage : 1)),
      1
    );
    this.protection -= damageTotal;

    const logs = [
      `<span class="damage">${damageTotal}</span> damage was dealt to <em>${
        this.name
      }</em>${
        isCrit ? " <span class='crit'>(Crit)</span>" : ""
      } (Protection: <b class="protection">${
        this.protection
      }</b> , Health: <b class="health">${this.health}</b>)`,
    ];

    logs.push(
      ...character.heal({
        type: "flat",
        amount: damageTotal * this.healthSteal,
        healthType: "health",
      })
    );

    if (this.health <= 0) {
      logs.push(`<em>${character.name}</em> defeated <em>${this.name}</em>`);
    }

    return logs;
  }
  public checkEffects(
    { effects, target }: iTarget,
    opponent: Character
  ): string[] {
    const logs: string[] = [];
    effects?.forEach((effect) => {
      if (effect?.condition) {
        const { buffs, debuffs, stats, inverted, isNew } = effect.condition;
        if (buffs) {
          const hasBuffs = buffs.every((status) => {
            const match = this._buffs.find((x) => x.name === status);
            if (match) {
              return isNew === false ? !match.isNew : true;
            }
            return false;
          });

          if ((hasBuffs && !inverted) || (!hasBuffs && inverted)) {
            logs.push(
              ...this.addEffects(opponent, effect, this.targetSelf(target))
            );
          }
        }
        if (debuffs) {
          const hasDebuffs = debuffs.every((status) => {
            const match = this.buffs.find((x) => x.name === status);
            if (match) {
              return isNew ? match.isNew : true;
            }
            return false;
          });

          if ((hasDebuffs && !inverted) || (!hasDebuffs && inverted)) {
            logs.push(
              ...this.addEffects(opponent, effect, this.targetSelf(target))
            );
          }
        }
        if (stats) {
          let meetsStatRequirement = false;
          const stat = this[stats.value];
          if (!isNaN(stat)) {
            //if it is a number
            const num = Number(stat);
            if (stats.value === "health" && stats.type === "percent") {
              const percent = num / this.maxHealth;
              meetsStatRequirement =
                stats.amountType === "greater"
                  ? stats.amount > percent
                  : stats.amount < percent;
            } else if (
              stats.value === "protection" &&
              stats.type === "percent"
            ) {
              const percent = num / this.maxProtection;
              meetsStatRequirement =
                stats.amountType === "greater"
                  ? stats.amount > percent
                  : stats.amount < percent;
            } else {
              meetsStatRequirement =
                stats.amountType === "greater"
                  ? stats.amount > num
                  : stats.amount < num;
            }
          } else {
            console.warn(`Could not find stat ${stat.type} on ${this.name}`);
          }

          if (
            (meetsStatRequirement && !inverted) ||
            (!meetsStatRequirement && inverted)
          ) {
            logs.push(
              ...this.addEffects(opponent, effect, this.targetSelf(target))
            );
          }
        }
      } else {
        logs.push(
          ...this.addEffects(opponent, effect, this.targetSelf(target))
        );
      }
    });
    return logs;
  }
  private addEffects(
    opponent: Character,
    effect: iEffect,
    isNew: boolean
  ): string[] {
    const logs: string[] = [];
    if (effect.dispel) {
      logs.push(...this.removeBuff(effect.dispel?.buffs ?? null, opponent));
      logs.push(...this.removeDebuff(effect.dispel?.debuffs ?? null, opponent));
    }

    if (effect.cooldown) {
      if (effect.cooldown.target === "Self") {
        logs.push(opponent.changeCooldown(effect));
      } else {
        logs.push(this.changeCooldown(effect));
      }
    }

    if (effect.recover) {
      logs.push(...this.heal(effect.recover));
    }

    logs.push(
      ...this.addBuff(effect.buffs ?? [], isNew, this.getScalar(effect.scale))
    );
    const { logs: logsList, resisted } = this.addDebuff(
      effect.debuffs ?? [],
      opponent
    );
    logs.push(...logsList);
    return logs;
  }
  public changeCooldown(effect: iEffect): string {
    if (effect.cooldown) {
      const { amount, id } = effect.cooldown;
      const ability = this.abilities.find((a) => a.id === id);
      if (ability) {
        ability.turnsRemaining += amount;
        return `${this.name}'s ${ability.name}'s cooldown was ${
          amount > 0 ? "increased" : "decreased"
        } by ${amount}`;
      } else {
        console.warn(`Could not change the cooldown of ${id}`, this.abilities);
      }
    }
    return "";
  }
  public checkEvade({ cantMiss, damageType }: iTarget, opponent: Character) {
    if (cantMiss) {
      return false;
    } else {
      const rand = randomNumber(0, 100);
      const { dodge } = this.getCombatStats(damageType);
      const { accuracy } = opponent.getCombatStats(damageType);

      const changeToDodge = dodge - accuracy;
      return rand <= changeToDodge;
    }
  }
  public takeAction(opponents: Character[], teammates: Character[]) {
    this._tm = 0;
    const logs: string[] = [];

    if (this.hasDebuff("Stun")) {
      logs.push(`<em>${this.name}</em> is stunned and took no action`);
    } else {
      const ability = this.chooseAbility();

      if (ability) {
        logs.push(
          `<em>${this.name}</em> used <span class="ability">${ability.name}</span>`
        );

        ability.targets?.forEach((targetData) => {
          const targets = this.findTargets(teammates, opponents, targetData);

          targets.forEach((char) => {
            const attackMissed = char.checkEvade(targetData, this);
            if (attackMissed) {
              logs.push(`<em>${char.name}</em> evaded`);
              return;
            }
            logs.push(...this.processTargets(targetData, char, ability));
          });
        });
      } else {
        console.warn("no ability");
      }
    }
    logs.push(...this.endOfTurn());
    return logs.filter((l) => !!l);
  }
  private processTargets(
    targetData: iTarget,
    char: Character,
    ability: iAbility | null,
    isNew?: boolean
  ): string[] {
    const logs: string[] = [];
    const { damage, effects, debuffs, buffs, target } = targetData;
    if (damage && ability) {
      logs.push(...char.takeDamage(this, targetData, ability));
    }

    if (effects && char.health > 0) {
      logs.push(...char.checkEffects(targetData, this));
    }
    if (debuffs && char.health > 0) {
      const { logs: logsList, resisted } = char.addDebuff(debuffs, this);
      this._history.resisted = resisted;
      logs.push(...logsList);
    }
    if (buffs) {
      logs.push(
        ...char.addBuff(
          buffs,
          isNew === false ? false : this.targetSelf(target),
          this.getScalar(target.scale)
        )
      );
    }
    return logs;
  }
  public hasTags(tag: string, id: string): boolean {
    if (this._categories.includes(tag)) {
      return true;
    } else if (tag === "Self") {
      return this.id === id;
    } else if (tag === "Light Side" || tag === "Dark Side" || "Neutral") {
      return this.alignment === tag;
    } else return false;
  }
  private getScalar(type: string = "") {
    if (type === "Resisted") {
      return this._history.resisted;
    } else {
      return 1;
    }
  }
  private targetSelf(target: iTarget["target"]): boolean {
    const all = target.all ?? false;
    const allies = target.allies ?? false;
    const tagsMatch = anyTagsMatch(this, target.tags ?? [], this.id);

    return (all && allies) || tagsMatch;
  }
  public endOfTurn(): string[] {
    const logs: string[] = [];
    const { newDebuffList, expireDebuffs, debuffsRemoved } =
      this._debuffs.reduce(
        (
          acc: {
            newDebuffList: iStatusEffect[];
            expireDebuffs: iTarget[];
            debuffsRemoved: string[];
          },
          debuff: iStatusEffect
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
              acc.expireDebuffs.push(debuff.expires);
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
          newBuffList: iStatusEffect[];
          expiredBuffs: iTarget[];
          buffsRemoved: string[];
        },
        buff: iStatusEffect
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
            acc.expiredBuffs.push(buff.expires);
          }

          acc.buffsRemoved.push(buff.name);
        }
        return acc;
      },
      { newBuffList: [], expiredBuffs: [], buffsRemoved: [] }
    );

    if (debuffsRemoved.length > 0) {
      logs.push(`<span class="debuff">
        ${debuffsRemoved.join(", ")}</span> 
        ${
          debuffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }
    if (buffsRemoved.length > 0) {
      logs.push(`<span class="buff">
        ${buffsRemoved.join(", ")}</span> 
        ${
          buffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }

    this._debuffs = newDebuffList;
    this._buffs = newBuffList;

    const expiredList = [...expireDebuffs, ...expiredBuffs];
    expiredList.forEach((x) => {
      logs.push(...this.processTargets(x, this, null, false));
    });
    this.abilities.forEach((a) => {
      a.turnsRemaining--;
    });
    this._history = {
      resisted: 0,
    };

    return logs;
  }
  public reset() {
    this._baseStats.health = this._baseStats.maxHealth;
    this._baseStats.protection = this._baseStats.maxProtection;
    this._abilities.forEach((a) => {
      a.turnsRemaining = 0;
    });
    this._debuffs = [];
    this._buffs = [];
    this._tm = 0;
  }
}

export const team1: Character[] = [
  {
    name: "Commander Luke Skywalker",
    id: "COMMANDERLUKESKYWALKER",
    owner: "team1",
    abilities: [
      "specialskill_COMMANDERLUKESKYWALKER02",
      "specialskill_COMMANDERLUKESKYWALKER01",
      "basicskill_COMMANDERLUKESKYWALKER",
    ],
    stats: {
      maxHealth: 30802,
      health: 30802,
      protection: 37634,
      maxProtection: 37634,
      speed: 172,
      physical: {
        offense: 3803,
        critChance: 0.5179,
        armorPen: 251,
        accuracy: 0,
        armor: 363,
        dodge: 2,
        critAvoid: 0,
      },
      special: {
        offense: 1877,
        critChance: 0.1083,
        armorPen: 0,
        accuracy: 0,
        armor: 227,
        dodge: 2,
        critAvoid: 0,
      },
      critDamage: 1.5,
      tenacity: 45,
      potency: 41,
      healthSteal: 10,
    },
    alignment: "Light Side" as iCharacter["alignment"],
    categories: ["Rebel", "Unaligned Force User", "Attacker", "Leader"],
  },
].map((c) => {
  return new Character(c);
});

export const team2: Character[] = [
  {
    name: "Obi-Wan Kenobi (Old Ben)",
    id: "OLDBENKENOBI",
    owner: "team2",
    abilities: [
      "specialskill_OLDBENKENOBI02",
      "specialskill_OLDBENKENOBI01",
      "basicskill_OLDBENKENOBI",
    ],
    stats: {
      maxHealth: 34584,
      health: 34584,
      protection: 43378,
      maxProtection: 43378,
      speed: 138,
      physical: {
        offense: 2518,
        critChance: 0.3017,
        armorPen: 20,
        accuracy: 0,
        armor: 740,
        dodge: 2,
        critAvoid: 0,
      },
      special: {
        offense: 2647,
        critChance: 0.125,
        armorPen: 5,
        accuracy: 0,
        armor: 583,
        dodge: 2,
        critAvoid: 0,
      },
      critDamage: 1.5,
      tenacity: 55,
      potency: 45,
      healthSteal: 0.2,
    },
    alignment: "Light Side" as iCharacter["alignment"],
    categories: ["Rebel", "Jedi", "Tank", "Leader"],
  },
].map((c) => {
  return new Character(c);
});

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
