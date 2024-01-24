import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
  HealthSteal,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";
import { gameEngine } from "../gameEngine";
import { randomNumber } from "utils";
import { Log } from "../characters/log";
import { anyTagsMatch } from "../characters/index";

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
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      if (primaryTarget) {
        if (!this.checkEvade("physical", primaryTarget)) {
          this.dealDamage(
            "physical",
            primaryTarget,
            2,
            5,
            stats,
            canBeCountered
          );
          this._character.statusEffect.inflictDebuff(
            [{ name: "Evasion Down", id: uuid(), duration: 2 }],
            primaryTarget,
            1,
            this
          );
        }
      }
    });
  }
}

class specialskill_C3POCHEWBACCA01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_C3POCHEWBACCA01",
      "Shining Distraction",
      `Dispel all debuffs on Threepio & Chewie. Rebel allies recover 15% Protection and gain Advantage for 2 turns. Dispel all buffs from all enemies and Blind them for 2 turns. This ability can't be evaded.`,
      character
    );
    this.cooldown = 2;
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      this._character.statusEffect.removeDebuff("all", undefined, this);

      const rebelAllies = this._character.teammates.filter((ally) =>
        ally.hasTags("Rebel", this._character.id)
      );

      rebelAllies.forEach((target) => {
        target.heal(
          {
            healthType: "protection",
            amount: 0.15,
            amountType: "multiplicative",
          },
          this
        );

        target.statusEffect.addBuff(
          [{ name: "Advantage", duration: 2, id: uuid() }],
          1,
          this
        );
      });

      this._character.opponents.forEach((target) => {
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
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      const deadOpponents = this._character.opponents.filter((c) => c.isDead);

      let defeatedByAbility = 0;

      this._character.opponents.forEach((target) => {
        if (!this.checkEvade("physical", target)) {
          for (let i = 0; i < deadOpponents.length + 1; i++) {
            //custom logic instead of the standard dealDamage method
            const { offense, critChance, armorPen } =
              this._character.stats.getCombatStats("physical", stats);
            const varianceOffense =
              offense * (1 - randomNumber(0 - 5, 5) / 100);

            const { isCrit, damageTotal } = target.receiveDamage(
              "physical",
              varianceOffense * 2,
              armorPen,
              critChance,
              this._character.stats.critDamage,
              stats
            );

            gameEngine.addLogs([
              new Log({
                target,
                damage: {
                  amount: damageTotal,
                  isCrit,
                },
              }),
            ]);

            this._character?.checkDeath(target);

            if (target.isDead) {
              defeatedByAbility++;
            }

            this._character.dispatchEvent("dealDamage", {
              damageAmount: damageTotal,
              isCrit,
              damageType: "physical",
              target,
            });

            target.dispatchEvent("receiveDamage", {
              damageAmount: damageTotal,
              isCrit,
              damageType: "physical",
              attackSource: this.id,
            });

            target.counterAttack(
              this._character,
              i === 0 ? canBeCountered : false
            );
          }
        }
      });

      for (let i = 0; i < defeatedByAbility; i++) {
        this._character.stats.tempStats.push(
          {
            statToModify: "physicalOffense",
            modifiedType: "multiplicative",
            amount: 0.1,
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialOffense",
            modifiedType: "multiplicative",
            amount: 0.1,
            characterSourceId: this._character.uniqueId,
          }
        );
      }
    });
  }
}

class uniqueskill_C3POCHEWBACCA extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_C3POCHEWBACCA",
      "I Must Tell The Others",
      `If the allied Leader is a non-Galactic Legend Rebel, Threepio & Chewie gain 40% of the Leader's Max Health, Max Protection, Offense, Defense, Potency, and Tenacity at the start of the first encounter, and Rebel allies gain half that amount. Rebel allies have +15% Critical Avoidance.\n\nWhenever another Rebel ally uses an ability, Threepio & Chewie are called to assist, dealing 30% less damage (limit once per turn). If they were defeated, Threepio & Chewie are revived with 50% Health and Protection whenever another Rebel ally is revived.\n\nWhile enemies are Blinded, they have -50% Tenacity and can't attack out of turn.`,
      character
    );
  }

  public override activate(): void {
    const teamLeader = this._character.teammates.find((c) => c.isLeader);
    const otherRebels = this._character.teammates.filter((ally) => {
      return (
        !ally.isSelf(this._character) &&
        ally.hasTags("Rebel", this._character.id)
      );
    });
    let triggerCount = 0;

    if (
      teamLeader &&
      anyTagsMatch(teamLeader, ["Rebel & !Galactic Legend"], teamLeader.id)
    ) {
      this._character.stats.tempStats.push(
        {
          statToModify: "maxHealth",
          amount: 0.4 * teamLeader.stats.baseStats.maxHealth,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "maxProtection",
          amount: 0.4 * teamLeader.stats.baseStats.maxProtection,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "physicalOffense",
          amount: 0.4 * teamLeader.stats.baseStats.physical.offense,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "specialOffense",
          amount: 0.4 * teamLeader.stats.baseStats.special.offense,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "physicalArmor",
          amount: 0.4 * teamLeader.stats.baseStats.physical.armor,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "specialArmor",
          amount: 0.4 * teamLeader.stats.baseStats.special.armor,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "potency",
          amount: 0.4 * teamLeader.stats.baseStats.potency,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "tenacity",
          amount: 0.4 * teamLeader.stats.baseStats.tenacity,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "physicalCritAvoid",
          amount: 0.15,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "specialCritAvoid",
          amount: 0.15,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        }
      );
      this._character.stats.initialize();

      otherRebels.forEach((character) => {
        character.stats.tempStats.push(
          {
            statToModify: "maxHealth",
            amount: 0.2 * teamLeader.stats.baseStats.maxHealth,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "maxProtection",
            amount: 0.2 * teamLeader.stats.baseStats.maxProtection,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "physicalOffense",
            amount: 0.2 * teamLeader.stats.baseStats.physical.offense,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialOffense",
            amount: 0.2 * teamLeader.stats.baseStats.special.offense,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "physicalArmor",
            amount: 0.2 * teamLeader.stats.baseStats.physical.armor,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialArmor",
            amount: 0.2 * teamLeader.stats.baseStats.special.armor,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "potency",
            amount: 0.2 * teamLeader.stats.baseStats.potency,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "tenacity",
            amount: 0.2 * teamLeader.stats.baseStats.tenacity,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "physicalCritAvoid",
            amount: 0.15,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialCritAvoid",
            amount: 0.15,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          }
        );
        character.stats.initialize();
      });
    }

    otherRebels.forEach((target) => {
      target.events.push(
        {
          eventType: "useAbility",
          characterSourceId: this._character.uniqueId,
          callback: ({ target: opponent }: { target: Character }) => {
            if (triggerCount < 1) {
              triggerCount++;
              this._character.assist(
                [
                  {
                    statToModify: "physicalOffense",
                    amount: 0.7,
                    modifiedType: "multiplicative",
                  },
                  {
                    statToModify: "specialOffense",
                    amount: 0.7,
                    modifiedType: "multiplicative",
                  },
                ],
                opponent,
                this
              );
            }
          },
        },
        {
          eventType: "revive",
          characterSourceId: this._character.uniqueId,
          callback: () => {
            if (this._character.isDead) {
              this._character.revive(
                this._character.stats.maxProtection * 0.5,
                this._character.stats.maxHealth * 0.5
              );
            }
          },
        }
      );
    });

    this._character.opponents.forEach((target) => {
      target.stats.tempStats.push({
        //todo not working
        statToModify: "tenacity",
        amount: -0.5,
        modifiedType: "additive",
        condition: {
          debuffs: ["Blind"],
        },
        characterSourceId: this._character.uniqueId,
      });

      target.statusEffect.addImmune(
        this._character.uniqueId,
        "Assisting",
        {
          debuffs: ["Blind"],
        },
        this
      );

      target.statusEffect.addImmune(
        this._character.uniqueId,
        "CounterAttacking",
        {
          debuffs: ["Blind"],
        },
        this
      );
    });

    this._character.events.push({
      characterSourceId: this._character.uniqueId,
      eventType: "endOfTurn",
      callback: () => {
        triggerCount = 0;
      },
    });
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
  ["uniqueskill_C3POCHEWBACCA", uniqueskill_C3POCHEWBACCA],
]);

const leaderAbility = new Map([]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
