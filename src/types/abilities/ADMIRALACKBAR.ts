import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const ackbar: Record<string, iAbility | iUniqueAbility> = {
  basicskill_ADMIRALACKBAR: {
    name: "Quick Shot",
    id: "basicskill_ADMIRALACKBAR",
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
                value: 1.745,
              },
              damageType: "physical",
            },
          },
          {
            buffs: [
              {
                name: "TM Increase",
                duration: 0.45,
                chance: 0.55,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_ADMIRALACKBAR01: {
    id: "specialskill_ADMIRALACKBAR01",
    name: "It's a Trap!",
    cooldown: 5,
    turnsRemaining: 0,
    actions: [
      {
        targets: {
          filters: [{ allies: true }],
        },
        effects: [
          {
            dispel: {
              debuffs: ["all"],
            },
            triggers: [
              {
                id: uuid(),
                triggerType: "dispelDebuff",
                actions: [
                  {
                    targets: {
                      filters: [{ allies: true }],
                    },
                    effects: [
                      {
                        heal: {
                          healthType: "health",
                          amount: 0.09,
                          amountType: "multiplicative",
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

export default ackbar;
