import { v4 as uuid } from "uuid";

import {
  ActiveAbility,
  PassiveAbility,
} from "types/gameEngine/characters/abilities";
import { Character } from "../../characters/index";
import { iStatsCheck } from "../../characters/stats";
import { anyTagsMatch } from "../../characters/index";
import { iBuff } from "../../characters/statusEffects";

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
            [
              {
                name: "Buff Immunity",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
            ],
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
        this._character.stats.addTempStats(
          [
            {
              characterSourceId: this._character.uniqueId,
              statToModify: "maxHealth",
              amount: 0.02 * this._character.stats.maxHealth,
              modifiedType: "additive",
            },
          ],
          this
        );
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
    this.cooldown = 4;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

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
                  unique: true,
                },
              ],
              1,
              this,
              3
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

class specialskill_GRANDMASTERLUKE02 extends ActiveAbility {
  constructor(character: Character) {
    super(
      "specialskill_GRANDMASTERLUKE02",
      "They Grow Beyond",
      `Deal Special damage to all enemies. Then, remove 20% Turn Meter from them and inflict Ability Block and Breach for 2 turns. Deal 10% more damage and remove an additional 5% Turn Meter for each ally with Jedi Lessons or Jedi Legacy.\n\nAll Jedi allies gain 15% Turn Meter and Critical Hit Immunity for 1 turn.`,
      character
    );
    this.cooldown = 4;
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ): void {
    const primaryTarget = this.findRandomEnemy(targetCharacter);

    super.execute(primaryTarget, stats, canBeCountered, () => {
      const jediWithLessonsOrLegacy = this._character.teammates.filter(
        (ally) => {
          return (
            ally.statusEffect.hasBuff("Jedi Lessons") ||
            ally.statusEffect.hasBuff("Jedi Legacy")
          );
        }
      );

      this._character.opponents.forEach((target) => {
        if (!this.checkEvade("special", target)) {
          this.dealDamage(
            "special",
            target,
            3,
            5,
            [
              ...(stats ?? []),
              {
                statToModify: "specialOffense",
                amount:
                  jediWithLessonsOrLegacy.length *
                  0.1 *
                  this._character.stats.special.offense,
                modifiedType: "additive",
                characterSourceId: this._character.uniqueId,
              },
            ],
            false
          );

          this._character.statusEffect.inflictDebuff(
            [
              {
                name: "Ability Block",
                duration: 2,
                id: uuid(),
                sourceAbility: this,
              },
              { name: "Breach", duration: 2, id: uuid(), sourceAbility: this },
            ],
            target,
            1,
            this
          );

          target.changeTurnMeter(
            -10 + jediWithLessonsOrLegacy.length * -5,
            this,
            this._character
          );
        }
      });

      this._character.teammates.forEach((ally) => {
        if (anyTagsMatch(ally, ["Jedi"], this._character.id)) {
          ally.changeTurnMeter(15, this, this._character);
          ally.statusEffect.addBuff(
            [
              {
                name: "Critical Hit Immunity",
                duration: 1,
                id: uuid(),
                sourceAbility: this,
              },
            ],
            1,
            this
          );
        }
      });
    });
  }
}

class leaderskill_GRANDMASTERLUKE extends PassiveAbility {
  constructor(character: Character) {
    super(
      "leaderskill_GRANDMASTERLUKE",
      "Legend of the Jedi",
      `All Light Side allies have +10% Max Health and Max Protection, doubled for Jedi allies. All Jedi allies have +30% Offense and +40 Speed.

      If all allies are Jedi at the start of battle (excluding summoned allies), Jedi Master Luke Skywalker Taunts while he has Protection.
      
      The first time each other Jedi ally falls below 100% Health, they dispel all debuffs on themselves and gain Critical Hit Immunity, Defense Up, and Tenacity Up for 2 turns. Then, Luke Taunts for 2 turns, which can't be copied, dispelled, or prevented.
      
      At the start of battle, Jedi allies gain the granted ability Inherited Teachings.
      
      Inherited Teachings: Gain Jedi Lessons for 3 turns and call target other Light Side ally to assist, dealing 90% less damage. Then, they deal true damage to the target enemy based on 60% of Jedi Master Luke Skywalker's base Max Protection, which can't be evaded.
      
      If that ally is a Jedi, they gain Jedi Lessons for 3 turns and 15% Turn Meter, recover Protection equal to 5% of Luke's base Max Protection, and reduce the cooldown of their Inherited Teachings ability by 1.
      
      This ability can't be used if there are no other Jedi allies. (Cooldown: 2)`,
      character
    );
  }

  public override activate() {
    const lightSideNonJediAllies = this._character.teammates.filter((ally) => {
      return anyTagsMatch(ally, ["Light Side & !Jedi"], this._character.id);
    });

    const jediAllies = this._character.teammates.filter((ally) => {
      return ally.hasTags("Jedi", this._character.id);
    });

    const triggeredList: string[] = [];

    lightSideNonJediAllies.forEach((target) => {
      target.stats.addTempStats(
        [
          {
            statToModify: "maxHealth",
            amount: 0.1,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "maxProtection",
            amount: 0.1,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
        ],
        this
      );
    });

    jediAllies.forEach((target) => {
      target.stats.addTempStats(
        [
          {
            statToModify: "maxHealth",
            amount: 0.2,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "maxProtection",
            amount: 0.2,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "physicalOffense",
            amount: 0.3,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "specialOffense",
            amount: 0.3,
            modifiedType: "multiplicative",
            characterSourceId: this._character?.uniqueId,
          },
          {
            statToModify: "speed",
            amount: 40,
            modifiedType: "additive",
            characterSourceId: this._character?.uniqueId,
          },
        ],
        this
      );

      target.events.push({
        eventType: "loseHealth",
        characterSourceId: this._character.uniqueId,
        callback: ({ previousHealth }) => {
          if (
            target.stats.health < target.stats.maxHealth &&
            previousHealth >= target.stats.maxHealth
          ) {
            const alreadyTriggered = triggeredList.some(
              (x) => x === target.uniqueId
            );
            if (!alreadyTriggered) {
              triggeredList.push(target.uniqueId);
              target.statusEffect.removeDebuff("all");
              target.statusEffect.addBuff(
                [
                  {
                    name: "Critical Hit Immunity",
                    id: uuid(),
                    duration: 2,
                    sourceAbility: this,
                  },
                  {
                    name: "Defense Up",
                    id: uuid(),
                    duration: 2,
                    sourceAbility: this,
                  },
                  {
                    name: "Tenacity Up",
                    id: uuid(),
                    duration: 2,
                    sourceAbility: this,
                  },
                ],
                1,
                this
              );
              this._character.statusEffect.addBuff(
                [
                  {
                    name: "Taunt",
                    duration: 2,
                    id: uuid(),
                    sourceAbility: this,
                    unique: true,
                    cantDispel: true,
                    cantPrevent: true,
                  },
                ],
                1,
                this
              );
            }
          }
        },
      });

      target.addGrantedAbility(
        new grantedability_grandmasterluke_inherited_teachings(target)
      );
    });

    const allAreJediAllies = this._character.teammates.every((ally) => {
      return ally.hasTags("Jedi", this._character.id);
    });

    if (allAreJediAllies) {
      const tauntId = "GRANDMASTERLUKE_TauntWhileProtection";
      this._character.events.push(
        {
          eventType: "matchSetup",
          characterSourceId: this._character.uniqueId,
          callback: () => {
            this._character.statusEffect.addBuff(
              [
                {
                  name: "Taunt",
                  duration: Infinity,
                  sourceAbility: this,
                  id: tauntId,
                },
              ],
              1,
              this
            );
          },
        },
        {
          eventType: "loseProtection",
          characterSourceId: this._character.uniqueId,
          callback: () => {
            if (this._character.stats.protection <= 0) {
              this._character.statusEffect.removeBuff({
                name: null,
                duration: 0,
                sourceAbility: this,
                id: tauntId,
              });
            }
          },
        },
        {
          eventType: "dispel",
          characterSourceId: this._character.uniqueId,
          callback: ({ effects }: { effects: iBuff[] }) => {
            effects.forEach((effect) => {
              if (effect.id === tauntId) {
                this._character.statusEffect.addBuff(
                  [
                    {
                      name: "Taunt",
                      duration: Infinity,
                      sourceAbility: this,
                      id: tauntId,
                    },
                  ],
                  1,
                  this
                );
              }
            });
          },
        }
      );
    }
  }
}

class grantedability_grandmasterluke_inherited_teachings extends ActiveAbility {
  constructor(character: Character) {
    super(
      "grantedability_grandmasterluke_inherited_teachings",
      "Inherited Teachings",
      `Gain Jedi Lessons for 3 turns and call target other Light Side ally to assist, dealing 90% less damage. Then, they deal true damage to the target enemy based on 60% of Jedi Master Luke Skywalker's base Max Protection, which can't be evaded.
      
      If that ally is a Jedi, they gain Jedi Lessons for 3 turns and 15% Turn Meter, recover Protection equal to 5% of Luke's base Max Protection, and reduce the cooldown of their Inherited Teachings ability by 1.
      
      This ability can't be used if there are no other Jedi allies. (Cooldown: 2)`,
      character
    );
    this.cooldown = 2;
  }

  public get canBeUsed() {
    return (
      this._character.teammates.filter((ally) =>
        ally.hasTags("Jedi", this._character.id)
      ).length > 0
    );
  }

  public execute(
    targetCharacter?: Character,
    stats?: iStatsCheck[],
    canBeCountered?: boolean
  ) {
    this._character.statusEffect.addBuff(
      [{ name: "Jedi Lessons", id: uuid(), duration: 3, sourceAbility: this }],
      1,
      this
    );

    const lightSideAlly = this.findTargets(
      this._character.teammates.filter((ally) =>
        ally.hasTags("Light Side", this._character.id)
      )
    );

    if (lightSideAlly) {
      lightSideAlly.assist(
        [
          {
            statToModify: "specialOffense",
            amount: 0.1,
            modifiedType: "multiplicative",
          },
          {
            statToModify: "physicalOffense",
            amount: 0.1,
            modifiedType: "multiplicative",
          },
        ],
        targetCharacter,
        this
      );

      const jml = this._character.teammates.find(
        (ally) => ally.id === "GRANDMASTERLUKE"
      );

      if (jml) {
        targetCharacter?.receiveDamage(
          "true",
          jml.stats.baseStats.maxProtection * 0.6,
          0,
          0,
          0,
          []
        );
      }

      if (lightSideAlly.hasTags("Jedi", this._character.id)) {
        lightSideAlly.statusEffect.addBuff(
          [
            {
              name: "Jedi Lessons",
              id: uuid(),
              duration: 3,
              sourceAbility: this,
            },
          ],
          1,
          this
        );
        lightSideAlly.changeTurnMeter(15, this, this._character);

        if (jml) {
          lightSideAlly.heal(
            {
              healthType: "protection",
              amount: 0.05 * jml?.stats.baseStats.maxProtection,
              amountType: "additive",
            },
            this
          );
        }

        const ineritedTeaching = lightSideAlly.specialAbilities.find(
          (ability) =>
            ability.id === "grantedability_grandmasterluke_inherited_teachings"
        );
        if (ineritedTeaching) {
          ineritedTeaching.changeCooldown(-1, this, this._character);
        }
      }
    }
  }
}

class uniqueability_grandmasterluke01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueability_grandmasterluke01",
      "Jedi Legacy",
      `Jedi allies may gain Jedi Lessons.

      The first time each other Light Side ally falls below 100% Health, they recover 25% Health and Protection, doubled for Jedi allies.
      
      At the start of battle, Jedi Master Luke Skywalker gains Jedi Legacy until the end of battle, which can't be copied, dispelled, or prevented.
      
      Jedi Legacy: +100% Mastery and ignores Taunt effects during their turn; can't gain Jedi Lessons`,
      character
    );
  }

  public override activate(): void {
    const lightSideAllies = this._character.teammates.filter((ally) => {
      return ally.hasTags("Light Side", this._character.id);
    });

    const triggeredList: string[] = [];

    lightSideAllies.forEach((target) => {
      target.events.push({
        eventType: "loseHealth",
        characterSourceId: this._character.uniqueId,
        callback: ({ previousHealth }) => {
          if (
            target.stats.health < target.stats.maxHealth &&
            previousHealth >= target.stats.maxHealth
          ) {
            const alreadyTriggered = triggeredList.some(
              (x) => x === target.uniqueId
            );
            if (!alreadyTriggered) {
              triggeredList.push(target.uniqueId);
              const isJedi = target.hasTags("Jedi", this._character.id);
              target.heal(
                {
                  amount: isJedi ? 0.5 : 0.25,
                  healthType: "health",
                  amountType: "multiplicative",
                },
                this
              );
              target.heal(
                {
                  amount: isJedi ? 0.5 : 0.25,
                  healthType: "protection",
                  amountType: "multiplicative",
                },
                this
              );
            }
          }
        },
      });
    });

    this._character.events.push({
      eventType: "matchSetup",
      characterSourceId: this._character.uniqueId,
      callback: () => {
        this._character.statusEffect.addBuff(
          [
            {
              name: "Jedi Legacy",
              id: uuid(),
              duration: Infinity,
              cantDispel: true,
              unique: true,
              cantPrevent: true,
              sourceAbility: this,
            },
          ],
          1,
          this
        );
      },
    });
  }
}

class uniqueability_galacticlegend01 extends PassiveAbility {
  constructor(character: Character) {
    super(
      "uniqueability_galacticlegend01",
      "Galactic Legend",
      `This unit takes reduced damage from percent Health damage effects and massive damage effects. They take massive damage from destroy effects (excludes raid bosses) and are immune to stun effects.

      This unit has +10% Max Health and Max Protection per Relic Amplifier level, and damage they receive is decreased by 30%.`,
      character
    );
  }

  public override activate(): void {
    this._character.stats.addTempStats(
      [
        {
          statToModify: "protection",
          amount:
            0.1 *
            this._character.relicLevel *
            this._character.stats.maxProtection,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
        {
          statToModify: "health",
          amount:
            0.1 * this._character.relicLevel * this._character.stats.maxHealth,
          modifiedType: "additive",
          characterSourceId: this._character.uniqueId,
        },
      ],
      this
    );

    //todo
    // this._character.events.push({
    //   eventType: "destroy",
    //   characterSourceId: this._character.uniqueId,
    //   callback: () => {

    //   }
    // })

    this._character.statusEffect.addImmune(
      "jml_galactic_legend",
      "Fear",
      undefined,
      this
    );
    this._character.statusEffect.addImmune(
      "jml_galactic_legend",
      "Stun",
      undefined,
      this
    );
    // this._character.statusEffect.addImmune("jml_galactic_legend", "Destroy", undefined, this)
  }
}

const basicAbility = new Map([
  ["basicskill_GRANDMASTERLUKE", basicskill_GRANDMASTERLUKE],
]);

const specialAbilities = new Map([
  ["specialskill_GRANDMASTERLUKE01", specialskill_GRANDMASTERLUKE01],
  ["specialskill_GRANDMASTERLUKE02", specialskill_GRANDMASTERLUKE02],
]);

const uniqueAbilities = new Map([
  ["uniqueability_grandmasterluke01", uniqueability_grandmasterluke01],
]);

const leaderAbility = new Map([
  ["leaderskill_GRANDMASTERLUKE", leaderskill_GRANDMASTERLUKE],
]);

export default {
  specialAbilities,
  uniqueAbilities,
  basicAbility,
  leaderAbility,
};
