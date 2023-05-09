import _ from "lodash";

import store from "vuex-store/store";
import { Mod, Unit } from "./unit";
import { sortValues } from "utils";

export class Team {
  private _id: string;
  private _name?: string;
  protected _units: TeamMember[] = [];
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
    if (val !== this._name) {
      this._name = val;
      this.save();
    }
  }
  public get units() {
    return this._units;
  }
  public get gameMode() {
    return this._gameMode;
  }
  public set gameMode(val) {
    if (val !== this._gameMode) {
      this._gameMode = val;
      this.save();
    }
  }
  public get sortDir() {
    return this._sortDir;
  }
  public set sortDir(val) {
    if (val !== this._sortDir) {
      this._sortDir = val;
      this.save();
    }
  }
  public get sortMethod() {
    return this._sortMethod;
  }
  public set sortMethod(val) {
    if (val !== this._sortMethod) {
      this._sortMethod = val;
      this.save();
    }
  }
  public get searchName() {
    return this._searchName;
  }
  public set searchName(val) {
    if (val !== this._searchName) {
      this._searchName = val;
      this.save();
    }
  }
  public get fullUnitList() {
    return this.units.sort((a, b) => {
      if (this.sortMethod === "subTotal") {
        return sortValues(
          a.speed,
          b.speed,
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "total" || this.sortMethod === undefined) {
        return sortValues(
          this.grandTotal(a, true),
          this.grandTotal(b, true),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "square") {
        return sortValues(
          speedValueFromMod(a.mods[0]),
          speedValueFromMod(b.mods[0]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "diamond") {
        return sortValues(
          speedValueFromMod(a.mods[2]),
          speedValueFromMod(b.mods[2]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "circle") {
        return sortValues(
          speedValueFromMod(a.mods[4]),
          speedValueFromMod(b.mods[4]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "arrow") {
        return sortValues(
          speedValueFromMod(a.mods[1]),
          speedValueFromMod(b.mods[1]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "triangle") {
        return sortValues(
          speedValueFromMod(a.mods[3]),
          speedValueFromMod(b.mods[3]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "cross") {
        return sortValues(
          speedValueFromMod(a.mods[5]),
          speedValueFromMod(b.mods[5]),
          this.sortDir ?? "asc",
          this.sortMethod
        );
      } else if (this.sortMethod === "speedSet") {
        return sortValues(
          a.hasSpeedSet,
          b.hasSpeedSet,
          this.sortDir ?? "asc",
          this.sortMethod
        );
      }
      return sortValues(a, b, this.sortDir ?? "asc", this.sortMethod);
    });
  }
  private get isPlayer() {
    return store.state.player.player?.id === this._owner;
  }
  private get isOpponent() {
    return store.state.opponents.player?.id === this._owner;
  }

  public sortIcon(type: SortType): string {
    if (this._sortMethod === type) {
      return this._sortDir === "asc" ? "fa-sort-down" : "fa-sort-up";
    } else {
      return "fa-sort";
    }
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

  protected save2 = _.debounce(() => {
    //todo: test if this works and can replace the above function
    if (this.isPlayer) {
      store.dispatch("teams/saveTeams");
    } else if (this.isOpponent) {
      store.dispatch("opponents/saveTeams");
    } else {
      console.warn("Team does not belong to either player nor opponent");
    }
  }, 500);

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
    const leaderAbilityList = (leader?.leaderAbility ?? []).filter(
      (ability) => ability.type === "speed"
    );
    let amount = 0;
    (leaderAbilityList || []).forEach((leaderAbility) => {
      if (leader && leaderAbility) {
        if (leaderAbility.scalesBy) {
          if (anyTagsMatch(unit, leader.id, leaderAbility.tags || [])) {
            amount += this.units.reduce((total: number, unit: any) => {
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
          amount += Math.floor(
            unitMatchesLeader(
              leaderAbility,
              unit,
              leader.id,
              this.gameMode,
              checkGameMode
            )
          );
        }
      }
    });
    return amount;
  }

  public uniqueSpeedBonus(unit: TeamMember, checkGameMode: boolean): number {
    const uniqueAbilityList = unit?.uniqueAbility;
    let amount = 0;
    (uniqueAbilityList || []).forEach((ability) => {
      if (ability.type === "speed") {
        amount += getUniqueAbilitySpeed(ability, unit, this, checkGameMode);
      }
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
        const uniqueAbilityList = (member.uniqueAbility ?? []).filter(
          (ability) => ability.type === "speed"
        );

        uniqueAbilityList.forEach((ability) => {
          amount += getUniqueFromTeamMembers(
            ability,
            unit,
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
      unit.speed +
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
  private _unitData: Unit;

  constructor(data: ITeamMember, owner: string) {
    this._id = data.id;
    this._isLeader = data.isLeader;
    this._owner = data.owner || owner;
    this._unitData = this.getUnitData();
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
    if (store.state.player.player?.id === this._owner) {
      return store.state.player.player?.name;
    } else if (store.state.opponents.player?.id === this._owner) {
      return store.state.opponents.player?.name;
    } else {
      return this._owner;
    }
  }
  public get name() {
    return this._unitData.name;
  }
  public get speed() {
    return this._unitData.speed;
  }
  public get hasSpeedSet() {
    return this._unitData.hasSpeedSet;
  }
  public get alignment() {
    return this._unitData.alignment;
  }
  public get categories() {
    return this._unitData.categories;
  }
  public get mods() {
    return this._unitData.mods;
  }

  private getUnitData() {
    if (this.isPlayer) {
      const unitData: Unit = store.getters["player/unitData"](this.id);
      return unitData;
    } else {
      const unitData: Unit = store.getters["opponents/unitData"](this.id);
      return unitData;
    }
  }

  public get abilityData(): AbilityStat | undefined {
    const abilityData = store.state.teams.abilityStatsData[this.id];
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

export type SortType =
  | "isLeader"
  | "name"
  | "subTotal"
  | "total"
  | "square"
  | "triangle"
  | "circle"
  | "diamond"
  | "diamond"
  | "arrow"
  | "cross"
  | "speedSet"
  | undefined;
export interface SpeedConfig {
  [key: string]: AbilityStat;
}

export interface AbilityStat {
  leader?: IAbilityStat[];
  unique?: IAbilityStat[];
}

interface IBasicAbilityStat {
  value?: number;
  tags?: string[];
  note?: string;
  type:
    | "speed"
    | "protection"
    | "health"
    | "damage mitigation"
    | "protection up";
  flat?: boolean;
  scalesBy?: string[];
  scaleSource?: "total" | "unique";
  conditions?: {
    allAllies?: boolean;
    tags?: string[];
    leader?: string[];
    solo?: boolean;
    enemyLeader?: boolean;
  }[];
}
export interface IAbilityStat extends IBasicAbilityStat {
  omicron?: OmicronAbility;
}

export type tOmicronMode =
  | "Territory Wars"
  | "Territory Battle"
  | "Grand Arena";

interface OmicronAbility extends IAbilityStat {
  mode: tOmicronMode;
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
    this.updateUnitList();

    store.watch(
      (state) => {
        return state.teams.teams;
      },
      (teamsList) => {
        const match = teamsList.find((t) => t.id === this._playerTeamId);
        const equal = _.isEqual(match, this);
        if (!equal) {
          this.updateUnitList();
        }
      },
      { deep: true }
    );
    store.watch(
      (state) => {
        return state.opponents.teams;
      },
      (teamsList) => {
        const match = teamsList.find((t) => t.id === this._opponentTeamId);
        const equal = _.isEqual(match, this);
        if (!equal) {
          this.updateUnitList();
        }
      },
      { deep: true }
    );
  }

  public get playerTeamId() {
    return this._playerTeamId;
  }
  public get opponentTeamId() {
    return this._opponentTeamId;
  }
  public get playerTeam() {
    return store.state.teams.teams.find(
      (team) => team.id === this.playerTeamId
    );
  }
  public get opponentTeam() {
    return store.state.opponents.teams.find(
      (team) => team.id === this.opponentTeamId
    );
  }

  private updateUnitList() {
    //todo: this isnt reactive when adding/removing units on the matchTable component
    this._units = [
      ...(this.playerTeam?.units || []),
      ...(this.opponentTeam?.units || []),
    ];
  }

  protected save() {
    //todo debounce
    store.dispatch("opponents/saveMatches", { root: true });
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
  leader: IAbilityStat,
  unit: TeamMember,
  leaderId: string,
  gameMode: string = "",
  checkGameMode: boolean = false
): number {
  if (leader.omicron && gameMode === leader.omicron.mode && checkGameMode) {
    return unitMatchesLeader(leader.omicron, unit, leaderId);
  } else if (leader.tags) {
    if (anyTagsMatch(unit, leaderId, leader.tags)) {
      return leader.value || 0;
    }
  }
  return 0;
}

export function allTagsMatch(
  unit: TeamMember | Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  return tagsList.some((x) => {
    let matchesList: boolean[] = [];
    const split = x.split(" & ").map((x) => x.trim());

    split.forEach((tag) => {
      let tagMatches = false;
      if (tag.charAt(0) === "!") {
        const value = tag.substring(1);
        tagMatches = !tagMatch(value, unit, leaderId);
      } else {
        tagMatches = tagMatch(tag, unit, leaderId);
      }
      matchesList.push(tagMatches);
    });
    return matchesList.every((x) => x === true);
  });
}

function tagMatch(tag: string, unit: TeamMember | Unit, leaderId: string) {
  if (tag === "Self") {
    return unit.id === leaderId;
  } else if (tag === "Light Side" || tag === "Dark Side") {
    return unit.alignment === tag;
  } else if (unit.categories.includes(tag)) {
    return true;
  } else if (tag === "Leader Slot") {
    return true;
  } else if (tag === leaderId) {
    return true;
  }
  return false;
}

export function anyTagsMatch(
  unit: TeamMember | Unit,
  leaderId: string,
  tagsList: string[]
): boolean {
  if (tagsList.some((r) => r.includes("&"))) {
    return allTagsMatch(unit, leaderId, tagsList);
  } else {
    return tagsList.some((tag) => {
      if (tag.charAt(0) === "!") {
        const value = tag.substring(1);
        return !tagMatch(value, unit, leaderId);
      } else {
        return tagMatch(tag, unit, leaderId);
      }
    });
  }
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
  ability: IAbilityStat,
  unit: TeamMember,
  team: Team,
  checkGameMode: boolean
): number {
  if (ability.scalesBy) {
    if (anyTagsMatch(unit, unit.id, ability.tags || [])) {
      return team.units.reduce((total: number, member: TeamMember) => {
        if (member.id === unit.id && ability.scalesBy?.includes("!Self")) {
          //do nothing
        } else if (anyTagsMatch(member, unit.id, ability?.scalesBy || [])) {
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
                uniqueTotal + member.speed
              );
              total += speedAmount;
            } else {
              total += getSpeedAmount(ability.value, member.speed);
            }
          } else {
            total += getSpeedAmount(ability.value, unit.speed);
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
    return getUniqueAbilitySpeed(ability.omicron, unit, team, checkGameMode);
  } else {
    return getSpeedAmount(ability.value, unit.speed);
  }
  return 0;
}

function getUniqueFromTeamMembers(
  ability: IAbilityStat,
  unit: TeamMember,
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
          uniqueTotal + sourceMember.speed
        );
        amount += speedAmount;
      } else {
        amount += getSpeedAmount(ability.value, sourceMember.speed);
      }
    } else {
      amount += getUniqueAbilitySpeed(ability, unit, fullTeam, checkGameMode);
    }
  }
  return amount;
}

export function speedValueFromMod(mod: Mod | undefined): number {
  if (mod) {
    if (mod.primary_stat.stat_id === 5) {
      return mod.primary_stat.value;
    } else {
      const match = mod.secondary_stats.find((x) => x.stat_id === 5);
      if (match) {
        return match.value;
      }
    }
  }
  return 0;
}
