import store from "../vuex-store/store";
import { Unit } from "./unit";

export class Team {
  private _id: string;
  private _name?: string;
  private _units: TeamMember[] = [];
  private _gameMode?: string;
  private _sortDir?: "asc" | "desc";
  private _sortMethod?: SortType;
  private _searchName?: string;
  private _owner: string;

  constructor(data: ITeam, playerId: string = "") {
    this._id = data.id;
    this._name = data.name;
    this._owner = playerId;
    this._units = (data?.units || []).map(
      (u) => new TeamMember(u, this._owner)
    );
    this._gameMode = data.gameMode;
    this._sortDir = data.sortDir;
    this._sortMethod = data.sortMethod;
    this._searchName = data.searchName;
  }

  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public set name(val) {
    this._name = val;
    this.save();
  }
  public get units() {
    return this._units;
  }
  public get gameMode() {
    return this._gameMode;
  }
  public set gameMode(val) {
    this._gameMode = val;
    this.save();
  }
  public get sortDir() {
    return this._sortDir;
  }
  public set sortDir(val) {
    this._sortDir = val;
    this.save();
  }
  public get sortMethod() {
    return this._sortMethod;
  }
  public set sortMethod(val) {
    this._sortMethod = val;
    this.save();
  }
  public get searchName() {
    return this._searchName;
  }
  public set searchName(val) {
    this._searchName = val;
    this.save();
  }
  public get fullUnitList() {
    return this.units.sort((a, b) => {
      if (this.sortMethod === "name") {
        if (this.sortDir === "asc") {
          return a.unitData.name.toLowerCase() > b.unitData.name.toLowerCase()
            ? 1
            : -1;
        } else {
          return a.unitData.name.toLowerCase() > b.unitData.name.toLowerCase()
            ? -1
            : 1;
        }
      } else if (this.sortMethod === "leader") {
        if (a.isLeader) {
          return this.sortDir === "asc" ? -1 : 1;
        } else if (b.isLeader) {
          return this.sortDir === "asc" ? 1 : -1;
        }
        return 0;
      } else if (this.sortMethod === "subtotal") {
        if (this.sortDir === "asc") {
          return a.unitData.speed - b.unitData.speed;
        } else {
          return b.unitData.speed - a.unitData.speed;
        }
      } else if (this.sortMethod === "total" || this.sortMethod === undefined) {
        const compareA: number = this.grandTotal(a, true);
        const compareB: number = this.grandTotal(b, true);
        if (this.sortDir === "asc") {
          return compareA - compareB;
        } else {
          return compareB - compareA;
        }
      }
      return 0;
    });
  }
  private get isPlayer() {
    return store.state.player.player?.id === this._owner;
  }
  private get isOpponent() {
    return store.state.opponents.player?.id === this._owner;
  }

  public addUnit(unit: Unit) {
    const exists = this.units.find((x) => x.id === unit.id);
    if (!exists) {
      this._units.push(new TeamMember(unit, this._owner));
      this.save();
    }
  }
  public removeUnit(unit: TeamMember) {
    const unitIndex = this._units.findIndex((x) => x.id === unit.id);
    if (unitIndex >= 0) {
      this._units.splice(unitIndex, 1);
      this.save();
    }
  }
  protected save() {
    if (this.isPlayer) {
      store.dispatch("teams/saveTeams");
    } else if (this.isOpponent) {
      store.dispatch("opponents/saveTeams");
    } else {
      console.warn("Team does not belong to either player nor opponent");
    }
  }

  public sanitize(): ITeam {
    return {
      id: this.id,
      name: this.name,
      units: this.units.map((x) => x.sanitize()),
      gameMode: this.gameMode,
      sortDir: this.sortDir,
      sortMethod: this.sortMethod,
    };
  }

  public leaderSpeedBonus(unit: TeamMember, checkGameMode: boolean): number {
    const leader = this.units.find(
      (teamMember) => teamMember.isLeader && unit.owner === teamMember.owner
    );
    const leaderAbility = leader?.leaderAbility;
    if (leader && leaderAbility) {
      if (leaderAbility.scalesBy) {
        if (anyTagsMatch(unit.unitData, leader.id, leaderAbility.tags || [])) {
          return this.units.reduce((total: number, unit: any) => {
            if (
              anyTagsMatch(
                unit.unitData,
                leader.id,
                leaderAbility?.scalesBy || []
              )
            ) {
              total += leaderAbility.value || 0;
            }
            return total;
          }, 0);
        }
      } else {
        return Math.floor(
          unitMatchesLeader(
            leaderAbility,
            unit.unitData,
            leader.id,
            this.gameMode,
            checkGameMode
          )
        );
      }
    }
    return 0;
  }

  public uniqueSpeedBonus(unit: TeamMember, checkGameMode: boolean): number {
    const uniqueAbilityList = unit?.uniqueAbility;
    let amount = 0;
    (uniqueAbilityList || []).forEach((ability) => {
      amount += getUniqueAbilitySpeed(
        ability,
        unit.unitData,
        this,
        checkGameMode
      );
    });
    return Math.floor(amount); //todo why .floor?
  }

  public speedBonusFromTeamMembers(
    unit: TeamMember,
    checkGameMode: boolean
  ): number {
    let amount = 0;

    this.units.forEach((member) => {
      if (member.owner === unit.owner) {
        const uniqueAbilityList = member.uniqueAbility;

        (uniqueAbilityList || []).forEach((ability) => {
          amount += getUniqueFromTeamMembers(
            ability,
            unit.unitData,
            this,
            member,
            checkGameMode
          );
        });
      }
    });
    return Math.floor(amount);
  }

  public grandTotal(unit: TeamMember, checkGameMode: boolean): number {
    return Math.floor(
      unit.unitData.speed +
        this.leaderSpeedBonus(unit, checkGameMode) +
        this.uniqueSpeedBonus(unit, checkGameMode) +
        this.speedBonusFromTeamMembers(unit, checkGameMode)
    );
  }
}

export interface ITeam {
  id: string;
  name?: string;
  units?: ITeamMember[];
  gameMode?: string;
  sortDir?: "asc" | "desc";
  sortMethod?: SortType;
  searchName?: string;
}

interface ITeamMember {
  id: string;
  isLeader?: boolean;
  owner?: string;
}

export class TeamMember {
  private _id: string;
  private _isLeader?: boolean;
  private _owner?: string;

  constructor(data: ITeamMember, owner: string) {
    this._id = data.id;
    this._isLeader = data.isLeader;
    this._owner = data.owner || owner;
  }

  public get id() {
    return this._id;
  }
  public get isLeader() {
    return this._isLeader;
  }
  public set isLeader(val) {
    this._isLeader = val;
    this.save();
  }
  public get owner() {
    return this._owner;
  }
  public get ownerName() {
    return this._owner; //todo
  }

  public get unitData() {
    if (this.isPlayer) {
      const unitData: Unit = store.getters["player/unitData"](this.id);
      return unitData;
    } else {
      const unitData: Unit = store.getters["opponents/unitData"](this.id);
      return unitData;
    }
  }

  public get abilityData(): UnitSpeedAbility | undefined {
    const abilityData = store.state.teams.speedAbilityData[this.id];
    return abilityData;
  }
  public get leaderAbility() {
    return this.abilityData?.leader;
  }
  public get uniqueAbility() {
    return this.abilityData?.unique;
  }
  private get isPlayer() {
    return store.state.player.player?.id === this._owner;
  }
  private get isOpponent() {
    return store.state.opponents.player?.id === this._owner;
  }

  public sanitize(): ITeamMember {
    return {
      id: this.id,
      isLeader: this.isLeader,
    };
  }

  protected save() {
    if (this.isPlayer) {
      store.dispatch("teams/saveTeams");
    } else if (this.isOpponent) {
      store.dispatch("opponents/saveTeams");
    } else {
      console.warn("Team Member does not belong to either player nor opponent");
    }
  }
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

export interface IMatch extends ITeam {
  playerTeamId: string;
  opponentTeamId: string;
}

export class Match extends Team {
  private _playerTeamId: string;
  private _opponentTeamId: string;

  constructor(data: IMatch) {
    super(data);
    this._playerTeamId = data.playerTeamId;
    this._opponentTeamId = data.opponentTeamId;
  }

  public get playerTeamId() {
    return this._playerTeamId;
  }
  public get opponentTeamId() {
    return this._opponentTeamId;
  }
  public get playerTeam() {
    const playerTeam: Team | undefined = store.state.teams.teams.find(
      (team) => team.id === this.playerTeamId
    );
    return playerTeam;
  }
  public get opponentTeam() {
    const opponentTeam: Team | undefined = store.state.opponents.teams.find(
      (team) => team.id === this.opponentTeamId
    );

    return opponentTeam;
  }
  public get units() {
    return [
      ...(this.playerTeam?.units || []),
      ...(this.opponentTeam?.units || []),
    ];
  }

  protected save() {
    store.dispatch("opponent/saveMatches");
  }

  public sanitize(): IMatch {
    return {
      id: this.id,
      gameMode: this.gameMode,
      sortDir: this.sortDir,
      sortMethod: this.sortMethod,
      playerTeamId: this.playerTeamId,
      opponentTeamId: this.opponentTeamId,
    };
  }
}

function unitMatchesLeader(
  leader: SpeedAbility,
  unit: Unit,
  leaderId: string,
  gameMode: string = "",
  checkGameMode: boolean = false
): number {
  if (leader.omicron && gameMode === leader.omicron.mode && checkGameMode) {
    return unitMatchesLeader(leader.omicron, unit, leaderId);
  } else if (leader.special && leader.special.tags) {
    if (anyTagsMatch(unit, leaderId, leader.special.tags)) {
      return leader.special.value || 0;
    } else if (anyTagsMatch(unit, leaderId, leader.tags || [])) {
      return leader.value || 0;
    }
  } else if (leader.tags) {
    if (anyTagsMatch(unit, leaderId, leader.tags)) {
      return leader.value || 0;
    }
  }
  return 0;
}

function allTagsMatch(
  unit: Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  return tagsList.some((x) => {
    let matchesList: boolean[] = [];
    const split = x.split(" & ").map((x) => x.trim());

    split.forEach((el) => {
      let tagMatches = false;
      if (unit.alignment === el) {
        tagMatches = true;
      } else if (unit.categories.includes(el)) {
        tagMatches = true;
      } else if (el === "Self" && unit.id === leaderId) {
        tagMatches = true;
      }
      matchesList.push(tagMatches);
    });
    return matchesList.every((x) => x === true);
  });
}

function anyTagsMatch(
  unit: Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  if (tagsList.includes("!Self") && unit.id === leaderId) {
    return false;
  } else if (tagsList.some((r) => r.includes("&"))) {
    return allTagsMatch(unit, leaderId, tagsList);
  } else if (tagsList.some((r) => unit.alignment === r)) {
    return true;
  } else if (tagsList.some((r) => unit.categories.includes(r))) {
    return true;
  } else if (tagsList.includes("Self") && unit.id === leaderId) {
    return true;
  } else if (tagsList.some((r) => r === "Ally")) {
    return true;
  } else if (tagsList.some((t) => t === unit.id)) {
    return true;
  }
  return false;
}

function getSpeedAmount(value: number | undefined, baseSpeed: number): number {
  if (value) {
    if (value < 1) {
      return baseSpeed * value;
    } else {
      return value;
    }
  }
  return 0;
}

function getUniqueAbilitySpeed(
  ability: SpeedAbility,
  unitData: Unit,
  team: Team,
  checkGameMode: boolean
): number {
  if (ability.scalesBy) {
    if (anyTagsMatch(unitData, unitData.id, ability.tags || [])) {
      return team.units.reduce((total: number, member: TeamMember) => {
        if (member.id === unitData.id && ability.scalesBy?.includes("!Self")) {
          //do nothing
        } else if (
          anyTagsMatch(member.unitData, unitData.id, ability?.scalesBy || [])
        ) {
          if (ability.scalesBy?.includes("Self")) {
            if (ability.scaleSource === "total") {
              total += getSpeedAmount(
                ability.value,
                team.grandTotal(member, checkGameMode)
              );
            } else if (ability.scaleSource === "unique") {
              const uniqueTotal = team.uniqueSpeedBonus(member, checkGameMode);
              const speedAmount = getSpeedAmount(
                ability.value,
                uniqueTotal + member.unitData.speed
              );
              total += speedAmount;
            } else {
              total += getSpeedAmount(ability.value, member.unitData.speed);
            }
          } else {
            total += getSpeedAmount(ability.value, unitData.speed);
          }
        }
        return total;
      }, 0);
    }
  } else if (
    ability.omicron &&
    team.gameMode === ability.omicron.mode &&
    checkGameMode
  ) {
    return getUniqueAbilitySpeed(
      ability.omicron,
      unitData,
      team,
      checkGameMode
    );
  } else {
    return getSpeedAmount(ability.value, unitData.speed);
  }
  return 0;
}

function getUniqueFromTeamMembers(
  ability: SpeedAbility,
  unit: Unit,
  fullTeam: Team,
  sourceMember: TeamMember,
  checkGameMode: boolean
): number {
  let amount = 0;
  if (
    ability.omicron &&
    fullTeam.gameMode === ability.omicron.mode &&
    checkGameMode
  ) {
    return getUniqueFromTeamMembers(
      ability.omicron,
      unit,
      fullTeam,
      sourceMember,
      checkGameMode
    );
  } else if (
    anyTagsMatch(unit, sourceMember.id, ability?.tags || []) &&
    sourceMember.id !== unit.id
  ) {
    if (ability.scalesBy?.includes("Self")) {
      if (ability.scaleSource === "total") {
        const total = fullTeam.grandTotal(sourceMember, checkGameMode);
        amount += getSpeedAmount(ability.value, total);
      } else if (ability.scaleSource === "unique") {
        const uniqueTotal = fullTeam.uniqueSpeedBonus(
          sourceMember,
          checkGameMode
        );
        const speedAmount = getSpeedAmount(
          ability.value,
          uniqueTotal + sourceMember.unitData.speed
        );
        amount += speedAmount;
      } else {
        amount += getSpeedAmount(ability.value, sourceMember.unitData.speed);
      }
    } else {
      amount += getUniqueAbilitySpeed(ability, unit, fullTeam, checkGameMode);
    }
  }
  return amount;
}
