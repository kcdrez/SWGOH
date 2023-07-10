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
                modifiedType: "multiplicative",
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 0.5,
              statToModify: "critAvoid",
              modifiedType: "additive",
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
              modifiedType: "additive",
            },
          },
          {
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
            stats: {
              amount: 0.5,
              statToModify: "counterChance",
              modifiedType: "additive",
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
              modifiedType: "multiplicative",
            },
          },
        ],
      },
      {
        triggerType: "receiveDamage",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Rebel & !Self"] }],
        effects: [
          {
            targets: [
              { allies: true },
              { targetIds: ["COMMANDERLUKESKYWALKER"] },
            ],
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
  uniqueskill_COMMANDERLUKESKYWALKER02: {
    name: "It Binds All Things",
    id: "uniqueskill_COMMANDERLUKESKYWALKER02",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            stats: {
              amount: 0.4,
              statToModify: "potency",
              modifiedType: "additive",
            },
          },
        ],
      },
      {
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            heal: {
              healthType: "protection",
              amount: 0.05,
              percent: true,
            },
          },
          {
            heal: {
              healthType: "health",
              amount: 0.05,
              percent: true,
            },
          },
        ],
      },
      {
        triggerType: "inflictDebuff",
        id: uuid(),
        targets: [
          {
            tags: ["Self"],
            allies: true,
          },
        ],
        effects: [
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            targets: [{ allies: true }, { tags: ["!Self"] }],
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
  leaderskill_COMMANDERLUKESKYWALKER: {
    name: "Rebel Maneuvers",
    id: "leaderskill_COMMANDERLUKESKYWALKER",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Rebel"] }],
        effects: [
          {
            stats: {
              amount: 0.5,
              statToModify: "counterChance",
              modifiedType: "additive",
            },
          },
          {
            stats: {
              amount: 0.5,
              statToModify: "defense",
              modifiedType: "multiplicative",
            },
          },
          {
            stats: {
              amount: 0.15,
              statToModify: "offense",
              modifiedType: "multiplicative",
            },
          },
        ],
      },
      {
        targets: [{ allies: false }],
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        effects: [
          {
            targets: [{ allies: false }, { tags: ["Rebel"] }],
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
};

export default cls;
