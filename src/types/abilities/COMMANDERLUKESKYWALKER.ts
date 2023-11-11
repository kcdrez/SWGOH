import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const cls: Record<string, iAbility | iUniqueAbility> = {
  basicskill_COMMANDERLUKESKYWALKER: {
    id: "basicskill_COMMANDERLUKESKYWALKER",
    name: "Destined Strike",
    gameText:
      "Deal Physical damage to target enemy and inflict Speed Down and Defense Down for 2 turns. If the target already had Speed Down, remove 30% Turn Meter. If the target already had Defense Down, inflict Stun for 1 turn.",
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 1.781,
              },
            },
          },
          {
            condition: {
              debuffs: ["Speed Down"],
            },
            debuffs: [
              {
                name: "TM Decrease",
                duration: -30,
                id: uuid(),
              },
            ],
          },
          {
            condition: {
              debuffs: ["Defense Down"],
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
            debuffs: [
              {
                name: "Speed Down",
                duration: 2,
                id: uuid(),
              },
              {
                name: "Defense Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_COMMANDERLUKESKYWALKER02: {
    id: "specialskill_COMMANDERLUKESKYWALKER02",
    name: "Call to Action",
    gameText: `Dispel all debuffs on Luke. Luke gains 100% Turn Meter and recovers 40% Health and Protection. If Luke doesn't have Call to Action, he gains it until the next time this ability is used, which can't be copied, dispelled, or prevented. If Luke already had Call to Action, he removes it.\n\n
    Call to Action: This character ignores Taunt during their turn and has +50% Accuracy, Critical Chance, and Critical Damage`,
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        effects: [
          {
            dispel: {
              debuffs: "all",
            },
          },
          {
            buffs: [
              {
                duration: 100,
                name: "TM Increase",
                id: uuid(),
              },
            ],
          },
          {
            heal: {
              healthType: "protection",
              amount: 0.4,
              amountType: "multiplicative",
            },
          },
          {
            heal: {
              healthType: "health",
              amount: 0.4,
              amountType: "multiplicative",
            },
          },
          {
            buffs: [
              {
                duration: Infinity,
                name: "Call to Action",
                id: uuid(),
                cantPrevent: true,
                cantDispel: true,
                unique: true,
              },
            ],
            condition: {
              buffs: ["Call to Action"],
              inverted: true,
            },
          },
          {
            dispel: {
              buffs: ["Call to Action"],
            },
            condition: {
              buffs: ["Call to Action"],
              isNew: false,
            },
          },
        ],
      },
    ],
  },
  specialskill_COMMANDERLUKESKYWALKER01: {
    id: "specialskill_COMMANDERLUKESKYWALKER01",
    name: "Use the Force",
    gameText:
      "Deal Physical damage to target enemy, Dispel all buffs on them, remove 100% Turn Meter, and inflict Buff Immunity and Tenacity Down for 2 turns. Reduce the cooldown of this ability by 1 if the target didn't have full Health.",
    cooldown: 4,
    turnsRemaining: 0,
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            dispel: {
              buffs: "all",
            },
          },
          {
            debuffs: [
              { name: "TM Decrease", duration: -100, id: uuid() },
              { name: "Buff Immunity", duration: 2, id: uuid() },
              { name: "Tenacity Down", duration: 2, id: uuid() },
            ],
          },
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 2.978,
              },
            },
          },
          {
            condition: {
              stats: {
                statToModify: "health",
                amount: 1,
                modifiedType: "multiplicative",
              },
            },
            cooldown: {
              id: "specialskill_COMMANDERLUKESKYWALKER01",
              amount: -1,
              target: { filters: [{ allies: true }, { tags: ["Self"] }] },
            },
          },
        ],
      },
    ],
  },
  uniqueskill_COMMANDERLUKESKYWALKER01: {
    name: "Learn Control",
    id: "uniqueskill_COMMANDERLUKESKYWALKER01",
    gameText:
      "While Luke doesn't have Call to Action, he has +50% Counter Chance, +50% Critical Avoidance, +50% Defense, +100% Tenacity, and gains 10% Turn Meter whenever another Rebel ally takes damage.",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                condition: {
                  buffs: ["Call to Action"],
                  inverted: true,
                },
                stats: {
                  amount: 0.5,
                  statToModify: "critAvoid",
                  modifiedType: "additive",
                },
              },
              {
                condition: {
                  buffs: ["Call to Action"],
                  inverted: true,
                },
                stats: {
                  amount: 1,
                  statToModify: "tenacity",
                  modifiedType: "additive",
                },
              },
              {
                condition: {
                  buffs: ["Call to Action"],
                  inverted: true,
                },
                stats: {
                  amount: 0.5,
                  statToModify: "counterChance",
                  modifiedType: "additive",
                },
              },
              {
                condition: {
                  buffs: ["Call to Action"],
                  inverted: true,
                },
                stats: {
                  amount: 0.5,
                  statToModify: "armor",
                  modifiedType: "multiplicative",
                },
              },
              {
                condition: {
                  buffs: ["Call to Action"],
                  inverted: true,
                },
                stats: {
                  amount: 0.5,
                  statToModify: "resistance",
                  modifiedType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "receiveDamage",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Rebel & !Self"] }] },
        actions: [
          {
            targets: {
              filters: [
                { allies: true },
                { targetIds: ["COMMANDERLUKESKYWALKER"] },
              ],
            },
            effects: [
              {
                buffs: [
                  {
                    id: uuid(),
                    name: "TM Increase",
                    duration: 10,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  uniqueskill_COMMANDERLUKESKYWALKER02: {
    name: "It Binds All Things",
    id: "uniqueskill_COMMANDERLUKESKYWALKER02",
    gameText:
      "Luke has +40% Potency. Whenever Luke Resists a detrimental effect he recovers 5% Health and 5% Protection. Whenever Luke inflicts a debuff he gains 10% Turn Meter and other allies gain half that amount.",
    triggers: [
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
                  amount: 0.4,
                  statToModify: "potency",
                  modifiedType: "additive",
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "resistDetrimentalEffect",
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        id: uuid(),
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                heal: {
                  healthType: "protection",
                  amount: 0.05,
                  amountType: "multiplicative",
                },
              },
              {
                heal: {
                  healthType: "health",
                  amount: 0.05,
                  amountType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
      {
        triggerType: "inflictDebuff",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
            effects: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 10,
                    id: uuid(),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        triggerType: "inflictDebuff",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["!Self"] }] },
            effects: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 5,
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
  leaderskill_COMMANDERLUKESKYWALKER: {
    name: "Rebel Maneuvers",
    id: "leaderskill_COMMANDERLUKESKYWALKER",
    gameText:
      "Rebel allies have +50% Counter Chance, +50% Defense, and +15% Offense. Whenever an enemy Resists a detrimental effect, Rebel allies gain 5% Turn Meter.",
    triggers: [
      {
        triggerType: "always",
        id: uuid(),
        targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
        actions: [
          {
            targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
            effects: [
              {
                stats: {
                  amount: 0.5,
                  statToModify: "counterChance",
                  modifiedType: "additive",
                },
              },
              {
                stats: {
                  amount: 0.5,
                  statToModify: "armor",
                  modifiedType: "multiplicative",
                },
              },
              {
                stats: {
                  amount: 0.15,
                  statToModify: "offense",
                  modifiedType: "multiplicative",
                },
              },
            ],
          },
        ],
      },
      {
        targets: { filters: [{ allies: false }] },
        triggerType: "resistDetrimentalEffect",
        id: uuid(),
        actions: [
          {
            targets: { filters: [{ allies: false }, { tags: ["Rebel"] }] },
            effects: [
              {
                buffs: [
                  {
                    name: "TM Increase",
                    duration: 5,
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
};

export default cls;
