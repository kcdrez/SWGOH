export interface Team {
  id: string;
  name: string;
  units: TeamMember[];
  gameMode?: string;
  sortDir?: "asc" | "desc";
  sortMethod?: SortType;
  searchName?: string;
}

export interface TeamMember {
  id: string;
  speedBonus: number;
  isLeader?: boolean;
}

export type SortType = "leader" | "name" | "subtotal" | "total" | undefined;
export interface SpeedConfig {
  [key: string]: UnitSpeedAbility;
}

interface UnitSpeedAbility {
  leader?: SpeedAbility;
  unique?: SpeedAbility[];
}

interface BasicSpeedAbility {
  value?: number;
  tags?: string[];
  note?: string;
  scalesBy?: string[];
}
export interface SpeedAbility extends BasicSpeedAbility {
  special?: BasicSpeedAbility;
  omicron?: OmicronAbility;
}

interface OmicronAbility extends SpeedAbility {
  mode: "Territory War" | "Territory Battle" | "Grand Arena";
}
