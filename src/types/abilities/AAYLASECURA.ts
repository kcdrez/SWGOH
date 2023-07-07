import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const aayla: Record<string, iAbility | iUniqueAbility> = {
  basicskill_AAYLASECURA: {
    name: "Inspiring Strike",
    id: "basicskill_AAYLASECURA",
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            damage: {
              modifier: 1.645,
              damageType: "physical",
              variance: 5,
            },
          },
        ],
      },
      {
        targets: [
          { allies: true },
          { tags: ["Jedi & !Self"] },
          { targetCount: 1 },
        ],
        effects: [
          {
            assist: {
              chance: 0.35,
              modifier: {
                stats: {
                  amount: 0.5,
                  type: "percent",
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
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            damage: {
              modifier: 3.008,
              damageType: "physical",
              variance: 5,
            },
          },
        ],
      },
      {
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            heal: {
              healthType: "health",
              amount: 0.65,
              percent: true,
            },
            scalesBy: {
              damage: true,
            },
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            targets: [{ targetIds: ["target"] }],
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
      {
        triggerType: "always",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            stats: {
              amount: 0.1,
              statToModify: "critChance",
              type: "flat",
            },
          },
          {
            stats: {
              amount: 0.65,
              statToModify: "counterChance",
              type: "flat",
            },
          },
          {
            stats: {
              amount: 0.5,
              statToModify: "counterDamage",
              type: "percent",
            },
          },
        ],
      },
    ],
  },
};

export default aayla;
