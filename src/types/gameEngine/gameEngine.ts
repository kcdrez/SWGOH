import store from "vuex-store/store";
import { iAbility } from "./abilities";
import {
  iDebuff,
  tDebuff,
  tBuff,
  iBuff,
  tStatusEffect,
  iStatusEffect,
} from "./statusEffects";
import {
  Character,
  iTargetData,
  iAssist,
  iStatsCheck,
  format,
} from "./characters";
import { Unit } from "types/unit";
import { randomNumber, round, unvue } from "utils";
import { Player } from "types/player";

/** An effect that happens when something else happens */
export interface iTrigger {
  /**
   * Determines when the effect will occur
   *
   * always: An effect that will always be present
   *
   * criticalHit: Triggers whenever a criticalHit is scored
   *
   * dealDamage: Triggers whenever damage is dealt
   *
   * dealDamageWithAttack: Triggers whenever damage is dealt from an attack
   *
   * death: Triggers whenever the target is defeated
   *
   * defeat: Triggers whenever the target defeats another target
   *
   * dodge: Triggers whenever the target dodges an effect/attack
   *
   * expires: Triggers whenever an effect expires
   *
   * inflictDebuff: Triggers whenever the target inflicts a debuff
   *
   * pregame: Triggers before the game begins
   *
   * receiveDamage: Triggers whenever the target receives damage
   *
   * resistDetrimentalEffect: Triggers whenever the target resists an effect
   *
   * revive: Triggers whenever the target is revived
   *
   * setup: Triggers after pregame and before start
   *
   * start: Triggers at the start of the game (after pregame and setup)
   *
   * useAbility: Triggers whenever the target uses an ability
   */
  triggerType:
    | "always"
    | "criticalHit"
    | "dealDamage"
    | "dealDamageWithAttack"
    | "death"
    | "defeat"
    | "dispelDebuff"
    | "dodge"
    | "expires"
    | "inflictDebuff"
    | "pregame"
    | "receiveDamage"
    | "receiveDamageFromAttack"
    | "resistDetrimentalEffect"
    | "revive"
    | "setup"
    | "start"
    | "useAbility";
  /** A list of filters, in order, which will be applied to determine who to add the triggers to */
  targets: iTargetData;
  /** This trigger is targeting various other units and causing effects on them (such as buffs or damage) */
  actions: iAction[];
  /** Misc data to be used for various effects */
  data?: any;
  /** Unique identifier */
  id: string;
  /** The original source that caused the effect(s) to happen */
  srcAbility?: iAbility | null;
  /** Used to determine how often the trigger should happen */
  triggerData?: {
    /** The maximum number of times the effect can trigger in a given frequency */
    limit?: number;
    /** A tracker on how many times the trigger has already happened */
    count?: number;
    /** The timing of when a trigger should check if it has reached the limit */
    frequency?: "match" | "turn" | "turn-unit";
    /** The list of units' ids affected by this ability and how many times theyve been affected */
    units?: { count: number; id: string }[];
    /** List of ability ids that cannot cause this to trigger */
    excludeAbilities?: string[];
  };
  /** A condition to check if the trigger should happen or not */
  condition?: iCondition;
}

export interface iTriggerData {
  triggerType: iTrigger["triggerType"];
  damageDealt?: number;
  isCrit?: boolean;
  ability?: iAbility | null;
  target?: Character | null;
  debuff?: iDebuff;
}

/** Determines who is being targeted and what is happening to them */
export interface iAction {
  /** An optional Identifier */
  id?: string;
  /** A list of filters, in order, which will be applied to determine who the effects will affect */
  targets: iTargetData;
  /** The actions themselves that will be applied to the target(s) in order */
  effects?: iEffect[];
  /** The actions will repeat until the conditions are no longer met */
  repeats?: {
    /** How many times the action has been done */
    count: number;
    /** The maximum number of times this action can be done */
    limit: number;
    /** The method in which to set the limit, if a variable amount */
    limitCounter?: "deadOpponents";
    /** When the count should be reset */
    reset: "turn";
  };
}

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

/** Various effects that will be applied */
export interface iEffect {
  /** Who the effect should target */
  // targets?: iTargetData[];
  /** The optional condition to check before applying any of the effects */
  condition?: iCondition;
  /** Determines if the effct cannot miss */
  cantMiss?: boolean;
  /** The debuffs being inflicted */
  debuffs?: iDebuff[];
  /** The buffs being granted */
  buffs?: iBuff[];
  /** The status effects (blue effects) being granted */
  statusEffects?: iStatusEffect[];
  /** The (de)buffs being removed */
  dispel?: {
    debuffs?: tDebuff[] | tDebuff;
    buffs?: tBuff[] | tBuff;
  };
  /** Manipulate the cooldown of an ability */
  cooldown?: {
    /** The ID of the ability being manipulated */
    id: string;
    /** The amount the ability is being manipulated. Positive number increases the cooldown, negative number increases the cooldown */
    amount: number;
    /** The target that the ability belongs to */
    target: iTargetData;
  };
  /** Heal the target */
  heal?: {
    /** Health or Protection */
    healthType: "health" | "protection";
    /** Determines if the amound should be added to the current health, or scale from the unit's maxHealth/Protection */
    amountType?: "additive" | "multiplicative";
    /** The amount to heal. For percentages, keep the amount a decimal (e.g. 0.4 would be a 40% heal) */
    amount?: number;
    // scale?: number;
  };
  /** Call another unit to assist */
  assist?: iAssist;
  /** Change the target's stats */
  stats?: iStatsCheck;
  /** Deal damage to the target */
  damage?: {
    /** The modifier data used to determine how to calculate damage */
    modifier: {
      /** The amount this ability will scale with offense */
      value: number;
      /** The condition to check if a modifier to the status should be applied */
      condition?: iCondition;
      /** The stats to be applied to modify the damage */
      stats?: iStatsCheck;
    };
    /** The variance amount of damage (usually 5 or 10) */
    variance?: number;
    /** The type of damage being dealt */
    damageType: "physical" | "special" | "true";
  };
  /** Use an ability */
  ability?: {
    abilityTrigger?: string;
    /** The id of the ability that should be used */
    abilityToUse: string;
    /** The id of the action that should be modified */
    actionId?: string;
    /** The stats modification */
    stats?: iStatsCheck;
    /** Any additional effects to add to the use of the ability */
    effects?: iEffect[];
    /** Replaces the target data if new targets should be used rather than the original ability's target */
    replaceTargets?: iTargetData;
  };
  /** Set the target immune to certain effects */
  immune?: {
    /** The negative status effects or debuffs that cannot be given to the target */
    negativeStatusEffects?: (tDebuff | tStatusEffect)[];
    /** The positive status effects or buffs that cannot be given to the target */
    positiveStatusEffects?: (tBuff | tStatusEffect)[];
    /** The target cannot assist */
    assisting?: boolean;
    /** The target cannot counter attack */
    counterAttacking?: boolean;
  };
  /** Scale the above effects with various data */
  scalesBy?: {
    /** Scales the effect based on how many stacks of the listed buffs */
    buffs?: tBuff[];
    /** Scales the effect based on how many stacks of the listed debuffs */
    debuffs?: tDebuff[];
    /** Scales the effect based on a certain stat */
    stat?: {
      /** Determines if the physical or special attribute should be used */
      type?: "physical" | "special";
      /** The name of the stat to use as the scale */
      name: iStatsCheck["statToModify"];
      /** How much of the user's stat should be used as the scale (i.e. .3 would be 30% of the user's stat) */
      percent?: number;
      /** Who should be the target used by the scaling (i.e. opponent's health, user's health, etc.) */
      // targets?: iTargetData;
    };
    /** Scales the data based on how much damage was dealt */
    damage?: boolean;
    /** Who to target to check the scale */
    targets?: iTargetData;
  };
  /** Triggers to add to the target that will occur at a later time */
  triggers?: iTrigger[];
  /** Misc. data used for checking various effects */
  revive?: {
    health: {
      amount: number;
      percent: boolean;
    };
    protection?: {
      amount: number;
      percent: boolean;
    };
  };
  data?: any;
}

export class Turn {
  public logs: Log[] = [];
  public endOfTurnLogs: Log[] = [];
  private _turnNumber: number = 0;
  private _character: Character | null = null;
  private _label: string | null = null;
  public characterLogData?: tLogData;
  public characterList: { name: string; owner: string; turnMeter: number }[] =
    [];

  constructor(
    turnNumber: number,
    character: Character | null,
    logs: Log[],
    endOfTurnLogs?: Log[],
    label?: string | null
  ) {
    this._turnNumber = turnNumber;
    this._character = character;
    this.logs = logs;
    this.endOfTurnLogs = endOfTurnLogs ?? [];
    this._label = label ?? null;

    this.characterLogData = this._character?.getLogs();

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

  addLogs(logs: Log[]) {
    this.logs.push(...logs.filter((l) => !!l));
  }
  addEndOfTurnLogs(logs: Log[]) {
    this.endOfTurnLogs.push(...logs.filter((l) => !!l));
  }
}

type tLogStatusEffect = {
  type: "buff" | "debuff" | "statusEffect" | null;
  list: iBuff[] | iDebuff[] | iStatusEffect[];
  resisted?: boolean;
  removed?: boolean;
  duration?: number;
  immune?: boolean;
  prevented?: boolean;
};

type tLogAbility = { used?: null | iAbility; source?: null | iAbility };

type tLogDamage = {
  isCrit?: boolean;
  amount?: number;
  evaded?: boolean;
  bonus?: boolean;
};

type tLogHeal = { amount: number; type: "health" | "protection" | null };

type tLogEffects = {
  assisted?: boolean;
  countered?: boolean;
  turnMeter?: number;
  cooldown?: {
    ability: null | iAbility;
    amount: number;
  };
  defeated?: boolean;
  winner?: string;
  stunned?: boolean;
};

export type tLogData = {
  name: string;
  owner: string;
  health: {
    current: number;
    max: number;
    base: number;
  };
  protection: {
    current: number;
    max: number;
    base: number;
  };
  activeAbilities: iAbility[];
  buffs: iBuff[];
  debuffs: iDebuff[];
  statusEffects: iStatusEffect[];
  physical: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  special: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  general: {
    label: string;
    value: number;
    base: number;
    isPercent?: boolean;
  }[];
  triggers: iTrigger[];
  otherEffects: { ignoreTaunt: boolean; immunity: Record<string, boolean> };
  turnMeter: number;
};

export class Log {
  public character?: Character;
  public target?: Character;
  public ability?: tLogAbility;
  public damage?: tLogDamage;
  public statusEffects?: tLogStatusEffect;
  public heal?: tLogHeal;
  public effects?: tLogEffects;
  public characterLogData?: tLogData;
  public targetLogData?: tLogData;

  constructor(data: {
    character?: Character;
    target?: Character;
    statusEffects?: tLogStatusEffect;
    ability?: tLogAbility;
    damage?: tLogDamage;
    heal?: tLogHeal;
    effects?: tLogEffects;
  }) {
    this.character = data?.character;
    this.target = data?.target;
    this.statusEffects = data?.statusEffects;
    this.ability = data?.ability;
    this.damage = data?.damage;
    this.heal = data?.heal;
    this.effects = data?.effects;

    if (this.character) {
      this.characterLogData = this.character.getLogs();
    }
    if (this.target) {
      this.targetLogData = this.target.getLogs();
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

    for (let i = 0; i < this._simulationData.total; i++) {
      this.initializeMatch(playerUnits, opponentUnits);

      let turnNumber = 0;
      do {
        turnNumber++;
        this.nextTurn(turnNumber);
        if (this.checkMatchEnd(turnNumber, 1000)) {
          this._simulationData.matchHistory.push(this.turns);
          break;
        }
      } while (true);
    }
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

    const allCharacters: Character[] = [
      ...this._playerCharacters,
      ...this._opponentCharacters,
    ] as Character[];
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

    allCharacters.forEach((x) => x.initialize());

    const startTriggers: Character[] = allCharacters
      .filter((char) => {
        return char.triggers.some((trigger) => {
          return trigger.triggerType === "start";
        });
      })
      .sort((a, b) => {
        if (
          (a.id === "HANSOLO" && b.id === "HANSOLO") ||
          (a.id !== "HANSOLO" && b.id !== "HANSOLO")
        ) {
          if (a.speed > b.speed) {
            return 1;
          } else if (b.speed > a.speed) {
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
      });

    const pregameTriggers = allCharacters.filter((char) => {
      return char.triggers.some((trigger) => {
        return trigger.triggerType === "pregame";
      });
    });

    const setupTriggers = allCharacters.filter((char) => {
      return char.triggers.some((trigger) => {
        return trigger.triggerType === "setup";
      });
    });

    pregameTriggers.forEach((char) => {
      const t = new Turn(0, char, [], [], "Match Set Up");
      this.turns.push(t); //this must exist for the current turn logic to work
      const logs = char.executePassiveTriggers([{ triggerType: "pregame" }]);
      if (logs.length) {
        t.addLogs(logs);
      } else {
        this.turns.pop();
      }
    });

    setupTriggers.forEach((char) => {
      const t = new Turn(0, char, [], [], "Match Set Up2");
      this.turns.push(t);
      const logs = char.executePassiveTriggers([{ triggerType: "setup" }]);
      t.addLogs(logs);
    });

    startTriggers.forEach((char) => {
      const t = new Turn(0 + 0.1, char, [], [], "Start of Match");
      this.turns.push(t);
      const logs = char.executePassiveTriggers([
        {
          triggerType: "start",
          ability: null,
          target: char,
        },
      ]);

      t.addLogs(logs);
    });

    allCharacters.forEach((x) => x.resetHealth());
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
          char.changeTurnMeter((tmAmount / character.speed) * char.speed);
        }
      });

      const turn = new Turn(turnNumber, character, []);
      this.turns.push(turn);
      const { logs, endOfTurnLogs } = character.takeAction();
      turn.addLogs(logs);
      turn.addEndOfTurnLogs(endOfTurnLogs);

      this.allCharacters.forEach((c) => c.resetTriggers("turn"));
    }
  }

  public checkMatchEnd(currentRound: number, maxRounds: number): boolean {
    const playerLost = this._playerCharacters.every((x) => x.health <= 0);
    const opponentLost = this._opponentCharacters.every((x) => x.health <= 0);
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
}

const gameEngine = new Engine();
export { gameEngine };
