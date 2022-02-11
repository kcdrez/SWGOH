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
  isLeader?: boolean;
  owner?: string;
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
  scaleSource?: "total" | "unique";
}
export interface SpeedAbility extends BasicSpeedAbility {
  special?: BasicSpeedAbility;
  omicron?: OmicronAbility;
}

interface OmicronAbility extends SpeedAbility {
  mode: "Territory War" | "Territory Battle" | "Grand Arena";
}

export interface MatchPayload {
  playerTeam: Team | null;
  opponentTeam: Team | null;
  id?: string;
}

export interface Match extends Team {
  playerTeamId: string;
  opponentTeamId: string;
}
