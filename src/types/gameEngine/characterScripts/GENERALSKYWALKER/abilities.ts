import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../../characters/index";
import { iStatsCheck } from "../../characters/stats";
import { iStatusEffect } from "types/gameEngine/characters/statusEffects";

class basicskill_GENERALSKYWALKER extends ActiveAbility {
  constructor(character: Character) {
    super(
      "basicskill_GENERALSKYWALKER",
      "Furious Slash",
      `Deal Physical damage to target enemy. This attack can't be evaded and has +65% Defense Penetration, tripled if all allies are 501st.

      If this is the first ability General Skywalker uses during his turn, he immediately uses the Special ability Telekinesis, if able.
      
      Telekinesis: Deal Physical damage to target enemy. If possible, this attack will critically hit enemies with Armor Shred. If the target enemy is Dazed, reduce General Skywalker's ability cooldowns by 1.`,
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
      const allAllies501st = this._character.teammates.every((ally) =>
        ally.hasTags("501st", this._character.id)
      );
      const newStats: iStatsCheck[] = [
        ...(stats ?? []),
        {
          statToModify: "specialArmorPen",
          modifiedType: "multiplicative",
          characterSourceId: this._character.uniqueId,
          amount: allAllies501st ? 0.65 * 3 : 0.65,
        },
        {
          statToModify: "physicalArmorPen",
          modifiedType: "multiplicative",
          characterSourceId: this._character.uniqueId,
          amount: allAllies501st ? 0.65 * 3 : 0.65,
        },
      ];

      if (primaryTarget) {
        this.dealDamage(
          "physical",
          primaryTarget,
          2.2,
          5,
          newStats,
          canBeCountered
        );
      }
    });
  }
}

class grantedability_GENERALSKYWALKER extends ActiveAbility {
  constructor(character: Character) {
    super(
      "grantedability_GENERALSKYWALKER",
      "Telekinesis",
      `Deal Physical damage to target enemy. If possible, this attack will critically hit enemies with Armor Shred. If the target enemy is Dazed, reduce General Skywalker's ability cooldowns by 1.`,
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
        const hasArmorShred =
          primaryTarget?.statusEffect.hasStatusEffect("Armor Shred");

        const newStats: iStatsCheck[] = [
          ...(stats ?? []),
          {
            statToModify: "physicalCritChance",
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
            amount: hasArmorShred ? Infinity : 0,
          },
          {
            statToModify: "specialCritChance",
            modifiedType: "multiplicative",
            characterSourceId: this._character.uniqueId,
            amount: hasArmorShred ? Infinity : 0,
          },
        ];

        this.dealDamage(
          "physical",
          primaryTarget,
          2.8,
          5,
          newStats,
          canBeCountered
        );

        if (primaryTarget?.statusEffect.hasDebuff("Daze")) {
          this._character.specialAbilities.forEach((ability) => {
            ability.changeCooldown(-1, this, this._character);
          });
        }
      }
    });
  }
}

class specialskill_GENERALSKYWALKER01 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_GENERALSKYWALKER01",
      "Sundering Strike",
      `Deal Physical damage to target enemy and inflict Armor Shred. If they are Dazed, this attack deals double damage.

      If this is the first ability General Skywalker uses during his turn, reset Force Grip's cooldown and use it if possible.`,
      character
    );
    this.cooldown = 3;
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
            primaryTarget.statusEffect.hasDebuff("Daze") ? 7 : 3.5,
            5,
            stats,
            canBeCountered
          );

          primaryTarget.statusEffect.addStatusEffect(
            {
              name: "Armor Shred",
              duration: Infinity,
              id: uuid(),
              sourceAbility: this,
              cantResist: true,
              isStackable: true,
            },
            this
          );
        }
      }
    });
  }
}

class specialskill_GENERALSKYWALKER02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_GENERALSKYWALKER02",
      "Force Grip",
      `Deal Physical damage to all enemies and Daze them for 2 turns. If possible, this attack will critically hit enemies with Armor Shred.

      If this is the first ability General Skywalker uses during his turn, reset Sundering Strike's cooldown and use it if possible.`,
      character
    );
    this.cooldown = 3;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      this._character.opponents.forEach((target) => {
        if (!this.checkEvade("physical", target)) {
          this._character.statusEffect.inflictDebuff(
            [{ name: "Daze", duration: 2, id: uuid(), sourceAbility: this }],
            target,
            1,
            this
          );

          const hasArmorShred =
            target.statusEffect.hasStatusEffect("Armor Shred");

          const newStats: iStatsCheck[] = [
            ...(stats ?? []),
            {
              statToModify: "physicalCritChance",
              modifiedType: "additive",
              characterSourceId: this._character.uniqueId,
              amount: hasArmorShred ? Infinity : 0,
            },
            {
              statToModify: "specialCritChance",
              modifiedType: "additive",
              characterSourceId: this._character.uniqueId,
              amount: hasArmorShred ? Infinity : 0,
            },
          ];

          this.dealDamage("physical", target, 3, 5, stats, canBeCountered);

          target.statusEffect.addStatusEffect(
            {
              name: "Armor Shred",
              duration: Infinity,
              id: uuid(),
              sourceAbility: this,
              cantResist: true,
              isStackable: true,
            },
            this
          );
        }
      });
    });
  }
}

class uniqueskill_GENERALSKYWALKER01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_GENERALSKYWALKER01",
      "The Chosen One",
      `General Skywalker uses an additional ability during his turn.

    Whenever General Skywalker critically hits an enemy during his turn, increase their cooldowns by 1 (excluding raid bosses and Galactic Legends), which can't be resisted.
    
    If he is critically hit, General Skywalker dispels all debuffs on himself. Enemies attacking out of turn can't critically hit.
    
    If the target enemy has no Protection when General Skywalker uses an ability, reduce their current Max Health by 20% for rest of the battle (stacking, excluding raid bosses and Galactic Legends), which can't be resisted.`,
      character
    );
  }

  public override activate(): void {
    this._character?.events.push(
      {
        characterSourceId: this._character.uniqueId,
        eventType: "receiveDamage",
        callback: ({ isCrit }) => {
          if (isCrit) {
            this._character.statusEffect.removeDebuff("all", undefined, this);
          }
        },
      },
      {
        characterSourceId: this._character.uniqueId,
        eventType: "dealDamage",
        callback: ({
          isCrit,
          target,
        }: {
          isCrit: boolean;
          target: Character;
        }) => {
          if (
            isCrit &&
            this._character.gameEngine.currentCharactersTurn?.isSelf(
              this._character
            ) &&
            !target.hasTags("Galactic Legend", "")
          ) {
            target.specialAbilities.forEach((ability) => {
              ability.changeCooldown(1, this, this._character, true);
            });
          }
        },
      },
      {
        eventType: "beforeUseAbility",
        characterSourceId: this._character.uniqueId,
        callback: ({ target }: { target: Character }) => {
          if (!target.hasTags("Galactic Legend", "")) {
            target.stats.addTempStats(
              [
                {
                  statToModify: "maxHealth",
                  amount: -0.2,
                  modifiedType: "multiplicative",
                  characterSourceId: this._character.uniqueId,
                },
              ],
              this
            );
          }
        },
      }
    );

    this._character.opponents.forEach((opponent) => {
      opponent.statusEffect.addImmune("cant_crit_out_of_turn", "Crit", () => {
        return !this._character.gameEngine.currentCharactersTurn?.isSelf(
          opponent
        );
      });
    });
  }
}

class uniqueskill_GENERALSKYWALKER02 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueskill_GENERALSKYWALKER02",
      "Hero with no Fear",
      `At the start of battle, General Skywalker gains 25% Defense, 15% Max Protection, and 25% Tenacity for each other 501st ally until all other 501st allies are defeated.

    If all allies are 501st at the start of battle, General Skywalker gains the following:
    
    - 100% counter chance and 50% Critical Chance
    
    - When all other allies are defeated, General Skywalker can't be critically hit and gains 35% Turn Meter after every enemy turn`,
      character
    );
  }

  public override activate(): void {
    const allies501st = this._character.teammates.filter(
      (ally) => ally.hasTags("501st", "") && !ally.isSelf(this._character)
    );

    if (allies501st.length > 0) {
      this._character?.stats.addTempStats(
        [
          {
            statToModify: "physicalArmor",
            amount:
              0.25 * allies501st.length * this._character.stats.physical.armor,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
            id: "uniqueskill_GENERALSKYWALKER02",
          },
          {
            statToModify: "specialArmor",
            amount:
              0.25 * allies501st.length * this._character.stats.special.armor,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
            id: "uniqueskill_GENERALSKYWALKER02",
          },
          {
            statToModify: "maxProtection",
            amount: 0.15 * allies501st.length,
            modifiedType: "multiplicative",
            characterSourceId: this._character.uniqueId,
            id: "uniqueskill_GENERALSKYWALKER02",
          },
          {
            statToModify: "tenacity",
            amount: 0.25 * allies501st.length,
            modifiedType: "multiplicative",
            characterSourceId: this._character.uniqueId,
            id: "uniqueskill_GENERALSKYWALKER02",
          },
        ],
        this
      );

      allies501st.forEach((ally) => {
        ally.events.push({
          eventType: "death",
          characterSourceId: this._character.uniqueId,
          callback: () => {
            const all501stAreDead = this._character.teammates.every((ally) => {
              if (!ally.isSelf(this._character) && ally.hasTags("501st", "")) {
                return ally.isDead;
              }
              return true;
            });
            if (all501stAreDead) {
              this._character.stats.removeTempStats(
                "",
                "uniqueskill_GENERALSKYWALKER02"
              );
            }
          },
        });
      });
    }

    if (this._character.teammates.every((ally) => ally.hasTags("501st", ""))) {
      this._character.stats.addTempStats(
        [
          {
            statToModify: "counterChance",
            amount: 1,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "physicalCritChance",
            amount: 0.5,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialCritChance",
            amount: 0.5,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
          },
          {
            statToModify: "specialCritAvoid",
            amount: Infinity,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
            condition: () => {
              return this._character.teammates.every((ally) => {
                if (!ally.isSelf(this._character)) {
                  return ally.isDead;
                }
                return true;
              });
            },
          },
          {
            statToModify: "physicalCritAvoid",
            amount: Infinity,
            modifiedType: "additive",
            characterSourceId: this._character.uniqueId,
            condition: () => {
              return this._character.teammates.every((ally) => {
                if (!ally.isSelf(this._character)) {
                  return ally.isDead;
                }
                return true;
              });
            },
          },
        ],
        this
      );

      this._character.teammates.forEach((ally) => {
        ally.events.push(
          {
            eventType: "death",
            characterSourceId: this._character.uniqueId,
            callback: () => {
              const allOtherAlliesAreDead = this._character.teammates.every(
                (ally) => {
                  if (!ally.isSelf(this._character)) {
                    return ally.isDead;
                  }
                  return true;
                }
              );

              if (allOtherAlliesAreDead) {
                this._character.events.push({
                  eventType: "endOfTurn",
                  characterSourceId: this._character.uniqueId,
                  id: "gain_tm_with_no_allies",
                  callback: ({ target }: { target: Character }) => {
                    if (target.owner !== this._character.owner) {
                      this._character.changeTurnMeter(35, this);
                    }
                  },
                });
              }
            },
          },
          {
            eventType: "revive",
            characterSourceId: this._character.uniqueId,
            callback: () => {
              this._character.events = this._character.events.filter(
                (event) => {
                  return event.id !== "gain_tm_with_no_allies";
                }
              );
            },
          }
        );
      });
    }
  }
}

class leaderskill_GENERALSKYWALKER extends PassiveAbility {
  constructor(character: Character) {
    super(
      "leaderskill_GENERALSKYWALKER",
      "General of the 501st",
      `All units can't be revived.
      All 501st allies have +50% Critical Damage.
      When an enemy gains a buff, all 501st allies gain 2% Offense (stacking) until the end of the encounter.
      
      While there are other active 501st allies, General Skywalker:
      - Can't drop below 100% Health
      - Advances if he has 100% Protection and takes Cover if he has 0% Protection at the end of every turn
      - Removes all other status effects when he takes Cover
      - Leaves Cover, recovers 100% Protection, and takes a bonus turn when all other 501st allies are defeated
      
      Advance:
      - Taunt, which can't be dispelled or prevented
      - Other 501st allies can't lose Health
      Cover:
      - Can't be targeted
      - Immune to damage and status effects
      - Speed set to 0
      - Recover 10% Protection and Turn Meter at the end of every turn, doubled for allied 501st turns, which can't be prevented`,
      character
    );
  }

  public override activate() {
    [...this._character.teammates, ...this._character.opponents].forEach(
      (character) => {
        character.statusEffect.addImmune(
          "GENERALSKYWALKER_leadership_no_revive",
          "Revive",
          undefined,
          this
        );
      }
    );

    this._character.events.push(
      {
        eventType: "gainStatusEffect",
        characterSourceId: this._character.uniqueId,
        callback: ({ statusEffect }: { statusEffect: iStatusEffect }) => {
          if (statusEffect.name === "Cover") {
            this._character.statusEffect.removeBuff("all");
            this._character.statusEffect.removeDebuff("all");
          } else if (statusEffect.name === "Advance") {
            this._character.heal(
              {
                healthType: "protection",
                amountType: "multiplicative",
                amount: 1,
              },
              this
            );
            this._character.statusEffect.addBuff(
              [
                {
                  name: "Taunt",
                  id: "advance_taunt",
                  duration: Infinity,
                  cantDispel: true,
                  cantPrevent: true,
                  sourceAbility: this,
                },
              ],
              1,
              this
            );
          }
        },
      },
      {
        eventType: "endOfTurn",
        characterSourceId: this._character.uniqueId,
        callback: ({ character }: { character: Character }) => {
          if (
            this._character.stats.protection >=
            this._character.stats.maxProtection
          ) {
            if (!this._character.statusEffect.hasStatusEffect("Advance")) {
              this._character.statusEffect.addStatusEffect(
                [
                  {
                    name: "Advance",
                    duration: Infinity,
                    id: uuid(),
                    sourceAbility: this,
                  },
                ],
                this
              );
              this._character.statusEffect.removeStatusEffect("Cover", this);

              const all501stAreDead = this._character.teammates.every(
                (ally) => {
                  return !ally.isSelf(this._character) && ally.isDead;
                }
              );
              if (all501stAreDead) {
                this._character.hasBonusTurn = true;
              }
            }
          } else if (this._character.stats.protection <= 0) {
            if (!this._character.statusEffect.hasStatusEffect("Cover")) {
              this._character.statusEffect.addStatusEffect(
                [
                  {
                    name: "Cover",
                    duration: Infinity,
                    id: uuid(),
                    sourceAbility: this,
                  },
                ],
                this
              );
              this._character.statusEffect.removeStatusEffect("Advance", this);
            }
          }

          if (this._character.statusEffect.hasStatusEffect("Cover")) {
            const on501stTurn =
              character.hasTags("501st", "") &&
              character.owner === this._character.owner;
            this._character.heal(
              {
                healthType: "protection",
                amountType: "multiplicative",
                amount: on501stTurn ? 0.2 : 0.1,
              },
              this
            );
            this._character.changeTurnMeter(
              on501stTurn ? 20 : 10,
              this,
              this._character
            );
          }
        },
      }
    );

    this._character.statusEffect.addImmune(
      "501st_cant_lose_health",
      "loseHealth",
      () => {
        return this._character.statusEffect.hasStatusEffect("Cover");
      }
    );

    const allies501st = this._character.teammates.filter((ally) => {
      return ally.hasTags("501st", this._character.id);
    });

    allies501st.forEach((target) => {
      target.stats.addTempStats(
        [
          {
            statToModify: "critDamage",
            amount: 0.5,
            modifiedType: "additive",
            characterSourceId: this._character?.uniqueId,
          },
        ],
        this
      );

      target.statusEffect.addImmune(
        "501st_cant_lose_health",
        "loseHealth",
        () => {
          return this._character.statusEffect.hasStatusEffect("Advance");
        }
      );
    });

    this._character.opponents.forEach((enemy) => {
      enemy.events.push({
        eventType: "buffed",
        characterSourceId: this._character.uniqueId,
        callback: () => {
          allies501st.forEach((ally) => {
            ally.stats.addTempStats(
              [
                {
                  statToModify: "physicalOffense",
                  amount: 0.02,
                  modifiedType: "multiplicative",
                },
                {
                  statToModify: "specialOffense",
                  amount: 0.02,
                  modifiedType: "multiplicative",
                },
              ],
              this
            );
          });
        },
      });
    });
  }
}

const basicAbility = new Map([
  ["basicskill_GENERALSKYWALKER", basicskill_GENERALSKYWALKER],
]);

const specialAbilities = new Map([
  ["specialskill_GENERALSKYWALKER01", specialskill_GENERALSKYWALKER01],
  ["specialskill_GENERALSKYWALKER02", specialskill_GENERALSKYWALKER02],
]);

const uniqueAbilities = new Map([
  ["uniqueskill_GENERALSKYWALKER01", uniqueskill_GENERALSKYWALKER01],
  ["uniqueskill_GENERALSKYWALKER02", uniqueskill_GENERALSKYWALKER02],
]);

const leaderAbility = new Map([
  ["leaderskill_GENERALSKYWALKER", leaderskill_GENERALSKYWALKER],
]);

const hiddenAbilities = new Map([
  ["grantedability_GENERALSKYWALKER", grantedability_GENERALSKYWALKER],
]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
  hiddenAbilities,
};
