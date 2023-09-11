import { iTrigger, iAction } from "./gameEngine";

/** A generic ability container that all abilities share */
export interface iGeneralAbility {
  /** A unique identifier */
  id: string;
  /** The name of the ability */
  name: string;
  /** Anything that will happen based on various states or actions being done (such as taking damage) */
  triggers?: iTrigger[];
  /** Sort the ability before or after other abilities */
  sort?: number;
  /** This ability is targeting various other units and causing effects on them (such as buffs or damage) */
  actions?: iAction[];
}
export interface iBasicAbility extends iGeneralAbility {}

/** Special Abilities */
export interface iSpecialAbility extends iGeneralAbility {
  /** How many turns are left before this ability can be used */
  turnsRemaining: number;
  /** Maximum amount that determines how many turns must pass before the ability can be used again */
  cooldown: number;
}
export interface iAbility
  extends iBasicAbility,
    iSpecialAbility,
    iUniqueAbility {}

export interface iUniqueAbility extends iGeneralAbility {}
