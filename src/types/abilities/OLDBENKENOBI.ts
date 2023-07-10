import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const oldBen: Record<string, iAbility | iUniqueAbility> = {
  basicskill_OLDBENKENOBI: {
    id: "basicskill_OLDBENKENOBI",
    name: "Elegant Form",
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
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
        targets: [{ allies: true }, { tags: ["Self"] }],
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
    cooldown: 5,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: false }],
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
                    targets: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
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
              {
                name: "Offense Down",
                duration: 2,
                id: uuid(),
                triggers: [
                  {
                    id: uuid(),
                    triggerType: "resistDetrimentalEffect",
                    targets: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
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
              {
                name: "TM Decrease",
                duration: -60,
                chance: 0.8,
                id: uuid(),
                triggers: [
                  {
                    id: uuid(),
                    triggerType: "resistDetrimentalEffect",
                    targets: [{ allies: true }, { tags: ["Jedi", "Rebel"] }],
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
            triggers: [],
          },
        ],
      },
    ],
  },
  specialskill_OLDBENKENOBI02: {
    id: "specialskill_OLDBENKENOBI02",
    name: "Devoted Protector",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: true }, { tags: ["Self"] }],
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
                    targets: [{ allies: true }, { tags: ["Self"] }],
                    effects: [
                      { buffs: [{ name: "Taunt", duration: 1, id: uuid() }] },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        targets: [{ allies: true }],
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
    triggers: [
      {
        triggerType: "receiveDamage",
        id: uuid(),
        targets: [
          { allies: true },
          { tags: ["Jedi & !Self", "Rebel & !Self"] },
        ],
        effects: [
          {
            targets: [{ allies: true }, { targetIds: ["OLDBENKENOBI"] }],
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
      {
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Self"] }],
        triggerType: "death",
        triggerData: {
          limit: 1,
          frequency: "match",
          count: 1,
        },
        effects: [
          {
            targets: [{ allies: true }],
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
            targets: [{ allies: true }],
            heal: {
              healthType: "protection",
              amount: 0.5,
              percent: true,
            },
          },
          {
            targets: [{ allies: true }],
            heal: {
              healthType: "health",
              amount: 0.5,
              percent: true,
            },
          },
        ],
      },
    ],
  },
  leaderskill_OLDBENKENOBI: {
    id: "leaderskill_OLDBENKENOBI",
    name: "Old Jedi Knight",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: [{ allies: true }],
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
      {
        triggerType: "dodge",
        id: uuid(),
        targets: [{ allies: true }],
        effects: [
          {
            targets: [{ allies: true }, { tags: ["Self"] }],
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
};

export default oldBen;
