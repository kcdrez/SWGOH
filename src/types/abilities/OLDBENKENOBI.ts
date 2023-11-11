import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const oldBen: Record<string, iAbility | iUniqueAbility> = {
  basicskill_OLDBENKENOBI: {
    id: "basicskill_OLDBENKENOBI",
    name: "Elegant Form",
    gameText:
      "Deal Physical damage to target enemy, inflict Evasion Down for 2 turns, then gain Potency Up for 2 turns. This attack can't be Evaded.",
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            damage: {
              modifier: {
                value: 1.758,
              },
              damageType: "physical",
            },
            cantMiss: true,
          },
          {
            debuffs: [
              {
                name: "Evasion Down",
                duration: 2,
                id: uuid(),
              },
            ],
            cantMiss: true,
          },
        ],
      },
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            buffs: [
              {
                name: "Potency Up",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_OLDBENKENOBI01: {
    id: "specialskill_OLDBENKENOBI01",
    name: "Mind Tricks",
    gameText:
      "Inflict Ability Block on all enemies for 1 turn and Offense Down for 2 turns, with an 80% chance to remove 60% Turn Meter. Jedi and Rebel allies gain 3% Turn Meter for each effect Resisted. This attack can't be Evaded.",
    cooldown: 5,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }] },
        effects: [
          {
            cantMiss: true,
            debuffs: [
              {
                name: "Ability Block",
                duration: 1,
                id: uuid(),
                triggers: [
                  {
                    id: uuid(),
                    triggerType: "resistDetrimentalEffect",
                    targets: {
                      filters: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
                    },
                    actions: [
                      {
                        targets: {
                          filters: [
                            { allies: true },
                            { tags: ["Jedi", "Rebel"] },
                          ],
                        },
                        effects: [
                          {
                            buffs: [
                              {
                                name: "TM Increase",
                                duration: 3,
                                id: uuid(),
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
                name: "Offense Down",
                duration: 2,
                id: uuid(),
                triggers: [
                  {
                    id: uuid(),
                    triggerType: "resistDetrimentalEffect",
                    targets: {
                      filters: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
                    },
                    actions: [
                      {
                        targets: {
                          filters: [
                            { allies: true },
                            { tags: ["Jedi", "Rebel"] },
                          ],
                        },
                        effects: [
                          {
                            buffs: [
                              {
                                name: "TM Increase",
                                duration: 3,
                                id: uuid(),
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
                name: "TM Decrease",
                duration: -60,
                chance: 0.8,
                id: uuid(),
                triggers: [
                  {
                    id: uuid(),
                    triggerType: "resistDetrimentalEffect",
                    targets: {
                      filters: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
                    },
                    actions: [
                      {
                        targets: {
                          filters: [
                            { allies: true },
                            { tags: ["Jedi", "Rebel"] },
                          ],
                        },
                        effects: [
                          {
                            buffs: [
                              {
                                name: "TM Increase",
                                duration: 3,
                                id: uuid(),
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
        ],
      },
    ],
  },
  specialskill_OLDBENKENOBI02: {
    id: "specialskill_OLDBENKENOBI02",
    name: "Devoted Protector",
    gameText:
      "Old Ben gains Taunt for 2 turns. When this Taunt expires, Old Ben gains Taunt for 1 turn. All allies gain Defense Up for 2 turns.",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            buffs: [
              {
                name: "Taunt",
                duration: 2,
                id: uuid(),

                triggers: [
                  {
                    id: uuid(),
                    triggerType: "expires",
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
                            buffs: [{ name: "Taunt", duration: 1, id: uuid() }],
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
        targets: { filters: [{ allies: true }] },
        effects: [
          {
            buffs: [
              {
                name: "Defense Up",
                id: uuid(),
                duration: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_OLDBENKENOBI01: {
    id: "uniqueskill_OLDBENKENOBI01",
    name: "If You Strike Me Down",
    gameText:
      "Whenever another Jedi or Rebel ally takes damage, Old Ben gains 5% Turn Meter. The first time Old Ben is defeated, all allies gain Offense Up and Speed Up for 2 turns, recover 50% Health and 50% Protection, and gain 25% Turn Meter.",
    triggers: [
      {
        triggerType: "receiveDamage",
        id: uuid(),
        targets: {
          filters: [
            { allies: true },
            { tags: ["Jedi & !Self", "Rebel & !Self"] },
          ],
        },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { targetIds: ["OLDBENKENOBI"] }],
            },
            effects: [
              {
                buffs: [
                  {
                    duration: 5,
                    name: "TM Increase",
                    id: uuid(),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        triggerType: "death",
        triggerData: {
          limit: 1,
          frequency: "match",
          count: 1,
        },
        actions: [
          {
            targets: { filters: [{ allies: true }] },
            effects: [
              {
                buffs: [
                  {
                    duration: 2,
                    name: "Offense Up",
                    id: uuid(),
                  },
                  {
                    duration: 2,
                    name: "Speed Up",
                    id: uuid(),
                  },
                  {
                    duration: 25,
                    name: "TM Increase",
                    id: uuid(),
                  },
                ],
              },
              {
                heal: {
                  healthType: "protection",
                  amount: 0.5,
                  amountType: "multiplicative",
                },
              },
              {
                heal: {
                  healthType: "health",
                  amount: 0.5,
                  amountType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  leaderskill_OLDBENKENOBI: {
    id: "leaderskill_OLDBENKENOBI",
    name: "Old Jedi Knight",
    gameText:
      "All allies gain 15% Evasion and gain 30% Turn Meter whenever they Evade an attack.",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: { filters: [{ allies: true }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                stats: {
                  modifiedType: "additive",
                  statToModify: "dodge",
                  amount: 0.15,
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "dodge",
        id: uuid(),
        targets: { filters: [{ allies: true }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 30,
                    id: uuid(),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export default oldBen;
