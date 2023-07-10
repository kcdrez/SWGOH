import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";
import effects from "chart.js/dist/helpers/helpers.easing";

const chewy: Record<string, iAbility | iUniqueAbility> = {
  basicskill_CHEWBACCALEGENDARY: {
    id: "basicskill_CHEWBACCALEGENDARY",
    name: "Overcharged Shot",
    sort: 0,
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 1.4,
              },
            },
          },
          {
            debuffs: [
              {
                name: "Tenacity Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_CHEWBACCALEGENDARY01: {
    id: "specialskill_CHEWBACCALEGENDARY01",
    name: "Pulverize",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: false }],
        effects: [
          {
            dispel: {
              buffs: "all",
            },
          },
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 0.9,
                stats: {
                  statToModify: "defense",
                  amount: 1,
                  modifiedType: "multiplicative",
                },
              },
            },
          },
        ],
      },
      {
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
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
    ],
  },
  specialskill_CHEWBACCALEGENDARY02: {
    id: "specialskill_CHEWBACCALEGENDARY02",
    name: "Furious Bowcaster",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            cantMiss: true,
            damage: {
              modifier: {
                value: 2.4,
              },
              damageType: "physical",
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
            condition: {
              stats: {
                statToModify: "protection",
                modifiedType: "additive",
                amount: 1,
                amountType: "less",
              },
            },
            cooldown: {
              amount: 0,
              target: [{ allies: true }, { tags: ["Self"] }],
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
        targets: [
          { allies: true },
          { tags: ["!Self"] },
          { targetIds: ["!HANSOLO"] },
          { weakest: true },
          { targetCount: 1 },
        ],
        effects: [
          {
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
                targets: [{ targetIds: ["target"] }],
                triggerData: {
                  frequency: "turn",
                  count: 1,
                  limit: 1,
                },
                effects: [
                  {
                    assist: {
                      chance: 1,
                      targets: [
                        { allies: true },
                        { targetIds: ["CHEWBACCALEGENDARY"] },
                      ],
                      modifier: {
                        stats: {
                          modifiedType: "multiplicative",
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
        id: uuid(),
        triggerType: "pregame",
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "match",
        },
        targets: [{ allies: true }, { targetIds: ["HANSOLO"] }],
        effects: [
          {
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
                targets: [{ targetIds: ["target"] }],
                triggerData: {
                  frequency: "turn",
                  count: 1,
                  limit: 1,
                },
                effects: [
                  {
                    assist: {
                      chance: 1,
                      targets: [
                        { allies: true },
                        { targetIds: ["CHEWBACCALEGENDARY"] },
                      ],
                      modifier: {
                        stats: {
                          modifiedType: "multiplicative",
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            targets: [{ allies: true }, { statusEffects: ["Guard"] }],
            heal: {
              healthType: "protection",
              amount: 0.03,
              percent: true,
            },
          },
          {
            targets: [{ allies: true }, { statusEffects: ["Guard"] }],
            heal: {
              healthType: "health",
              amount: 0.03,
              percent: true,
            },
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
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
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            targets: [{ targetIds: ["target"] }],
            damage: {
              damageType: "true",
              modifier: {
                value: 1,
              },
            },
            scalesBy: {
              stat: {
                name: "maxHealth",
                percent: 0.2,
                targets: [{ targetIds: ["target"] }],
              },
            },
          },
        ],
      },
      {
        triggerType: "receiveDamage",
        id: uuid(),
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            stats: {
              statToModify: "offense",
              modifiedType: "multiplicative",
              amount: 0.25,
              expires: {
                frequency: "turn",
                count: 1,
              },
              stacking: false,
            },
          },
          {
            stats: {
              statToModify: "critChance",
              modifiedType: "multiplicative",
              amount: 0.25,
              expires: {
                frequency: "turn",
                count: 1,
              },
              stacking: false,
            },
          },
          {
            cooldown: {
              id: "specialskill_CHEWBACCALEGENDARY02",
              amount: -1,
              target: [{ allies: true }, { tags: ["Self"] }],
            },
          },
        ],
      },
      {
        triggerType: "pregame",
        id: uuid(),
        targets: [{ allies: true }, { statusEffects: ["Guard"] }],
        effects: [
          {
            triggers: [
              {
                triggerType: "receiveDamage",
                id: uuid(),
                targets: [
                  { allies: true },
                  { targetIds: ["CHEWBACCALEGENDARY"] },
                ],
                effects: [
                  {
                    cooldown: {
                      id: "specialskill_CHEWBACCALEGENDARY02",
                      amount: -1,
                      target: [
                        { allies: true },
                        { targetIds: ["CHEWBACCALEGENDARY"] },
                      ],
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
};

export default chewy;
