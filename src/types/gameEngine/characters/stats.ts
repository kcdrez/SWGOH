import { Ability, IUnit, Unit } from "types/unit";
import { Character } from "./index";

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

export interface iStatsCheck {
  /** The stat that will be modified
   *
   * armor: Increases the amount of offense to mitigate
   *
   * counterChance: The chances of counter attacking (as a decimal)
   *
   * counterDamage: The amount of damage used to scale offense (as a decimal; e.g. 1.5 would be 150% damage)
   *
   * critAvoid: The chances to mitigate a critical hit (as a decimal)
   *
   * critChance: The chances of getting a critical hit (as a decimal)
   *
   * dodge: The chances of missing an attack/effect
   *
   * health: The amount of health
   *
   * maxHealth/maxProtection: The max health or protection
   *
   * offense: The amount of damage an attack deals
   *
   * potency: The chances a negative status effect will successful be inflicted
   *
   * protection: The amount of protection
   *
   * tenacity: The chances to mitigate a negative status effect
   */
  statToModify:
    | "armor"
    | "counterChance"
    | "counterDamage"
    | "critAvoid"
    | "critChance"
    | "dodge"
    | "health"
    | "maxHealth"
    | "maxProtection"
    | "offense"
    | "potency"
    | "protection"
    | "resistance"
    | "tenacity";
  /** The amount that the stat will be modified */
  amount: number;
  /** Determines if the stat will added to the existing stat (additive) or multiplied together (multiplicative) */
  modifiedType: "additive" | "multiplicative";
  /** Todo: whats this? */
  amountType?: "greater" | "less";
  /** Determines when the effect will expire and thus be removed */
  expires?: {
    /** How many cycles before the effect is removed */
    count: number;
    /** How often the effect is checked to see if it should be removed */
    frequency: "turn";
  };
  /** Todo: whats this for? */
  stacking?: boolean;
}

export class Stats {
  public baseStats: iStats;
  private _tempStats: iStatsCheck[] = [];
  private _role: IUnit["role"];
  private _primaryStat: IUnit["primaryStat"];
  private _character: Character;
  private _curHealth: number = 0;
  private _curProtection: number = 0;

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

  public initialize() {
    this._curHealth = this.baseStats.maxHealth;
    this._curProtection = this.baseStats.maxProtection;
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
      ],
      stat,
      this.getTempStat("maxHealth")
    );
  }
  public set maxHealth(val) {
    this.baseStats.maxHealth = val;
  }
  /** The current amount of Health */
  public get health() {
    return this._curHealth;
  }
  public set health(val) {
    this._curHealth = Math.max(val, 0);
    if (this._curHealth > this.maxHealth) {
      this._curHealth = this.maxHealth;
    }
  }
  /** The current amount of Protection */
  public get protection() {
    return this._curProtection;
  }
  public set protection(val) {
    if (val < 0) {
      this.health += val;
      this._curProtection = 0;
    } else {
      this._curProtection = Math.max(val, 0);
    }

    if (this._curProtection > this.maxProtection) {
      this._curProtection = this.maxProtection;
    }
  }
  /** The current Speed */
  public get speed() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this._character.statusEffect.hasDebuff("Speed Down"),
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
    return this.baseStats.mastery;
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
          value: -50,
        },
        {
          hasEffect: this._character.statusEffect.hasBuff("Potency Up"),
          value: 50,
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
          self.getTempStat("offense"),
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
              value: Infinity,
            },
          ],
          stat,
          self.getTempStat("critChance")
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
          ],
          stat,
          self.getTempStat("armor"),
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
          self.getTempStat("armorPen")
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
              value: -999,
            },
            {
              hasEffect: self._character.statusEffect.hasBuff("Call to Action"),
              value: 0.5,
            },
          ],
          stat,
          self.getTempStat("accuracy")
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
          self.getTempStat("dodge")
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
          self.getTempStat("critAvoid")
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
          self.getTempStat("offense"),
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
          ],
          stat,
          self.getTempStat("critChance")
        );
      },
      set critChance(val) {
        self.baseStats.physical.critChance = val;
      },
      get armor() {
        let stat = self.baseStats.physical.armor;

        if (self._role === "Tank") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        } else if (self._role === "Healer") {
          if (self._primaryStat === "tac") {
            stat *= 0.1 * self.mastery;
          }
        }

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
          ],
          stat,
          self.getTempStat("armor"),
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
          self.getTempStat("armorPen")
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
          self.getTempStat("accuracy")
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
          self.getTempStat("dodge")
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
          self.getTempStat("critAvoid")
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

  private getTempStat(statName: string): iStatsCheck[] {
    return [];
    // const tempStatMapping: Record<string, iStatsCheck[]> =
    //   this._tempStats.reduce((statsMapping, stat) => {
    //     if (stat.statToModify in statsMapping) {
    //       statsMapping[stat.statToModify].push(stat);
    //     } else {
    //       statsMapping[stat.statToModify] = [stat];
    //     }
    //     return statsMapping;
    //   }, {});

    // const finalMapping: Record<string, iStatsCheck[]> = this._triggers.reduce(
    //   (statsMapping, trigger) => {
    //     if (trigger.triggerType === "always") {
    //       trigger.actions?.forEach((action) => {
    //         const { targetList } = this.findTargets(action.targets);
    //         targetList.forEach((target) => {
    //           if (target.id === this.id) {
    //             action.effects?.forEach(({ condition, stats }) => {
    //               if (
    //                 stats &&
    //                 stats.statToModify &&
    //                 this.checkCondition(condition, this)
    //               ) {
    //                 if (stats.statToModify in statsMapping) {
    //                   statsMapping[stats.statToModify].push(stats);
    //                 } else {
    //                   statsMapping[stats.statToModify] = [stats];
    //                 }
    //               }
    //             });
    //           }
    //         });
    //       });
    //     }
    //     return statsMapping;
    //   },
    //   tempStatMapping
    // );

    // return finalMapping[statName] ?? [];
  }

  private getModifiedStats(
    statusEffectConfig: { hasEffect: boolean; value: number }[],
    baseStat: number,
    tempStats: iStatsCheck[],
    isMultiplicative: boolean = false
  ) {
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
          newStat *= 1 + stat?.amount ?? 0;
        } else {
          newStat += stat?.amount ?? 0;
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

  /** Gets the combat stats of the character
   *
   * @damageType - The type of damage being dealt (physical, special, or true)
   * @stats - An array of stats to modify the starting stat value
   *
   * @returns - A map of the stats
   */
  public getCombatStats(
    damageType?: "physical" | "special" | "true",
    stats?: iStatsCheck[]
  ) {
    const baseStat = damageType === "physical" ? this.physical : this.special;

    return {
      offense: modifyStat(baseStat.offense, "offense", stats),
      critChance: modifyStat(baseStat.critChance, "critChance", stats),
      armorPen: modifyStat(baseStat.armorPen, "armorPen", stats),
      armor: modifyStat(baseStat.armor, "armor", stats),
      dodge: modifyStat(baseStat.dodge, "dodge", stats),
      accuracy: modifyStat(baseStat.accuracy, "accuracy", stats),
      critAvoid: modifyStat(baseStat.critAvoid, "critAvoid", stats),
      maxHealth: this.maxHealth,
      health: this.health,
      maxProtection: this.maxProtection,
      protection: this.protection,
    };
  }
}

/** Modifies the stat based on a flat amount of multimplicative value
 *
 * @startingStatValue - The starting stat value
 * @statType - The type of stat used to modify the starting stat (e.g. offense, health, etc.)
 * @stats - An array of stats to modify the starting stat value
 */
export function modifyStat(
  startingStatValue: number,
  statType: string,
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

export interface iStatsCheck {
  /** The stat that will be modified
   *
   * armor: Increases the amount of offense to mitigate
   *
   * counterChance: The chances of counter attacking (as a decimal)
   *
   * counterDamage: The amount of damage used to scale offense (as a decimal; e.g. 1.5 would be 150% damage)
   *
   * critAvoid: The chances to mitigate a critical hit (as a decimal)
   *
   * critChance: The chances of getting a critical hit (as a decimal)
   *
   * dodge: The chances of missing an attack/effect
   *
   * health: The amount of health
   *
   * maxHealth/maxProtection: The max health or protection
   *
   * offense: The amount of damage an attack deals
   *
   * potency: The chances a negative status effect will successful be inflicted
   *
   * protection: The amount of protection
   *
   * tenacity: The chances to mitigate a negative status effect
   */
  statToModify:
    | "armor"
    | "counterChance"
    | "counterDamage"
    | "critAvoid"
    | "critChance"
    | "dodge"
    | "health"
    | "maxHealth"
    | "maxProtection"
    | "offense"
    | "potency"
    | "protection"
    | "resistance"
    | "tenacity";
  /** The amount that the stat will be modified */
  amount: number;
  /** Determines if the stat will added to the existing stat (additive) or multiplied together (multiplicative) */
  modifiedType: "additive" | "multiplicative";
  /** Todo: whats this? */
  amountType?: "greater" | "less";
  /** Determines when the effect will expire and thus be removed */
  expires?: {
    /** How many cycles before the effect is removed */
    count: number;
    /** How often the effect is checked to see if it should be removed */
    frequency: "turn";
  };
  /** Todo: whats this for? */
  stacking?: boolean;
}

export interface iHeal {
  /** Health or Protection */
  healthType: "health" | "protection";
  /** Determines if the amound should be added to the current health, or scale from the unit's maxHealth/Protection */
  amountType?: "additive" | "multiplicative";
  /** The amount to heal. For percentages, keep the amount a decimal (e.g. 0.4 would be a 40% heal) */
  amount?: number;
  // scale?: number;
}