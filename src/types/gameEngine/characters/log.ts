import { ActiveAbility, Ability } from "./abilities";
import { iBuff, iDebuff, iStatusEffect } from "./statusEffects";
import { Character } from "./index";

/** A type used to log any ability information */
type tLogAbility = {
  used?: null | { name: string; id: string; text: string };
  source?: null | { name: string; id: string; text: string };
};

/** A type used to log any damage information */
type tLogDamage = {
  isCrit?: boolean;
  amount?: number;
  evaded?: boolean;
  bonus?: boolean;
};

/** A type used to log any healing information */
type tLogHeal = { amount: number; type: "health" | "protection" | null };

/** A type used to log any misc. effects that may have occured */
type tLogEffects = {
  assisted?: boolean;
  countered?: boolean;
  turnMeter?: number;
  cooldown?: {
    ability: null | { name: string; id: string; text: string };
    amount: number;
  };
  defeated?: boolean;
  winner?: string;
  stunned?: boolean;
  revived?: boolean;
};

/** A type used to log any status effects (such as buffs or debuffs) that may have been applied or removed */
type tLogStatusEffect = {
  type: "buff" | "debuff" | "statusEffect" | null;
  list: {
    name: string;
    duration: number;
    sourceAbility?: { id: string; name: string; text: string };
  }[];

  resisted?: boolean;
  removed?: boolean;
  duration?: number;
  immune?: boolean;
  prevented?: string;
  reset?: number;
};

/** A container type that has all the logging information of what has occured */
export type tLogData = {
  name: string;
  owner: string;
  health: {
    current: number;
    max: number;
    base: number;
  };
  protection: {
    current: number;
    max: number;
    base: number;
    bonus: number;
  };
  activeAbilities: {
    name: string;
    cooldown?: number | null;
    id: string;
    text: string;
  }[];
  buffs: {
    name: string;
    duration: number;
    cantResist?: boolean;
    cantPrevent?: boolean;
    cantDispel?: boolean;
    unique?: boolean;
  }[];
  debuffs: {
    name: string;
    duration: number;
    cantResist?: boolean;
    cantPrevent?: boolean;
    cantDispel?: boolean;
    unique?: boolean;
  }[];
  statusEffects: {
    name: string;
    duration: number;
    cantResist?: boolean;
    cantPrevent?: boolean;
    cantDispel?: boolean;
    unique?: boolean;
  }[];
  physical: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  special: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  general: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  otherEffects: {
    ignoreTaunt: boolean;
    immunity: Record<
      string,
      {
        value: boolean;
        sourceAbility?: { name: string; id: string; text: string };
      }
    >;
  };
  turnMeter: number;
};

export interface iLog {
  // character?: Character;
  // target?: Character;
  statusEffects?: tLogStatusEffect;
  ability?: tLogAbility;
  damage?: tLogDamage;
  heal?: tLogHeal;
  effects?: tLogEffects;
  customMessage?: string;
  characterLogData?: tLogData;
  targetLogData?: tLogData;
}
/**
 * A class object that contains any log information
 * @class Log
 */
export class Log {
  // public character?: Character;
  // public target?: Character;
  public ability?: tLogAbility;
  public damage?: tLogDamage;
  public statusEffects?: tLogStatusEffect;
  public heal?: tLogHeal;
  public effects?: tLogEffects;
  public characterLogData?: tLogData;
  public targetLogData?: tLogData;
  public customMessage?: string;

  constructor(data: iLog) {
    // this.character = data?.character;
    // this.target = data?.target;
    this.statusEffects = data?.statusEffects;
    this.ability = data?.ability;
    this.damage = data?.damage;
    this.heal = data?.heal;
    this.effects = data?.effects;
    this.customMessage = data.customMessage;
    this.characterLogData = data.characterLogData;
    this.targetLogData = data.targetLogData;
  }
}
