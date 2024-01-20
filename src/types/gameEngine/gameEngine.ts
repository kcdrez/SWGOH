import store from "vuex-store/store";
import { Character } from "./characters/index";
import { randomNumber, round } from "utils";
import { Log } from "./characters/log";
import { tBuff, tDebuff } from "./characters/statusEffects";
import { iStatsCheck } from "./characters/stats";
import { loadingState } from "types/loading";

/** Data used to determine certain things */
export interface iCondition {
  /** Checks if a debuff is present */
  debuffs?: tDebuff[];
  /** Checks if a buff is present */
  buffs?: tBuff[];
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
  public logs: Log[] = [];
  public endOfTurnLogs: Log[] = [];
  private _turnNumber: number = 0;
  private _character: Character | null = null;
  private _label: string | null = null;
  public characterList: { name: string; owner: string; turnMeter: number }[] =
    [];

  constructor(
    turnNumber: number,
    character: Character | null,
    logs?: Log[],
    endOfTurnLogs?: Log[],
    label?: string | null
  ) {
    this._turnNumber = turnNumber;
    this._character = character;
    this.logs = logs ?? [];
    this.endOfTurnLogs = endOfTurnLogs ?? [];
    this._label = label ?? null;

    this.characterList = gameEngine.allCharacters
      .map((c) => {
        const logs = c.getLogs();
        return {
          name: c.name,
          owner: c.owner,
          turnMeter: round(logs.turnMeter, 2),
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

  addLogs(logs: Log[], endOfTurn?: boolean) {
    if (endOfTurn) {
      this.endOfTurnLogs.push(...logs.filter((l) => !!l));
    } else {
      this.logs.push(...logs.filter((l) => !!l));
    }
  }
}

interface iSimulation {
  total: number;
  playerWins: number;
  opponentWins: number;
  matchHistory: Turn[][];
}

export class Engine {
  private _playerCharacters: Character[] = [];
  private _opponentCharacters: Character[] = [];
  private _simulationData: iSimulation = {
    total: 1,
    playerWins: 0,
    opponentWins: 0,
    matchHistory: [],
  };
  public turns: Turn[] = [];
  public status: loadingState = loadingState.initial;

  constructor() {}

  public get allCharacters() {
    return [...this._playerCharacters, ...this._opponentCharacters];
  }
  public get totalSimulations() {
    return this._simulationData.total;
  }
  public set totalSimulations(val: number) {
    if (val <= 10) {
      this._simulationData.total = val;
    }
  }
  public get matchHistory(): Turn[][] {
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
      round(this.playerWins / (this.playerWins + this.opponentWins), 2) * 100
    );
  }
  public get opponentWinRate(): number {
    return (
      round(this.opponentWins / (this.playerWins + this.opponentWins), 2) * 100
    );
  }
  public get currentCharactersTurn() {
    if (this.turns.length) {
      return this.turns[this.turns.length - 1].character;
    } else {
      return null;
    }
  }

  public startSimulation(playerUnits: Character[], opponentUnits: Character[]) {
    this._simulationData.matchHistory = [];
    this._simulationData.opponentWins = 0;
    this._simulationData.playerWins = 0;
    this.status = loadingState.loading;

    for (let i = 0; i < this._simulationData.total; i++) {
      this.initializeMatch(playerUnits, opponentUnits);

      let turnNumber = 0;
      do {
        turnNumber++;
        this.nextTurn(turnNumber);
        if (this.checkMatchEnd(turnNumber, 99999)) {
          this._simulationData.matchHistory.push(this.turns);
          break;
        }
      } while (true);
    }
    this.status = loadingState.ready;
  }

  private initializeMatch(
    playerUnits: Character[],
    opponentUnits: Character[]
  ) {
    this.turns = [];
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

    this.allCharacters
      .filter((char) => {
        return char.events.some((x) => x.eventType === "matchSetup");
      })
      .forEach((character, index) => {
        this.turns.push(
          new Turn(0 + 0.1 * index, character, [], [], "Match Set Up")
        );
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
        this.turns.push(
          new Turn(0 + 0.2 * index, char, [], [], "Start of Match")
        );

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

      this.turns.push(new Turn(turnNumber, character));
      character.takeAction();
      this.allCharacters.forEach((c) => c.dispatchEvent("endOfTurn"));
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
          [
            new Log({
              effects: {
                winner: opponentLost
                  ? store.state.player.player?.name
                  : store.state.opponents.player?.name,
              },
            }),
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

  public addLogs(logs: Log | Log[], endOfTurn?: boolean) {
    if (this.turns.length <= 0) {
      console.error("cannot add logs because there are no turns");
    }

    const currentTurn = this.turns[this.turns.length - 1];
    if (Array.isArray(logs)) {
      currentTurn.addLogs(logs, endOfTurn);
    } else {
      currentTurn.addLogs([logs], endOfTurn);
    }
  }
}

const gameEngine = new Engine();
export { gameEngine };
