import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";

class basicskill_HANSOLO extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_HANSOLO",
      "Quick Draw",
      `Deal Physical damage to target enemy. If the target has less than 50% Turn Meter, deal 75% more damage. Otherwise, remove 35% Turn Meter. This attack can't be Evaded.`,
      character
    );
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean,
    additionalEffects: Function = () => {}
  ): void {
    const primaryTarget = this.findRandomEnemy(
      targetCharacter,
      !!targetCharacter
    );

    super.execute(primaryTarget, stats, canBeCountered, () => {
      additionalEffects();
      //note: Cannot be evaded so no evade check
      if (primaryTarget) {
        if (primaryTarget.turnMeter < 50) {
          this.dealDamage(
            "physical",
            primaryTarget,
            2.6, //1.85 (standard ability modifier) + .75 (additional 75% damage)
            5,
            stats,
            canBeCountered
          );
        } else {
          this.dealDamage(
            "physical",
            primaryTarget,
            1.85,
            5,
            stats,
            canBeCountered
          );
          primaryTarget.changeTurnMeter(-35, this);
        }
      }
    });
  }
}

class specialskill_HANSOLO01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_HANSOLO01",
      "Deadeye",
      `Deal Physical damage to target enemy and Stun them for 1 turn. Gain Turn Meter equal to Han's Critical Chance.`,
      character
    );
    this.cooldown = 3;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy();

    super.execute(primaryTarget, stats, canBeCountered, () => {
      this._character.changeTurnMeter(
        this._character.stats.physical.critChance * 100,
        this
      );

      if (primaryTarget) {
        if (!this.checkEvade("physical", primaryTarget)) {
          this._character?.statusEffect.inflictDebuff(
            [{ name: "Stun", duration: 1, id: uuid(), sourceAbility: this }],
            primaryTarget,
            1,
            this
          );
          this.dealDamage(
            "physical",
            primaryTarget,
            3.699,
            5,
            stats,
            canBeCountered
          );
        }
      }
    });
  }
}

class specialskill_HANSOLO02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_HANSOLO02",
      "Never Tell Me the Odds",
      `All allies gain Critical Chance Up and Evasion Up for 2 turns. Han gains 50% Turn Meter and Critical Damage Up for 2 turns.`,
      character
    );
    this.cooldown = 4;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy();

    super.execute(primaryTarget, stats, canBeCountered, () => {
      this._character.changeTurnMeter(50, this);
      this._character.statusEffect.addBuff(
        {
          name: "Critical Damage Up",
          duration: 2,
          id: uuid(),
          sourceAbility: this,
        },
        1,
        this
      );

      this._character.teammates.forEach((target) => {
        target.statusEffect.addBuff(
          [
            {
              name: "Critical Chance Up",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
            },
            {
              name: "Evasion Up",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
            },
          ],
          1,
          this
        );
      });
    });
  }
}

class uniqueskill_HANSOLO01 extends PassiveAbility {
  private triggerCount = 0;

  constructor(character: Character) {
    super(
      "uniqueskill_HANSOLO01",
      "Shoots First",
      `Han has +35% Counter Chance and +20% Critical Chance. The first time each turn Han uses his Basic attack, he attacks again dealing 50% less damage.\n\nHan takes a bonus turn at the start of each encounter. During this turn Han ignores Taunts and he can only use his Basic ability, but it will Stun the target for 1 turn and can't be Resisted.`,
      character
    );
  }

  public override activate(): void {
    this.triggerCount = 0;

    this._character?.stats.addTempStats(
      [
        {
          statToModify: "counterChance",
          amount: 0.35,
          modifiedType: "additive",
        },
        {
          statToModify: "physicalCritChance",
          amount: 0.2,
          modifiedType: "additive",
        },
        {
          statToModify: "specialCritChance",
          amount: 0.2,
          modifiedType: "additive",
        },
      ],
      this
    );

    this._character?.events.push(
      {
        characterSourceId: this._character.uniqueId,
        eventType: "useAbility",
        callback: ({ abilityId, target }) => {
          if (abilityId === "basicskill_HANSOLO" && this.triggerCount < 1) {
            this.triggerCount++;
            const ability = this._character.activeAbilities.find(
              (x) => x.id === "basicskill_HANSOLO"
            );
            ability?.execute(
              target,
              [
                {
                  statToModify: "physicalOffense",
                  amount: 0.5,
                  modifiedType: "multiplicative",
                },
                {
                  statToModify: "specialOffense",
                  amount: 0.5,
                  modifiedType: "multiplicative",
                },
              ],
              true
            );
          }
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "endOfTurn",
        callback: () => {
          this.triggerCount = 0;
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "matchStart",
        callback: () => {
          const ability = this._character.chooseAbility("basicskill_HANSOLO");
          const primaryTarget = this.findRandomEnemy(undefined, true);

          if (primaryTarget) {
            ability?.execute(primaryTarget, [], true, () => {
              this._character.statusEffect.inflictDebuff(
                [
                  {
                    name: "Stun",
                    duration: 1,
                    id: uuid(),
                    cantResist: true,
                    sourceAbility: this,
                  },
                ],
                primaryTarget,
                1,
                this
              );
            });
          }
        },
      }
    );
  }
}

const basicAbility = new Map([["basicskill_HANSOLO", basicskill_HANSOLO]]);

const specialAbilities = new Map([
  ["specialskill_HANSOLO01", specialskill_HANSOLO01],
  ["specialskill_HANSOLO02", specialskill_HANSOLO02],
]);

const uniqueAbilities = new Map([
  ["uniqueskill_HANSOLO01", uniqueskill_HANSOLO01],
]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
