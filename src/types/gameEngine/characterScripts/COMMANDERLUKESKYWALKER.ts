import { v4 as uuid } from "uuid";

import {
  Ability,
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { Dictionary } from "lodash";

class basicskill_COMMANDERLUKESKYWALKER extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_COMMANDERLUKESKYWALKER",
      "Destined Strike",
      "Deal Physical damage to target enemy and inflict Speed Down and Defense Down for 2 turns. If the target already had Speed Down, remove 30% Turn Meter. If the target already had Defense Down, inflict Stun for 1 turn.",
      character
    );
  }

  public execute(): void {
    super.execute();

    const { targetList } = this.findTargets({
      filters: [{ allies: false }],
      targetCount: 1,
    });

    targetList.forEach((target) => {
      if (!this.checkEvade("physical", target)) {
        this.dealDamage("physical", target, 1.781);
        if (
          target.checkCondition({
            debuffs: ["Speed Down"],
          })
        ) {
          target.changeTurnMeter(-30, this);
        }

        if (
          target.checkCondition({
            debuffs: ["Defense Down"],
          })
        ) {
          this._character?.statusEffect.inflictDebuff(
            [{ name: "Stun", duration: 1, id: uuid() }],
            target,
            1,
            this
          );
        }

        this._character?.statusEffect.inflictDebuff(
          [
            { name: "Speed Down", duration: 2, id: uuid() },
            { name: "Defense Down", duration: 2, id: uuid() },
          ],
          target,
          1,
          this
        );

        this._character?.checkDeath(target);
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
    super.execute();

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
      this._character?.checkCondition({
        buffs: ["Call to Action"],
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
          },
        ],
        1,
        this
      );
    }
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

  public execute(): void {
    super.execute();

    const { targetList } = this.findTargets({
      filters: [{ allies: false }],
      targetCount: 1,
    });

    targetList.forEach((target) => {
      if (target.stats.health < target.stats.maxHealth) {
        this.changeCooldown(-1, this);
      }

      target.statusEffect.removeBuff("all");
      this._character?.statusEffect.inflictDebuff(
        [{ name: "Buff Immunity", duration: 2, id: uuid() }],
        target,
        1,
        this
      );
      this.dealDamage("physical", target, 2.978);
      target.changeTurnMeter(-100, this);
      this._character?.statusEffect.inflictDebuff(
        [{ name: "Tenacity Down", duration: 2, id: uuid(), cantResist: true }],
        target,
        1,
        this
      );
      this._character?.checkDeath(target);
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

    this._character?.stats.tempStats.push({
      statToModify: "potency",
      amount: 0.4,
      modifiedType: "additive",
    });

    this._character?.events.push(
      {
        id: this._character.id,
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
              healthType: "protection",
              amountType: "multiplicative",
            },
            this
          );
        },
      },
      {
        id: this._character.id,
        eventType: "inflicted",
        callback: () => {
          console.log("inflicted");
          this._character?.changeTurnMeter(5, this);
          this._character?.teammates.forEach((target) => {
            target.changeTurnMeter(5, this);
          });
        },
      }
    );

    this.addListener();
  }
}

class uniqueskill_COMMANDERLUKESKYWALKER01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_COMMANDERLUKESKYWALKER01",
      "It Binds All Things",
      `Luke has +40% Potency. Whenever Luke Resists a detrimental effect he recovers 5% Health and 5% Protection. Whenever Luke inflicts a debuff he gains 10% Turn Meter and other allies gain half that amount.`,
      character
    );

    this._character?.stats.tempStats.push({
      statToModify: "potency",
      amount: 0.4,
      modifiedType: "additive",
    });

    this._character?.events.push(
      {
        id: this._character.id,
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
              healthType: "protection",
              amountType: "multiplicative",
            },
            this
          );
        },
      },
      {
        id: this._character.id,
        eventType: "inflicted",
        callback: () => {
          this._character?.changeTurnMeter(10, this);
          this._character?.teammates.forEach((target) => {
            target.changeTurnMeter(5, this);
          });
        },
      }
    );

    this.addListener();
  }
}

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
    "uniqueskill_COMMANDERLUKESKYWALKER02",
    uniqueskill_COMMANDERLUKESKYWALKER02,
  ],
]);

const basicAbility = new Map([
  ["basicskill_COMMANDERLUKESKYWALKER", basicskill_COMMANDERLUKESKYWALKER],
]);

export default { specialAbilities, uniqueAbilities, basicAbility };
// const x: Map<string, Ability> = new Map({
//   meow: basicskill_COMMANDERLUKESKYWALKER
// })

// const characterMapping: Record<string, Ability> = {
//   basicskill_COMMANDERLUKESKYWALKER
// };

// export default characterMapping;
