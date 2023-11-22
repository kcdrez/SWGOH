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
    gameText:
      "Deal Physical damage to target enemy. If the target has less than 50% Turn Meter, deal 75% more damage. Otherwise, remove 35% Turn Meter. This attack can't be Evaded.",
    actions: [
      {
        id: quickDrawActionId,
        targets: { allies: false, targetCount: 1 },
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
    gameText:
      "Deal Physical damage to target enemy and Stun them for 1 turn. Gain Turn Meter equal to Han's Critical Chance.",
    cooldown: 3,
    turnsRemaining: 0,
    actions: [
      {
        targets: { allies: false, targetCount: 1 },
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
        targets: { self: true },
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
    gameText:
      "All allies gain Critical Chance Up and Evasion Up for 2 turns. Han gains 50% Turn Meter and Critical Damage Up for 2 turns.",
    turnsRemaining: 0,
    cooldown: 4,
    actions: [
      {
        targets: { allies: true },
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
        targets: { self: true },
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
    gameText: `Han has +35% Counter Chance and +20% Critical Chance. The first time each turn Han uses his Basic attack, he attacks again dealing 50% less damage.\n\nHan takes a bonus turn at the start of each encounter. During this turn Han ignores Taunts and he can only use his Basic ability, but it will Stun the target for 1 turn and can't be Resisted.`,
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: { self: true },
        actions: [
          {
            targets: { self: true },
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
        targets: { self: true },
        triggerData: {
          limit: 1,
          count: 1,
          frequency: "turn",
        },
        actions: [
          {
            targets: {
              filters: [{ primary: true }],
            },
            effects: [
              {
                ability: {
                  abilityToUse: "basicskill_HANSOLO",
                  abilityTrigger: "basicskill_HANSOLO",
                  actionId: quickDrawActionId,
                  replaceTargets: {
                    filters: [{ primary: true }],
                  },
                },
                stats: {
                  modifiedType: "multiplicative",
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
        targets: { self: true },
        actions: [
          {
            targets: {
              allies: false,
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
