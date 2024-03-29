import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../characters/index";
import { iStatsCheck } from "../characters/stats";

class basicskill_CHEWBACCALEGENDARY extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_CHEWBACCALEGENDARY",
      "Overcharged Shot",
      `Deal Physical damage to target enemy and inflict Tenacity Down for 2 turns.`,
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
            1.4,
            5,
            stats,
            canBeCountered
          );
          this._character.statusEffect.inflictDebuff(
            [
              {
                name: "Tenacity Down",
                id: uuid(),
                duration: 2,
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

class specialskill_CHEWBACCALEGENDARY01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_CHEWBACCALEGENDARY01",
      "Pulverize",
      `Dispel all buffs on all enemies, then deal Physical damage to all enemies. Chewbacca gains Offense Up and Critical Chance Up for 2 turns. This attack ignores Defense.`,
      character
    );
    this.cooldown = 4;
  }

  public override execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      const damagedCharacters: Character[] = [];
      this._character.opponents.forEach((target) => {
        if (!this.checkEvade("physical", target)) {
          target.statusEffect.removeBuff("all", this._character, this);

          this.dealDamage(
            "physical",
            target,
            0.9,
            5,
            [
              {
                statToModify: "physicalArmorPen",
                amount: Infinity,
                modifiedType: "additive",
              },
            ],
            false
          );

          if (canBeCountered) {
            damagedCharacters.push(target);
          }
        }
      });

      this._character.statusEffect.addBuff(
        [
          { name: "Offense Up", duration: 2, id: uuid(), sourceAbility: this },
          {
            name: "Critical Chance Up",
            duration: 2,
            id: uuid(),
            sourceAbility: this,
          },
        ],
        1,
        this
      );

      damagedCharacters.forEach((character) => {
        character.counterAttack(this._character, canBeCountered);
      });
    });
  }
}

class specialskill_CHEWBACCALEGENDARY02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_CHEWBACCALEGENDARY02",
      "Furious Bowcaster",
      `Deal Physical damage to target enemy and Stun them for 1 turn. Then, if the target has no Protection, reset Pulverize's ability cooldown. This attack can't be Evaded.`,
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
      if (primaryTarget) {
        this._character.statusEffect.inflictDebuff(
          [{ name: "Stun", duration: 1, id: uuid(), sourceAbility: this }],
          primaryTarget,
          1,
          this
        );

        this.dealDamage("physical", primaryTarget, 2.4, 5, [], canBeCountered);

        if (primaryTarget.stats.protection <= 0) {
          this._character.activeAbilities.forEach((ability) => {
            if (ability.id === "specialskill_CHEWBACCALEGENDARY01") {
              ability.changeCooldown(-Infinity, this);
            }
          });
        }
      }
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
          const hansolo = this._character.teammates.find(
            (c) => c.id === "HANSOLO"
          );

          const weakestCharacter = this._character.teammates.reduce(
            (weakestCharacter: null | Character, ally: Character) => {
              if (this._character.isSelf(ally)) {
                return weakestCharacter;
              } else if (ally.id === "HANSOLO") {
                return weakestCharacter;
              } else if (!weakestCharacter) {
                return ally;
              } else if (
                ally.stats.health + ally.stats.protection <
                weakestCharacter.stats.health +
                  weakestCharacter.stats.protection
              ) {
                return ally;
              }
              return weakestCharacter;
            },
            null
          );

          [weakestCharacter, hansolo].forEach((target) => {
            if (target) {
              target.statusEffect.addStatusEffect(
                {
                  name: "Guard",
                  duration: Infinity,
                  id: uuid(),
                  sourceAbility: this,
                },
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
                          statToModify: "physicalOffense",
                          amount: 0.8,
                          modifiedType: "multiplicative",
                        },
                        {
                          statToModify: "specialOffense",
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
            }
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
          const targetList = this._character.teammates.filter((ally) => {
            return (
              ally.isSelf(this._character) ||
              ally.statusEffect.hasStatusEffect("Guard")
            );
          });

          targetList.forEach((target) => {
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

    const targetList = this._character.teammates.filter((ally) =>
      ally.statusEffect.hasStatusEffect("Guard")
    );

    targetList.forEach((target) => {
      target.statusEffect.removeStatusEffect("Guard", this, this._character);
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
    let triggers: string[] = [];

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
          const alreadyTriggered = triggers.some((t) => t === target.uniqueId);
          if (!alreadyTriggered) {
            triggers.push(target.uniqueId);
            this.dealDamage(
              "true",
              target,
              target.stats.maxHealth * 0.2,
              0,
              [],
              false,
              this
            );
          }
        },
      },
      {
        eventType: "receiveDamage",
        characterSourceId: this._character.uniqueId,
        callback: ({ attackSource }) => {
          if (attackSource) {
            this._character.stats.addTempStats(
              [
                {
                  statToModify: "physicalOffense",
                  amount: 0.25,
                  modifiedType: "multiplicative",
                  expires: {
                    count: 1,
                    frequency: "turn",
                  },
                },
                {
                  statToModify: "specialOffense",
                  amount: 0.25,
                  modifiedType: "multiplicative",
                  expires: {
                    count: 1,
                    frequency: "turn",
                  },
                },
                {
                  statToModify: "physicalCritChance",
                  amount: 0.25,
                  modifiedType: "additive",
                  expires: {
                    count: 1,
                    frequency: "turn",
                  },
                },
                {
                  statToModify: "specialCritChance",
                  amount: 0.25,
                  modifiedType: "additive",
                  expires: {
                    count: 1,
                    frequency: "turn",
                  },
                },
              ],
              this
            );
          }
        },
      },
      {
        eventType: "matchSetup",
        characterSourceId: this._character.uniqueId,
        callback: () => {
          const targetList = this._character.teammates.filter((ally) =>
            ally.statusEffect.hasStatusEffect("Guard")
          );

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
          triggers = [];
        },
      }
    );
  }
}

const basicAbility = new Map([
  ["basicskill_CHEWBACCALEGENDARY", basicskill_CHEWBACCALEGENDARY],
]);

const specialAbilities = new Map([
  ["specialskill_CHEWBACCALEGENDARY01", specialskill_CHEWBACCALEGENDARY01],
  ["specialskill_CHEWBACCALEGENDARY02", specialskill_CHEWBACCALEGENDARY02],
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
