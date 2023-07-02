import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const oldBen: Record<string, iAbility | iUniqueAbility> = {
  basicskill_OLDBENKENOBI: {
    id: "basicskill_OLDBENKENOBI",
    name: "Elegant Form",
    targets: [
      {
        target: { targetCount: 1, allies: false },
        debuffs: [
          {
            name: "Evasion Down",
            duration: 2,
            id: uuid(),
          },
        ],
        damage: 1.758,
        damageType: "physical",
        cantMiss: true,
      },
      {
        target: {
          tags: ["Self"],
          allies: true,
        },
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
  specialskill_OLDBENKENOBI01: {
    id: "specialskill_OLDBENKENOBI01",
    name: "Mind Tricks",
    cooldown: 5,
    turnsRemaining: 0,
    targets: [
      {
        target: {
          allies: false,
        },
        cantMiss: true,
        debuffs: [
          {
            name: "Ability Block",
            duration: 1,
            id: uuid(),
          },
          {
            name: "Offense Down",
            duration: 2,
            id: uuid(),
          },
          {
            name: "TM Decrease",
            duration: -60,
            chance: 0.8,
            id: uuid(),
          },
        ],
      },
      //todo: add the following to an event
      {
        target: {
          tags: ["Jedi", "Rebel"],
          allies: true,
          scale: "Resisted",
        },
        buffs: [
          {
            duration: 3,
            name: "TM Increase",
            id: uuid(),
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
    targets: [
      {
        target: {
          tags: ["Self"],
          allies: true,
        },
        buffs: [
          {
            name: "Taunt",
            duration: 2,
            id: uuid(),
            expires: {
              target: {
                tags: ["Self"],
                allies: true,
              },
              buffs: [
                {
                  name: "Taunt",
                  duration: 1,
                  id: uuid(),
                },
              ],
            },
          },
        ],
      },
      {
        target: { allies: true },
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
  uniqueskill_OLDBENKENOBI01: {
    id: "uniqueskill_OLDBENKENOBI01",
    name: "If You Strike Me Down",
    triggers: [
      {
        triggerType: "receiveDamage",
        id: uuid(),
        target: {
          tags: ["Jedi & !Self", "Rebel & !Self"],
          allies: true,
        },
        events: [
          {
            target: {
              targetIds: ["OLDBENKENOBI"],
              allies: true,
            },
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
        target: {
          tags: ["Self"],
          allies: true,
        },
        triggerType: "death",
        events: [
          {
            triggerData: {
              limit: 1,
              frequency: "match",
              count: 1,
            },
            target: {
              allies: true,
            },
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
            actions: [
              {
                heal: {
                  healthType: "protection",
                  amount: 0.5,
                  type: "percent",
                },
              },
              {
                heal: {
                  healthType: "health",
                  amount: 0.5,
                  type: "percent",
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
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        target: {
          allies: true,
        },
        actions: [
          {
            stats: {
              type: "flat",
              statToModify: "dodge",
              amount: 0.15,
            },
          },
        ],
      },
      {
        triggerType: "dodge",
        id: uuid(),
        target: {
          allies: true,
        },
        events: [
          {
            target: {
              tags: ["Self"],
              allies: true,
            },
            actions: [
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
