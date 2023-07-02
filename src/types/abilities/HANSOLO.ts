import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const hansolo: Record<string, iAbility | iUniqueAbility> = {
  basicskill_HANSOLO: {
    id: "basicskill_HANSOLO",
    name: "Quick Draw",
    targets: [
      {
        damageType: "physical",
        cantMiss: true,
        target: { targetCount: 1, allies: false },
        damage: 1.85,
        modifyDamage: {
          condition: {
            tm: {
              amount: 50,
              greaterThan: false,
            },
          },
          stats: {
            type: "percent",
            statToModify: "offense",
            amount: 1.75,
          },
        },
      },
    ],
    triggers: [
      {
        triggerType: "dealDamage",
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
            actions: [
              {
                condition: {
                  tm: {
                    amount: 49.999999,
                    greaterThan: true,
                  },
                },
                debuffs: [
                  {
                    name: "TM Decrease",
                    duration: -35,
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
  specialskill_HANSOLO01: {
    name: "Deadeye",
    id: "specialskill_HANSOLO011",
    cooldown: 3,
    turnsRemaining: 0,
    targets: [
      {
        damageType: "physical",
        target: { targetCount: 1, allies: false },
        damage: 3.699,
        debuffs: [
          {
            name: "Stun",
            duration: 1,
            id: uuid(),
          },
        ],
      },
      {
        target: {
          tags: ["Self"],
          allies: true,
          scale: "physical critChance",
        },
        buffs: [
          {
            name: "TM Increase",
            duration: 100,
            id: uuid(),
          },
        ],
      },
    ],
  },
  specialskill_HANSOLO02: {
    id: "specialskill_HANSOLO01",
    name: "Never Tell Me The Odds",
    turnsRemaining: 0,
    cooldown: 4,
    targets: [
      {
        target: {
          allies: true,
        },
        buffs: [
          {
            name: "Critical Chance Up",
            duration: 2,
            id: uuid(),
          },
          {
            name: "Evasion Up",
            duration: 2,
            id: uuid(),
          },
        ],
      },
      {
        target: {
          allies: true,
          tags: ["Self"],
        },
        buffs: [
          {
            name: "Critical Damage Up",
            duration: 2,
            id: uuid(),
          },
          {
            name: "TM Increase",
            duration: 50,
            id: uuid(),
          },
        ],
      },
    ],
  },
  uniqueskill_HANSOLO01: {
    id: "uniqueskill_HANSOLO01",
    name: "Shoots First",
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
              amount: 0.2,
              statToModify: "critChance",
              type: "flat",
            },
          },
          {
            stats: {
              amount: 0.35,
              statToModify: "counter",
              type: "flat",
            },
          },
        ],
      },
      {
        triggerType: "ability",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "turn",
        },
        events: [
          {
            target: {
              targetIds: ["target"],
            },
            actions: [
              {
                ability: {
                  abilityTrigger: "basicskill_HANSOLO",
                  abilityToUse: "basicskill_HANSOLO",
                },
                stats: {
                  type: "percent",
                  amount: 0.5,
                  statToModify: "offense",
                },
              },
            ],
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "start",
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "match",
        },
        target: {
          tags: ["Self"],
          allies: true,
        },
        events: [
          {
            target: {
              targetCount: 1,
              allies: false,
              ignoreTaunt: true,
            },
            actions: [
              {
                ability: {
                  abilityToUse: "basicskill_HANSOLO",
                  modifiers: [
                    {
                      target: {
                        targetCount: 1,
                        allies: false,
                        ignoreTaunt: true,
                      },
                      debuffs: [
                        {
                          name: "Stun",
                          duration: 1,
                          cantResist: true,
                          id: uuid(),
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};

export default hansolo;
