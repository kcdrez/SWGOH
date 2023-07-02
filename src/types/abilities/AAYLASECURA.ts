import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const aayla: Record<string, iAbility | iUniqueAbility> = {
  basicskill_AAYLASECURA: {
    name: "Inspiring Strike",
    id: "basicskill_AAYLASECURA",
    targets: [
      {
        target: { targetCount: 1, allies: false },
        damage: 1.645,
        damageType: "physical",
        actions: [
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
              target: {
                target: {
                  allies: true,
                  targetCount: 1,
                  tags: ["Jedi & !Self"],
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
    triggers: [
      {
        id: uuid(),
        triggerType: "dealDamage",
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            heal: {
              type: "flat",
              healthType: "health",
            },
            scale: 0.65,
          },
        ],
      },
    ],
    targets: [
      {
        target: { targetCount: 1, allies: false },
        damage: 3.008,
        damageType: "physical",
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
        target: {
          tags: ["Self"],
          allies: true,
        },
        events: [
          {
            target: {
              targetIds: ["target"],
            },
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
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
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
              statToModify: "counter",
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
