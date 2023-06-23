import { randomNumber, unvue } from "utils";
import abilities from "types/abilities";
import { random } from "lodash";

interface iCharacter {
  id: string;
  name: string;
  stats: iStats;
  abilities: string[];
  owner: string;
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
  | "Ability Block" //todo
  | "Accuracy Down"
  | "Anguish" //todo
  | "Blind" //todo
  | "Breach"
  | "Buff Immunity" //
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
  | "Vulnerable"; //
type tBuff = "TM" | "Potency Up";
type tStatusEffect = tDebuff | tBuff;

export interface iStatusEffect {
  name: tStatusEffect;
  duration: number;
}

export interface iEffects {
  ignoreTaunt: boolean;
}

export interface iAbility {
  turnsRemaining: number;
  name: string;
  damage?: number;
  damageVariance?: number;
  damageType?: "physical" | "special";
  cooldown: number;
  targets?: iTarget[];
}

interface iTarget {
  amount: number | "all" | "self";
  debuffs?: iStatusEffect[];
  buffs?: iStatusEffect[];
  effects?: iEffect[];
  damage?: boolean;
  cantMiss?: boolean;
}

interface iEffect {
  condition?: {
    debuffs?: tDebuff[];
    buffs?: tBuff[];
    stats?: {
      value: string;
      amount: number;
      type: "flat" | "percent";
    };
  };
  debuffs?: iStatusEffect[];
  buffs?: iStatusEffect[];
  dispell?: {
    debuffs?: "all";
  };
  cooldown?: {
    id: string;
    amount: number;
  };
}

export class Character {
  private _baseStats: iStats;
  private _name: string;
  private _id: string;
  private _tm: number = 0;
  private _buffs: iStatusEffect[];
  private _debuffs: iStatusEffect[];
  private _effects: iEffects;
  private _abilities: iAbility[];
  private _owner: string;

  constructor(data: iCharacter) {
    this._baseStats = data.stats;
    this._name = data.name;
    this._id = data.id;
    this._buffs = [];
    this._debuffs = [];
    this._effects = {
      ignoreTaunt: false,
    };
    this._abilities = data.abilities.map((x: string) => {
      return abilities[this._id][x];
    });
    this._owner = data.owner;
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
  }
  public get speed() {
    const { speed } = this._baseStats;
    if (this.hasDebuff("Speed Down") || this.hasDebuff("Breach")) {
      return speed * 0.75;
    }
    return speed;
  }
  public get critDamage() {
    const { critDamage } = this._baseStats;
    if (this.hasDebuff("Critical Damage Down")) {
      return Math.max(critDamage - 0.5, 0);
    }
    return critDamage;
  }
  public get tenacity() {
    const { tenacity } = this._baseStats;
    if (this.hasDebuff("Tenacity Down")) {
      return 0;
    }
    return tenacity;
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
        if (self.hasDebuff("Critical Chance Down")) {
          return Math.min(critChance - 0.25, 0);
        }
        return critChance;
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      get armor() {
        const { armor } = self._baseStats.physical;
        if (self.hasDebuff("Defense Down") || self.hasDebuff("Breach")) {
          return armor * 0.75;
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
        if (self.hasDebuff("Accuracy Down")) {
          return Math.max(accuracy - 15, 0);
        }
        return accuracy;
      },
      set accuracy(val) {
        self._baseStats.physical.accuracy = val;
      },
      get dodge() {
        const { dodge } = self._baseStats.physical;
        if (self.hasDebuff("Accuracy Down")) {
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
        if (self.hasDebuff("Critical Chance Down")) {
          return Math.min(critChance - 0.25, 0);
        }
        return critChance;
      },
      set critChance(val) {
        self._baseStats.special.critChance = val;
      },
      get armor() {
        const { armor } = self._baseStats.special;
        if (self.hasDebuff("Defense Down") || self.hasDebuff("Breach")) {
          return armor * 0.75;
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
        if (self.hasDebuff("Accuracy Down")) {
          return Math.max(accuracy - 15, 0);
        }
        return accuracy;
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
  public set turnMeter(val: number) {
    this._tm = val < 0 ? 0 : val;
  }
  public get turnMeterRatio() {
    return (100 - this._tm) / this.speed;
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
  public get isStunned() {
    return this.hasDebuff("Stun");
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
  public addBuff(buff: iStatusEffect | iStatusEffect[]): string[] {
    if (Array.isArray(buff)) {
      return buff.reduce((arr: string[], b) => {
        arr.push(...this.addBuff(b));
        return arr;
      }, []);
    } else if (!this.hasBuff(buff.name)) {
      this._buffs.push(buff);
      return [
        `<em>${this.name}</em> gained <span class="buff">${buff.name}</span>`,
      ];
    }
    return [];
  }
  public addDebuff(debuffs: iStatusEffect[], opponent: Character): string[] {
    const logs: string[] = [];
    debuffs.forEach((debuff) => {
      if (!this.hasDebuff(debuff.name)) {
        const resistedChance = Math.max(this.tenacity - this.potency, 15);
        if (resistedChance < randomNumber(0, 100)) {
          if (debuff.name === "TM") {
            this.turnMeter += debuff.duration;
            logs.push(
              `<em>${opponent.name}</em> removed ${Math.abs(
                debuff.duration
              )}% turn meter from <em>${this.name}</em>`
            );
          } else {
            this.debuffs.push(unvue(debuff));
            logs.push(
              `<em>${opponent.name}</em> inflicted <em>${this.name}</em> with <span class="debuff">${debuff.name}</span>`
            );
          }
        } else {
          logs.push(
            `<em>${this.name}</em> resisted <em>${opponent.name}'s</em> debuff <span class="debuff">(${debuff.name})</span>`
          );
        }
      }
    });
    return logs;
  }

  //Abilities
  public get abilities() {
    return this._abilities;
  }
  public chooseAbility() {
    const ability = this._abilities.find((a) => {
      return a.turnsRemaining <= 0;
    });

    if (ability) {
      ability.turnsRemaining = ability.cooldown;
    }
    return ability;
  }
  public findTargets(
    opponents: Character[],
    targetSelection: iTarget
  ): Character[] {
    if (targetSelection.amount === "all") {
      return opponents;
    } else if (targetSelection.amount === "self") {
      return [this];
    } else if (typeof targetSelection.amount === "number") {
      const taunting = opponents.filter((c) => {
        if (this.ignoreTaunt) {
          return false;
        }
        return [...c.buffs, ...c.debuffs].some((b) =>
          ["Taunt", "Marked", "Deathmarked"].includes(b.name)
        );
      });
      const validTargets = taunting.length > 0 ? taunting : opponents;
      const arr: Character[] = [];

      do {
        const rand: number = randomNumber(0, validTargets.length - 1);
        const el = validTargets[rand];
        const exists = arr.some((x) => x.id === el.id);
        if (!exists) {
          arr.push(validTargets[rand]);
        }
      } while (arr.length < targetSelection.amount);
      return arr;
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
  public get ignoreTaunt() {
    return this._effects.ignoreTaunt;
  }

  //Methods
  public getCombatStats(damageType: iAbility["damageType"]) {
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
  public takeDamage(character: Character, ability: iAbility) {
    const abilityModifier = ability?.damage ?? 0;
    const variance = ability?.damageVariance ?? 5;
    const { offense, critChance, armorPen } = character.getCombatStats(
      ability.damageType
    );
    const { armor, critAvoid } = this.getCombatStats(ability.damageType);
    const varianceRand = randomNumber(0 - variance, variance) / 100;
    const varianceOffense = offense * (1 - varianceRand);
    const damageTaken =
      (varianceOffense - (armor - armorPen)) * abilityModifier;
    const rand = randomNumber(0, 100);
    const isCrit = rand <= (critChance - critAvoid) * 100;

    const damageTotal = Math.round(
      damageTaken * (isCrit ? character.critDamage : 1)
    );
    this.protection -= Math.max(damageTotal, 1);

    const logs = [
      `<em>${character.name}</em> used <span class="ability">${
        ability.name
      }</span> and dealt <span class="damage">${damageTotal}</span> damage to <em>${
        this.name
      }</em>${isCrit ? " <span class='crit'>(Crit)<span>" : ""}`,
      `<em>${this.name}</em> Protection: <b class="protection">${this.protection}</b> , Health: <b class="health">${this.health}</b>`,
    ];

    if (this.health <= 0) {
      logs.push(`<em>${character.name}</em> defeated <em>${this.name}</em>`);
    }

    return logs;
  }
  public takeEffect(effects: iEffect[], opponent: Character): string[] {
    const logs: string[] = [];
    effects.forEach((effect) => {
      if (effect?.condition) {
        if (effect.condition.buffs) {
          const hasBuffs = effect.condition.buffs.every((status) =>
            this.hasBuff(status)
          );
          if (hasBuffs) {
            logs.push(...this.addDebuff(effect.debuffs ?? [], opponent));
            logs.push(...this.addBuff(effect.buffs ?? []));
          }
        }
        if (effect.condition.debuffs) {
          const hasDebuffs = effect.condition.debuffs.every((status) =>
            this.hasDebuff(status)
          );
          if (hasDebuffs) {
            logs.push(...this.addDebuff(effect.debuffs ?? [], opponent));
            logs.push(...this.addBuff(effect.buffs ?? []));
          }
        }
      } else {
        console.log(effect);
        logs.push(...this.addBuff(effect.buffs ?? []));
        logs.push(...this.addDebuff(effect.debuffs ?? [], opponent));
      }
    });
    return logs;
  }
  public checkEvade(
    target: iTarget,
    damageType: iAbility["damageType"],
    opponent: Character
  ) {
    if (target.cantMiss) {
      return false;
    } else {
      const rand = randomNumber(0, 100);
      const { dodge } = this.getCombatStats(damageType);
      const { accuracy } = opponent.getCombatStats(damageType);

      const changeToDodge = dodge - accuracy;
      return rand <= changeToDodge;
    }
  }
  public takeAction(opponents: Character[]) {
    this.turnMeter = 0;
    const logs: string[] = [];

    if (this.isStunned) {
      logs.push(`<em>${this.name}</em> is stunned and took no action`);
    } else {
      const ability = this.chooseAbility();

      if (ability) {
        ability.targets?.forEach((targetData) => {
          const targets = this.findTargets(opponents, targetData);

          targets.forEach((char) => {
            const attackMissed = char.checkEvade(
              targetData,
              ability.damageType,
              this
            );
            if (attackMissed) {
              logs.push(
                `<em>${char.name}</em> evaded <em>${this.name}'s</em> ${ability.name}`
              );
              return;
            }

            if (targetData.damage) {
              logs.push(...char.takeDamage(this, ability));
            }
            if (targetData.effects && char.health > 0) {
              logs.push(...char.takeEffect(targetData.effects, this));
            }
            if (targetData.debuffs && char.health > 0) {
              logs.push(...char.addDebuff(targetData.debuffs, this));
            }
            if (targetData.buffs) {
              logs.push(...this.addBuff(targetData.buffs));
            }
          });
        });

        this.abilities.forEach((a) => {
          a.turnsRemaining--;
        });
      } else {
        console.warn("no ability");
      }
    }
    this.endOfTurn();
    return logs;
  }
  public endOfTurn() {
    this._debuffs = unvue(this._debuffs).reduce((acc, debuff) => {
      debuff.duration--;
      if (debuff.duration > 0) {
        acc.push(debuff);
      }
      return acc;
    }, []);
    this._buffs = unvue(this._buffs).reduce((acc, buff) => {
      buff.duration--;
      if (buff.duration > 0) {
        acc.push(buff);
      }
      return acc;
    }, []);
    this.abilities.forEach((a) => {
      a.turnsRemaining--;
    });
  }
  public reset() {
    this._baseStats.health = this._baseStats.maxHealth;
    this._baseStats.protection = this._baseStats.maxProtection;
    this._abilities.forEach((a) => {
      a.turnsRemaining = 0;
    });
    this._debuffs = [];
    this._buffs = [];
  }
}

export const team1: Character[] = [
  {
    name: "Commander Luke Skywalker",
    id: "COMMANDERLUKESKYWALKER",
    owner: "team1",
    abilities: ["basicskill_COMMANDERLUKESKYWALKER"],
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
  },
].map((c) => {
  return new Character(c);
});

export const team2: Character[] = [
  {
    name: "Obi-Wan Kenobi (Old Ben)",
    id: "OLDBENKENOBI",
    owner: "team2",
    abilities: ["basicskill_OLDBENKENOBI"],
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
  },
].map((c) => {
  return new Character(c);
});
