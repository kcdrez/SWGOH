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
        targets: { filters: [{ allies: false }], targetCount: 1 },
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
    actions: [
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            dispel: {
              debuffs: "all",
            },
          },
        ],
      },
      {
        targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
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
        targets: {
          filters: [{ allies: false }],
        },
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
    actions: [
      {
        targets: { filters: [{ allies: false }] },
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
      //       targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
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
  uniqueskill_C3POCHEWBACCA01: {
    id: "uniqueskill_C3POCHEWBACCA01",
    name: "I Must Tell The Others",
    gameText: `If the allied Leader is a non-Galactic Legend Rebel, Threepio & Chewie gain 40% of the Leader's Max Health, Max Protection, Offense, Defense, Potency, and Tenacity at the start of the first encounter, and Rebel allies gain half that amount. Rebel allies have +15% Critical Avoidance.

    Whenever another Rebel ally uses an ability, Threepio & Chewie are called to assist, dealing 30% less damage (limit once per turn). If they were defeated, Threepio & Chewie are revived with 50% Health and Protection whenever another Rebel ally is revived.
    
    While enemies are Blinded, they have -50% Tenacity and can't attack out of turn.`,
    triggers: [
      {
        id: uuid(),
        triggerType: "pregame",
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: {
              filters: [
                { allies: true },
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
                      filters: [
                        { allies: true },
                        { targetIds: ["C3POCHEWBACCA"] },
                      ],
                    },
                    actions: [
                      {
                        targets: {
                          filters: [
                            { allies: true },
                            { targetIds: ["C3POCHEWBACCA"] },
                          ],
                        }, //not sure?
                        effects: [
                          {
                            stats: {
                              statToModify: "potency",
                              amount: 0.4,
                              modifiedType: "multiplicative",
                            },
                            scalesBy: {
                              stat: {
                                name: "potency",
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
      // {
      //   id: uuid(),
      //   triggerType: "always",
      //   targets: { filters: [{ allies: false }] },
      //   actions: [
      //     {
      //       targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
      //       effects: [
      //         {
      //           condition: { debuffs: ["Blind"] },
      //           stats: {
      //             modifiedType: "additive",
      //             amount: -0.4,
      //             statToModify: "tenacity",
      //           },
      //         },
      //         {
      //           condition: { debuffs: ["Blind"] },
      //           immune: {
      //             assists: true,
      //             counterAttack: true,
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: uuid(),
      //   triggerType: "useAbility",
      //   triggerData: {
      //     limit: 1,
      //     count: 0,
      //     frequency: "turn",
      //   },
      //   targets: { filters: [{ allies: true }, { tags: ["Rebel & !Self"] }] },
      //   actions: [
      //     {
      //       targets: {
      //         filters: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
      //       },
      //       effects: [
      //         {
      //           assist: {
      //             chance: 1,
      //             modifier: {
      //               stats: {
      //                 statToModify: "offense",
      //                 amount: 0.7,
      //                 modifiedType: "multiplicative",
      //               },
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: uuid(),
      //   triggerType: "revive",
      //   targets: { filters: [{ allies: true }, { tags: ["Rebel & !Self"] }] },
      //   actions: [
      //     {
      //       targets: {
      //         filters: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
      //       },
      //       effects: [
      //         {
      //           revive: {
      //             health: {
      //               amount: 0.5,
      //               percent: true,
      //             },
      //             protection: {
      //               amount: 0.5,
      //               percent: true,
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: uuid(),
      //   triggerType: "always",
      //   targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
      //   actions: [
      //     {
      //       targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
      //       effects: [
      //         {
      //           stats: {
      //             statToModify: "maxHealth",
      //             amount: 0.4,
      //             modifiedType: "multiplicative",
      //           },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           stats: {
      //             statToModify: "maxProtection",
      //             amount: 0.4,
      //             modifiedType: "multiplicative",
      //           },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           stats: {
      //             statToModify: "offense",
      //             amount: 0.4,
      //             modifiedType: "multiplicative",
      //           },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           // stats: {
      //           //   statToModify: "defense",
      //           //   amount: 0.4,
      //           //   modifiedType: "multiplicative",
      //           // },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           stats: {
      //             statToModify: "potency",
      //             amount: 0.4,
      //             modifiedType: "multiplicative",
      //           },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //         {
      //           stats: {
      //             statToModify: "tenacity",
      //             amount: 0.4,
      //             modifiedType: "multiplicative",
      //           },
      //           scalesBy: {
      //             targets: {
      //               filters: [
      //                 { allies: true },
      //                 { tags: ["Rebel"] },
      //                 { isLeader: true },
      //               ],
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: uuid(),
      //   triggerType: "always",
      //   targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
      //   actions: [
      //     {
      //       targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
      //       effects: [
      //         {
      //           stats: {
      //             statToModify: "critAvoid",
      //             amount: 0.15,
      //             modifiedType: "additive",
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
};

export default chewpio;
