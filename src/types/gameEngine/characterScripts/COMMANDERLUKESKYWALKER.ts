import { v4 as uuid } from "uuid";

import { Ability, ActiveAbility } from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";

// import C3POCHEWBACCA from "./C3POCHEWBACCA";
// import AAYLASECURA from "./AAYLASECURA";
// import CHEWBACCALEGENDARY from "./CHEWBACCALEGENDARY";
// import COMMANDERLUKESKYWALKER from "./COMMANDERLUKESKYWALKER";
// import HANSOLO from "./HANSOLO";
// import OLDBENKENOBI from "./OLDBENKENOBI";
// import ADMIRALACKBAR from "./ADMIRALACKBAR";

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
            { name: "Speed Down", duration: 1, id: uuid() },
            { name: "Defense Down", duration: 1, id: uuid() },
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

export default new Map([
  ["basicskill_COMMANDERLUKESKYWALKER", basicskill_COMMANDERLUKESKYWALKER],
  [
    "specialskill_COMMANDERLUKESKYWALKER02",
    specialskill_COMMANDERLUKESKYWALKER02,
  ],
]);
// const x: Map<string, Ability> = {
//   meow: basicskill_COMMANDERLUKESKYWALKER
// }

// const characterMapping: Record<string, Ability> = {
//   basicskill_COMMANDERLUKESKYWALKER
// };

// export default characterMapping;
