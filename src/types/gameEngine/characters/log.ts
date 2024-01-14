import { ActiveAbility } from "./abilities";
import { iBuff, iDebuff, iStatusEffect } from "./statusEffects";
import { Character } from "./index";

type tLogAbility = {
  used?: null | ActiveAbility;
  source?: null | ActiveAbility;
};

type tLogDamage = {
  isCrit?: boolean;
  amount?: number;
  evaded?: boolean;
  bonus?: boolean;
};

type tLogHeal = { amount: number; type: "health" | "protection" | null };

type tLogEffects = {
  assisted?: boolean;
  countered?: boolean;
  turnMeter?: number;
  cooldown?: {
    ability: null | ActiveAbility;
    amount: number;
  };
  defeated?: boolean;
  winner?: string;
  stunned?: boolean;
};

type tLogStatusEffect = {
  type: "buff" | "debuff" | "statusEffect" | null;
  list: iBuff[] | iDebuff[] | iStatusEffect[];
  resisted?: boolean;
  removed?: boolean;
  duration?: number;
  immune?: boolean;
  prevented?: boolean;
};

export type tLogData = {
  name: string;
  owner: string;
  health: {
    current: number;
    max: number;
  };
  protection: {
    current: number;
    max: number;
  };
  activeAbilities: ActiveAbility[];
  buffs: iBuff[];
  debuffs: iDebuff[];
  statusEffects: iStatusEffect[];
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
  // triggers: iTrigger[];
  otherEffects: { ignoreTaunt: boolean; immunity: Record<string, boolean> };
  turnMeter: number;
};

export class Log {
  public character?: Character;
  public target?: Character;
  public ability?: tLogAbility;
  public damage?: tLogDamage;
  public statusEffects?: tLogStatusEffect;
  public heal?: tLogHeal;
  public effects?: tLogEffects;
  public characterLogData?: tLogData;
  public targetLogData?: tLogData;

  constructor(data: {
    character?: Character;
    target?: Character;
    statusEffects?: tLogStatusEffect;
    ability?: tLogAbility;
    damage?: tLogDamage;
    heal?: tLogHeal;
    effects?: tLogEffects;
  }) {
    this.character = data?.character;
    this.target = data?.target;
    this.statusEffects = data?.statusEffects;
    this.ability = data?.ability;
    this.damage = data?.damage;
    this.heal = data?.heal;
    this.effects = data?.effects;

    if (this.character) {
      this.characterLogData = this.character.getLogs();
    }
    if (this.target) {
      this.targetLogData = this.target.getLogs();
    }
  }
}
