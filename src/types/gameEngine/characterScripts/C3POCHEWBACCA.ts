import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";
import { gameEngine } from "../gameEngine";

class basicskill_C3POCHEWBACCA extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_C3POCHEWBACCA",
      "Frantic Shot",
      `Deal Physical damage to target enemy and inflict Evasion Down for 2 turns.`,
      character
    );
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered: boolean = true
  ): void {
    super.execute(targetCharacter, stats, canBeCountered, () => {
      const { targetList } = this.findTargets(
        {
          filters: [{ allies: false }],
          targetCount: 1,
        },
        targetCharacter
      );

      targetList.forEach((target) => {
        if (!this.checkEvade("physical", target)) {
          this.dealDamage("physical", target, 2, 5, stats, canBeCountered);
          this._character.statusEffect.inflictDebuff(
            [{ name: "Evasion Down", id: uuid(), duration: 2 }],
            target,
            1,
            this
          );
        }
      });
    });
  }
}

class specialskill_C3POCHEWBACCA01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_CHEWBACCALEGENDARY01",
      "Shining Distraction",
      `Dispel all debuffs on Threepio & Chewie. Rebel allies recover 15% Protection and gain Advantage for 2 turns. Dispel all buffs from all enemies and Blind them for 2 turns. This ability can't be evaded.`,
      character
    );
    this.cooldown = 2;
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered: boolean = true
  ): void {
    super.execute(targetCharacter, stats, canBeCountered, () => {
      this._character.statusEffect.removeDebuff("all", undefined, this);

      const { targetList } = this.findTargets({
        filters: [{ allies: true, tags: ["Rebel"] }],
      });

      targetList.forEach((target) => {
        target.heal({
          healthType: "protection",
          amount: 0.15,
          amountType: "multiplicative",
        });
        target.statusEffect.addBuff(
          [{ name: "Advantage", duration: 2, id: uuid() }],
          1,
          this
        );
      });

      const { targetList: enemies } = this.findTargets({
        filters: [{ allies: false }],
      });

      enemies.forEach((target) => {
        target.statusEffect.removeBuff("all", this._character, this);
        this._character.statusEffect.inflictDebuff(
          [{ name: "Blind", duration: 2, id: uuid() }],
          target,
          1,
          this
        );
      });
    });
  }
}

class specialskill_C3POCHEWBACCA02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_C3POCHEWBACCA02",
      "Chewie's Rage",
      `Deal Physical damage to all enemies. Deal damage an additional time (up to 5 additional times) for each enemy that has been defeated during the battle. Threepio & Chewie gain 10% Offense (stacking) until the end of battle whenever this ability defeats an enemy.`,
      character
    );
    this.cooldown = 3;
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered: boolean = true
  ): void {
    super.execute(targetCharacter, stats, canBeCountered, () => {
      const { targetList } = this.findTargets({
        filters: [{ allies: false }],
      });

      const deadOpponents = this._character.opponents.filter(
        (c) => c.isDead
      ).length;

      targetList.forEach((target) => {
        if (!this.checkEvade("physical", target)) {
          //deal damage a number of times equal to deadOpponents
          for (let i = 0; i < deadOpponents + 1; i++) {
            this.dealDamage("physical", target, 2, 5, [], canBeCountered);
          }
        }
      });

      //todo add stacking offense
    });
  }
}

class uniqueskill_CHEWBACCALEGENDARY01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_CHEWBACCALEGENDARY01",
      "Loyal Friend",
      `At the start of the battle, grant Guard to the weakest ally and Han Solo until Chewbacca is defeated. Chewbacca Assists when a Guarded ally uses any ability during their turn, doing 20% less damage, limited once per turn. When Chewbacca deals damage to an enemy, Chewbacca and all Guarded allies recover 3% Health and 3% Protection.\n\nGuard: Can't be Critically Hit, immune to Daze and Stun, +25% Critical Chance`,
      character
    );
  }

  public override activate(): void {
    let triggerCount = 0;

    this._character?.events.push(
      {
        characterSourceId: this._character.uniqueId,
        eventType: "matchSetup",
        callback: () => {
          const { targetList: weakest } = this.findTargets({
            filters: [
              { allies: true },
              { tags: ["!Self"] },
              { targetIds: ["!HANSOLO"] },
            ],
            targetCount: 1,
            weakest: true,
          });

          const { targetList: hansolo } = this.findTargets({
            filters: [{ allies: true }, { targetIds: ["HANSOLO"] }],
          });

          [...weakest, ...hansolo].forEach((target) => {
            target.statusEffect.addStatusEffect(
              { name: "Guard", duration: Infinity, id: uuid() },
              this
            );
            target.events.push({
              eventType: "useAbility",
              characterSourceId: this._character.uniqueId,
              callback: ({ target }) => {
                if (triggerCount < 1) {
                  triggerCount++;
                  this._character.assist(
                    [
                      {
                        statToModify: "offense",
                        amount: 0.8,
                        modifiedType: "multiplicative",
                      },
                    ],
                    target,
                    this
                  );
                }
              },
            });
          });
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "endOfTurn",
        callback: () => {
          triggerCount = 0;
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "dealDamage",
        callback: () => {
          const { targetList: guardedAllies } = this.findTargets({
            filters: [{ allies: true }, { statusEffects: ["Guard"] }],
          });

          [...guardedAllies, this._character].forEach((target) => {
            target.heal(
              {
                healthType: "protection",
                amount: 0.03,
                amountType: "multiplicative",
              },
              this
            );
            target.heal(
              {
                healthType: "health",
                amount: 0.03,
                amountType: "multiplicative",
              },
              this
            );
          });
        },
      }
    );
  }

  public override deactivate(): void {
    super.deactivate();

    const { targetList } = this.findTargets({
      filters: [{ allies: true }, { statusEffects: ["Guard"] }],
    });

    targetList.forEach((target) => {
      target.statusEffect.removeStatusEffect("Guard", this);
    });
  }
}

class uniqueskill_CHEWBACCALEGENDARY02 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_CHEWBACCALEGENDARY02",
      "Raging Wookie",
      `Chewbacca is immune to Ability Block and Cooldown Increase. When Chewbacca deals damage to an enemy with an attack, he deals bonus damage equal to 20% of their Max Health. When Chewbacca takes damage from an attack, he gains +25% Offense and +25% Critical Chance until the end of his next turn. When Chewbacca or a Guarded ally takes damage from an attack, reduce Furious Bowcaster's cooldown by 1.`,
      character
    );
  }

  public override activate(): void {
    let triggerCount = 0;

    this._character.statusEffect.addImmune(
      this._character.uniqueId,
      "Ability Block"
    );
    this._character.statusEffect.addImmune(
      this._character.uniqueId,
      "Cooldown Increase"
    );

    this._character.events.push(
      {
        eventType: "dealDamage",
        characterSourceId: this._character.uniqueId,
        callback: ({ target }: { target: Character }) => {
          if (triggerCount < 1) {
            triggerCount++;
            this.dealDamage(
              "true",
              target,
              target.stats.maxHealth * 0.2,
              0,
              [],
              false
            );
          }
        },
      },
      {
        eventType: "receiveDamage",
        characterSourceId: this._character.uniqueId,
        callback: ({ attackSource }) => {
          if (attackSource) {
            this._character.stats.tempStats.push(
              {
                statToModify: "offense",
                amount: 0.25,
                modifiedType: "multiplicative",
                expires: {
                  count: 1,
                  frequency: "turn",
                },
              },
              {
                statToModify: "critChance",
                amount: 0.25,
                modifiedType: "additive",
                expires: {
                  count: 1,
                  frequency: "turn",
                },
              }
            );
          }
        },
      },
      {
        eventType: "matchSetup",
        characterSourceId: this._character.uniqueId,
        callback: () => {
          const { targetList } = this.findTargets({
            filters: [{ allies: true }, { statusEffects: ["Guard"] }],
          });

          targetList.forEach((target) => {
            target.events.push({
              eventType: "receiveDamage",
              characterSourceId: this._character.uniqueId,
              callback: ({ attackSource }) => {
                if (attackSource) {
                  const furiousBowcasterAbility =
                    this._character.activeAbilities.find(
                      (ability) =>
                        ability.id === "specialskill_CHEWBACCALEGENDARY02"
                    );

                  if (furiousBowcasterAbility) {
                    furiousBowcasterAbility.changeCooldown(-1, this);
                  }
                }
              },
            });
          });
        },
      },
      {
        eventType: "endOfTurn",
        characterSourceId: this._character.uniqueId,
        callback: () => {
          triggerCount = 0;
        },
      }
    );
  }
}

const basicAbility = new Map([
  ["basicskill_C3POCHEWBACCA", basicskill_C3POCHEWBACCA],
]);

const specialAbilities = new Map([
  ["specialskill_C3POCHEWBACCA01", specialskill_C3POCHEWBACCA01],
  ["specialskill_C3POCHEWBACCA02", specialskill_C3POCHEWBACCA02],
]);

const uniqueAbilities = new Map([
  ["uniqueskill_CHEWBACCALEGENDARY01", uniqueskill_CHEWBACCALEGENDARY01],
  ["uniqueskill_CHEWBACCALEGENDARY02", uniqueskill_CHEWBACCALEGENDARY02],
]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
