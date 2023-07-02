import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const chewy: Record<string, iAbility | iUniqueAbility> = {
  basicskill_CHEWBACCALEGENDARY: {
    id: "basicskill_CHEWBACCALEGENDARY",
    name: "Overcharged Shot",
    sort: 0,
    targets: [
      {
        target: { targetCount: 1, allies: false },
        debuffs: [
          {
            name: "Tenacity Down",
            duration: 2,
            id: uuid(),
          },
        ],
        damage: 1.4,
        damageType: "physical",
      },
    ],
  },
  specialskill_CHEWBACCALEGENDARY01: {
    id: "specialskill_CHEWBACCALEGENDARY01",
    name: "Pulverize",
    cooldown: 4,
    turnsRemaining: 0,
    targets: [
      {
        target: { allies: false },
        actions: [
          {
            dispel: {
              buffs: "all",
            },
          },
        ],
      },
      {
        target: { allies: false },
        damage: 0.9,
        damageType: "physical",
        stats: {
          statToModify: "armor",
          amount: 0,
          type: "percent",
        },
      },
      {
        target: { tags: ["Self"], allies: true },
        buffs: [
          {
            name: "Offense Up",
            duration: 2,
            id: uuid(),
          },
          {
            name: "Critical Chance Up",
            duration: 2,
            id: uuid(),
          },
        ],
      },
    ],
  },
  specialskill_CHEWBACCALEGENDARY02: {
    id: "specialskill_CHEWBACCALEGENDARY01",
    name: "Furious Bowcaster",
    cooldown: 3,
    turnsRemaining: 0,
    targets: [
      {
        target: {
          targetCount: 1,
          allies: false,
        },
        cantMiss: true,
        debuffs: [
          {
            name: "Stun",
            duration: 1,
            id: uuid(),
          },
        ],
        damage: 2.4,
        damageType: "physical",
        actions: [
          {
            condition: {
              stats: {
                statToModify: "protection",
                type: "flat",
                amount: 1,
                amountType: "less",
              },
            },
            cooldown: {
              amount: 0,
              target: "Self",
              id: "specialskill_CHEWBACCALEGENDARY01",
            },
          },
        ],
      },
    ],
  },
  uniqueskill_CHEWBACCALEGENDARY01: {
    id: "uniqueskill_CHEWBACCALEGENDARY01",
    name: "Loyal Friend",
    triggers: [
      {
        id: uuid(),
        triggerType: "pregame",
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "match",
        },
        target: {
          tags: ["Self"],
        },
        events: [
          {
            target: {
              weakest: true,
              allies: true,
              tags: ["!Self"],
              targetIds: ["!HANSOLO"],
              targetCount: 1,
            },
            statusEffects: [
              {
                name: "Guard",
                duration: Infinity,
                id: uuid(),
              },
            ],
            triggers: [
              {
                triggerType: "useAbility",
                id: uuid(),
                target: { targetIds: ["target"] },
                triggerData: {
                  frequency: "turn",
                  count: 1,
                  limit: 1,
                },
                actions: [
                  {
                    assist: {
                      chance: 1,
                      target: {
                        target: {
                          allies: true,
                          targetIds: ["CHEWBACCALEGENDARY"],
                        },
                      },
                      modifier: {
                        stats: {
                          type: "percent",
                          statToModify: "offense",
                          amount: 0.8,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            target: {
              targetIds: ["HANSOLO"],
              allies: true,
            },
            statusEffects: [
              {
                name: "Guard",
                duration: Infinity,
                id: uuid(),
              },
            ],
            triggers: [
              {
                triggerType: "useAbility",
                id: uuid(),
                target: { targetIds: ["target"] },
                triggerData: {
                  frequency: "turn",
                  count: 1,
                  limit: 1,
                },
                actions: [
                  {
                    assist: {
                      chance: 1,
                      target: {
                        target: {
                          allies: true,
                          targetIds: ["CHEWBACCALEGENDARY"],
                        },
                      },
                      modifier: {
                        stats: {
                          type: "percent",
                          statToModify: "offense",
                          amount: 0.8,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
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
              statusEffects: ["Guard"],
              allies: true,
            },
            actions: [
              {
                heal: {
                  healthType: "health",
                  amount: 0.03,
                  type: "percent",
                },
              },
              {
                heal: {
                  healthType: "protection",
                  amount: 0.03,
                  type: "percent",
                },
              },
            ],
          },
          {
            target: {
              allies: true,
              tags: ["Self"],
            },
            actions: [
              {
                heal: {
                  healthType: "health",
                  amount: 0.03,
                  type: "percent",
                },
              },
              {
                heal: {
                  healthType: "protection",
                  amount: 0.03,
                  type: "percent",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_CHEWBACCALEGENDARY02: {
    id: "uniqueskill_CHEWBACCALEGENDARY02",
    name: "Raging Wookie",
    sort: 1,
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
            immune: {
              negativeStatusEffects: ["Ability Block", "Cooldown Increase"],
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "dealDamage",
        target: {
          tags: ["Self"],
          allies: true,
        },
        events: [
          {
            target: { targetIds: ["target"] },
            actions: [
              {
                damage: {
                  scale: {
                    target: { target: { targetIds: ["target"] } },
                    stats: {
                      statToModify: "maxHealth",
                      type: "percent",
                      amount: 0.2,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "receiveDamage",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            stats: {
              statToModify: "offense",
              type: "percent",
              amount: 0.25,
              expires: {
                frequency: "turn",
                count: 1,
              },
            },
          },
          {
            stats: {
              statToModify: "critChance",
              type: "flat",
              amount: 0.25,
              expires: {
                frequency: "turn",
                count: 1,
              },
            },
          },
          {
            cooldown: {
              id: "specialskill_CHEWBACCALEGENDARY01",
              amount: -1,
              target: "Self",
            },
          },
        ],
      },
      {
        triggerType: "pregame",
        id: uuid(),
        target: {
          tags: ["Self"],
          allies: true,
        },
        events: [
          {
            target: {
              statusEffects: ["Guard"],
              allies: true,
            },
            triggers: [
              {
                triggerType: "receiveDamage",
                id: uuid(),
                target: {
                  tags: ["Self"],
                  allies: true,
                },
                events: [
                  {
                    target: {
                      targetIds: ["CHEWBACCALEGENDARY"],
                      allies: true,
                    },
                    actions: [
                      {
                        cooldown: {
                          id: "specialskill_CHEWBACCALEGENDARY01",
                          amount: -1,
                          target: 1,
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
  },
};

export default chewy;
