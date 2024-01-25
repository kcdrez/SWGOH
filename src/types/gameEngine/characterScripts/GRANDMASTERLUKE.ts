import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";
import { gameEngine } from "../gameEngine";
import { Log } from "../characters/log";
import { anyTagsMatch } from "../characters/index";
import { iBuff } from "../characters/statusEffects";

class basicskill_GRANDMASTERLUKE extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_GRANDMASTERLUKE",
      "Indomitable Blast",
      `Inflict Buff Immunity on target enemy for 2 turns and deal Special damage to them. Luke gains 2% Max Health (stacking, max 20%) until the end of encounter. This attack will critically hit if able and can't be countered.`,
      character
    );
  }

  public execute(targetCharacter?: Character, stats?: iStatsCheck[]): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);
    let stackCounter = 0;

    super.execute(primaryTarget, stats, false, () => {
      if (primaryTarget) {
        if (!this.checkEvade("special", primaryTarget)) {
          this._character.statusEffect.inflictDebuff(
            [{ name: "Buff Immunity", duration: 2, id: uuid() }],
            primaryTarget,
            1,
            this
          );

          this.dealDamage(
            "special",
            primaryTarget,
            2,
            5,
            [
              ...(stats ?? []),
              {
                statToModify: "specialCritChance",
                amount: 200,
                modifiedType: "additive",
                characterSourceId: this._character.uniqueId,
              },
            ],
            false
          );
        }
      }

      if (stackCounter < 20) {
        this._character.stats.tempStats.push({
          characterSourceId: this._character.uniqueId,
          statToModify: "maxHealth",
          amount: 0.02 * this._character.stats.maxHealth,
          modifiedType: "additive",
        });
        stackCounter++;
      }
    });
  }
}

class specialskill_GRANDMASTERLUKE01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_GRANDMASTERLUKE01",
      "They Grow Beyond",
      `Inflict Tenacity Down on target enemy for 2 turns, then Daze them for 2 turns. Increase their cooldowns by 1.\n\nRaid Bosses: Inflict Tenacity Down on target enemy for 2 turns, then inflict 3 Expose for 2 turns on them.\n\nCall target other Light Side ally to assist, then grant them and Jedi Master Luke Skywalker Advantage and Critical Damage Up for 2 turns.\n\nIf target other ally is a Jedi, that ally gains Jedi Lessons for 3 turns, which can't be copied. If they already have Jedi Lessons, the duration for all current stacks on them resets to 3 turns (max 3 stacks).\n\nThis ability can't be resisted or evaded.\n\nJedi Lessons: +20% Mastery per stack`,
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
      if (primaryTarget) {
        this._character.statusEffect.inflictDebuff(
          [
            {
              name: "Tenacity Down",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
              cantResist: true,
            },
          ],
          primaryTarget,
          1,
          this
        );

        this._character.statusEffect.inflictDebuff(
          [
            {
              name: "Daze",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
              cantResist: true,
            },
          ],
          primaryTarget,
          1,
          this
        );

        primaryTarget.specialAbilities.forEach((ability) => {
          ability.changeCooldown(1, this, this._character, true);
        });

        const ally = this.findRandomAlly();
        if (ally) {
          ally.assist([], primaryTarget, this);

          ally.statusEffect.addBuff(
            [
              {
                name: "Advantage",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
              {
                name: "Critical Damage Up",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
            ],
            1,
            this
          );

          if (ally.hasTags("Jedi", this._character.id)) {
            ally.statusEffect.resetDuration("Jedi Lessons", 3, "buff", this);

            ally.statusEffect.addBuff(
              [
                {
                  name: "Jedi Lessons",
                  duration: 3,
                  id: uuid(),
                  sourceAbility: this,
                  isStackable: true,
                  stacks: 1,
                  maxStacks: 3,
                  unique: true,
                },
              ],
              1,
              this
            );
          }
        }

        this._character.statusEffect.addBuff(
          [
            {
              name: "Advantage",
              duration: 2,
              id: uuid(),
              sourceAbility: this,
            },
            {
              name: "Critical Damage Up",
              duration: 2,
              id: uuid(),
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

const basicAbility = new Map([
  ["basicskill_GRANDMASTERLUKE", basicskill_GRANDMASTERLUKE],
]);

const specialAbilities = new Map([
  ["specialskill_GRANDMASTERLUKE01", specialskill_GRANDMASTERLUKE01],
]);

const uniqueAbilities = new Map([]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
