import _ from "lodash";

import { iStats, iStatsCheck } from "./stats";
import { Ability, IUnit, Unit } from "types/unit";
import abilities from "types/abilities";
import {
  iBuff,
  iDebuff,
  iStatusEffect,
  tStatusEffect,
  tBuff,
  tDebuff,
} from "../statusEffects";
import {
  iBasicAbility,
  iSpecialAbility,
  iUniqueAbility,
  iGeneralAbility,
  iAbility,
} from "../abilities";
import {
  iTrigger,
  iEffect,
  iCondition,
  iTriggerData,
  iAction,
  gameEngine,
  Log,
  tLogData,
} from "../gameEngine";

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
  private _tempStats: iStatsCheck[] = [];
  private _alignment: IUnit["alignment"];
  private _role: IUnit["role"];
  private _primaryStat: IUnit["primaryStat"];
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
      mastery: data.mastery,
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

    this._uniqueAbilities = data.uniqueAbilities
      .reduce((acc: iUniqueAbility[], ability: Ability | undefined) => {
        const abilitiesMap = abilities[data.id];
        const abilityId = ability?.id ?? "";
        if (abilityId && abilityId in abilitiesMap) {
          acc.push(_.cloneDeep(abilitiesMap[abilityId]));
        }
        return acc;
      }, [])
      .sort(function (a, b) {
        if (a.sort && b.sort) {
          return a.sort > b.sort ? 1 : -1;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      });
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
    this._role = data.role;
    this._primaryStat = data.primaryStat;
  }
}
