import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const aayla: Record<string, iAbility | iUniqueAbility> = {
  basicskill_AAYLASECURA: {
    name: "Inspiring Strike",
    id: "basicskill_AAYLASECURA",
    actions: [
      {
        targets: {
          filters: [{ allies: false }],
          targetCount: 1,
        },
        effects: [
          {
            damage: {
              modifier: {
                value: 1.645,
              },
              damageType: "physical",
            },
          },
        ],
      },
      {
        targets: {
          filters: [{ allies: true }, { tags: ["Jedi & !Self"] }],
          targetCount: 1,
        },
        effects: [
          {
            assist: {
              chance: 0.35,
              modifier: {
                stats: {
                  amount: 0.5,
                  modifiedType: "multiplicative",
                  statToModify: "offense",
                },
              },
            },
          },
        ],
      },
    ],
  },
  specialskill_AAYLASECURA01: {
    id: "specialskill_AAYLASECURA01",
    name: "Survivor",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: {
          filters: [{ allies: false }],
          targetCount: 1,
        },
        effects: [
          {
            damage: {
              modifier: {
                value: 3.008,
              },
              damageType: "physical",
            },
          },
        ],
      },
    ],
    triggers: [
      {
        triggerType: "dealDamage",
        id: uuid(),
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                heal: {
                  healthType: "health",
                  amount: 0.65,
                  amountType: "multiplicative",
                },
                scalesBy: {
                  damage: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_AAYLASECURA01: {
    id: "uniqueskill_AAYLASECURA01",
    name: "Superior Riposte",
    triggers: [
      {
        triggerType: "criticalHit",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ targetIds: ["target"] }] },
            effects: [
              // {
              //   debuffs: [
              //     {
              //       duration: 1,
              //       name: "Stun",
              //       id: uuid(),
              //     },
              //   ],
              // },
            ],
          },
        ],
      },
      {
        triggerType: "always",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                stats: {
                  amount: 0.1,
                  statToModify: "critChance",
                  modifiedType: "additive",
                },
              },
              {
                stats: {
                  amount: 0.65,
                  statToModify: "counterChance",
                  modifiedType: "additive",
                },
              },
              {
                stats: {
                  amount: 0.5,
                  statToModify: "counterDamage",
                  modifiedType: "additive",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  leaderskill_AAYLASECURA: {
    id: "leaderskill_AAYLASECURA",
    name: "Jedi Valor",
    triggers: [
      {
        id: uuid(),
        triggerType: "always",
        targets: { filters: [{ allies: true }, { tags: ["Jedi"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                stats: {
                  modifiedType: "additive",
                  statToModify: "tenacity",
                  amount: 0.4,
                },
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "resistDetrimentalEffect",
        targets: { filters: [{ allies: true }, { tags: ["Jedi"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                heal: {
                  healthType: "health",
                  amount: 0.1,
                  amountType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default aayla;
