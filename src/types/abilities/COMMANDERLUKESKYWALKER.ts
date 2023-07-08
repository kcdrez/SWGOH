import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const cls: Record<string, iAbility | iUniqueAbility> = {
  specialskill_COMMANDERLUKESKYWALKER02: {
    id: "specialskill_COMMANDERLUKESKYWALKER02",
    name: "Call to Action",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            dispel: {
              debuffs: "all",
            },
          },
          {
            buffs: [
              {
                duration: 100,
                name: "TM Increase",
                id: uuid(),
              },
            ],
          },
          {
            heal: {
              healthType: "protection",
              amount: 0.4,
              percent: true,
            },
          },
          {
            heal: {
              healthType: "health",
              amount: 0.4,
              percent: true,
            },
          },
          {
            buffs: [
              {
                duration: Infinity,
                name: "Call to Action",
                id: uuid(),
                cantPrevent: true,
                cantDispel: true,
                unique: true,
              },
            ],
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
          },
          {
            dispel: {
              buffs: ["Call to Action"],
            },
            condition: {
              buffs: ["Call to Action"],
              isNew: false,
            },
          },
        ],
      },
    ],
  },
  specialskill_COMMANDERLUKESKYWALKER01: {
    id: "specialskill_COMMANDERLUKESKYWALKER01",
    name: "Use the Force",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            dispel: {
              buffs: "all",
            },
          },
          {
            debuffs: [
              { name: "TM Decrease", duration: -100, id: uuid() },
              { name: "Buff Immunity", duration: 2, id: uuid() },
              { name: "Tenacity Down", duration: 2, id: uuid() },
            ],
          },
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 2.978,
              },
            },
          },
          {
            condition: {
              stats: {
                statToModify: "health",
                amount: 1,
                type: "percent",
              },
            },
            cooldown: {
              id: "specialskill_COMMANDERLUKESKYWALKER01",
              amount: -1,
              target: [{ allies: true }, { tags: ["Self"] }],
            },
          },
        ],
      },
    ],
  },
  basicskill_COMMANDERLUKESKYWALKER: {
    id: "basicskill_COMMANDERLUKESKYWALKER",
    name: "Destined Strike",
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 1.781,
              },
            },
          },
          {
            condition: {
              debuffs: ["Speed Down"],
            },
            debuffs: [
              {
                name: "TM Decrease",
                duration: -30,
                id: uuid(),
              },
            ],
          },
          {
            condition: {
              debuffs: ["Defense Down"],
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
            debuffs: [
              {
                name: "Speed Down",
                duration: 2,
                id: uuid(),
              },
              {
                name: "Defense Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_COMMANDERLUKESKYWALKER01: {
    name: "Learn Control",
    id: "uniqueskill_COMMANDERLUKESKYWALKER01",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 0.5,
              statToModify: "critAvoid",
              type: "flat",
            },
          },
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 1,
              statToModify: "tenacity",
              type: "flat",
            },
          },
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 0.5,
              statToModify: "counter",
              type: "flat",
            },
          },
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 0.5,
              statToModify: "defense",
              type: "percent",
            },
          },
        ],
      },
      {
        triggerType: "receiveDamage",
        id: uuid(),
        target: {
          tags: ["Rebel & !Self"],
          allies: true,
        },
        events: [
          {
            target: {
              targetIds: ["COMMANDERLUKESKYWALKER"],
              allies: true,
            },
            actions: [
              {
                buffs: [
                  {
                    id: uuid(),
                    name: "TM Increase",
                    duration: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_COMMANDERLUKESKYWALKER02: {
    name: "It Binds All Things",
    id: "uniqueskill_COMMANDERLUKESKYWALKER02",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            stats: {
              amount: 0.4,
              statToModify: "potency",
              type: "flat",
            },
          },
        ],
      },
      {
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            heal: {
              healthType: "health",
              amount: 0.05,
              type: "percent",
            },
          },
          {
            heal: {
              healthType: "protection",
              amount: 0.05,
              type: "percent",
            },
          },
        ],
      },
      {
        triggerType: "inflictDebuff",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            buffs: [
              {
                name: "TM Increase",
                duration: 10,
                id: uuid(),
              },
            ],
          },
        ],
      },
      {
        triggerType: "inflictDebuff",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        events: [
          {
            target: {
              tags: ["!Self"],
              allies: true,
            },
            actions: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 5,
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
  leaderskill_COMMANDERLUKESKYWALKER: {
    name: "Rebel Maneuvers",
    id: "leaderskill_COMMANDERLUKESKYWALKER",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        target: {
          allies: true,
          tags: ["Rebel"],
        },
        actions: [
          {
            stats: {
              amount: 0.5,
              statToModify: "counter",
              type: "flat",
            },
          },
          {
            stats: {
              amount: 0.5,
              statToModify: "defense",
              type: "percent",
            },
          },
          {
            stats: {
              amount: 0.15,
              statToModify: "offense",
              type: "percent",
            },
          },
        ],
      },
      {
        target: {
          allies: false,
        },
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        events: [
          {
            target: {
              allies: false,
              tags: ["Rebel"],
            },
            actions: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 5,
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

export default cls;
