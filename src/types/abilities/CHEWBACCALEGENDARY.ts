import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const weakest = {
  targets: {
    filters: [
      { allies: true },
      { tags: ["!Self"] },
      { targetIds: ["!HANSOLO"] },
    ],
    targetCount: 1,
    weakest: true,
  },
};

const chewy: Record<string, iAbility | iUniqueAbility> = {
  basicskill_CHEWBACCALEGENDARY: {
    id: "basicskill_CHEWBACCALEGENDARY",
    name: "Overcharged Shot",
    gameText:
      "Deal Physical damage to target enemy and inflict Tenacity Down for 2 turns.",
    sort: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 1.4,
              },
            },
          },
          {
            debuffs: [
              {
                name: "Tenacity Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_CHEWBACCALEGENDARY01: {
    id: "specialskill_CHEWBACCALEGENDARY01",
    name: "Pulverize",
    gameText:
      "Dispel all buffs on all enemies, then deal Physical damage to all enemies. Chewbacca gains Offense Up and Critical Chance Up for 2 turns. This attack ignores Defense.",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }] },
        effects: [
          {
            dispel: {
              buffs: "all",
            },
          },
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 0.9,
                stats: {
                  statToModify: "armor",
                  amount: 0,
                  modifiedType: "multiplicative",
                },
              },
            },
          },
        ],
      },
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            buffs: [
              {
                name: "Offense Up",
                duration: 2,
                id: uuid(),
              },
              {
                name: "Critical Chance Up",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_CHEWBACCALEGENDARY02: {
    id: "specialskill_CHEWBACCALEGENDARY02",
    name: "Furious Bowcaster",
    gameText:
      "Deal Physical damage to target enemy and Stun them for 1 turn. Then, if the target has no Protection, reset Pulverize's ability cooldown. This attack can't be Evaded.",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            cantMiss: true,
            damage: {
              modifier: {
                value: 2.4,
              },
              damageType: "physical",
            },
            debuffs: [
              {
                name: "Stun",
                duration: 1,
                id: uuid(),
              },
            ],
          },
          {
            condition: {
              stats: {
                statToModify: "protection",
                modifiedType: "additive",
                amount: 1,
                amountType: "less",
              },
            },
            cooldown: {
              amount: -Infinity,
              target: { filters: [{ allies: true }, { tags: ["Self"] }] },
              id: "specialskill_CHEWBACCALEGENDARY01",
            },
          },
        ],
      },
    ],
  },
  uniqueskill_CHEWBACCALEGENDARY01: {
    id: "uniqueskill_CHEWBACCALEGENDARY01",
    name: "Loyal Friend",
    gameText: `At the start of the battle, grant Guard to the weakest ally and Han Solo until Chewbacca is defeated. Chewbacca Assists when a Guarded ally uses any ability during their turn, doing 20% less damage, limited once per turn. When Chewbacca deals damage to an enemy, Chewbacca and all Guarded allies recover 3% Health and 3% Protection.\n\nGuard: Can't be Critically Hit, immune to Daze and Stun, +25% Critical Chance`,
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
                { tags: ["!Self"] },
                { targetIds: ["!HANSOLO"] },
              ],
              targetCount: 1,
              weakest: true,
            },
            effects: [
              {
                statusEffects: [
                  {
                    name: "Guard",
                    duration: Infinity,
                    id: uuid(),
                  },
                ],
                triggers: [
                  {
                    triggerType: "useAbility",
                    id: uuid(),
                    targets: {
                      filters: [{ allies: true }, { tags: ["Self"] }],
                    },
                    triggerData: {
                      frequency: "turn",
                      count: 1,
                      limit: 1,
                    },
                    condition: {
                      onTurn: true,
                    },
                    actions: [
                      {
                        targets: { filters: [{ primary: true }] },
                        effects: [
                          {
                            assist: {
                              chance: 1,
                              targets: {
                                filters: [
                                  { allies: true },
                                  { targetIds: ["CHEWBACCALEGENDARY"] },
                                ],
                              },
                              modifier: {
                                stats: {
                                  modifiedType: "multiplicative",
                                  statToModify: "offense",
                                  amount: 0.8,
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
        triggerType: "pregame",
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { targetIds: ["HANSOLO"] }],
            },
            effects: [
              {
                statusEffects: [
                  {
                    name: "Guard",
                    duration: Infinity,
                    id: uuid(),
                  },
                ],
                triggers: [
                  {
                    triggerType: "useAbility",
                    id: uuid(),
                    targets: {
                      filters: [{ allies: true }, { tags: ["Self"] }],
                    },
                    triggerData: {
                      frequency: "turn",
                      count: 1,
                      limit: 1,
                    },
                    condition: {
                      onTurn: true,
                    },
                    actions: [
                      {
                        targets: { filters: [{ primary: true }] },
                        effects: [
                          {
                            assist: {
                              chance: 1,
                              targets: {
                                filters: [
                                  { allies: true },
                                  { targetIds: ["CHEWBACCALEGENDARY"] },
                                ],
                              },
                              modifier: {
                                stats: {
                                  modifiedType: "multiplicative",
                                  statToModify: "offense",
                                  amount: 0.8,
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
        triggerType: "dealDamage",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { statusEffects: ["Guard"] }],
            },
            effects: [
              {
                heal: {
                  healthType: "protection",
                  amount: 0.03,
                  amountType: "multiplicative",
                },
              },
              {
                heal: {
                  healthType: "health",
                  amount: 0.03,
                  amountType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_CHEWBACCALEGENDARY02: {
    id: "uniqueskill_CHEWBACCALEGENDARY02",
    name: "Raging Wookie",
    gameText:
      "Chewbacca is immune to Ability Block and Cooldown Increase. When Chewbacca deals damage to an enemy with an attack, he deals bonus damage equal to 20% of their Max Health. When Chewbacca takes damage from an attack, he gains +25% Offense and +25% Critical Chance until the end of his next turn. When Chewbacca or a Guarded ally takes damage from an attack, reduce Furious Bowcaster's cooldown by 1.",
    sort: 1,
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                immune: {
                  negativeStatusEffects: ["Ability Block", "Cooldown Increase"],
                },
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "dealDamageWithAttack",
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        triggerData: {
          excludeAbilities: ["uniqueskill_CHEWBACCALEGENDARY02"],
        },
        actions: [
          {
            targets: { filters: [{ primary: true }] },
            effects: [
              {
                damage: {
                  damageType: "true",
                  modifier: {
                    value: 1,
                  },
                },
                scalesBy: {
                  stat: {
                    name: "maxHealth",
                    percent: 0.2,
                  },
                  targets: { filters: [{ primary: true }] },
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "receiveDamageFromAttack",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                stats: {
                  statToModify: "offense",
                  modifiedType: "multiplicative",
                  amount: 0.25,
                  expires: {
                    frequency: "turn",
                    count: 1,
                  },
                  stacking: false,
                },
              },
              {
                stats: {
                  statToModify: "critChance",
                  modifiedType: "multiplicative",
                  amount: 0.25,
                  expires: {
                    frequency: "turn",
                    count: 1,
                  },
                  stacking: false,
                },
              },
              {
                cooldown: {
                  id: "specialskill_CHEWBACCALEGENDARY02",
                  amount: -1,
                  target: { filters: [{ allies: true }, { tags: ["Self"] }] },
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "receiveDamageFromAttack",
        id: uuid(),
        targets: {
          filters: [{ allies: true }, { tags: ["Self"] }],
        },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { tags: ["Self"] }],
            },
            effects: [
              {
                cooldown: {
                  id: "specialskill_CHEWBACCALEGENDARY02",
                  amount: -1,
                  target: {
                    filters: [
                      { allies: true },
                      { targetIds: ["CHEWBACCALEGENDARY"] },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      // {
      //   triggerType: "pregame",
      //   id: uuid(),
      //   targets: {
      //     filters: [{ allies: true }],
      //   },
      //   actions: [
      //     {
      //       targets: {
      //         filters: [{ allies: true }],
      //       },
      //       effects: [
      //         {
      //           triggers: [
      //             {
      //               triggerType: "receiveDamageFromAttack",
      //               id: uuid(),
      //               targets: {
      //                 filters: [{ allies: true }, { tags: ["Self"] }],
      //               },

      //               actions: [
      //                 {
      //                   targets: {
      //                     filters: [
      //                       { allies: true },
      //                       { targetIds: ["CHEWBACCALEGENDARY"] },
      //                     ],
      //                   },
      //                   effects: [
      //                     {
      //                       cooldown: {
      //                         id: "specialskill_CHEWBACCALEGENDARY02",
      //                         amount: -1,
      //                         target: {
      //                           filters: [
      //                             { allies: true },
      //                             { targetIds: ["CHEWBACCALEGENDARY"] },
      //                           ],
      //                         },
      //                       },
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
};

export default chewy;
