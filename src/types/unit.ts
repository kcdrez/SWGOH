export interface Unit {
  id: string;
  name: string;
  gear_level: number;
  thumbnailName: string;
  nameKey: string;
  unitTierList: UnitTier[];
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

interface UnitTier {
  tier: number;
  equipmentSetList: string[];
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
