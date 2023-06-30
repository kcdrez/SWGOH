import { v4 as uuid } from "uuid";
import { round } from "lodash";
import _ from "lodash";

import { randomNumber, unvue } from "utils";
import abilities from "types/abilities";
import { Ability, IUnit, Unit } from "types/unit";

export interface iStats {
  maxHealth: number;
  health: number;
  maxProtection: number;
  protection: number;
  speed: number;
  physical: {
    offense: number;
    armor: number;
    armorPen: number;
    critChance: number;
    accuracy: number;
    dodge: number;
    critAvoid: number;
  };
  special: {
    offense: number;
    armor: number;
    armorPen: number;
    critChance: number;
    accuracy: number;
    dodge: number;
    critAvoid: number;
  };
  critDamage: number;
  tenacity: number;
  potency: number;
  healthSteal: number;
}

type tDebuff =
  | "Ability Block"
  | "Accuracy Down"
  | "Anguish" //todo
  | "Blind" //todo
  | "Breach" //
  | "Buff Immunity"
  | "Burning" //
  | "Buzz Droids" //
  | "Captive" //
  | "Cooldown Increase"
  | "Concussion Mine" //
  | "Confuse" //
  | "Corrupted Battle Meditation" //
  | "Critical Chance Down"
  | "Critical Damage Down"
  | "Damage Over Time" //
  | "Daze" //
  | "Deathmark" //
  | "Deceived" //
  | "Defense Down" //
  | "Defense Penetration Down"
  | "Demoralized" //
  | "Disarm" //
  | "Doubt" //
  | "Evasion Down"
  | "Expose" //
  | "Fear" //
  | "Ferocity" //
  | "Force Influence" //
  | "Fracture" //
  | "Healing Immunity" //
  | "Health Down" //add check when its applied so current health doesnt exceed it
  | "Health Steal Down"
  | "Hunted" //
  | "Inevitable Failure" //
  | "Marked"
  | "Offense Down"
  | "Overconfident" //
  | "Pain" //
  | "Plague" //
  | "Potency Down"
  | "Protection Disruption" //
  | "Provoked" //
  | "Purge" //
  | "Shatterpoint" //
  | "Shield Disruption" //
  | "Shock" //
  | "Speed Down"
  | "Stagger" //
  | "Stranded" //
  | "Stun"
  | "Target Lock" //
  | "Tenacity Down"
  | "TM Decrease"
  | "Torture" //
  | "Useful Pawn" //
  | "Vulnerable"
  | "all"; //
type tBuff =
  | "Accuracy Up"
  | "Call to Action"
  | "Critical Chance Up"
  | "Critical Damage Up"
  | "Critical Hit Immunity"
  | "Cooldown Decrease"
  | "Defense Penetration Up"
  | "Defense Up"
  | "Evasion Up"
  | "Health Up"
  | "Health Steal Up"
  | "Potency Up"
  | "Offense Up"
  | "Speed Up"
  | "Taunt"
  | "Tenacity Up"
  | "TM Increase"
  | "all";
type tStatusEffect = "Guard";
// type tStatusEffect = tDebuff | tBuff | tBlueEffect;

export interface iStatusEffect {
  name: tBuff | tDebuff | tStatusEffect;
  duration: number;
  isNew?: boolean;
  chance?: number;
  cantResist?: boolean;
  cantPrevent?: boolean;
  cantDispel?: boolean;
  unique?: boolean;
  expires?: iTarget;
  id: string;
  sourceAbility?: iAbility | null;
  isStackable?: boolean;
}

interface iBuff extends iStatusEffect {
  name: tBuff;
}

interface iDebuff extends iStatusEffect {
  name: tDebuff;
}

export interface iEffects {
  ignoreTaunt: boolean;
}

interface iGeneralAbility {
  id: string;
  name: string;
  triggers?: iTrigger[];
}
export interface iBasicAbility extends iGeneralAbility {
  targets?: iTarget[];
}

export interface iSpecialAbility extends iGeneralAbility {
  turnsRemaining: number;
  cooldown: number;
  targets?: iTarget[];
}
export interface iAbility
  extends iBasicAbility,
    iSpecialAbility,
    iUniqueAbility {
  id: string;
  turnsRemaining: number;
  name: string;
  cooldown: number;
  targets?: iTarget[];
  actions?: iEffect[];
}

export interface iUniqueAbility extends iGeneralAbility {}

interface iTrigger extends iTarget {
  triggerType:
    | "useAbility"
    | "receiveDamage"
    | "dealDamage"
    | "death"
    | "resistDetrimentalEffect"
    | "inflictDebuff"
    | "criticalHit"
    | "dodge"
    | "always"
    | "ability"
    | "start"
    | "pregame";
  events?: iTarget[];
  data?: any;
  id: string;
  srcAbility?: iAbility | null;
}

interface iTarget {
  target: iTargetData;
  debuffs?: iDebuff[];
  buffs?: iBuff[];
  statusEffects?: iStatusEffect[];
  actions?: iEffect[];
  triggers?: iTrigger[];
  cantMiss?: boolean;
  damage?: number;
  modifyDamage?: iEffect;
  damageVariance?: number;
  damageType?: "physical" | "special";
  stats?: iStatsCheck;
  triggerData?: {
    limit: number;
    count: number;
    frequency: "match" | "turn";
  };
  ability?: iAbility | null;
}

interface iTargetData {
  targetIds?: string[];
  tags?: string[];
  allies?: boolean;
  weakest?: boolean;
  targetCount?: number;
  scale?: "Resisted" | "physical critChance";
  ignoreTaunt?: boolean;
  statusEffects?: tStatusEffect[];
}

interface iCondition {
  debuffs?: tDebuff[];
  buffs?: tBuff[];
  stats?: iStatsCheck;
  inverted?: boolean;
  isNew?: boolean;
  tags?: string[];
  tm?: {
    amount: number;
    greaterThan: boolean;
  };
}
interface iEffect {
  condition?: iCondition;
  debuffs?: iDebuff[];
  buffs?: iBuff[];
  dispel?: {
    debuffs?: tDebuff[] | tDebuff;
    buffs?: tBuff[] | tBuff;
  };
  cooldown?: {
    id: string;
    amount: number;
    target: "Self" | number;
  };
  heal?: {
    healthType: "health" | "protection";
    type: "percent" | "flat";
    amount?: number;
    scale?: number;
  };
  assist?: iAssist;
  scale?: number;
  stats?: iStatsCheck;
  damage?: {
    scale?: {
      target: iTarget;
      stats: Record<string, number>;
    };
  };
  ability?: {
    abilityTrigger?: string;
    abilityToUse: string;
    modifiers?: iTarget[];
  };
  immune?: {
    negativeStatusEffects?: (tDebuff | tStatusEffect)[];
    positiveStatusEffects?: (tBuff | tStatusEffect)[];
  };
  data?: any;
}

interface iStatsCheck {
  statToModify: string;
  amount: number;
  type: "flat" | "percent";
  amountType?: "greater" | "less";
}

interface iAssist {
  condition?: iCondition;
  chance: number;
  modifier: {
    stats: iStatsCheck;
    condition?: iCondition;
  };
  target: iTarget;
}

interface iHistory {
  resisted: number;
}

export class Character {
  private _baseStats: iStats;
  private _name: string;
  private _id: string;
  private _tm: number = 0;
  private _buffs: iBuff[];
  private _debuffs: iDebuff[];
  private _statusEffects: iStatusEffect[] = [];
  private _activeAbilities: (iBasicAbility | iSpecialAbility)[];
  private _uniqueAbilities: iUniqueAbility[];
  private _leaderAbility: iUniqueAbility | null;
  private _owner: string;
  private _history: iHistory = {
    resisted: 0,
  };
  private _alignment: IUnit["alignment"];
  private _categories: string[];
  private _triggers: iTrigger[] = [];
  private _teammates: Character[] = [];
  private _opponents: Character[] = [];
  public isLeader: boolean = false;

  constructor(data: Unit, owner: string) {
    this._baseStats = {
      maxHealth: data.health,
      health: data.health,
      maxProtection: data.protection,
      protection: data.protection,
      speed: data.speed,
      physical: {
        offense: data.offense.physical,
        armor: (data.physicalArmor * 637.5) / (100 - data.physicalArmor),
        armorPen: data.armorPen,
        critChance: data.critChance.physical / 100,
        accuracy: data.physicalAccuracy / 100,
        dodge: data.physicalDodge / 100,
        critAvoid: data.physicalCritAvoid / 100,
      },
      special: {
        offense: data.offense.special,
        armor: (data.armor.special * 637.5) / (100 - data.armor.special),
        armorPen: data.resistancePen,
        critChance: data.critChance.special / 100,
        accuracy: data.specialAccuracy / 100,
        dodge: data.specialDodge / 100,
        critAvoid: data.specialCritAvoid / 100,
      },
      critDamage: data.critDamage / 100,
      tenacity: data.tenacity / 100,
      potency: data.potency / 100,
      healthSteal: data.healthSteal,
    };

    this._name = data.name;
    this._id = data.id;
    this._buffs = [];
    this._debuffs = [];
    this._activeAbilities = [
      ...data.specialAbilities,
      data.basicAbility,
    ].reduce(
      (
        acc: (iBasicAbility | iSpecialAbility)[],
        ability: Ability | undefined
      ) => {
        const abilitiesMap = abilities[data.id];
        const abilityId = ability?.id ?? "";
        if (abilityId && abilityId in abilitiesMap) {
          acc.push(_.cloneDeep(abilitiesMap[abilityId]));
        }
        return acc;
      },
      []
    );

    this._uniqueAbilities = data.uniqueAbilities.reduce(
      (acc: iUniqueAbility[], ability: Ability | undefined) => {
        const abilitiesMap = abilities[data.id];
        const abilityId = ability?.id ?? "";
        if (abilityId && abilityId in abilitiesMap) {
          acc.push(_.cloneDeep(abilitiesMap[abilityId]));
        }
        return acc;
      },
      []
    );
    this._leaderAbility = (() => {
      const abilitiesMap = abilities[data.id];
      const abilityId = data.leaderAbility?.id ?? "";
      if (abilityId && abilityId in abilitiesMap) {
        return _.cloneDeep(abilitiesMap[abilityId]);
      }
      return null;
    })();
    this._owner = owner;
    this._alignment = data.alignment;
    this._categories = data.categories;
  }

  //Stats
  public get maxProtection() {
    return this.getModifiedStats(
      [],
      this._baseStats.maxProtection,
      this.tempStats.maxProtection
    );
  }
  public set maxProtection(val) {
    this._baseStats.maxProtection = val;
  }
  public get maxHealth() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Health Down"),
          value: -0.2,
        },
        {
          hasEffect: this.hasBuff("Health Up"),
          value: 0.15,
        },
      ],
      this._baseStats.maxHealth,
      this.tempStats.maxHealth
    );
  }
  public set maxHealth(val) {
    this._baseStats.maxHealth = val;
  }
  public get health() {
    return this._baseStats.health;
  }
  public set health(val) {
    this._baseStats.health = Math.max(val, 0);
    if (this._baseStats.health > this._baseStats.maxHealth) {
      this._baseStats.health = this._baseStats.maxHealth;
    }
  }
  public get protection() {
    return this._baseStats.protection;
  }
  public set protection(val) {
    if (val < 0) {
      this.health += val;
      this._baseStats.protection = 0;
    } else {
      this._baseStats.protection = Math.max(val, 0);
    }

    if (this._baseStats.protection > this._baseStats.maxProtection) {
      this._baseStats.protection = this._baseStats.maxProtection;
    }

    if (this.health <= 0) {
      this.removePassiveTriggers();
    }
  }
  public get isDead() {
    return this.health <= 0;
  }
  public heal(
    healData: iEffect["heal"],
    ability?: iAbility | null,
    amount?: number
  ): string[] {
    const logs: string[] = [];

    if (healData && !this.isDead) {
      const { healthType, type, amount: healAmount } = healData;
      const maxAmount =
        healthType === "health" ? this.maxHealth : this.maxProtection;
      const finalAmount =
        type === "percent"
          ? (healAmount ?? amount ?? 1) * maxAmount
          : healAmount ?? amount ?? 0;

      let diff = 0;
      if (this[healthType] < maxAmount) {
        diff = Math.min(maxAmount - this[healthType], finalAmount);
      }
      this[healthType] += finalAmount;

      if (diff > 0) {
        logs.push(
          `${format.recover(
            this.name,
            this.owner,
            healthType,
            round(diff),
            this.protection,
            this.health,
            ability
          )}`
        );
      }
    }
    return logs;
  }
  public get healthSteal() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Health Steal Down"),
          value: -0.5,
        },
        {
          hasEffect: this.hasBuff("Health Steal Up"),
          value: 0.5,
        },
      ],
      this._baseStats.healthSteal,
      this.tempStats.healthSteal
    );
  }
  public get speed() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Speed Down"),
          value: -0.25,
        },
        {
          hasEffect: this.hasBuff("Speed Up"),
          value: 0.25,
        },
      ],
      this._baseStats.speed,
      this.tempStats.speed,
      true
    );
  }
  public set speed(val) {
    this._baseStats.speed = val;
  }
  public get critDamage() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasBuff("Call to Action"),
          value: 0.5,
        },
        {
          hasEffect: this.hasDebuff("Critical Damage Down"),
          value: -0.5,
        },
        {
          hasEffect: this.hasBuff("Critical Damage Up"),
          value: 0.5,
        },
      ],
      this._baseStats.critDamage,
      this.tempStats.critDamage
    );
  }
  public get tenacity() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Tenacity Down"),
          value: -1000,
        },
        {
          hasEffect: this.hasBuff("Tenacity Up"),
          value: 99999,
        },
      ],
      this._baseStats.tenacity,
      this.tempStats.tenacity
    );
  }
  public set tenacity(val) {
    this._baseStats.tenacity = val;
  }
  public get potency() {
    return this.getModifiedStats(
      [
        {
          hasEffect: this.hasDebuff("Potency Down"),
          value: -50,
        },
        {
          hasEffect: this.hasBuff("Potency Up"),
          value: 50,
        },
      ],
      this._baseStats.potency,
      this.tempStats.potency
    );
  }
  public set potency(val) {
    this._baseStats.potency = val;
  }
  public get counterChance() {
    if (this.hasDebuff("Stun")) {
      return 0;
    }

    const { counter: tempCounter } = this.tempStats as Record<
      string,
      iStatsCheck
    >;
    return tempCounter?.amount ?? 0;
  }
  public get counterDamage() {
    const { counterDamage: tempCounterDamage } = this.tempStats as Record<
      string,
      iStatsCheck
    >;
    return tempCounterDamage?.amount ?? 1;
  }
  private callAllyToAssist(
    assistData: iEffect["assist"],
    targetCharacter: Character
  ): string[] {
    const logs: string[] = [];
    if (assistData && !targetCharacter.isDead) {
      if (chanceOfEvent(assistData.chance * 100)) {
        this.findTargets(assistData.target).forEach((ally) => {
          logs.push(
            `${format.characterName(ally.name, ally.owner)} is called to assist`
          );
          logs.push(
            ...ally.assist(
              assistData.modifier,
              targetCharacter.owner === this.owner ? null : targetCharacter
            )
          );
        });
      }
    }
    return logs;
  }

  public assist(
    modifier: iAssist["modifier"],
    targetCharacter: Character | null
  ): string[] {
    const logs: string[] = [];

    if (this.basicAbility) {
      if (!modifier || this.checkCondition(modifier.condition, this)) {
        logs.push(
          ...this.useAbility(
            this.basicAbility as iAbility,
            modifier.stats,
            targetCharacter,
            false
          )
        );
      }
    }
    return logs;
  }

  public get physical() {
    const self = this;
    return {
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          self._baseStats.physical.offense,
          self.tempStats.tempOffense,
          true
        );
      },
      set offense(val) {
        self._baseStats.physical.offense = val;
      },
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
          ],
          self._baseStats.physical.critChance,
          self.tempStats.tempCritChance
        );
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          self._baseStats.physical.armor,
          self.tempStats.armor,
          true
        );
      },
      set armor(val) {
        self._baseStats.physical.armor = val;
      },
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          self._baseStats.physical.armorPen,
          self.tempStats.armorPen
        );
      },
      set armorPen(val) {
        self._baseStats.physical.armorPen = val;
      },
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
          ],
          self._baseStats.physical.accuracy,
          self.tempStats.accuracy
        );
      },
      set accuracy(val) {
        self._baseStats.physical.accuracy = val;
      },
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          self._baseStats.physical.dodge,
          self.tempStats.dodge
        );
      },
      set dodge(val) {
        self._baseStats.physical.dodge = val;
      },
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -999,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: 1000000,
            },
          ],
          self._baseStats.physical.critAvoid,
          self.tempStats.critAvoid
        );
      },
      set critAvoid(val) {
        self._baseStats.physical.critAvoid = val;
      },
    };
  }
  public get special() {
    const self = this;
    return {
      get offense() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Offense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Offense Up"), value: 0.5 },
          ],
          self._baseStats.special.offense,
          self.tempStats.tempOffense,
          true
        );
      },
      set offense(val) {
        self._baseStats.special.offense = val;
      },
      get critChance() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Critical Chance Down"), value: -0.25 },
            { hasEffect: self.hasBuff("Critical Chance Up"), value: 0.25 },
            { hasEffect: self.hasBuff("Call to Action"), value: 0.5 },
            { hasEffect: self.hasStatusEffect("Guard"), value: 0.25 },
          ],
          self._baseStats.special.critChance,
          self.tempStats.tempCritChance
        );
      },
      set critChance(val) {
        self._baseStats.physical.critChance = val;
      },
      get armor() {
        return self.getModifiedStats(
          [
            { hasEffect: self.hasDebuff("Defense Down"), value: -0.5 },
            { hasEffect: self.hasBuff("Defense Up"), value: 0.5 },
          ],
          self._baseStats.special.armor,
          self.tempStats.armor,
          true
        );
      },
      set armor(val) {
        self._baseStats.special.armor = val;
      },
      get armorPen() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Defense Penetration Down"),
              value: -150,
            },
            { hasEffect: self.hasBuff("Defense Penetration Up"), value: 150 },
          ],
          self._baseStats.special.armorPen,
          self.tempStats.armorPen
        );
      },
      set armorPen(val) {
        self._baseStats.special.armorPen = val;
      },
      get accuracy() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Accuracy Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Accuracy Up"), value: 0.15 },
          ],
          self._baseStats.special.accuracy,
          self.tempStats.accuracy
        );
      },
      set accuracy(val) {
        self._baseStats.special.accuracy = val;
      },
      get dodge() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Evasion Down"),
              value: -0.15,
            },
            { hasEffect: self.hasBuff("Evasion Up"), value: 0.15 },
          ],
          self._baseStats.special.dodge,
          self.tempStats.dodge
        );
      },
      set dodge(val) {
        self._baseStats.special.dodge = val;
      },
      get critAvoid() {
        return self.getModifiedStats(
          [
            {
              hasEffect: self.hasDebuff("Vulnerable"),
              value: -999,
            },
            {
              hasEffect:
                self.hasBuff("Critical Hit Immunity") ||
                self.hasStatusEffect("Guard"),
              value: 1000000,
            },
          ],
          self._baseStats.special.critAvoid,
          self.tempStats.critAvoid
        );
      },
      set critAvoid(val) {
        self._baseStats.special.critAvoid = val;
      },
    };
  }
  private get tempStats(): Record<string, iStatsCheck> {
    return this._triggers.reduce((statsMapping, trigger) => {
      if (trigger.triggerType === "always") {
        trigger.actions?.forEach((effect) => {
          if (effect.stats) {
            if (this.checkCondition(effect.condition, this)) {
              if (effect.stats.statToModify) {
                statsMapping[effect.stats.statToModify] = effect.stats;
              }
            }
          }
        });
      }
      return statsMapping;
    }, {});
  }
  private get immunity(): Record<string, boolean> {
    return this._triggers.reduce(
      (immuneMapping, trigger) => {
        trigger.actions?.forEach((effect) => {
          if (effect.immune) {
            if (this.checkCondition(effect.condition, this)) {
              effect.immune.negativeStatusEffects?.forEach((x) => {
                immuneMapping[x] = true;
              });
              effect.immune.positiveStatusEffects?.forEach((x) => {
                immuneMapping[x] = true;
              });
            }
          }
        });
        if (trigger.triggerType === "always") {
        }
        return immuneMapping;
      },
      {
        Daze: this.hasStatusEffect("Guard"),
        Stun: this.hasStatusEffect("Guard"),
      }
    );
  }
  private getModifiedStats(
    statusEffectConfig: { hasEffect: boolean; value: number }[],
    baseStat: number,
    tempStat: iStatsCheck,
    isMultiplicative: boolean = false
  ) {
    let newStat = baseStat;

    if (tempStat?.type === "percent") {
      newStat *= 1 + tempStat?.amount ?? 0;
    } else {
      newStat += tempStat?.amount ?? 0;
    }

    let amountIncrease = 0;

    statusEffectConfig.forEach((effect) => {
      if (effect.hasEffect) {
        amountIncrease += effect.value;
      }
    });

    if (isMultiplicative) {
      return newStat * (1 + amountIncrease);
    } else {
      return newStat + amountIncrease;
    }
  }

  //Turn Meter and turn order logic
  public get turnMeter() {
    return this._tm;
  }
  public get turnMeterRatio() {
    return (100 - this._tm) / this.speed;
  }
  public changeTurnMeter(amount: number): string {
    if (amount === 0) {
      return "";
    }
    let diff = 0;

    if (this._tm >= 100 && amount < 0) {
      diff = Math.abs(amount);
      this._tm = 100 + amount; //note this will remove tm since val is a negative number
    } else {
      diff = amount < 0 ? Math.min(Math.abs(amount), this._tm) : amount;
      this._tm += amount;
    }

    if (this._tm < 0) {
      this._tm = 0;
    }

    if (amount > 0) {
      return `${format.characterName(this.name, this.owner)} gained ${round(
        diff,
        2
      )}% turn meter (${round(this._tm, 2)}%)`;
    } else {
      return `${round(
        diff,
        2
      )}% turn meter was removed from ${format.characterName(
        this.name,
        this.owner
      )} (${round(this._tm, 2)}%)`;
    }
  }
  public compareTm(opponent: Character): {
    character: Character;
    amount: number;
  } {
    const results = {
      character: this as Character,
      amount: 0,
    };

    if (opponent.turnMeter >= 100 && this.turnMeter >= 100) {
      results.amount = 0;
      if (opponent.turnMeter > this.turnMeter) {
        results.character = opponent;
      } else if (opponent.turnMeter === this.turnMeter) {
        if (opponent.speed > this.speed) {
          results.character = opponent;
        } else if (this.speed === opponent.speed) {
          const rand = randomNumber(0, 1);
          if (rand === 1) {
            results.character = opponent;
          }
        }
      }
    } else if (this.turnMeterRatio < opponent.turnMeterRatio) {
      results.amount = 100 - this.turnMeter;
      results.character = this;
    } else if (opponent.turnMeterRatio < this.turnMeterRatio) {
      results.amount = 100 - opponent.turnMeter;
      results.character = opponent;
    } else {
      const rand = randomNumber(0, 1);
      const c = rand === 0 ? this : opponent;
      results.amount = 100 - c.turnMeter;
      results.character = c;
    }
    return results;
  }

  //Status Effects
  public get debuffs() {
    return this._debuffs;
  }
  public get buffs() {
    return this._buffs;
  }
  public get statusEfects() {
    return this._statusEffects;
  }
  public hasDebuff(name: tDebuff | tDebuff[] | iDebuff | iDebuff[]) {
    if (Array.isArray(name)) {
      return (name as (tDebuff | iDebuff)[]).every((x) => this.hasDebuff(x));
    } else {
      return this.debuffs.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public hasBuff(name: tBuff | tBuff[] | iBuff | iBuff[]) {
    if (Array.isArray(name)) {
      return (name as (tBuff | iBuff)[]).every((x) => this.hasBuff(x));
    } else {
      return this.buffs.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public hasStatusEffect(
    name: tStatusEffect | tStatusEffect[] | iStatusEffect | iStatusEffect[]
  ): boolean {
    if (Array.isArray(name)) {
      return (name as (tStatusEffect | iStatusEffect)[]).every((x) =>
        this.hasStatusEffect(x)
      );
    } else {
      return this._statusEffects.some((d) => {
        if (typeof name === "string") {
          return d.name === name;
        } else {
          return d.id === name.id;
        }
      });
    }
  }
  public isImmune(statusEffect: iStatusEffect | tStatusEffect): boolean {
    if (typeof statusEffect === "string") {
      return this.immunity[statusEffect];
    } else {
      return this.immunity[statusEffect.name];
    }
  }
  public addBuff(
    buff: iBuff | iBuff[],
    isNew: boolean,
    scalar: number,
    ability: iAbility | null
  ): string[] {
    if (Array.isArray(buff)) {
      return buff.reduce((arr: string[], b) => {
        arr.push(...this.addBuff(b, isNew, scalar, ability));
        return arr;
      }, []);
    } else if (buff.name === "TM Increase") {
      if (scalar > 0) {
        return [
          this.changeTurnMeter(buff.duration * scalar) +
            `${format.abilitySource(ability)}`,
        ];
      }
    } else if (this.hasDebuff("Buff Immunity") && !buff.cantPrevent) {
      return [
        `${format.characterName(
          this.name,
          this.owner
        )} could not gain ${format.buff([buff.name])} due to ${format.debuff([
          "Buff Immunity",
        ])}`,
      ];
    } else if (!this.hasDebuff("Buff Immunity")) {
      if ((!this.hasBuff(buff) || buff.isStackable) && !this.isImmune(buff)) {
        if (scalar > 0) {
          this._buffs.push({
            ...buff,
            duration: buff.duration * scalar,
            isNew,
            sourceAbility: ability,
          });
          return [
            `${format.characterName(
              this.name,
              this.owner
            )} gained ${format.buff([buff.name])} for <b>${
              buff.duration * scalar
            }</b> turns${format.abilitySource(ability)}`,
          ];
        }
      }
    }
    return [];
  }
  private removeBuff(
    buff: iBuff | iBuff[] | tBuff | tBuff[] | null,
    opponent?: Character
  ): string[] {
    const list: string[] = [];
    const logs: string[] = [];
    if (Array.isArray(buff)) {
      logs.push(
        ...(buff as (iBuff | tBuff)[]).reduce((arr: string[], b) => {
          arr.push(...this.removeBuff(b, opponent));
          return arr;
        }, [])
      );
    } else {
      let buffData: iBuff | null = null;
      if (typeof buff === "string") {
        buffData = {
          name: buff,
          id: uuid(),
          duration: 1,
        };
      } else {
        buffData = buff;
      }

      this._buffs = this._buffs.filter((b) => {
        if (
          (b.name === buffData?.name ||
            buffData?.name === "all" ||
            b.id === buffData?.id) &&
          !this.isSelf(opponent) &&
          !b.cantDispel
        ) {
          if (b.expires) {
            logs.push(...this.processTargets(b.expires, this, null));
          }
          list.push(b.name);
          return false;
        }
        return true;
      });

      if (list.length > 0) {
        if (opponent && !this.isSelf(opponent)) {
          logs.push(
            `${format.characterName(
              opponent.name,
              opponent.owner
            )} removed ${format.buff(list)} from ${format.characterName(
              this.name,
              this.owner
            )}`
          );
        } else {
          logs.push(
            `${format.buff(list)} ${list.length <= 1 ? "was" : "were"} removed`
          );
        }
      }
    }
    return logs;
  }
  private inflictDebuff(
    debuffs: iDebuff[],
    targetCharacter: Character,
    scalar: number = 1
  ): string[] {
    const logs: string[] = [];
    this._history.resisted = 0;

    debuffs.forEach((debuff) => {
      if (!targetCharacter.hasDebuff(debuff.name) || debuff.isStackable) {
        const resistedChance = Math.max(
          targetCharacter.tenacity - this.potency,
          0.15
        );
        if (
          !chanceOfEvent(resistedChance * 100) ||
          debuff.cantResist ||
          debuff.name === "Tenacity Down" ||
          this.isSelf(targetCharacter)
        ) {
          if (targetCharacter.isImmune(debuff)) {
            logs.push(
              `${format.characterName(
                targetCharacter.name,
                targetCharacter.owner
              )} is immune to ${debuff.name}`
            );
          } else {
            if (chanceOfEvent(debuff.chance ?? 0)) {
              return;
            }

            if (debuff.name === "TM Decrease") {
              logs.push(
                targetCharacter.changeTurnMeter(debuff.duration * scalar)
              );
            } else {
              if (
                (!targetCharacter.hasDebuff(debuff) || debuff.isStackable) &&
                !targetCharacter.isImmune(debuff)
              ) {
                const amount = debuff.duration * scalar;

                targetCharacter.debuffs.push({
                  ...unvue(debuff),
                  isNew: true,
                });
                logs.push(
                  `${format.characterName(
                    targetCharacter.name,
                    targetCharacter.owner
                  )} was inflicted with ${format.debuff([
                    debuff.name,
                  ])} for ${amount} turn${amount > 1 ? "s" : ""}`
                );
                logs.push(
                  ...this.executePassiveTriggers([
                    {
                      triggerType: "inflictDebuff",
                      target: {},
                      data: { debuff: debuff.name },
                      id: uuid(),
                    },
                  ])
                );
              }
            }
          }
        } else {
          this._history.resisted++;
          logs.push(
            `${format.characterName(
              targetCharacter.name,
              targetCharacter.owner
            )} resisted ${format.debuff([debuff.name])}`
          );
          logs.push(
            ...targetCharacter.executePassiveTriggers([
              {
                triggerType: "resistDetrimentalEffect",
                target: {},
                data: { debuff: debuff.name },
                id: uuid(),
              },
            ])
          );
        }
      }
    });
    return logs;
  }
  private removeDebuff(
    debuff: iDebuff | iDebuff[] | tDebuff | tDebuff[] | null,
    opponent?: Character
  ): string[] {
    const list: string[] = [];
    const logs: string[] = [];

    if (Array.isArray(debuff)) {
      logs.push(
        ...(debuff as (iDebuff | tDebuff)[]).reduce(
          (arr: string[], d: iDebuff | tDebuff) => {
            arr.push(...this.removeDebuff(d, opponent));
            return arr;
          },
          []
        )
      );
    } else {
      let debuffData: iDebuff | null = null;
      if (typeof debuff === "string") {
        debuffData = {
          name: debuff,
          id: uuid(),
          duration: 1,
        };
      } else {
        debuffData = debuff;
      }

      this._debuffs = unvue(this._debuffs).filter((x) => {
        if (
          x.name === debuffData?.name ||
          debuffData?.name === "all" ||
          x.id === debuffData?.id
        ) {
          if (x.expires) {
            logs.push(...this.processTargets(x.expires, this, null));
          }
          list.push(x.name);
          return false;
        }
        return true;
      });

      if (list.length > 0) {
        if (opponent && !this.isSelf(opponent)) {
          logs.push(
            `${format.characterName(
              opponent.name,
              opponent.owner
            )} removed ${format.debuff(list)} from ${format.characterName(
              this.name,
              this.owner
            )}`
          );
        } else {
          logs.push(
            `${format.debuff(list)} ${
              list.length <= 1 ? "was" : "were"
            } removed`
          );
        }
      }
    }
    return logs;
  }
  private addStatusEffect(
    effect: iStatusEffect | iStatusEffect[],
    ability: iAbility | null
  ): string[] {
    if (Array.isArray(effect)) {
      return effect.reduce((arr: string[], e) => {
        arr.push(...this.addStatusEffect(e, ability));
        return arr;
      }, []);
    } else {
      if (
        (!this.hasStatusEffect(effect) || effect.isStackable) &&
        !this.isImmune(effect)
      ) {
        this._statusEffects.push(effect);
        return [
          `${format.characterName(this.name, this.owner)} gained ${format.buff([
            effect.name,
          ])} ${format.abilitySource(ability)}`,
        ];
      }
    }
    return [];
  }
  private removeStatusEffect(
    statusEffect:
      | iStatusEffect
      | iStatusEffect[]
      | tStatusEffect
      | tStatusEffect[]
      | null
  ): string[] {
    const logs: string[] = [];
    if (Array.isArray(statusEffect)) {
      logs.push(
        ...(statusEffect as (iStatusEffect | tStatusEffect)[]).reduce(
          (arr: string[], d) => {
            arr.push(...this.removeStatusEffect(d));
            return arr;
          },
          []
        )
      );
    } else {
      const list: string[] = [];
      let statusEffectData: iStatusEffect | null = null;
      if (typeof statusEffect === "string") {
        statusEffectData = {
          name: statusEffect,
          id: uuid(),
          duration: 1,
        };
      } else {
        statusEffectData = statusEffect;
      }

      this._statusEffects = unvue(this._statusEffects).filter((x) => {
        if (
          x.name === statusEffectData?.name ||
          statusEffectData?.name === "all" ||
          x.id === statusEffectData?.id
        ) {
          if (x.expires) {
            logs.push(...this.processTargets(x.expires, this, null));
          }
          list.push(x.name);
          return false;
        }
        return true;
      });

      if (list.length > 0) {
        logs.push(
          `${format.debuff(list)} ${list.length <= 1 ? "was" : "were"} removed`
        );
      }
    }
    return logs;
  }

  //Abilities
  public get activeAbilities() {
    return this._activeAbilities;
  }
  public get basicAbility() {
    return this.activeAbilities.find((a) => {
      return a.id.startsWith("basic");
    });
  }
  public get hasLeaderAbility() {
    return !!this._leaderAbility;
  }
  public chooseAbility(abilityId?: string): iAbility | null {
    if (this.hasDebuff("Stun")) {
      return null;
    } else if (this.hasDebuff("Ability Block")) {
      return (this.basicAbility as iAbility) ?? null;
    }

    const ability = this._activeAbilities.find((a) => {
      if (abilityId) {
        return a.id === abilityId;
      } else if ("turnsRemaining" in a) {
        return a.turnsRemaining <= 0;
      } else {
        return a;
      }
    });

    if (ability && "turnsRemaining" in ability) {
      ability.turnsRemaining = ability.cooldown;
    }
    return (ability as iAbility) ?? null;
  }
  public findTargets(
    targetSelection: iTarget,
    target?: Character,
    ignore?: {
      paralysisDebuff?: boolean;
      daze?: boolean;
      noAssist?: boolean;
      dead?: boolean;
    }
  ): Character[] {
    const { allies, targetCount, tags, targetIds, weakest, statusEffects } =
      targetSelection.target;
    let list: Character[] = [...this._teammates, ...this._opponents].filter(
      (char: Character) => {
        let shouldExclude = false;

        if (char.isDead && !ignore?.dead) {
          shouldExclude = true;
        }
        if (ignore?.paralysisDebuff) {
          shouldExclude = char.hasDebuff("Stun") || shouldExclude;
        }
        if (ignore?.daze) {
          shouldExclude = char.hasDebuff("Daze") || shouldExclude;
        }
        return !shouldExclude;
      }
    );

    if (allies) {
      list = list.filter((x) => x.owner === this.owner);
    } else if (allies === false) {
      list = list.filter((x) => x.owner !== this.owner);
    }

    if (tags) {
      list = list.filter((char) => anyTagsMatch(char, tags, this.id));
    }

    if (targetIds) {
      list = list.filter((char) => {
        let shouldInclude = false;
        if (target instanceof Character) {
          shouldInclude = targetIds.includes("target") && char.isSelf(target);
        }
        return anyTagsMatch(char, targetIds, this.id) || shouldInclude;
      });
    }

    if (weakest) {
      const weakestChar = list.reduce(
        (acc: null | Character, el: Character) => {
          if (!acc) {
            return el;
          } else {
            const totalEl = el.protection + el.health;
            const totalAcc = acc.protection + acc.health;
            if (totalEl < totalAcc) {
              return el;
            } else if (totalEl === totalAcc) {
              return randomNumber(0, 1) === 0 ? el : acc;
            }
          }
          return acc;
        },
        null
      );
      if (!!weakestChar) {
        list = [weakestChar];
      }
    }

    if (targetCount) {
      let validTargets: Character[] = list;
      if (allies === false) {
        const forcedTargets = list.filter((c) => {
          if (this.effects.ignoreTaunt) {
            return true;
          }
          return [...c.buffs, ...c.debuffs].some((b) =>
            ["Taunt", "Marked", "Deathmarked"].includes(b.name)
          );
        });
        validTargets = forcedTargets.length > 0 ? forcedTargets : list;
      } else {
        validTargets = list;
      }

      list = [];

      do {
        const rand: number = randomNumber(0, validTargets.length - 1);
        const el = validTargets[rand];
        const exists = list.some((x) => x.id === el.id);
        if (!exists) {
          list.push(validTargets[rand]);
        }
      } while (list.length < targetCount && validTargets.length >= targetCount);
    }

    if (statusEffects) {
      list = list.filter((x) => x.hasStatusEffect(statusEffects));
    }

    return list.filter((char: Character) => !!char);
  }

  //other properties
  public get owner() {
    return this._owner;
  }
  public get name() {
    return this._name;
  }
  public get id() {
    return this._id;
  }
  public get alignment() {
    return this._alignment;
  }
  public get effects() {
    const self = this;
    return {
      get ignoreTaunt() {
        return self.hasBuff("Call to Action");
      },
    };
  }

  //Methods
  public getCombatStats(
    damageType: iTarget["damageType"],
    stats?: iStatsCheck | null
  ) {
    if (damageType === "physical") {
      const baseStat = this.physical;
      return {
        offense: modifyStat(baseStat.offense, "offense", stats),
        critChance: modifyStat(baseStat.critChance, "critChance", stats),
        armorPen: modifyStat(baseStat.armorPen, "armorPen", stats),
        armor: modifyStat(baseStat.armor, "armor", stats),
        dodge: modifyStat(baseStat.dodge, "dodge", stats),
        accuracy: modifyStat(baseStat.accuracy, "accuracy", stats),
        critAvoid: modifyStat(baseStat.critAvoid, "critAvoid", stats),
      };
    } else if (damageType === "special") {
      const baseStat = this.special;
      return {
        offense: modifyStat(baseStat.offense, "offense", stats),
        critChance: modifyStat(baseStat.critChance, "critChance", stats),
        armorPen: modifyStat(baseStat.armorPen, "armorPen", stats),
        armor: modifyStat(baseStat.armor, "armor", stats),
        dodge: modifyStat(baseStat.dodge, "dodge", stats),
        accuracy: modifyStat(baseStat.accuracy, "accuracy", stats),
        critAvoid: modifyStat(baseStat.critAvoid, "critAvoid", stats),
      };
    } else {
      return {
        offense: 0,
        critChance: 0,
        armorPen: 0,
        armor: 0,
        dodge: 0,
        accuracy: 0,
        critAvoid: 0,
      };
    }
  }
  public dealDamage(
    targetCharacter: Character,
    target: iTarget,
    srcAbility: iAbility | null,
    stats?: iStatsCheck | null
  ) {
    const logs: string[] = [];

    const { isCrit, damageTotal } = this.calculateDamage(
      targetCharacter,
      target,
      stats ?? target.stats
    );

    targetCharacter.protection -= damageTotal;

    logs.push(
      format.damage(
        damageTotal,
        targetCharacter.name,
        targetCharacter.owner,
        isCrit,
        targetCharacter.protection,
        targetCharacter.health
      )
    );

    logs.push(
      ...this.heal(
        {
          type: "flat",
          amount: damageTotal * this.healthSteal,
          healthType: "health",
        },
        {
          name: "Health Steal",
          id: "whatever",
          turnsRemaining: 0,
          cooldown: 0,
        }
      )
    );

    if (isCrit) {
      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "criticalHit",
            target: {},
            data: { damageDealt: damageTotal, isCrit, target: targetCharacter },
            id: uuid(),
            srcAbility,
          },
        ])
      );
    }

    if (targetCharacter.health <= 0) {
      logs.push(
        `${format.characterName(
          this.name,
          this.owner
        )} defeated ${format.characterName(targetCharacter.name, this.owner)}`
      );
    }

    return { logs, damageDealt: damageTotal, isCrit };
  }
  public dealTrueDamage(
    targetCharacter: Character,
    damageTotal: number,
    isCrit: boolean = false
  ): string[] {
    const logs: string[] = [];
    targetCharacter.protection -= damageTotal;

    logs.push(
      format.damage(
        damageTotal,
        targetCharacter.name,
        targetCharacter.owner,
        isCrit,
        targetCharacter.protection,
        targetCharacter.health
      )
    );

    logs.push(
      ...this.heal(
        {
          type: "flat",
          amount: damageTotal * this.healthSteal,
          healthType: "health",
        },
        {
          name: "Health Steal",
          id: "whatever",
          turnsRemaining: 0,
          cooldown: 0,
        }
      )
    );
    return logs;
  }
  private calculateDamage(
    targetCharacter: Character,
    target: iTarget,
    stats?: iStatsCheck | null
  ): { isCrit: boolean; damageTotal: number } {
    const abilityModifier = target?.damage ?? 0;
    const variance = target?.damageVariance ?? 5;
    const { offense, critChance, armorPen } = this.getCombatStats(
      target.damageType,
      stats
    );
    const { armor, critAvoid } = targetCharacter.getCombatStats(
      target.damageType,
      stats
    );
    const varianceOffense =
      offense * (1 - randomNumber(0 - variance, variance) / 100);

    const modifiedArmor = Math.max(armor - armorPen, 0);
    const damageReduction =
      (modifiedArmor * 100) / (modifiedArmor + 637.5) / 100;
    const damageTaken =
      varianceOffense * abilityModifier * (1 - damageReduction);

    const isCrit = chanceOfEvent((critChance - critAvoid) * 100);

    const damageTotal = Math.max(
      Math.round(damageTaken * (isCrit ? targetCharacter.critDamage : 1)),
      1
    );
    return { isCrit, damageTotal };
  }
  public counterAttack(
    targetCharacter: Character,
    canBeCountered: boolean = true
  ): string[] {
    const logs: string[] = [];
    if (canBeCountered && !targetCharacter.isDead) {
      if (
        chanceOfEvent(this.counterChance) &&
        !this.isDead &&
        this.owner !== targetCharacter.owner
      ) {
        logs.push(
          `${format.characterName(this.name, this.owner)} counter attacked`
        );
        logs.push(
          ...this.useAbility(
            this.basicAbility as iAbility,
            {
              statToModify: "offense",
              amount: this.counterDamage,
              type: "percent",
            },
            targetCharacter,
            false
          )
        );
      }
    }
    return logs;
  }
  public inflictEffects(
    { actions, target }: iTarget,
    targetCharacter: Character,
    ability: iAbility | null
  ): string[] {
    const logs: string[] = [];
    actions?.forEach((action) => {
      if (this.checkCondition(action.condition, targetCharacter)) {
        logs.push(
          ...this.addEffects(
            targetCharacter,
            action,
            this.targetSelf(target),
            ability
          )
        );
      }
    });
    return logs;
  }
  private checkCondition(
    condition: iEffect["condition"],
    targetCharacter: Character
  ): boolean {
    if (!condition) {
      return true;
    }

    const { buffs, debuffs, stats, inverted, isNew, tags, tm } = condition;
    let results = false;
    if (buffs) {
      const hasBuffs = buffs.every((status) => {
        const match = this._buffs.find((x) => x.name === status);
        if (match) {
          return isNew === false ? !match.isNew : true;
        }
        return false;
      });
      results = (hasBuffs && !inverted) || (!hasBuffs && inverted) || results;
    }
    if (debuffs) {
      const hasDebuffs = debuffs.every((status) => {
        const match = this.buffs.find((x) => x.name === status);
        if (match) {
          return isNew ? match.isNew : true;
        }
        return false;
      });

      results =
        (hasDebuffs && !inverted) || (!hasDebuffs && inverted) || results;
    }
    if (stats) {
      let meetsStatRequirement = false;
      const stat = targetCharacter[stats.statToModify];
      if (!isNaN(stat)) {
        //if it is a number
        const num = Number(stat);
        if (stats.statToModify === "health" && stats.type === "percent") {
          const percent = num / targetCharacter.maxHealth;
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < percent
              : stats.amount > percent;
        } else if (
          stats.statToModify === "protection" &&
          stats.type === "percent"
        ) {
          const percent = num / targetCharacter.maxProtection;
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount > percent
              : stats.amount < percent;
        } else {
          meetsStatRequirement =
            stats.amountType === "greater"
              ? stats.amount < num
              : stats.amount > num;
        }
      } else {
        console.warn(
          `Could not find stat ${stat.type} on ${targetCharacter.name}`
        );
      }

      results =
        (meetsStatRequirement && !inverted) ||
        (!meetsStatRequirement && inverted) ||
        results;
    }
    if (tags) {
      results = anyTagsMatch(targetCharacter, tags, this.id) || results;
    }
    if (tm) {
      if (tm.greaterThan) {
        results = targetCharacter.turnMeter > tm.amount || results;
      } else {
        results = targetCharacter.turnMeter < tm.amount || results;
      }
    }
    return results;
  }
  private addEffects(
    targetCharacter: Character,
    effect: iEffect,
    isNew: boolean,
    ability: iAbility | null,
    data?: any
  ): string[] {
    const logs: string[] = [];
    if (effect.dispel) {
      logs.push(
        ...targetCharacter.removeBuff(effect.dispel?.buffs ?? null, this)
      );

      console.log(
        this.id,
        this.owner,
        targetCharacter.id,
        targetCharacter.owner
      );
      logs.push(
        ...targetCharacter.removeDebuff(effect.dispel?.debuffs ?? null, this)
      );
    }

    if (effect.cooldown) {
      if (effect.cooldown.target === "Self") {
        logs.push(this.changeCooldown(effect));
      } else {
        logs.push(targetCharacter.changeCooldown(effect));
      }
    }

    if (effect.heal) {
      logs.push(
        ...targetCharacter.heal(effect.heal, ability, data?.healAmount)
      );
    }

    if (effect.stats) {
      console.info("todo: change stats");
    }

    if (effect.assist) {
      logs.push(...this.callAllyToAssist(effect.assist, targetCharacter));
    }

    if (effect.buffs) {
      logs.push(
        ...targetCharacter.addBuff(
          effect.buffs ?? [],
          isNew,
          this.getScalar(effect.scale),
          ability
        )
      );
    }

    if (effect.debuffs) {
      //it looks backwards from the other logic but its not
      logs.push(...this.inflictDebuff(effect.debuffs ?? [], targetCharacter));
    }

    if (effect.ability) {
      const { abilityTrigger, abilityToUse } = effect.ability;
      if (abilityTrigger === ability?.id || !abilityTrigger) {
        if (abilityToUse) {
          const abilityMatch = this.chooseAbility(abilityToUse);
          if (abilityMatch) {
            const copyAbility: iAbility = unvue(abilityMatch);
            if (effect.ability?.modifiers) {
              copyAbility.targets = copyAbility.targets ?? [];
              effect.ability?.modifiers?.forEach((mod) => {
                copyAbility.targets = copyAbility.targets?.reduce(
                  (modifiedTargets: iTarget[], target) => {
                    modifiedTargets.push({ ...target, ...mod });
                    return modifiedTargets;
                  },
                  []
                );
              });
            }
            logs.push(
              ...this.useAbility(copyAbility, effect.stats, targetCharacter)
            );
          } else if (this.hasDebuff("Stun")) {
            logs.push(
              `${format.characterName(
                this.name,
                this.owner
              )} is stunned and took no action`
            );
          }
        }
      }
    }

    if (effect.damage) {
      if (effect.damage.scale) {
        // this.findTargets(effect.damage.scale.target).forEach
        this.dealTrueDamage(targetCharacter, 0);
      }
    }

    return logs;
  }
  public changeCooldown(effect: iEffect): string {
    if (effect.cooldown) {
      const { amount, id } = effect.cooldown;
      const name = amount > 0 ? "Cooldown Increase" : "Cooldown Decrease";
      if (
        this.isImmune({
          name,
          id: uuid(),
          duration: amount,
        })
      ) {
        return `${format.characterName(
          this.name,
          this.owner
        )} is immune to ${format.buff([name])}`;
      } else {
        const ability = this._activeAbilities.find((a) => a.id === id);
        if (ability && "turnsRemaining" in ability) {
          const finalAmount = amount === 0 ? ability.turnsRemaining : amount;
          ability.turnsRemaining += finalAmount;
          return `${format.characterName(
            this.name,
            this.owner
          )}'s ${format.ability(ability.name)}'s cooldown was ${
            finalAmount > 0 ? "increased" : "decreased"
          } by ${Math.abs(finalAmount)}`;
        } else {
          console.warn(
            `Could not change the cooldown of ${id}`,
            this._activeAbilities
          );
        }
      }
    }
    return "";
  }
  public checkEvade(
    { cantMiss, damageType }: iTarget,
    opponent: Character,
    stats?: iStatsCheck
  ) {
    if (cantMiss || this.isSelf(opponent)) {
      return false;
    } else {
      const { dodge } = this.getCombatStats(damageType);
      const { accuracy } = opponent.getCombatStats(damageType);

      const chanceToDodge =
        modifyStat(dodge, "dodge", stats) -
        modifyStat(accuracy, "accuracy", stats);
      return chanceOfEvent(chanceToDodge * 100);
    }
  }
  public startOfTurn() {
    this._debuffs.forEach((debuff) => {
      debuff.isNew = false;
    });
    this._buffs.forEach((debuff) => {
      debuff.isNew = false;
    });
  }
  public takeAction() {
    this.startOfTurn();
    this._tm = 0;
    const logs: string[] = [];
    let ability: iAbility | null = null;
    if (this.hasDebuff("Stun")) {
      logs.push(
        `${format.characterName(
          this.name,
          this.owner
        )} is stunned and took no action`
      );
    } else {
      ability = this.chooseAbility();

      if (ability) {
        logs.push(...this.useAbility(ability));
      } else {
        console.warn("no ability");
      }
    }

    logs.push(...this.endOfTurn(ability));
    return logs.filter((l) => !!l);
  }
  public useAbility(
    ability: iAbility,
    stats?: iStatsCheck,
    targetCharacter?: Character | null,
    canBeCountered?: boolean
  ): string[] {
    const logs: string[] = [];
    logs.push(format.useAbility(this.name, ability.name, this.owner));

    ability.targets?.forEach((targetData) => {
      const targets = targetCharacter
        ? [targetCharacter]
        : this.findTargets(targetData);

      targets.forEach((char) => {
        const attackMissed = char.checkEvade(targetData, this, stats);
        if (attackMissed) {
          logs.push(`${format.characterName(char.name, char.owner)} evaded`);
          logs.push(
            ...char.executePassiveTriggers([
              {
                triggerType: "dodge",
                target: {},
                id: uuid(),
              },
            ])
          );
          return;
        }
        logs.push(
          ...this.processTargets(
            targetData,
            char,
            ability,
            canBeCountered,
            stats
          )
        );
        logs.push(
          ...this.executePassiveTriggers([
            {
              triggerType: "ability",
              target: {},
              id: uuid(),
              data: { target: char },
              srcAbility: ability,
            },
          ])
        );
      });

      const primaryCharIndex = randomNumber(0, targets.length - 1);

      logs.push(
        ...this.executePassiveTriggers([
          {
            triggerType: "useAbility",
            id: uuid(),
            target: {},
            data: { ability, target: targets[primaryCharIndex] },
          },
        ])
      );

      if (targetData.damage) {
        targets.forEach((char) => {
          logs.push(...char.counterAttack(this, canBeCountered));
        });
      }
    });

    this.resetTriggers();

    return logs;
  }
  private processTargets(
    targetData: iTarget,
    targetCharacter: Character,
    ability: iAbility | null,
    isNew?: boolean,
    stats?: iStatsCheck,
    canBeCountered?: boolean
  ): string[] {
    const logs: string[] = [];
    const myTriggers: iTrigger[] = [];
    const opponentTriggers: iTrigger[] = [];
    const { damage, actions, debuffs, buffs, target, statusEffects, triggers } =
      targetData;

    if (targetData?.triggerData?.count) {
      if (targetData.triggerData.count > 0) {
        targetData.triggerData.count--;
      } else {
        return logs;
      }
    }

    if (damage && ability) {
      const _stats = this.checkCondition(
        targetData.modifyDamage?.condition,
        targetCharacter
      )
        ? targetData.modifyDamage?.stats
        : null;
      const {
        logs: damageLogs,
        damageDealt,
        isCrit,
      } = this.dealDamage(
        targetCharacter,
        targetData,
        ability,
        stats ?? _stats
      );
      logs.push(...damageLogs);
      opponentTriggers.push({
        triggerType: "receiveDamage",
        target: {},
        data: { damageDealt, isCrit, ability },
        id: uuid(),
      });
      myTriggers.push({
        triggerType: "dealDamage",
        target: {},
        data: { damageDealt, isCrit, target: targetCharacter },
        id: uuid(),
        // srcAbility: ability,
      });

      if (targetCharacter.health <= 0) {
        opponentTriggers.push({
          triggerType: "death",
          target: {},
          id: uuid(),
          srcAbility: ability,
        });
      }
    }

    if (actions && !targetCharacter.isDead) {
      logs.push(...this.inflictEffects(targetData, targetCharacter, ability));
    }
    if (debuffs && !targetCharacter.isDead) {
      logs.push(...this.inflictDebuff(debuffs, targetCharacter));
    }
    if (buffs && !targetCharacter.isDead) {
      logs.push(
        ...targetCharacter.addBuff(
          buffs,
          isNew === false ? false : this.targetSelf(target),
          targetCharacter.getScalar(target.scale),
          ability
        )
      );
    }
    if (statusEffects) {
      logs.push(...targetCharacter.addStatusEffect(statusEffects, ability));
    }
    if (triggers && ability) {
      triggers.forEach((t) => targetCharacter.addTrigger(t, ability));
    }

    logs.push(...targetCharacter.executePassiveTriggers(opponentTriggers));
    logs.push(...this.executeAbilityTriggers(ability, myTriggers));
    logs.push(...this.executePassiveTriggers(myTriggers));

    return logs;
  }
  public hasTags(tag: string, id: string): boolean {
    if (this._categories.includes(tag)) {
      return true;
    } else if (tag === "Self") {
      return this.id === id;
    } else if (
      tag === "Light Side" ||
      tag === "Dark Side" ||
      tag === "Neutral"
    ) {
      return this.alignment === tag;
    } else {
      return tag === this.id;
    }
  }
  private getScalar(type: string | number = ""): number {
    if (type === "Resisted") {
      return this._history.resisted;
    } else if (type.toString().includes(" critChance")) {
      const split = type.toString().split(" ");
      if (split[0] === "physical" || split[0] === "special") {
        return this.getCombatStats(split[0])[split[1]];
      }
    } else if (typeof type === "string") {
      return 1;
    }
    return Number(type);
  }
  private targetSelf(target: iTrigger["target"]): boolean {
    const allies = target.allies ?? false;
    const tagsMatch = anyTagsMatch(this, target.tags ?? [], this.id);

    return allies || tagsMatch;
  }
  private isSelf(char?: Character) {
    return this.id === char?.id && this.owner === char?.owner;
  }
  public get triggers() {
    return this._triggers;
  }
  public addTrigger(trigger: iTrigger, ability: iAbility) {
    const match = this._triggers.find((t) => t.id === trigger.id);
    if (!match) {
      this._triggers.push({ ...unvue(trigger), ability: unvue(ability) });
    }
  }
  public removeTrigger(trigger: iTrigger): string[] {
    const logs: string[] = [];
    logs.push(...this.removeEvents([trigger]));
    logs.push(...this.removeEvents(trigger?.events));

    const index = this._triggers.findIndex((t) => t.id === trigger.id);
    if (index > -1) {
      this._triggers.splice(index, 1);
    }
    return logs;
  }
  public removeEvents(events?: iTarget[]): string[] {
    const logs: string[] = [];
    events?.forEach((event) => {
      [...this._teammates, ...this._opponents].forEach((target) => {
        event.buffs?.forEach((buff) => {
          logs.push(...target.removeBuff(buff));
        });
        event.debuffs?.forEach((debuff) => {
          logs.push(...target.removeDebuff(debuff));
        });
        event.statusEffects?.forEach((s) => {
          logs.push(...target.removeStatusEffect(s));
        });
        event.triggers?.forEach((trigger) => {
          logs.push(...target.removeTrigger(trigger));
        });
      });
    });
    return logs;
  }
  public executePassiveTriggers(types: iTrigger[], data?: any): string[] {
    const logs: string[] = [];
    this._triggers.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (trigger?.triggerData?.count !== undefined) {
            if (trigger.triggerData.count >= 1) {
              trigger.triggerData.count--;
            } else {
              return;
            }
          }
          //order matters
          logs.push(...this.executeTrigger({ data, ...trigger, ...type }));
        }
      });
    });
    return logs;
  }
  public executeAbilityTriggers(ability: iAbility | null, types: iTrigger[]) {
    const logs: string[] = [];
    ability?.triggers?.forEach((trigger) => {
      types.forEach((type) => {
        if (trigger.triggerType === type.triggerType) {
          if (trigger?.triggerData?.count) {
            if (trigger.triggerData.count >= 1) {
              trigger.triggerData.count--;
            } else {
              return;
            }
          }

          logs.push(
            ...this.executeTrigger({
              ...trigger,
              ...type,
              srcAbility: ability,
            })
          );
        }
      });
    });
    return logs;
  }
  public executeTrigger({
    triggerType,
    events,
    actions,
    ability,
    data,
    srcAbility,
  }: iTrigger): string[] {
    const logs: string[] = [];
    events?.forEach((targetData) => {
      const targets = this.findTargets(targetData, data?.target);
      targets.forEach((char) => {
        //if this needs to be switched, then the logic is broken
        logs.push(
          ...this.processTargets(
            targetData,
            char,
            srcAbility ?? ability ?? null
          )
        );
      });
    });

    actions?.forEach((action) => {
      if (triggerType === "dealDamage" && action.heal) {
        data.healAmount = data?.damageDealt * (action?.scale ?? 1);
      }

      logs.push(
        ...this.addEffects(
          data?.target ?? this,
          action,
          true,
          data.ability ?? ability ?? null,
          data
        )
      );
    });
    return logs;
  }
  private removePassiveTriggers() {
    this._uniqueAbilities.forEach((ability) => {
      this.removeAllTriggers(ability.triggers);
    });
  }
  private removeAllTriggers(triggers?: iTrigger[]) {
    const logs: string[] = [];
    triggers?.forEach((trigger) => {
      [...this._teammates, ...this._opponents].forEach((target) => {
        logs.push(...target.removeTrigger(trigger));
      });
    });
  }
  private resetTriggers() {
    this._triggers.forEach((t) => {
      if (t.triggerData) {
        if (t.triggerData.frequency === "turn") {
          t.triggerData.count = t.triggerData.limit;
        }
      }

      t.events?.forEach((e) => {
        if (e.triggerData) {
          if (e.triggerData.frequency === "turn") {
            e.triggerData.count = e.triggerData.limit;
          }
        }
      });
    });
    this._history = {
      resisted: 0,
    };
  }
  public endOfTurn(ability: iAbility | null): string[] {
    const logs: string[] = [];
    const { newDebuffList, expireDebuffs, debuffsRemoved } =
      this._debuffs.reduce(
        (
          acc: {
            newDebuffList: iDebuff[];
            expireDebuffs: iDebuff[];
            debuffsRemoved: string[];
          },
          debuff: iDebuff
        ) => {
          if (debuff.isNew) {
            debuff.isNew = false;
          } else {
            debuff.duration--;
          }

          if (debuff.duration > 0) {
            acc.newDebuffList.push(debuff);
          } else {
            if (debuff.expires) {
              acc.expireDebuffs.push(debuff);
            }

            acc.debuffsRemoved.push(debuff.name);
          }
          return acc;
        },
        { newDebuffList: [], expireDebuffs: [], debuffsRemoved: [] }
      );

    const { newBuffList, expiredBuffs, buffsRemoved } = this._buffs.reduce(
      (
        acc: {
          newBuffList: iBuff[];
          expiredBuffs: iBuff[];
          buffsRemoved: string[];
        },
        buff: iBuff
      ) => {
        if (buff.isNew) {
          buff.isNew = false;
        } else {
          buff.duration--;
        }

        if (buff.duration > 0) {
          acc.newBuffList.push(buff);
        } else {
          if (buff.expires) {
            acc.expiredBuffs.push(buff);
          }

          acc.buffsRemoved.push(buff.name);
        }
        return acc;
      },
      { newBuffList: [], expiredBuffs: [], buffsRemoved: [] }
    );

    if (debuffsRemoved.length > 0) {
      logs.push(`
        ${format.debuff(debuffsRemoved)}
        ${
          debuffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }
    if (buffsRemoved.length > 0) {
      logs.push(`${format.buff(buffsRemoved)}
        ${
          buffsRemoved.length <= 1 ? "was" : "were"
        } removed at the end of the turn`);
    }

    this._debuffs = newDebuffList;
    this._buffs = newBuffList;

    const expiredList = [...expireDebuffs, ...expiredBuffs];
    expiredList.forEach((x) => {
      if (x.expires) {
        logs.push(
          ...this.processTargets(
            x.expires,
            this,
            x.sourceAbility ?? null,
            false
          )
        );
      }
    });

    this._activeAbilities.forEach((a) => {
      if (ability?.id !== a.id && "turnsRemaining" in a) {
        a.turnsRemaining--;
      }
    });

    return logs;
  }
  public reset(teammates: Character[], opponents: Character[]) {
    this._triggers = [];
    this._teammates = teammates;
    this._opponents = opponents;
  }
  public initialize() {
    this._baseStats.health = this._baseStats.maxHealth;
    this._baseStats.protection = this._baseStats.maxProtection;
    this._activeAbilities.forEach((a) => {
      if ("turnsRemaining" in a) {
        a.turnsRemaining = 0;
      }
    });
    this._debuffs = [];
    this._buffs = [];
    this._tm = 0;

    this._uniqueAbilities.forEach((ability) => {
      ability.triggers?.forEach((trigger) => {
        this.findTargets(trigger).forEach((target) => {
          target.addTrigger(trigger, ability as iAbility);
        });
      });
    });

    if (this.isLeader && this._leaderAbility) {
      this._leaderAbility.triggers?.forEach((trigger) => {
        this.findTargets(trigger).forEach((target) => {
          target.addTrigger(trigger, this._leaderAbility as iAbility);
        });
      });
    }

    this._triggers.forEach((trigger) => {
      if (trigger?.triggerData?.count !== undefined) {
        trigger.triggerData.count = trigger.triggerData.limit;
      }
    });
  }
}

//todo: combine these functions with /teams.js
export function anyTagsMatch(
  character: Character,
  tagsList: string[],
  id: string
): boolean {
  return tagsList.some((tag) => {
    if (tag.includes("&")) {
      const split = tag.split("&");
      return split.every((x) => anyTagsMatch(character, [x.trim()], id));
    } else if (tag.charAt(0) === "!") {
      const value = tag.substring(1);
      return !character.hasTags(value, id);
    } else {
      return character.hasTags(tag, id);
    }
  });
}

function modifyStat(
  baseStat: number,
  statType: string,
  stats?: iStatsCheck | null
) {
  if (statType === stats?.statToModify) {
    if (stats.type === "percent") {
      return baseStat * stats.amount;
    } else if (stats.type === "flat") {
      return baseStat + stats.amount;
    }
  }
  return baseStat;
}

export const format = {
  characterName(name: string, owner: string) {
    return `<em>${name}</em> (${owner})`;
  },
  recover(
    charName: string,
    owner: string,
    type: "health" | "protection",
    amount: number,
    currentProt: number,
    currentHealth: number,
    ability: iAbility | null = null
  ) {
    return `${this.characterName(
      charName,
      owner
    )} recovered <b class="${type}">${amount}</b> ${type} (${this.healthStats(
      currentProt,
      currentHealth
    )})${this.abilitySource(ability)}`;
  },
  healthStats(protection: number, health: number) {
    return `Protection: <b class="protection">${round(
      protection
    )}</b> , Health: <b class="health">${round(health)}</b>`;
  },
  buff(buffs: string[]) {
    return this.statusEffects(buffs, "buff");
  },
  debuff(debuffs: string[]) {
    return this.statusEffects(debuffs, "debuff");
  },
  statusEffects(list: string[], type: string) {
    return `<span class="${type}">${list.join(", ")}</span>`;
  },
  damage(
    amount: number,
    targetName: string,
    owner: string,
    isCrit: boolean,
    protection: number,
    health: number
  ) {
    return `<span class="damage">${amount}</span> damage was dealt to ${this.characterName(
      targetName,
      owner
    )}${this.crit(isCrit)} (${this.healthStats(protection, health)})`;
  },
  crit(isCrit: boolean) {
    return isCrit ? " <span class='crit'>(Crit)</span>" : "";
  },
  useAbility(charName: string, abilityName: string, owner: string) {
    return `${this.characterName(charName, owner)} used ${this.ability(
      abilityName
    )}`;
  },
  ability(name) {
    return `<span class="ability">${name}</span>`;
  },
  abilitySource(ability: iAbility | null) {
    return ability ? ` (src: ${format.ability(ability.name)})` : "";
  },
};

function chanceOfEvent(percentChance: number): boolean {
  if (percentChance < 1) {
    percentChance *= 100;
  }
  return percentChance >= randomNumber(1, 100);
}
