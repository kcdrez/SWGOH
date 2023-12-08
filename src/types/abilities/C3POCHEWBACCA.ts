import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const chewpio: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3POCHEWBACCA: {
    id: "basicskill_C3POCHEWBACCA",
    name: "Frantic Shot",
    gameText:
      "Deal Physical damage to target enemy and inflict Evasion Down for 2 turns.",
    actions: [
      {
        targets: { allies: false, targetCount: 1 },
        effects: [
          {
            damage: {
              modifier: {
                value: 2,
              },
              damageType: "physical",
            },
          },
          {
            debuffs: [
              {
                name: "Evasion Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_C3POCHEWBACCA01: {
    id: "specialskill_C3POCHEWBACCA01",
    name: "Shining Distraction",
    gameText:
      "Dispel all debuffs on Threepio & Chewie. Rebel allies recover 15% Protection and gain Advantage for 2 turns. Dispel all buffs from all enemies and Blind them for 2 turns. This ability can't be evaded.",
    cooldown: 2,
    turnsRemaining: 0,
    actions: [
      {
        targets: { self: true },
        effects: [
          {
            dispel: {
              debuffs: "all",
            },
          },
        ],
      },
      {
        targets: { allies: true, filters: [{ tags: ["Rebel"] }] },
        effects: [
          {
            heal: {
              amount: 0.15,
              amountType: "multiplicative",
              healthType: "protection",
            },
          },
          {
            buffs: [
              {
                name: "Advantage",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
      {
        targets: { allies: true },
        effects: [
          {
            cantMiss: true,
            dispel: {
              buffs: "all",
            },
          },
          {
            cantMiss: true,
            debuffs: [
              {
                name: "Blind",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_C3POCHEWBACCA02: {
    id: "specialskill_C3POCHEWBACCA02",
    name: "Chewie's Rage",
    gameText:
      "Deal Physical damage to all enemies. Deal damage an additional time (up to 5 additional times) for each enemy that has been defeated during the battle. Threepio & Chewie gain 10% Offense (stacking) until the end of battle whenever this ability defeats an enemy.",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: { allies: false },
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 2,
              },
            },
          },
        ],
        repeats: {
          count: 0,
          limit: 0,
          limitCounter: "deadOpponents",
          reset: "turn",
        },
      },
    ],
    triggers: [
      // {
      //   id: uuid(),
      //   triggerType: "defeat",
      //   actions: [
      //     {
      //       targets: { self: true },
      //       effects: [
      //         {
      //           stats: {
      //             statToModify: "offense",
      //             amount: 0.1,
      //             modifiedType: "multiplicative",
      //             stacking: true,
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
  uniqueskill_C3POCHEWBACCA: {
    id: "uniqueskill_C3POCHEWBACCA",
    name: "I Must Tell The Others",
    gameText: `If the allied Leader is a non-Galactic Legend Rebel, Threepio & Chewie gain 40% of the Leader's Max Health, Max Protection, Offense, Defense, Potency, and Tenacity at the start of the first encounter, and Rebel allies gain half that amount. Rebel allies have +15% Critical Avoidance.\n\nWhenever another Rebel ally uses an ability, Threepio & Chewie are called to assist, dealing 30% less damage (limit once per turn). If they were defeated, Threepio & Chewie are revived with 50% Health and Protection whenever another Rebel ally is revived.\n\nWhile enemies are Blinded, they have -50% Tenacity and can't attack out of turn.`,
    triggers: [
      {
        id: uuid(),
        triggerType: "pregame",
        targets: { self: true },
        actions: [
          {
            targets: {
              allies: true,
              filters: [
                { isLeader: true },
                { tags: ["Rebel & !Galactic Legend"] },
              ],
            },
            effects: [
              {
                triggers: [
                  {
                    triggerType: "always",
                    id: uuid(),
                    targets: {
                      allies: true,
                      filters: [{ targetIds: ["C3POCHEWBACCA"] }],
                    },
                    actions: [
                      {
                        targets: {
                          allies: true,
                          filters: [{ targetIds: ["C3POCHEWBACCA"] }],
                        },
                        effects: [
                          {
                            stats: {
                              statToModify: "maxHealth",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseHealth",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "maxProtection",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseProtection",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "tenacity",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseTenacity",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "potency",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "basePotency",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "offense",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseOffense",
                                type: "physical",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "offense",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseOffense",
                                type: "special",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "armor",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseArmor",
                                type: "physical",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "armor",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseArmor",
                                type: "special",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },

                  {
                    triggerType: "always",
                    id: uuid(),
                    targets: {
                      allies: true,
                      filters: [
                        { targetIds: ["!C3POCHEWBACCA"] },
                        { tags: ["Rebel"] },
                      ],
                    },
                    actions: [
                      {
                        targets: {
                          allies: true,
                          filters: [
                            { targetIds: ["!C3POCHEWBACCA"] },
                            { tags: ["Rebel"] },
                          ],
                        },
                        effects: [
                          {
                            stats: {
                              statToModify: "maxProtection",
                              amount: 0.2,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseHealth",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "maxProtection",
                              amount: 0.2,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseProtection",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "tenacity",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseTenacity",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "potency",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "basePotency",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "offense",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseOffense",
                                type: "physical",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "offense",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseOffense",
                                type: "special",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "armor",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseArmor",
                                type: "physical",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                          {
                            stats: {
                              statToModify: "armor",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "baseArmor",
                                type: "special",
                              },
                              targets: {
                                self: true, //note this is from the leader's perspective
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "always",
        targets: { allies: false },
        actions: [
          {
            targets: { allies: false },
            effects: [
              {
                condition: { debuffs: ["Blind"] },
                stats: {
                  modifiedType: "additive",
                  amount: -0.5,
                  statToModify: "tenacity",
                },
              },
              {
                condition: { debuffs: ["Blind"] },
                immune: {
                  assisting: true,
                  counterAttacking: true,
                },
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "always",
        targets: { allies: true, filters: [{ tags: ["Rebel"] }] },
        actions: [
          {
            targets: { allies: true, filters: [{ tags: ["Rebel"] }] },
            effects: [
              {
                stats: {
                  modifiedType: "additive",
                  amount: 0.15,
                  statToModify: "critAvoid",
                },
              },
            ],
          },
        ],
      },

      {
        id: uuid(),
        triggerType: "pregame",
        targets: { self: true },
        actions: [
          {
            targets: {
              self: false,
              allies: true,
              filters: [{ tags: ["Rebel"] }],
            },
            effects: [
              {
                triggers: [
                  {
                    triggerType: "useAbility",
                    id: uuid(),
                    targets: { self: true },
                    triggerData: {
                      frequency: "turn",
                      count: 1,
                      limit: 1,
                    },
                    actions: [
                      {
                        targets: { filters: [{ primary: true }] },
                        effects: [
                          {
                            assist: {
                              chance: 1,
                              targets: {
                                allies: true,
                                filters: [{ targetIds: ["C3POCHEWBACCA"] }],
                              },
                              modifier: {
                                stats: {
                                  modifiedType: "multiplicative",
                                  statToModify: "offense",
                                  amount: 0.7,
                                },
                              },
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "revive",
        targets: {
          self: false,
          allies: true,
          filters: [{ tags: ["Rebel"] }],
        },
        actions: [
          {
            targets: {
              allies: true,
              filters: [{ targetIds: ["C3POCHEWBACCA"] }],
            },
            effects: [
              {
                revive: {
                  health: {
                    amount: 0.5,
                    percent: true,
                  },
                  protection: {
                    amount: 0.5,
                    percent: true,
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default chewpio;
