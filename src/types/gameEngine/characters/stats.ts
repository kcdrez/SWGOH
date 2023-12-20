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
