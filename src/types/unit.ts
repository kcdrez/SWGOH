export interface UnitBasic {
  id: string;
  name: string;
  image: string;
  gear_levels: UnitTier[];
}

export interface Unit extends UnitBasic {
  gear_level: number;
  nameKey: string;
  tier: number;
  level: number;
  power: number;
  gear: UnitGear[];
  stats: any; //make map on api?
  ability_data: Ability[];
  relic_tier: number;
  has_ultimate: boolean;
  xp: number;
  mods: Mod[];
  crew: Crew[];
  stars: number;
  categories: string[];
  ability_classes: string[];
  role: string;
  alignment: string;
  is_ship?: boolean;
}

export function isUnit(unit: Unit | UnitBasic): unit is Unit {
  return unit ? (<Unit>unit).gear_level !== undefined : false;
}

export interface UnitGear {
  base_id: string;
  is_obtained: boolean;
  slot: number;
}

interface Ability {
  id: string;
  ability_tier: number;
  tier_max: number;
  is_omega: boolean;
  is_zeta: boolean;
  is_omicron: boolean;
  has_omicron_learned: boolean;
  has_zeta_learned: boolean;
  name: string;
}

export interface Mod {
  id: string;
  level: number;
  tier: number;
  slot: number;
  set: number;
  pips: number;
  primaryStat: { unitStat: number; value: number };
  secondaryStat: { unitStat: number; value: number; roll: number }[];
}

export interface UnitTier {
  tier: number;
  gear: string[];
}

interface Crew {
  unitId: string;
  slot: number;
  skillReferenceList: CrewSkill[];
  skilllessCrewAbilityId: string;
  gp: number;
  cp: number;
}

interface CrewSkill {
  skillId: string;
  requiredTier: number;
  requiredRarity: number;
  requiredRelicTier: number;
}
