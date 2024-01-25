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

class basicskill_C3POLEGENDARY extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_C3POLEGENDARY",
      "Baffling Trick",
      `C-3PO inflicts the unique debuff Confuse for 3 turns (max 3 stacks, can't be evaded or copied). If target is already Confused, duration of their stacks resets to 3 turns. Reduce target's Turn Meter by 6% and 3% more for each stack of Translation on C-3PO. (See Protocol Droid for Translation.)\n\nConfuse - Detrimental effects build based on the cumulative number of stacks:\n1: Cannot gain buffs\n2: Cannot counter, assist, or gain bonus Turn Meter (Raid bosses and Galactic Legends: -30% Counter Chance)\n3: When this character uses their Basic ability, increase their cooldowns by 1, which can't be resisted (Raid bosses and Galactic Legends: -50% Defense, doesn't stack with Defense Down)`,
      character
    );
  }

  public execute(targetCharacter?: Character, stats?: iStatsCheck[]): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, false, () => {
      if (primaryTarget) {
        primaryTarget.statusEffect.resetDuration("Confuse", 3, "debuff");

        if (
          primaryTarget.statusEffect.debuffs.filter((d) => d.name === "Confuse")
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
            primaryTarget,
            1,
            this
          );
        }

        const translationCount = this._character.statusEffect.buffs.filter(
          (b) => b.name === "Translation"
        ).length;

        primaryTarget.changeTurnMeter(
          -6 + translationCount * -3,
          this,
          this._character
        );
      }

      const protocolDroidAbility = this._character.uniqueAbilities.find(
        (x) => x.id === "uniqueskill_C3POLEGENDARY01"
      );
      //todo, if tech is present, dont do the following
      this._character.teammates.forEach((ally) => {
        if (ally.statusEffect.hasBuff("Translation", undefined, 3)) {
          ally.specialAbilities.forEach((ability) => {
            ability.changeCooldown(
              -1,
              protocolDroidAbility ?? this,
              this._character
            );
          });
        }
      });
    });
  }
}

class specialskill_C3POLEGENDARY01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialability_C3POLEGENDARY01",
      "Oh My Goodness!",
      `C-3PO gains Potency Up and Stealth for 2 turns, then he and target other ally gain Translation for 3 turns. C-3PO inflicts Confuse twice on target enemy for 3 turns, then calls all other allies with Translation to assist, dealing 50% less damage.\n\n(See Protocol Droid for a description of Translation.)`,
      character
    );
    this.cooldown = 3;
  }

  public execute(targetCharacter?: Character, stats?: iStatsCheck[]): void {
    const primaryEnemy = this.findRandomEnemy(targetCharacter);
    const primaryAlly = this.findRandomAlly(targetCharacter);

    super.execute(primaryEnemy, stats, false, () => {
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
            stacks: 1,
          },
        ],
        1,
        this
      );

      if (primaryAlly) {
        primaryAlly.statusEffect.addBuff(
          [
            {
              name: "Translation",
              id: uuid(),
              duration: 3,
              unique: true,
              isStackable: true,
              stacks: 1,
            },
          ],
          1,
          this
        );
      }

      const allTranslationAllies = this._character.teammates.filter((ally) => {
        return (
          !ally.isSelf(this._character) &&
          ally.statusEffect.hasBuff("Translation")
        );
      });

      if (primaryEnemy) {
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
          primaryEnemy,
          1,
          this
        );

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
            primaryEnemy ?? targetCharacter,
            this
          );
        });
      }
    });
  }
}

class uniqueskill_C3POLEGENDARY01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_C3POLEGENDARY01",
      "Protocol Droid",
      `C-3PO has +20 Speed. While C-3PO is active, Galactic Republic, Rebel, Resistance, and Ewok allies gain Translation for 3 turns (max 3 stacks) each time they use a Special ability. Translation cannot be copied. If the character already has Translation, the duration for all current stacks on that character resets to 3 turns. If all allies that can apply Translation are defeated, all stacks of Translation expire.\n\nTranslation - Beneficial effects build based on the cumulative number of stacks:\n1: Gain +30% Max Health\n2: Gain +15% Critical Chance\n3: If only one ally who grants Translation is present, decrease this character's cooldowns by 1 when that ally uses their Basic ability (limit once per turn)`,
      character
    );
  }

  public override activate(): void {
    this._character?.stats.tempStats.push({
      statToModify: "speed",
      amount: 20,
      modifiedType: "additive",
    });

    const rebelAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Rebel & !Self"], this._character.id)
    );
    const resistanceAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Resistance & !Self"], this._character.id)
    );
    const ewokAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Ewok & !Self"], this._character.id)
    );

    [
      this._character,
      ...rebelAllies,
      ...resistanceAllies,
      ...ewokAllies,
    ].forEach((ally) => {
      ally.events.push({
        eventType: "useAbility",
        characterSourceId: this._character.uniqueId,
        callback: ({ abilityId }) => {
          if (abilityId !== ally.basicAbility?.id) {
            ally.statusEffect.resetDuration("Translation", 3, "buff", this);

            ally.statusEffect.addBuff(
              [
                {
                  name: "Translation",
                  duration: 3,
                  maxStacks: 3,
                  isStackable: true,
                  unique: true,
                  id: uuid(),
                  stacks: 1,
                },
              ],
              1,
              this
            );
          }
        },
      });
    });

    this._character.events.push({
      eventType: "death",
      characterSourceId: this._character.uniqueId,
      callback: () => {
        const allyTech = this._character.teammates.find((x) => x.id === "TECH"); //todo
        if (allyTech) {
        }

        this._character.teammates.forEach((ally) => {
          ally.statusEffect.removeBuff("Translation", this._character, this);
        });
      },
    });
  }
}

class uniqueskill_C3POLEGENDARY02 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_C3POLEGENDARY02",
      "Wait For Me!",
      `C-3PO and R2-D2 have +10% Evasion for each of their own stacks of Translation. At the start of encounter, C-3PO and R2-D2 gain Translation for 3 turns. When there are no other allied combatants, C-3PO escapes from battle.`,
      character
    );
  }

  public override activate(): void {
    const validTargets = this._character.teammates.filter(
      (x) => x.id === "R2D2LEGENDARY" || x.id === this._character.id
    );
    validTargets.forEach((target) => {
      target.stats.tempStats.push(
        {
          modifiedType: "additive",
          statToModify: "physicalDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          modifiedType: "additive",
          statToModify: "physicalDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          modifiedType: "additive",
          statToModify: "physicalDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          modifiedType: "additive",
          statToModify: "specialDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          modifiedType: "additive",
          statToModify: "specialDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        },
        {
          modifiedType: "additive",
          statToModify: "specialDodge",
          amount: 0.1,
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
          characterSourceId: this._character.uniqueId,
        }
      );

      target.events.push({
        eventType: "matchSetup",
        characterSourceId: this._character.uniqueId,
        callback: () => {
          target.statusEffect.addBuff(
            {
              name: "Translation",
              duration: 3,
              unique: true,
              isStackable: true,
              maxStacks: 3,
              id: uuid(),
              stacks: 1,
            },
            1,
            this
          );
          target.stats.gainHealth(Infinity, "health");
        },
      });
    });

    [...this._character.teammates, ...this._character.opponents].forEach(
      (ally) => {
        if (!ally.isSelf(this._character)) {
          ally.events.push({
            eventType: "startOfTurn",
            characterSourceId: this._character.uniqueId,
            callback: () => {
              //todo check other passive characters
              const aliveAllies = this._character.teammates.filter(
                (x) => !x.isDead
              );

              if (aliveAllies.length === 1 && !this._character.isDead) {
                this._character.stats.loseHealth(
                  this._character.stats.maxHealth,
                  "health"
                );
                gameEngine.addLogs(
                  new Log({
                    character: this._character,
                    customMessage: "escaped from the battle",
                    ability: { source: this },
                  })
                );
              }
            },
          });
        }
      }
    );
  }
}

class uniqueskill_C3POLEGENDARY03 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_C3POLEGENDARY03",
      "Intermediary",
      `All allies have +10% Defense Penetration. Each time a Galactic Republic or Ewok ally gains a different, non-unique, non-Protection buff, they gain 15% Protection Up for 2 turns (does not stack with itself). For each stack of Translation, Galactic Republic have +10% Defense Penetration, doubled for Ewoks.`,
      character
    );
  }

  public override activate(): void {
    this._character.teammates.forEach((ally) => {
      ally.stats.tempStats.push(
        {
          statToModify: "physicalArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
        },
        {
          statToModify: "specialArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
        }
      );
    });

    const ewokAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Ewok"], this._character.id)
    );
    const republicAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Galactic Republic"], this._character.id)
    );

    [...ewokAllies, ...republicAllies].forEach((ally) => {
      ally.events.push({
        eventType: "buffed",
        characterSourceId: this._character.uniqueId,
        callback: ({ buff }: { buff: iBuff }) => {
          if (
            !ally.statusEffect.hasBuff(
              buff.name,
              undefined,
              undefined,
              false
            ) &&
            buff.name !== "Protection Up" &&
            !buff.unique
          ) {
            ally.statusEffect.addBuff(
              [
                {
                  name: "Protection Up",
                  duration: 1,
                  stacks: 0.15 * ally.stats.maxHealth,
                  id: uuid(),
                  sourceAbility: this,
                },
              ],
              1,
              this
            );
          }
        },
      });
    });

    ewokAllies.forEach((ally) => {
      ally.stats.tempStats.push(
        {
          statToModify: "specialArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "specialArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "specialArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.2,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        }
      );
    });

    republicAllies.forEach((ally) => {
      ally.stats.tempStats.push(
        {
          statToModify: "specialArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "specialArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "specialArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "physicalArmorPen",
          amount: 0.1,
          modifiedType: "multiplicative",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        }
      );
    });
  }
}

class uniqueskill_C3POLEGENDARY04 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_C3POLEGENDARY04",
      "Fretful Mediator",
      `All allies have +10% Critical Damage. Whenever a Resistance or Ewok ally uses their Special ability, they inflict Offense Down on the target enemy for 2 turns which cannot be evaded. For each stack of Translation, Resistance allies have +10% Critical Damage, doubled for Ewoks.`,
      character
    );
  }

  public override activate(): void {
    this._character.teammates.forEach((ally) => {
      ally.stats.tempStats.push({
        statToModify: "critDamage",
        amount: 0.1,
        modifiedType: "additive",
      });
    });

    const ewokAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Ewok"], this._character.id)
    );
    const resistanceAllies = this._character.teammates.filter((ally) =>
      anyTagsMatch(ally, ["Resistance"], this._character.id)
    );

    [...ewokAllies, ...resistanceAllies].forEach((ally) => {
      ally.events.push({
        eventType: "useAbility",
        characterSourceId: this._character.uniqueId,
        callback: ({
          abilityId,
          target,
        }: {
          abilityId: string;
          target: Character;
        }) => {
          if (ally.specialAbilities.some((x) => x.id === abilityId)) {
            ally.statusEffect.inflictDebuff(
              [{ name: "Offense Down", duration: 2, id: uuid() }],
              target,
              1,
              this
            );
          }
        },
      });
    });

    ewokAllies.forEach((ally) => {
      ally.stats.tempStats.push(
        {
          statToModify: "critDamage",
          amount: 0.2,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "critDamage",
          amount: 0.2,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "critDamage",
          amount: 0.2,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        }
      );
    });

    resistanceAllies.forEach((ally) => {
      ally.stats.tempStats.push(
        {
          statToModify: "critDamage",
          amount: 0.1,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 1, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "critDamage",
          amount: 0.1,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 2, id: uuid(), duration: 0 },
            ],
          },
        },
        {
          statToModify: "critDamage",
          amount: 0.1,
          modifiedType: "additive",
          condition: {
            buffs: [
              { name: "Translation", stacks: 3, id: uuid(), duration: 0 },
            ],
          },
        }
      );
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
  ["uniqueskill_C3POLEGENDARY01", uniqueskill_C3POLEGENDARY01],
  ["uniqueskill_C3POLEGENDARY02", uniqueskill_C3POLEGENDARY02],
  ["uniqueskill_C3POLEGENDARY03", uniqueskill_C3POLEGENDARY03],
  ["uniqueskill_C3POLEGENDARY04", uniqueskill_C3POLEGENDARY04],
]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
