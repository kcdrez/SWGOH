export interface Player {
  url: string;
  ally_code: number;
  name: string;
  arena: any;
  fleet_arena: any;
  units: PlayerUnit[];
}

export interface PlayerUnit {
  name: string;
  id: string;
  gear_level: number;
  level: number;
  power: number;
  gear: UnitGear[];
  url: string;
  stats: any; //make map on api?
  ability_data: Ability[];
  relic_tier: number;
  has_ultimate: boolean;
  xp: number;
  mods: Mod[];
  crew: Crew[];
  stars: number;
}
export interface UnitGear {
  base_id: string;
  is_obtained: boolean;
  slot: number;
}

export interface EquippedGear {
  equipmentId: string;
  nameKey: string;
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

interface Mod {
  id: string;
  level: number;
  tier: number;
  slot: number;
  set: number;
  pips: number;
  primaryStat: { unitStat: number; value: number };
  secondaryStat: { unitStat: number; value: number; roll: number }[];
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
