import { iTrigger } from "./gameEngine";
import { iAbility } from "./abilities";

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
  triggers?: iTrigger[];
  /** Unique identifier */
  id: string;
  /** The original source of the effect */
  sourceAbility?: iAbility | null;
  /** Determines if more than one of the effect can be applied to a target */
  isStackable?: boolean;
  /** The maximum number of stacks of this effect */
  maxStacks?: number;
}
