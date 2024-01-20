import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";
import { gameEngine, iCondition } from "../gameEngine";
import { Log } from "../characters/log";

class basicskill_C3POLEGENDARY extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_C3POLEGENDARY",
      "Baffling Trick",
      `C-3PO inflicts the unique debuff Confuse for 3 turns (max 3 stacks, can't be evaded or copied). If target is already Confused, duration of their stacks resets to 3 turns. Reduce target's Turn Meter by 6% and 3% more for each stack of Translation on C-3PO. (See Protocol Droid for Translation.)
      \n\n
      Confuse - Detrimental effects build based on the cumulative number of stacks:
      1: Cannot gain buffs
      2: Cannot counter, assist, or gain bonus Turn Meter (Raid bosses and Galactic Legends: -30% Counter Chance)
      3: When this character uses their Basic ability, increase their cooldowns by 1, which can't be resisted (Raid bosses and Galactic Legends: -50% Defense, doesn't stack with Defense Down)`,
      character
    );
  }

  public execute(targetCharacter?: Character, stats?: iStatsCheck[]): void {
    const { targetList, primaryTarget } = this.findTargets(
      {
        filters: [{ allies: false }],
        targetCount: 1,
      },
      targetCharacter
    );

    super.execute(primaryTarget, stats, false, () => {
      targetList.forEach((target) => {
        target.statusEffect.resetDuration("Confuse", 3, "debuff");

        if (
          target.statusEffect.debuffs.filter((d) => d.name === "Confuse")
            .length < 3
        ) {
          this._character.statusEffect.inflictDebuff(
            [
              {
                name: "Confuse",
                duration: 3,
                id: uuid(),
                unique: true,
                isStackable: true,
              },
            ],
            target,
            1,
            this
          );
        }

        const translationCount = this._character.statusEffect.buffs.filter(
          (b) => b.name === "Translation"
        ).length;

        target.changeTurnMeter(
          -6 + translationCount * -3,
          this,
          this._character
        );
      });
    });
  }
}

class specialskill_C3POLEGENDARY01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialability_C3POLEGENDARY01",
      "Oh My Goodness!",
      `C-3PO gains Potency Up and Stealth for 2 turns, then he and target other ally gain Translation for 3 turns. C-3PO inflicts Confuse twice on target enemy for 3 turns, then calls all other allies with Translation to assist, dealing 50% less damage.
      \n\n
      (See Protocol Droid for a description of Translation.)`,
      character
    );
    this.cooldown = 3;
  }

  public execute(targetCharacter?: Character, stats?: iStatsCheck[]): void {
    const { targetList: enemies, primaryTarget } = this.findTargets(
      {
        filters: [{ allies: false }],
        targetCount: 1,
      },
      targetCharacter
    );

    const { targetList: targetAllies } = this.findTargets({
      filters: [{ allies: true }, { tags: ["!Self"] }],
      targetCount: 1,
    });

    super.execute(primaryTarget, stats, false, () => {
      this._character.statusEffect.addBuff(
        [
          { name: "Potency Up", id: uuid(), duration: 2 },
          { name: "Stealth", id: uuid(), duration: 2 },
          {
            name: "Translation",
            id: uuid(),
            duration: 3,
            unique: true,
            isStackable: true,
          },
        ],
        1,
        this
      );

      targetAllies.forEach((target) => {
        target.statusEffect.addBuff(
          [
            {
              name: "Translation",
              id: uuid(),
              duration: 3,
              unique: true,
              isStackable: true,
            },
          ],
          1,
          this
        );
      });

      const { targetList: allTranslationAllies } = this.findTargets({
        filters: [
          { allies: true },
          { tags: ["!Self"] },
          { buffs: ["Translation"] },
        ],
      });

      allTranslationAllies.forEach((target) => {
        target.assist(
          [
            {
              statToModify: "physicalOffense",
              modifiedType: "multiplicative",
              amount: 0.5,
            },
            {
              statToModify: "specialOffense",
              modifiedType: "multiplicative",
              amount: 0.5,
            },
          ],
          primaryTarget ?? targetCharacter,
          this
        );
      });

      enemies.forEach((target) => {
        this._character.statusEffect.inflictDebuff(
          [
            {
              name: "Confuse",
              duration: 3,
              id: uuid(),
              unique: true,
              isStackable: true,
              stacks: 2,
              maxStacks: 3,
            },
          ],
          target,
          1,
          this
        );
      });
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
    this._character?.stats.tempStats.push({
      statToModify: "potency",
      amount: 0.4,
      modifiedType: "additive",
    });

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
    const doesntHaveCallToAction: iCondition = {
      buffs: ["Call to Action"],
      inverted: true,
    };

    this._character?.stats.tempStats.push({
      statToModify: "counterChance",
      amount: 0.5,
      modifiedType: "additive",
      condition: doesntHaveCallToAction,
      characterSourceId: this._character.uniqueId,
    });

    this._character?.stats.tempStats.push(
      {
        statToModify: "physicalCritAvoid",
        amount: 0.5,
        modifiedType: "additive",
        condition: doesntHaveCallToAction,
        characterSourceId: this._character.uniqueId,
      },
      {
        statToModify: "specialCritAvoid",
        amount: 0.5,
        modifiedType: "additive",
        condition: doesntHaveCallToAction,
        characterSourceId: this._character.uniqueId,
      }
    );

    this._character?.stats.tempStats.push(
      {
        statToModify: "physicalArmor",
        amount: 0.5,
        modifiedType: "multiplicative",
        condition: doesntHaveCallToAction,
        characterSourceId: this._character.uniqueId,
      },
      {
        statToModify: "specialArmor",
        amount: 0.5,
        modifiedType: "multiplicative",
        condition: doesntHaveCallToAction,
        characterSourceId: this._character.uniqueId,
      }
    );

    this._character?.stats.tempStats.push({
      statToModify: "tenacity",
      amount: 1,
      modifiedType: "additive",
      condition: doesntHaveCallToAction,
      characterSourceId: this._character.uniqueId,
    });

    const { targetList } = this.findTargets({
      filters: [{ allies: true }, { tags: ["Rebel & !Self"] }],
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

const basicAbility = new Map([
  ["basicskill_C3POLEGENDARY", basicskill_C3POLEGENDARY],
]);

const specialAbilities = new Map([
  ["specialskill_C3POLEGENDARY01", specialskill_C3POLEGENDARY01],
]);

const uniqueAbilities = new Map([
  // [
  //   "uniqueskill_COMMANDERLUKESKYWALKER01",
  //   uniqueskill_COMMANDERLUKESKYWALKER01,
  // ],
  // [
  //   "uniqueskill_COMMANDERLUKESKYWALKER02",
  //   uniqueskill_COMMANDERLUKESKYWALKER02,
  // ],
]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
