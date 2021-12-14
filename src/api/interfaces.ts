export interface Unit {
  id: string;
  thumbnailName: string;
  nameKey: string;
}

export interface Gear {
  base_id: string;
  image: string;
  name: string;
}

export interface Player {
  data: _playerData;
  units: UnitData[];
}

export interface UnitData {
  data: _unit;
}

interface _playerData {
  ally_code: number;
  name: string;
  //guild data
  //arena data
  //battles history data
}

interface _unit {
  name: string;
  base_id: string;
  gear: UnitGear[];
  gear_level: number;
  // level: number;
  // omicron_abilities: any[];
  // zeta_abilities: any[];
  relic_tier: number;
  // stats: any[];
  ability_data: _unitAbility[];
  url: string;
}
export interface UnitGear {
  base_id: string;
  is_obtained: boolean;
  slot: number;
}

interface _unitAbility {
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
