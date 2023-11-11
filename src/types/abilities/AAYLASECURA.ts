import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const aayla: Record<string, iAbility | iUniqueAbility> = {
  basicskill_AAYLASECURA: {
    name: "Inspiring Strike",
    id: "basicskill_AAYLASECURA",
    gameText:
      "Deal Physical damage to target enemy with a 35% chance to call an ally to Assist. If the assisting ally is a Jedi, they deal 50% more damage.",
    actions: [
      {
        targets: {
          filters: [{ allies: false }],
          targetCount: 1,
        },
        effects: [
          {
            damage: {
              modifier: { value: 1.645 },
              damageType: "physical",
            },
          },
          {
            assist: {
              chance: 0.35,
              modifier: {
                stats: {
                  amount: 0.5,
                  modifiedType: "multiplicative",
                  statToModify: "offense",
                },
                condition: {
                  tags: ["Jedi"],
                },
              },
              targets: {
                filters: [{ allies: true }, { tags: ["!Self"] }],
                targetCount: 1,
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
    gameText:
      "Deal Physical damage to target enemy and recover Health equal to 65% of the damage dealt.",
    cooldown: 3,
    turnsRemaining: 0,
    triggers: [
      {
        id: uuid(),
        triggerType: "dealDamage",
        targets: {
          filters: [{ allies: true }, { tags: ["Self"] }],
        },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                heal: {
                  amountType: "multiplicative",
                  healthType: "health",
                  amount: 0.65,
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
    actions: [
      {
        targets: {
          filters: [{ allies: false }],
          targetCount: 1,
        },
        effects: [
          {
            damage: {
              modifier: { value: 3.008 },
              damageType: "physical",
            },
          },
        ],
      },
    ],
  },
  uniqueskill_AAYLASECURA01: {
    id: "uniqueskill_AAYLASECURA01",
    name: "Superior Riposte",
    gameText:
      "Aayla has +10% Critical Chance, 65% Counter Chance and +50% Counter Damage. In addition, she Stuns her target for 1 turn whenever she critically hits.",
    triggers: [
      {
        triggerType: "criticalHit",
        id: uuid(),
        targets: {
          filters: [{ tags: ["Self"] }, { allies: true }],
        },
        actions: [
          {
            targets: { filters: [{ targetIds: ["target"] }] },
            effects: [
              {
                debuffs: [
                  {
                    duration: 1,
                    name: "Stun",
                    id: uuid(),
                  },
                ],
              },
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
                  amount: 0.5,
                  statToModify: "counterDamage",
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
            ],
          },
        ],
      },
    ],
  },
  leaderskill_AAYLASECURA: {
    id: "leaderskill_AAYLASECURA",
    name: "Jedi Valor",
    gameText:
      "Jedi allies gain 40% Tenacity and recover 10% of their Max Health when they resist an effect.",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: {
          filters: [{ allies: true }, { tags: ["Jedi"] }],
        },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { tags: ["Self"] }],
            },
            effects: [
              {
                stats: {
                  amount: 0.4,
                  statToModify: "tenacity",
                  modifiedType: "additive",
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        targets: {
          filters: [{ allies: true }, { tags: ["Jedi"] }],
        },
        actions: [
          {
            targets: {
              filters: [{ allies: true }, { tags: ["Self"] }],
            },
            effects: [
              {
                heal: {
                  amount: 0.1,
                  amountType: "multiplicative",
                  healthType: "health",
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
