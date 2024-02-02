import { IUnit, Unit } from "types/unit";
import { Character } from "./index";
import { gameEngine, iCondition } from "../gameEngine";
import { Log } from "./log";
import { Ability } from "./abilities";

/** A generic interface that contains all of the base stats for a character */
export interface iStats {
  /** The maximum amount of health */
  maxHealth: number;
  /** The current health, used to determine if the unit is dead or not */
  health: number;
  /** The maximum amount of protection */
  maxProtection: number;
  /** The current protection, which is depleted first before health */
  protection: number;
  /** How soon a unit takes a turn */
  speed: number;
  /** The physical attributes */
  physical: {
    /** Used to determine how much damage will be dealt for physical attacks */
    offense: number;
    /** Used to determine how much of the opponent's physical offense will be mitigated prior to calculating damage. TODO: check if this is a percent or flat value */
    armor: number;
    /** The amount of the opponent's armor will be ignored */
    armorPen: number;
    /** The chances of scoring a critical hit (decimal) */
    critChance: number;
    /** The amount of the opponent's dodge that is ignored */
    accuracy: number;
    /** The chances of evading an attack/effect (decimal) */
    dodge: number;
    /** The amount of the opponent's critChance that will be mitigated (decimal) */
    critAvoid: number;
  };
  /** The special attributes */
  special: {
    /** Used to determine how much damage will be dealt for special attacks */
    offense: number;
    /** Used to determine how much of the opponent's special offense will be mitigated prior to calculating damage. (aka resistance). TODO: check if this is a percent or flat value */
    armor: number;
    /** The amount of the opponent's armor (resistance) will be ignored */
    armorPen: number;
    /** The chances of scoring a critical hit (decimal) */
    critChance: number;
    /** The amount of the opponent's dodge that is ignored */
    accuracy: number;
    /** The chances of evading an attack/effect (decimal) */
    dodge: number;
    /** The amount of the opponent's critChance that will be mitigated (decimal) */
    critAvoid: number;
  };
  /** How much extra damage a critical hit will deal (decimal) */
  critDamage: number;
  /** The chances of resisting a negative status effect (decimal) */
  tenacity: number;
  /** The chances of successfulling inflicing a negative status effect (decimal) */
  potency: number;
  /** The amount of health that will be healed when dealing damage (decimal) */
  healthSteal: number;
  /** The amount of mastery that a unit has which will scale other stats based on role */
  mastery: number;
}

/** An interface that contains any information used manipulate a character's stats */
export interface iStatsCheck {
  /** The stat that will be modified
   *
   * counterChance: The chances of counter attacking (as a decimal)
   * counterDamage: The amount of damage used to scale offense (as a decimal; e.g. 1.5 would be 150% damage)
   * critDamage: The amount that damage is increased on a critical hit
   * health: The amount of health
   * healthSteal: The percentage (decimal) amount that is healed when dealing damage with an attack
   * maxHealth/maxProtection: The max health or protection
   * mastery: The amount of mastery
   * physicalAccuracy: The percentage (decimal) that decrease the chance of the physical attack missing
   * physicalArmor: The amount of armor used to mitigate damage from a physical attack
   * physicalArmorPen: The amount of armor that is ignored when dealing damage with a physical attack
   * physicalCritAvoid: The percentage (decimal) that reduces the chance of getting a critical hit from a physical attack
   * physicalCritChance: The percentage (decimal) that increases the chance of getting a critical hit from a physical attack
   * physicalDodge: The percentage (decimal) chance of a physical attack missing
   * physicalOffense: The amount of damage dealt on a physical attack
   * potency: The chances a negative status effect will successful be inflicted
   * protection: The amount of protection
   * specialAccuracy: The percentage (decimal) that decrease the chance of the physical attack missing
   * specialArmor: The amount of armor used to mitigate damage from a special attack
   * specialArmorPen: The amount of armor that is ignored when dealing damage with a special attack
   * specialCritAvoid: The percentage (decimal) that reduces the chance of getting a critical hit from a special attack
   * specialCritChance: The percentage (decimal) that increases the chance of getting a critical hit from a special attack
   * specialDodge: The percentage (decimal) chance of a special attack missing
   * specialOffense: The amount of damage dealt on a special attack
   * speed: The rate at which this user takes a turn
   * tenacity: The chances to mitigate a negative status effect
   */
  statToModify:
    | "counterChance"
    | "counterDamage"
    | "critDamage"
    | "health"
    | "healthSteal"
    | "mastery"
    | "maxHealth"
    | "maxProtection"
    | "physicalAccuracy"
    | "physicalArmor"
    | "physicalArmorPen"
    | "physicalCritAvoid"
    | "physicalCritChance"
    | "physicalDodge"
    | "physicalOffense"
    | "potency"
    | "protection"
    | "specialAccuracy"
    | "specialArmor"
    | "specialArmorPen"
    | "specialCritAvoid"
    | "specialCritChance"
    | "specialDodge"
    | "specialOffense"
    | "speed"
    | "tenacity";
  /** The amount that the stat will be modified */
  amount: number;
  /** Determines if the stat will added to the existing stat (additive) or multiplied together (multiplicative) */
  modifiedType: "additive" | "multiplicative";
  /** Determines when the effect will expire and thus be removed */
  expires?: {
    /** How many cycles before the effect is removed */
    count: number;
    /** How often the effect is checked to see if it should be removed */
    frequency: "turn";
  };
  condition?: Function;
  characterSourceId?: string;
  id?: string;
}

/** A container class used to hold all of a character's status any utility functions */
export class Stats {
  public baseStats: iStats;
  protected tempStats: iStatsCheck[] = [];
  protected _role: IUnit["role"];
  protected _primaryStat: IUnit["primaryStat"];
  protected _character: Character;
  protected _curHealth: number = 0;
  protected _curProtection: number = 0;

  constructor(data: Unit, parentCharacter: Character) {
    this._character = parentCharacter;
    this._role = data.role;
    this._primaryStat = data.primaryStat;
    this.baseStats = {
      maxHealth: data.health,
      health: data.health,
      maxProtection: data.protection,
      protection: data.protection,
      speed: data.speed,
      physical: {
        offense: data.offense.physical,
        armor: (data.physicalArmor * 637.5) / (100 - data.physicalArmor),
        armorPen: data.armorPen,
        critChance: data.critChance.physical / 100,
        accuracy: data.physicalAccuracy / 100,
        dodge: data.physicalDodge / 100,
        critAvoid: data.physicalCritAvoid / 100,
      },
      special: {
        offense: data.offense.special,
        armor: (data.armor.special * 637.5) / (100 - data.armor.special),
        armorPen: data.resistancePen,
        critChance: data.critChance.special / 100,
        accuracy: data.specialAccuracy / 100,
        dodge: data.specialDodge / 100,
        critAvoid: data.specialCritAvoid / 100,
      },
      critDamage: data.critDamage / 100,
      tenacity: data.tenacity / 100,
      potency: data.potency / 100,
      healthSteal: data.healthSteal,
      mastery: data.mastery,
    };
    this._curHealth = data.health;
    this._curProtection = data.protection;
  }

  /** An initializer function that resets various properties */
  public initialize() {
    this._curHealth = this.maxHealth;
    this._curProtection = this.maxProtection;
  }

  /** The modified maximum amount of Protection */
  public get maxProtection() {
    let stat = this.baseStats.maxProtection;

    if (this._role === "Tank") {
      if (this._primaryStat === "str") {
        stat += 220 * this.mastery;
      } else if (this._primaryStat === "agi") {
        stat += 200 * this.mastery;
      } else if (this._primaryStat === "tac") {
        stat += 230 * this.mastery;
      }
    }
    return this.getModifiedStats([], stat, this.getTempStat("maxProtection"));
  }
  public set maxProtection(val) {
    this.baseStats.maxProtection = val;
  }
  public get bonusProtection() {
    return this._character.statusEffect.buffs.reduce((total, buff) => {
      if (buff.name === "Protection Up") {
        total += buff.value ?? 0;
      }
      return total;
    }, 0);
  }
  /** The modified maximum amount of Health */
  public get maxHealth() {
    let stat = this.baseStats.maxHealth;

    if (this._role === "Tank") {
      if (this._primaryStat === "agi") {
        stat += 120 * this.mastery;
      }
    } else if (this._role === "Healer") {
      if (this._primaryStat === "str") {
        stat += 420 * this.mastery;
      } else if (this._primaryStat === "agi") {
        stat += 225 * this.mastery;
      } else if (this._primaryStat === "tac") {
        stat += 300 * this.mastery;
      }
    }

    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasDebuff("Health Down"),
          value: -0.2,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Health Up"),
          value: 0.15,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff(
            "Translation",
            undefined,
            1
          ),
          value: 0.3,
        },
      ],
      stat,
      this.getTempStat("maxHealth"),
      true
    );
  }
  public set maxHealth(val) {
    this.baseStats.maxHealth = val;
  }
  /** The current amount of Health */
  public get health() {
    return this._curHealth;
  }

  /** The current amount of Protection */
  public get protection() {
    return this._curProtection;
  }

  /**
   * Calculates how much should be removed from Protection Up, Protection, or Health
   * @param amount - The amount of health/protection that is lost
   * @param type - The type of health lost if targeting a specific type (e.g. lose health, ignoring protection)
   */
  public loseHealth(amount: number, type?: "health" | "protection") {
    if (type === "health") {
      if (this._character.statusEffect.isImmune("loseHealth")) {
        return;
      }
      this._curHealth -= amount;
      this._curHealth = Math.max(this._curHealth, 0);
      this._character.dispatchEvent("loseHealth", {
        previousHealth: this._curHealth + amount,
      });
    } else if (type === "protection") {
      this._curProtection -= amount;
      this._curProtection = Math.max(this._curProtection, 0);
      this._character.dispatchEvent("loseProtection");
    } else if (this._character.statusEffect.hasBuff("Protection Up")) {
      const match = this._character.statusEffect.buffs.find(
        (x) => x.name === "Protection Up"
      );
      if (match?.value) {
        if (match?.value && match?.value > amount) {
          match.value -= amount;
        } else {
          const diff = amount - match.value;
          match.value = 0;
          this.loseHealth(diff);
        }

        if (match?.value <= 0) {
          this._character.statusEffect.removeBuff({
            id: match.id,
            duration: 0,
            name: null,
            sourceAbility: null,
          });
        }
      }
    } else if (this._curProtection > 0) {
      if (this._curProtection > amount) {
        this._curProtection -= amount;
        this._character.dispatchEvent("loseProtection");
      } else {
        const diff = amount - this._curProtection;
        this._curProtection = 0;
        this._character.dispatchEvent("loseProtection");
        this.loseHealth(diff);
      }
    } else {
      if (this._character.statusEffect.isImmune("loseHealth")) {
        return;
      }
      this._curHealth -= amount;
      this._character.dispatchEvent("loseHealth", {
        previousHealth: this._curHealth + amount,
      });
    }
  }

  /**
   * Gains health or protection
   * @param amount - The amount of health/protection that is gained
   * @param type - The type of health or protection if needing to target a specific type
   */
  public gainHealth(amount: number, type?: "health" | "protection") {
    if (type === "health") {
      this._curHealth += amount;
      this._curHealth = Math.min(this._curHealth, this.maxHealth);
    } else if (type === "protection") {
      this._curProtection += amount;
      this._curProtection = Math.min(this._curProtection, this.maxHealth);
    } else {
      this._curHealth += amount;

      if (this._curHealth > this.maxHealth) {
        const diff = this._curHealth - this.maxHealth;
        this._curProtection += diff;
        this._curHealth = this.maxHealth;

        if (this._curProtection > this.maxProtection) {
          this._curProtection = this.maxProtection;
        }
      }
    }
  }
  /** The current Speed */
  public get speed() {
    return this.getModifiedStats(
      [
        {
          hasEffect:
            this._character.statusEffect.hasDebuff("Speed Down") ||
            this._character.statusEffect.hasDebuff("Breach"),
          value: -0.25,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Speed Up"),
          value: 0.25,
        },
      ],
      this.baseStats.speed,
      this.getTempStat("speed"),
      true
    );
  }
  /** The current mastery of the character */
  public get mastery() {
    let stat = this.baseStats.mastery;

    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasBuff(
            "Jedi Lessons",
            undefined,
            1
          ),
          value: 0.2,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff(
            "Jedi Lessons",
            undefined,
            2
          ),
          value: 0.2,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff(
            "Jedi Lessons",
            undefined,
            3
          ),
          value: 0.2,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Jedi Legacy"),
          value: 1,
        },
      ],
      stat,
      this.getTempStat("mastery"),
      true
    );
  }
  /** The current Critical Damage (decimal) */
  public get critDamage() {
    let stat = this.baseStats.critDamage;

    if (this._role === "Attacker") {
      if (this._primaryStat === "agi") {
        stat += 0.003 * this.mastery;
      }
    } else if (this._role === "Support") {
      if (this._primaryStat === "agi") {
        stat *= 0.003 * this.mastery;
      }
    }

    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasBuff("Call to Action"),
          value: 0.5,
        },
        {
          hasEffect: this._character.statusEffect.hasDebuff(
            "Critical Damage Down"
          ),
          value: -0.5,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Critical Damage Up"),
          value: 0.5,
        },
      ],
      stat,
      this.getTempStat("critDamage")
    );
  }

  /** The current Tenacity (decimal) */
  public get tenacity() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasDebuff("Tenacity Down"),
          value: -Infinity,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Tenacity Up"),
          value: Infinity,
        },
      ],
      this.baseStats.tenacity,
      this.getTempStat("tenacity")
    );
  }
  public set tenacity(val) {
    this.baseStats.tenacity = val;
  }

  /** The current Potency (decimal) */
  public get potency() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasDebuff("Potency Down"),
          value: -0.5,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Potency Up"),
          value: 0.5,
        },
      ],
      this.baseStats.potency,
      this.getTempStat("potency")
    );
  }
  public set potency(val) {
    this.baseStats.potency = val;
  }

  /* The likelyhood (decimal) of counter attacking */
  public get counterChance() {
    if (this._character.statusEffect.hasDebuff("Stun")) {
      return 0;
    }

    const chance = this.getModifiedStats(
      [],
      0,
      this.getTempStat("counterChance")
    );
    return chance;
  }

  /* The amount of damage dealt when counter attacking (decimal) */
  public get counterDamage() {
    const damageAmount = this.getModifiedStats(
      [],
      1,
      this.getTempStat("counterDamage")
    );
    return damageAmount;
  }

  /** The modified physical stats of a character */
  public get physical() {
    const self = this;
    return {
      /** Physical Offense */
      get offense() {
        let stat = self.baseStats.physical.offense;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "agi") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 27 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 12 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Offense Down"),
              value: -0.5,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Offense Up"),
              value: 0.5,
            },
          ],
          stat,
          self.getTempStat("physicalOffense"),
          true
        );
      },
      set offense(val) {
        self.baseStats.physical.offense = val;
      },
      /** Physical Crit Chance (decimal) */
      get critChance() {
        let stat = self.baseStats.physical.critChance;

        if (self._role === "Attacker") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff(
                "Critical Chance Down"
              ),
              value: -0.25,
            },
            {
              hasEffect:
                self._character.statusEffect.hasBuff("Critical Chance Up"),
              value: 0.25,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Call to Action"),
              value: 0.5,
            },
            {
              hasEffect: self._character.statusEffect.hasStatusEffect("Guard"),
              value: 0.25,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Advantage"),
              value: 2,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff(
                "Translation",
                undefined,
                2
              ),
              value: 0.15,
            },
          ],
          stat,
          self.getTempStat("physicalCritChance")
        );
      },
      set critChance(val) {
        self.baseStats.physical.critChance = val;
      },
      /** Physical Armor (flat number) */
      get armor() {
        let stat = self.baseStats.physical.armor;

        if (self._role === "Tank") {
          if (self._primaryStat === "str") {
            stat *= 0.1 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "str") {
            stat *= 0.06 * self.mastery;
          }
        }

        const hasDefDown =
          self._character.statusEffect.hasDebuff("Defense Down");
        const hasBreach = self._character.statusEffect.hasDebuff("Breach");

        const armorShredCount =
          self._character.statusEffect.statusEffects.filter(
            (s) => s.name === "Armor Shred"
          ).length;

        const armorShredValue = self._character.hasTags(
          "Galactic Legend",
          self._character.id
        )
          ? -0.25
          : -0.5;

        return self.getModifiedStats(
          [
            {
              hasEffect: hasDefDown || hasBreach,
              value: hasDefDown ? -0.5 : -0.25,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Defense Up"),
              value: 0.5,
            },
            {
              hasEffect:
                self._character.statusEffect.hasStatusEffect("Armor Shred"),
              value: armorShredCount * armorShredValue,
            },
          ],
          stat,
          self.getTempStat("physicalArmor"),
          true
        );
      },
      set armor(val) {
        self.baseStats.physical.armor = val;
      },
      /** Physical Armor Penetration */
      get armorPen() {
        let stat = self.baseStats.physical.armorPen;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff(
                "Defense Penetration Down"
              ),
              value: -150,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff(
                "Defense Penetration Up"
              ),
              value: 150,
            },
          ],
          stat,
          self.getTempStat("physicalArmorPen")
        );
      },
      set armorPen(val) {
        self.baseStats.physical.armorPen = val;
      },
      /** Physical Accuracy (decimal) */
      get accuracy() {
        let stat = self.baseStats.physical.accuracy;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect:
                self._character.statusEffect.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Accuracy Up"),
              value: 0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasDebuff("Blind"),
              value: -Infinity,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Call to Action"),
              value: 0.5,
            },
          ],
          stat,
          self.getTempStat("physicalAccuracy")
        );
      },
      set accuracy(val) {
        self.baseStats.physical.accuracy = val;
      },
      /** Physical Dodge Chance (decimal) */
      get dodge() {
        let stat = self.baseStats.physical.dodge;

        if (self._role === "Tank") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Evasion Up"),
              value: 0.15,
            },
          ],
          stat,
          self.getTempStat("physicalDodge")
        );
      },
      set dodge(val) {
        self.baseStats.physical.dodge = val;
      },
      /** Physical Critical Avoice (decimal) */
      get critAvoid() {
        let stat = self.baseStats.physical.critAvoid;

        if (self._role === "Tank") {
          if (self._primaryStat === "tac") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Vulnerable"),
              value: -Infinity,
            },
            {
              hasEffect:
                self._character.statusEffect.hasBuff("Critical Hit Immunity") ||
                self._character.statusEffect.hasStatusEffect("Guard"),
              value: Infinity,
            },
          ],
          stat,
          self.getTempStat("physicalCritAvoid")
        );
      },
      set critAvoid(val) {
        self.baseStats.physical.critAvoid = val;
      },
    };
  }

  /** The modified special stats of a character */
  public get special() {
    const self = this;
    return {
      get offense() {
        let stat = self.baseStats.special.offense;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "agi") {
            stat += 26 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 27 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 12 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Offense Down"),
              value: -0.5,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Offense Up"),
              value: 0.5,
            },
          ],
          stat,
          self.getTempStat("specialOffense"),
          true
        );
      },
      set offense(val) {
        self.baseStats.special.offense = val;
      },
      get critChance() {
        let stat = self.baseStats.special.critChance;

        if (self._role === "Attacker") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff(
                "Critical Chance Down"
              ),
              value: -0.25,
            },
            {
              hasEffect:
                self._character.statusEffect.hasBuff("Critical Chance Up"),
              value: 0.25,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Call to Action"),
              value: 0.5,
            },
            {
              hasEffect: self._character.statusEffect.hasStatusEffect("Guard"),
              value: 0.25,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Advantage"),
              value: 2,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff(
                "Translation",
                undefined,
                2
              ),
              value: 0.15,
            },
          ],
          stat,
          self.getTempStat("specialCritChance")
        );
      },
      set critChance(val) {
        self.baseStats.special.critChance = val;
      },
      get armor() {
        let stat = self.baseStats.special.armor;

        if (self._role === "Tank") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        }

        const armorShredCount =
          self._character.statusEffect.statusEffects.filter(
            (s) => s.name === "Armor Shred"
          ).length;

        const armorShredValue = self._character.hasTags(
          "Galactic Legend",
          self._character.id
        )
          ? -0.25
          : -0.5;

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Defense Down"),
              value: -0.5,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Defense Up"),
              value: 0.5,
            },
            {
              hasEffect:
                self._character.statusEffect.hasStatusEffect("Armor Shred"),
              value: armorShredCount * armorShredValue,
            },
          ],
          stat,
          self.getTempStat("specialArmor"),
          true
        );
      },
      set armor(val) {
        self.baseStats.special.armor = val;
      },
      get armorPen() {
        let stat = self.baseStats.special.armorPen;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "str") {
            stat += 2 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff(
                "Defense Penetration Down"
              ),
              value: -150,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff(
                "Defense Penetration Up"
              ),
              value: 150,
            },
          ],
          stat,
          self.getTempStat("specialArmorPen")
        );
      },
      set armorPen(val) {
        self.baseStats.special.armorPen = val;
      },
      get accuracy() {
        let stat = self.baseStats.special.accuracy;

        if (self._role === "Attacker") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "str") {
            stat += 0.003 * self.mastery;
          } else if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect:
                self._character.statusEffect.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Accuracy Up"),
              value: 0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Call to Action"),
              value: 0.5,
            },
          ],
          stat,
          self.getTempStat("specialAccuracy")
        );
      },
      set accuracy(val) {
        self.baseStats.special.accuracy = val;
      },
      get dodge() {
        let stat = self.baseStats.special.dodge;

        if (self._role === "Tank") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "agi") {
            stat += 0.0035 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Evasion Up"),
              value: 0.15,
            },
          ],
          stat,
          self.getTempStat("specialDodge")
        );
      },
      set dodge(val) {
        self.baseStats.special.dodge = val;
      },
      get critAvoid() {
        let stat = self.baseStats.special.critAvoid;

        if (self._role === "Tank") {
          if (self._primaryStat === "tac") {
            stat += 0.0045 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        } else if (self._role === "Support") {
          if (self._primaryStat === "tac") {
            stat += 0.003 * self.mastery;
          }
        }

        return self.getModifiedStats(
          [
            {
              hasEffect: self._character.statusEffect.hasDebuff("Vulnerable"),
              value: -Infinity,
            },
            {
              hasEffect:
                self._character.statusEffect.hasBuff("Critical Hit Immunity") ||
                self._character.statusEffect.hasStatusEffect("Guard"),
              value: Infinity,
            },
          ],
          stat,
          self.getTempStat("specialCritAvoid")
        );
      },
      set critAvoid(val) {
        self.baseStats.special.critAvoid = val;
      },
    };
  }

  /** The current Health Steal (decimal) */
  public get healthSteal() {
    let stat = this.baseStats.healthSteal;

    if (this._role === "Tank") {
      if (this._primaryStat === "str") {
        stat += 0.0015 * this.mastery;
      }
    } else if (this._role === "Healer") {
      if (this._primaryStat === "str") {
        stat *= 0.0015 * this.mastery;
      }
    }

    return this.getModifiedStats(
      [
        {
          hasEffect:
            this._character.statusEffect.hasDebuff("Health Steal Down"),
          value: -0.5,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Health Steal Up"),
          value: 0.5,
        },
      ],
      stat,
      this.getTempStat("healthSteal")
    );
  }

  /**
   * Gets an array of stats that are currently being changed through various effects
   * @param statName
   * @returns An array of stats that should be changed
   */
  private getTempStat(statName: iStatsCheck["statToModify"]): iStatsCheck[] {
    const tempStatMapping: Record<string, iStatsCheck[]> =
      this.tempStats.reduce((statsMapping, stat) => {
        if (this._character.checkCondition(stat.condition)) {
          if (stat.statToModify in statsMapping) {
            statsMapping[stat.statToModify].push(stat);
          } else {
            statsMapping[stat.statToModify] = [stat];
          }
        }
        return statsMapping;
      }, {});

    return tempStatMapping[statName] ?? [];
  }

  /**
   * Gets the modified stats based on if an effect is present (such as Offense Up)
   * @param statusEffectConfig - An object containing if an effect is present and by how much the stat should be adjusted
   * @param baseStat - The base value of the stat to be used
   * @param tempStats - An array of any temporary stats that may exist
   * @param isMultiplicative - Determines if the stat should be multiplied (true) or added together (false)
   * @returns The number of the new value for the stat
   */
  private getModifiedStats(
    statusEffectConfig: { hasEffect: boolean; value: number }[],
    baseStat: number,
    tempStats: iStatsCheck[],
    isMultiplicative: boolean = false
  ): number {
    let newStat = baseStat;

    tempStats
      .sort((a: iStatsCheck, b: iStatsCheck) => {
        if (
          a.modifiedType === "multiplicative" &&
          b.modifiedType === "multiplicative"
        ) {
          return 0;
        } else if (a.modifiedType === "multiplicative") {
          return 1;
        } else if (b.modifiedType === "multiplicative") {
          return -1;
        }
        return 0;
      })
      .forEach((stat) => {
        if (stat?.modifiedType === "multiplicative") {
          newStat += baseStat * stat.amount;
        } else {
          newStat += stat.amount;
        }
      });

    let amountIncrease = 0;

    statusEffectConfig.forEach((effect) => {
      if (effect.hasEffect) {
        amountIncrease += effect.value;
      }
    });

    if (isMultiplicative) {
      return newStat * (1 + amountIncrease);
    } else {
      return newStat + amountIncrease;
    }
  }

  /** Gets the current combat stats of the character after all effects have been applied
   * @param damageType - The type of damage being dealt (physical, special, or true)
   * @param stats - An array of stats to modify the starting stat value
   * @returns - A map of the stats and their current values
   */
  public getCombatStats(
    damageType?: "physical" | "special" | "true",
    stats?: iStatsCheck[]
  ) {
    const baseStat = damageType === "physical" ? this.physical : this.special;

    const mapping = {
      offense: baseStat.offense,
      critChance: baseStat.critChance,
      armorPen: baseStat.armorPen,
      armor: baseStat.armor,
      dodge: baseStat.dodge,
      accuracy: baseStat.accuracy,
      critAvoid: baseStat.critAvoid,
      maxHealth: this.maxHealth,
      health: this.health,
      maxProtection: this.maxProtection,
      protection: this.protection,
    };

    if (damageType === "physical" || damageType === "special") {
      mapping.offense = modifyStat(
        baseStat.offense,
        (damageType + "Offense") as iStatsCheck["statToModify"],
        stats
      );
      mapping.critChance = modifyStat(
        baseStat.critChance,
        (damageType + "CritChance") as iStatsCheck["statToModify"],
        stats
      );
      mapping.armorPen = modifyStat(
        baseStat.armorPen,
        (damageType + "ArmorPen") as iStatsCheck["statToModify"],
        stats
      );
      mapping.armor = modifyStat(
        baseStat.armor,
        (damageType + "Armor") as iStatsCheck["statToModify"],
        stats
      );
      mapping.dodge = modifyStat(
        baseStat.dodge,
        (damageType + "Dodge") as iStatsCheck["statToModify"],
        stats
      );
      mapping.accuracy = modifyStat(
        baseStat.accuracy,
        (damageType + "Accuracy") as iStatsCheck["statToModify"],
        stats
      );
      mapping.critAvoid = modifyStat(
        baseStat.critAvoid,
        (damageType + "CritAvoid") as iStatsCheck["statToModify"],
        stats
      );
    }
    return mapping;
  }

  public addTempStats(statsList: iStatsCheck[], srcAbility?: Ability) {
    this.tempStats.push(...statsList);
    statsList.forEach((stat) => {
      let amountLabel = stat.amount.toString();
      if (stat.modifiedType === "multiplicative") {
        amountLabel = `${stat.amount * 100}%`;
      }
      let conditionLabel = stat.condition ? " (if a condition is met)" : "";

      gameEngine.addLogs(
        new Log({
          character: this._character,
          customMessage: `gained ${amountLabel} (${stat.modifiedType}) ${stat.statToModify}${conditionLabel}`,
          ability: { source: srcAbility },
        })
      );
    });
  }

  public removeTempStats(characterId?: string, effectId?: string) {
    this.tempStats = this.tempStats.filter((stat) => {
      if (
        stat.characterSourceId === characterId ||
        (stat.id === effectId && effectId !== undefined)
      ) {
        let amountLabel = stat.amount.toString();
        if (stat.modifiedType === "multiplicative") {
          amountLabel = `${stat.amount * 100}%`;
        }

        gameEngine.addLogs(
          new Log({
            character: this._character,
            customMessage: `removed ${amountLabel} (${stat.modifiedType}) ${stat.statToModify}`,
          })
        );
        return false;
      }
      return true;
    });
  }

  /** Removes any stats that shouldnt be present any more after the turn has ended */
  public endOfTurn() {
    this.tempStats = this.tempStats.reduce(
      (list: iStatsCheck[], stat: iStatsCheck) => {
        if (stat.expires?.frequency === "turn") {
          stat.expires.count--;
          if (stat.expires.count > 0) {
            list.push(stat);
          }
        } else if (!stat.expires) {
          list.push(stat);
        }
        return list;
      },
      []
    );
  }

  /** Resets all temporary stats and effects  */
  public reset() {
    this.tempStats = [];
  }
}

/** Modifies the stat based on a flat amount of multimplicative value
 * @param startingStatValue - The starting stat value
 * @param statType - The type of stat used to modify the starting stat (e.g. offense, health, etc.)
 * @param stats - An array of stats to modify the starting stat value
 * @returns The modified value of the stat
 */
export function modifyStat(
  startingStatValue: number,
  statType: iStatsCheck["statToModify"],
  stats?: iStatsCheck[] | null
) {
  let modifiedStat = startingStatValue;
  if (stats) {
    stats.forEach((s) => {
      if (statType === s?.statToModify) {
        if (s.modifiedType === "multiplicative") {
          modifiedStat *= s.amount;
        } else if (s.modifiedType === "additive") {
          modifiedStat += s.amount;
        }
      }
    });
  }
  return modifiedStat;
}

/** An interface used to allow how much should be healed and what type of healing */
export interface iHeal {
  /** Health or Protection */
  healthType: "health" | "protection";
  /** Determines if the amound should be added to the current health, or scale from the unit's maxHealth/Protection */
  amountType?: "additive" | "multiplicative";
  /** The amount to heal. For percentages, keep the amount a decimal (e.g. 0.4 would be a 40% heal) */
  amount?: number;
}
