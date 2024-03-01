import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";

class basicskill_COMMANDERLUKESKYWALKER extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_COMMANDERLUKESKYWALKER",
      "Destined Strike",
      `Deal Physical damage to target enemy and inflict Speed Down and Defense Down for 2 turns. If the target already had Speed Down, remove 30% Turn Meter. If the target already had Defense Down, inflict Stun for 1 turn.`,
      character
    );
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      if (primaryTarget) {
        if (!this.checkEvade("physical", primaryTarget)) {
          this.dealDamage(
            "physical",
            primaryTarget,
            1.781,
            5,
            stats,
            canBeCountered
          );
          if (
            primaryTarget.checkCondition(() => {
              return primaryTarget.statusEffect.hasDebuff("Speed Down");
            })
          ) {
            primaryTarget.changeTurnMeter(-30, this);
          }
          if (
            primaryTarget.checkCondition(() => {
              return primaryTarget.statusEffect.hasDebuff("Defense Down");
            })
          ) {
            this._character?.statusEffect.inflictDebuff(
              [{ name: "Stun", duration: 1, id: uuid(), sourceAbility: this }],
              primaryTarget,
              1,
              this
            );
          }
          this._character?.statusEffect.inflictDebuff(
            [
              {
                name: "Speed Down",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
              {
                name: "Defense Down",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
            ],
            primaryTarget,
            1,
            this
          );
        }
      }
    });
  }
}

class specialskill_COMMANDERLUKESKYWALKER02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_COMMANDERLUKESKYWALKER02",
      "Call to Action",
      `Dispel all debuffs on Luke. Luke gains 100% Turn Meter and recovers 40% Health and Protection. If Luke doesn't have Call to Action, he gains it until the next time this ability is used, which can't be copied, dispelled, or prevented. If Luke already had Call to Action, he removes it.\n\nCall to Action: This character ignores Taunt during their turn and has +50% Accuracy, Critical Chance, and Critical Damage`,
      character
    );
    this.cooldown = 4;
  }

  public execute(): void {
    const primaryTarget = this.findRandomEnemy();

    super.execute(primaryTarget, [], false, () => {
      this._character?.statusEffect.removeDebuff("all", this._character);
      this._character?.changeTurnMeter(100, this);
      this._character?.heal(
        {
          healthType: "protection",
          amountType: "multiplicative",
          amount: 0.4,
        },
        this
      );
      this._character?.heal(
        {
          healthType: "health",
          amountType: "multiplicative",
          amount: 0.4,
        },
        this
      );
      if (
        this._character?.checkCondition(() => {
          return this._character.statusEffect.hasBuff("Call to Action");
        })
      ) {
        this._character?.statusEffect.removeBuff(
          "Call to Action",
          this._character
        );
      } else {
        this._character?.statusEffect.addBuff(
          [
            {
              name: "Call to Action",
              duration: Infinity,
              id: uuid(),
              cantDispel: true,
              cantResist: true,
              unique: true,
              sourceAbility: this,
            },
          ],
          1,
          this
        );
      }
    });
  }
}

class specialskill_COMMANDERLUKESKYWALKER01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_COMMANDERLUKESKYWALKER01",
      "Use the Force",
      `Deal Physical damage to target enemy, Dispel all buffs on them, remove 100% Turn Meter, and inflict Buff Immunity and Tenacity Down for 2 turns. Reduce the cooldown of this ability by 1 if the target didn't have full Health.`,
      character
    );
    this.cooldown = 4;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      if (primaryTarget) {
        if (primaryTarget.stats.health < primaryTarget.stats.maxHealth) {
          this.changeCooldown(-1, this);
        }
        primaryTarget.statusEffect.removeBuff("all");
        this._character?.statusEffect.inflictDebuff(
          [
            {
              name: "Buff Immunity",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
            },
          ],
          primaryTarget,
          1,
          this
        );
        this.dealDamage("physical", primaryTarget, 2.978);
        primaryTarget.changeTurnMeter(-100, this);
        this._character?.statusEffect.inflictDebuff(
          [
            {
              name: "Tenacity Down",
              duration: 2,
              id: uuid(),
              cantResist: true,
              sourceAbility: this,
            },
          ],
          primaryTarget,
          1,
          this
        );
      }
    });
  }
}

class uniqueskill_COMMANDERLUKESKYWALKER02 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_COMMANDERLUKESKYWALKER02",
      "It Binds All Things",
      `Luke has +40% Potency. Whenever Luke Resists a detrimental effect he recovers 5% Health and 5% Protection. Whenever Luke inflicts a debuff he gains 10% Turn Meter and other allies gain half that amount.`,
      character
    );
  }

  public override activate(): void {
    this._character?.stats.addTempStats(
      [
        {
          statToModify: "potency",
          amount: 0.4,
          modifiedType: "additive",
        },
      ],
      this
    );

    this._character?.events.push(
      {
        characterSourceId: this._character.uniqueId,
        eventType: "resisted",
        callback: () => {
          this._character?.heal(
            {
              amount: 0.05,
              healthType: "protection",
              amountType: "multiplicative",
            },
            this
          );
          this._character?.heal(
            {
              amount: 0.05,
              healthType: "health",
              amountType: "multiplicative",
            },
            this
          );
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "inflicted",
        callback: () => {
          this._character?.changeTurnMeter(10, this);
          this._character?.teammates.forEach((target) => {
            if (!target.isSelf(this._character)) {
              target.changeTurnMeter(5, this);
            }
          });
        },
      }
    );
  }
}

class uniqueskill_COMMANDERLUKESKYWALKER01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_COMMANDERLUKESKYWALKER01",
      "Learn Control",
      `While Luke doesn't have Call to Action, he has +50% Counter Chance, +50% Critical Avoidance, +50% Defense, +100% Tenacity, and gains 10% Turn Meter whenever another Rebel ally takes damage.`,
      character
    );
  }

  public override activate(): void {
    this._character?.stats.addTempStats(
      [
        {
          statToModify: "counterChance",
          amount: 0.5,
          modifiedType: "additive",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "physicalCritAvoid",
          amount: 0.5,
          modifiedType: "additive",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "specialCritAvoid",
          amount: 0.5,
          modifiedType: "additive",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "physicalArmor",
          amount: 0.5,
          modifiedType: "multiplicative",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "specialArmor",
          amount: 0.5,
          modifiedType: "multiplicative",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "tenacity",
          amount: 1,
          modifiedType: "additive",
          condition: () => {
            return !this._character.statusEffect.hasBuff("Call to Action");
          },
          characterSourceId: this._character.uniqueId,
        },
      ],
      this
    );

    const targetList = this._character.teammates.filter((ally) => {
      return ally.hasTags("Rebel & !Self", this._character.id);
    });

    targetList.forEach((target) => {
      target.events.push({
        characterSourceId: this._character?.uniqueId,
        eventType: "receiveDamage",
        callback: () => {
          this._character?.changeTurnMeter(10, this);
        },
      });
    });
  }
}

class leaderskill_COMMANDERLUKESKYWALKER extends PassiveAbility {
  constructor(character: Character) {
    super(
      "leaderskill_COMMANDERLUKESKYWALKER",
      "Rebel Maneuvers",
      `Rebel allies have +50% Counter Chance, +50% Defense, and +15% Offense. Whenever an enemy Resists a detrimental effect, Rebel allies gain 5% Turn Meter.`,
      character
    );
  }

  public override activate() {
    const targetList = this._character.teammates.filter((ally) => {
      return ally.hasTags("Rebel", this._character.id);
    });

    targetList.forEach((target) => {
      target.stats.addTempStats(
        [
          {
            statToModify: "counterChance",
            amount: 0.5,
            modifiedType: "additive",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "physicalArmor",
            amount: 0.5,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "specialArmor",
            amount: 0.5,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "physicalOffense",
            amount: 0.15,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "specialOffense",
            amount: 0.15,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
        ],
        this
      );

      target.events.push({
        characterSourceId: this._character?.uniqueId ?? "",
        eventType: "resisted",
        callback: () => {
          target.changeTurnMeter(5, this);
        },
      });
    });
  }
}

const basicAbility = new Map([
  ["basicskill_COMMANDERLUKESKYWALKER", basicskill_COMMANDERLUKESKYWALKER],
]);

const specialAbilities = new Map([
  [
    "specialskill_COMMANDERLUKESKYWALKER02",
    specialskill_COMMANDERLUKESKYWALKER02,
  ],
  [
    "specialskill_COMMANDERLUKESKYWALKER01",
    specialskill_COMMANDERLUKESKYWALKER01,
  ],
]);

const uniqueAbilities = new Map([
  [
    "uniqueskill_COMMANDERLUKESKYWALKER01",
    uniqueskill_COMMANDERLUKESKYWALKER01,
  ],
  [
    "uniqueskill_COMMANDERLUKESKYWALKER02",
    uniqueskill_COMMANDERLUKESKYWALKER02,
  ],
]);

const leaderAbility = new Map([
  ["leaderskill_COMMANDERLUKESKYWALKER", leaderskill_COMMANDERLUKESKYWALKER],
]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
