import { v4 as uuid } from "uuid";

import {
  iBasicAbility,
  iUniqueAbility,
  iSpecialAbility,
} from "types/gameEngine/abilities";

const quickDrawActionId = uuid();

const hansolo: Record<
  string,
  iBasicAbility | iSpecialAbility | iUniqueAbility
> = {
  basicskill_HANSOLO: {
    id: "basicskill_HANSOLO",
    name: "Quick Draw",
    actions: [
      {
        id: quickDrawActionId,
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            damage: {
              modifier: {
                value: 1.85,
                condition: {
                  tm: {
                    amount: 50,
                    greaterThan: false,
                  },
                },
                stats: {
                  modifiedType: "multiplicative",
                  statToModify: "offense",
                  amount: 1.75,
                },
              },
              damageType: "physical",
            },
            cantMiss: true,
          },
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
  specialskill_HANSOLO01: {
    name: "Deadeye",
    id: "specialskill_HANSOLO011",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 3.699,
              },
            },
          },
          {
            debuffs: [
              {
                name: "Stun",
                duration: 1,
                id: uuid(),
              },
            ],
          },
        ],
      },
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            buffs: [
              {
                name: "TM Increase",
                duration: 100,
                id: uuid(),
              },
            ],
            scalesBy: {
              stat: {
                type: "physical",
                name: "critChance",
                percent: 1,
              },
            },
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
    actions: [
      {
        targets: { filters: [{ allies: true }] },
        effects: [
          {
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
        ],
      },
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
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
    ],
  },
  uniqueskill_HANSOLO01: {
    id: "uniqueskill_HANSOLO01",
    name: "Shoots First",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                stats: {
                  amount: 0.2,
                  statToModify: "critChance",
                  modifiedType: "additive",
                },
              },
              {
                stats: {
                  amount: 0.35,
                  statToModify: "counterChance",
                  modifiedType: "additive",
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "useAbility",
        id: uuid(),
        targets: { filters: [{ tags: ["Self"], allies: true }] },
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "turn",
        },
        actions: [
          {
            targets: { filters: [{ targetIds: ["target"] }] },
            effects: [
              {
                ability: {
                  abilityToUse: "basicskill_HANSOLO",
                  abilityTrigger: "basicskill_HANSOLO",
                  actionId: quickDrawActionId,
                  effects: [
                    {
                      stats: {
                        modifiedType: "multiplicative",
                        amount: 0.5,
                        statToModify: "offense",
                      },
                    },
                  ],
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
        actions: [
          {
            targets: {
              filters: [{ allies: false }],
              ignoreTaunt: true,
              targetCount: 1,
            },
            effects: [
              {
                ability: {
                  abilityToUse: "basicskill_HANSOLO",
                  actionId: quickDrawActionId,
                  effects: [
                    {
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
