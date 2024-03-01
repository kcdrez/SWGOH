import _ from "lodash";
// import store from "vuex-store/store";
import { Character } from "./characters/index";
import { randomNumber } from "./characters/utils";
import { Log, iLog } from "./characters/log";
import { iBuff, tBuff, tDebuff } from "./characters/statusEffects";
import { iStatsCheck } from "./characters/stats";
import { loadingState } from "types/loading";

/** Data used to determine certain things */
export interface iCondition {
  /** Checks if a debuff is present */
  debuffs?: tDebuff[];
  /** Checks if a buff is present */
  buffs?: (tBuff | iBuff)[];
  /** Checks if a specific stat meets a threshold */
  stats?: iStatsCheck;
  /** Inverts the logic so that all conditions are "Not" */
  inverted?: boolean;
  /** Checks if an effect is new */
  isNew?: boolean;
  /** Checks if a tag is present. Can use '!' (not) or '&' (and) to combine with any other tags */
  tags?: string[];
  /** Checks if turn meter is at a certain threshold */
  tm?: {
    /** The amount of turn meter to check. Use whole numbers (so 100% turn meter would be '100') */
    amount: number;
    /** Checks if the current turn meter should be greater than the amount (true) or less than the amount (false) */
    greaterThan: boolean;
  };
  /** Checks if its the current character's turn. or something todo */
  onTurn?: boolean;
}

export class Turn {
  public logs: iLog[] = [];
  public endOfTurnLogs: iLog[] = [];
  private _turnNumber: number = 0;
  private _character: Character | null = null;
  private _label: string | null = null;
  public characterList: { name: string; owner: string; turnMeter: number }[] =
    [];
  private engine: Engine;

  constructor(
    turnNumber: number,
    character: Character | null,
    gameEngine: Engine,
    logs?: iLog[],
    endOfTurnLogs?: iLog[],
    label?: string | null
  ) {
    this._turnNumber = turnNumber;
    this._character = character;
    this.logs = logs ?? [];
    this.endOfTurnLogs = endOfTurnLogs ?? [];
    this._label = label ?? null;
    this.engine = gameEngine;

    this.characterList = this.engine.allCharacters
      .map((c) => {
        const logs = c.getLogs();
        return {
          name: c.name,
          owner: c.owner,
          turnMeter: _.round(logs.turnMeter, 2),
        };
      })
      .sort((a, b) => {
        return a.turnMeter > b.turnMeter ? -1 : 1;
      });
  }

  get turnNumber() {
    return this._turnNumber;
  }
  get character() {
    return this._character;
  }
  get label() {
    return this._label ?? `Turn ${this.turnNumber}`;
  }

  addLogs(logs: iLog[], endOfTurn?: boolean) {
    if (endOfTurn || this.endOfTurnLogs.length > 0) {
      this.endOfTurnLogs.push(...logs.filter((l) => !!l));
    } else {
      this.logs.push(...logs.filter((l) => !!l));
    }
  }

  public sanitize(): iTurn {
    return {
      label: this.label,
      turnNumber: this.turnNumber,
      logs: this.logs,
      endOfTurnLogs: this.endOfTurnLogs,
      characterList: this.characterList,
    };
  }
}

export interface iTurn {
  label: string;
  turnNumber: number;
  logs: iLog[];
  endOfTurnLogs: iLog[];
  characterList: { name: string; owner: string; turnMeter: number }[];
}

export interface iSimulation {
  matchHistory: iTurn[][];
  playerWins: number;
  opponentWins: number;
  playerWinRate?: number;
  // total: number;
}

export class Engine {
  private _playerCharacters: Character[] = [];
  private _opponentCharacters: Character[] = [];
  private _simulationData: iSimulation = {
    // total: 1,
    playerWins: 0,
    opponentWins: 0,
    matchHistory: [],
  };
  public turns: Turn[] = [];

  constructor() {}

  public get allCharacters() {
    return [...this._playerCharacters, ...this._opponentCharacters];
  }
  // public get totalSimulations() {
  //   return this._simulationData.total;
  // }
  // public set totalSimulations(val: number) {
  //   if (val <= 10) {
  //     this._simulationData.total = val;
  //   }
  // }
  public get matchHistory(): iTurn[][] {
    return this._simulationData.matchHistory;
  }
  public get playerWins() {
    return this._simulationData.playerWins;
  }
  public get opponentWins() {
    return this._simulationData.opponentWins;
  }
  public get playerWinRate(): number {
    return (
      _.round(this.playerWins / (this.playerWins + this.opponentWins), 2) * 100
    );
  }
  public get opponentWinRate(): number {
    return (
      _.round(this.opponentWins / (this.playerWins + this.opponentWins), 2) *
      100
    );
  }
  public get currentCharactersTurn() {
    if (this.turns.length) {
      return this.turns[this.turns.length - 1].character;
    } else {
      return null;
    }
  }

  public startSimulation(
    playerUnits: Character[],
    opponentUnits: Character[],
    amountOfSimulations: number
  ): iSimulation {
    this._simulationData.matchHistory = [];
    this._simulationData.opponentWins = 0;
    this._simulationData.playerWins = 0;

    for (let i = 0; i < amountOfSimulations; i++) {
      this.initializeMatch(playerUnits, opponentUnits);

      let turnNumber = 0;
      do {
        console.time("turn");
        turnNumber++;
        this.nextTurn(turnNumber);
        if (this.checkMatchEnd(turnNumber, 9999)) {
          this._simulationData.matchHistory.push(
            this.turns.map((t) => t.sanitize())
          );
          break;
        }
        console.timeEnd("turn");
      } while (true);
    }

    return {
      matchHistory: this.matchHistory,
      playerWins: this._simulationData.playerWins,
      opponentWins: this._simulationData.opponentWins,
      playerWinRate: this.playerWinRate,
    };
  }

  private initializeMatch(
    playerUnits: Character[],
    opponentUnits: Character[]
  ) {
    this.turns = [new Turn(0, null, this, [], [], "Initialilze Match")];
    this._playerCharacters = [];
    this._opponentCharacters = [];

    playerUnits.forEach((unit) => {
      if (!this._playerCharacters.some((x) => x.id === unit.id)) {
        this._playerCharacters.push(unit);
      }
    });

    opponentUnits.forEach((unit) => {
      if (!this._opponentCharacters.some((x) => x.id === unit.id)) {
        this._opponentCharacters.push(unit);
      }
    });

    this._playerCharacters.forEach((x) =>
      x.reset(
        this._playerCharacters as Character[],
        this._opponentCharacters as Character[]
      )
    );
    this._opponentCharacters.forEach((x) =>
      x.reset(
        this._opponentCharacters as Character[],
        this._playerCharacters as Character[]
      )
    );

    this.allCharacters.forEach((character) => character.initialize());

    this.turns.push(new Turn(0.1, null, this, [], [], "Match Set Up"));

    this.allCharacters
      .filter((char) => {
        return char.events.some((x) => x.eventType === "matchSetup");
      })
      .forEach((character, index) => {
        character.dispatchEvent("matchSetup");
      });

    this.allCharacters
      .filter((char) => {
        return char.events.some((x) => x.eventType === "matchStart");
      })
      .sort((a, b) => {
        if (
          (a.id === "HANSOLO" && b.id === "HANSOLO") ||
          (a.id !== "HANSOLO" && b.id !== "HANSOLO")
        ) {
          if (a.stats.speed > b.stats.speed) {
            return 1;
          } else if (b.stats.speed > a.stats.speed) {
            return -1;
          } else {
            return randomNumber(0, 1) === 0 ? 1 : -1;
          }
        } else if (a.id === "HANSOLO") {
          return 1;
        } else if (b.id === "HANSOLO") {
          return -1;
        }
        return 0;
      })
      .forEach((char, index) => {
        this.turns.push(new Turn(0.2, char, this, [], [], "Start of Match"));
        char.dispatchEvent("matchStart");
      });

    this.allCharacters.forEach((c) => c.dispatchEvent("endOfTurn"));
  }

  private nextTurn(turnNumber: number) {
    const { character, tmAmount } = this.allCharacters.reduce(
      (acc: { tmAmount: number; character: null | Character }, char) => {
        if (!char?.isDead) {
          if (!acc.character) {
            acc.character = char;
          } else {
            const results = acc.character.compareTm(char);
            acc.character = results.character;
            acc.tmAmount = results.amount;
          }
        }

        return acc;
      },
      { tmAmount: 0, character: null }
    );

    if (character !== null) {
      this.allCharacters.forEach((char) => {
        if (!char.isDead) {
          char.changeTurnMeter(
            (tmAmount / character.stats.speed) * char.stats.speed
          );
        }
      });

      this.turns.push(new Turn(turnNumber, character, this));
      character.takeAction();
      this.allCharacters.forEach((c) =>
        c.dispatchEvent("endOfTurn", { character })
      );
    }
  }

  public checkMatchEnd(currentRound: number, maxRounds: number): boolean {
    const playerLost = this._playerCharacters.every((x) => x.stats.health <= 0);
    const opponentLost = this._opponentCharacters.every(
      (x) => x.stats.health <= 0
    );
    if (playerLost || opponentLost || currentRound > maxRounds) {
      this.turns.push(
        new Turn(
          Infinity,
          null,
          this,
          [
            // {
            //   effects: {
            //     winner: opponentLost
            //       ? store.state.player.player?.name
            //       : store.state.opponents.player?.name,
            //   },
            // },
          ],
          [],
          "Final Score"
        )
      );

      if (playerLost) {
        this._simulationData.opponentWins++;
      } else if (opponentLost) {
        this._simulationData.playerWins++;
      }
      return true;
    }
    return false;
  }

  public addLogs(logs: iLog | iLog[], endOfTurn?: boolean) {
    if (this.turns.length <= 0) {
      console.error("cannot add logs because there are no turns");
      return;
    }

    const currentTurn = this.turns[this.turns.length - 1];
    if (Array.isArray(logs)) {
      currentTurn.addLogs(logs, endOfTurn);
    } else {
      currentTurn.addLogs([logs], endOfTurn);
    }
  }
}

// const gameEngine = new Engine();
// export { gameEngine };
