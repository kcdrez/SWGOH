import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const chewpio: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3POCHEWBACCA: {
    id: "basicskill_C3POCHEWBACCA",
    name: "Frantic Shot",
    actions: [
      {
        targets: [{ allies: false }, { targetCount: 1 }],
        effects: [
          {
            damage: {
              modifier: {
                value: 2,
              },
              damageType: "physical",
            },
          },
          {
            debuffs: [
              {
                name: "Evasion Down",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_C3POCHEWBACCA01: {
    id: "specialskill_C3POCHEWBACCA01",
    name: "Shining Distraction",
    actions: [
      {
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            dispel: {
              debuffs: "all",
            },
          },
        ],
      },
      {
        targets: [{ allies: true }, { tags: ["Rebel"] }],
        effects: [
          {
            heal: {
              amount: 0.15,
              percent: true,
              healthType: "protection",
            },
          },
          {
            buffs: [
              {
                name: "Advantage",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
      {
        targets: [
          {
            allies: false,
          },
        ],
        effects: [
          {
            cantMiss: true,
            dispel: {
              buffs: "all",
            },
          },
          {
            cantMiss: true,
            debuffs: [
              {
                name: "Blind",
                duration: 2,
                id: uuid(),
              },
            ],
          },
        ],
      },
    ],
  },
  specialskill_C3POCHEWBACCA02: {
    id: "specialskill_C3POCHEWBACCA01",
    name: "Chewie's Rage",
    actions: [
      {
        targets: [{ allies: false }],
        effects: [
          {
            damage: {
              damageType: "physical",
              modifier: {
                value: 2,
              },
            },
          },
        ],
        repeats: {
          count: 0,
          limit: 0,
          limitCounter: "deadOpponents",
          reset: "turn",
        },
      },
    ],
    triggers: [
      {
        id: uuid(),
        triggerType: "defeat",
        effects: [
          {
            targets: [{ allies: true }, { tags: ["Self"] }],
            stats: {
              statToModify: "offense",
              amount: 0.1,
              modifiedType: "multiplicative",
              stacking: true,
            },
          },
        ],
      },
    ],
  },
  uniqueskill_C3POCHEWBACCA01: {
    id: "uniqueskill_C3POCHEWBACCA01",
    name: "I Must Tell The Others",
    actions: [{}],
    triggers: [
      {
        id: uuid(),
        triggerType: "always",
        targets: [{ allies: false }],
        effects: [
          {
            condition: { debuffs: ["Blind"] },
            stats: {
              modifiedType: "additive",
              amount: -0.4,
              statToModify: "tenacity",
            },
          },
          {
            condition: { debuffs: ["Blind"] },
            immune: {
              assists: true,
              counterAttack: true,
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "useAbility",
        triggerData: {
          limit: 1,
          count: 0,
          frequency: "turn",
        },
        targets: [{ allies: true }, { tags: ["Rebel & !Self"] }],
        effects: [
          {
            targets: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
            assist: {
              chance: 1,
              modifier: {
                stats: {
                  statToModify: "offense",
                  amount: 0.7,
                  modifiedType: "multiplicative",
                },
              },
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "revive",
        targets: [{ allies: true }, { tags: ["Rebel & !Self"] }],
        effects: [
          {
            targets: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
            revive: {
              health: {
                amount: 0.5,
                percent: true,
              },
              protection: {
                amount: 0.5,
                percent: true,
              },
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "always",
        targets: [{ allies: true }, { tags: ["Self"] }],
        effects: [
          {
            stats: {
              statToModify: "maxHealth",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "maxProtection",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "offense",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "defense",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "potency",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "tenacity",
              amount: 0.4,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "always",
        targets: [{ allies: true }, { tags: ["!Self & Rebel"] }],
        effects: [
          {
            stats: {
              statToModify: "maxHealth",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "maxProtection",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "offense",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "defense",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "potency",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
          {
            stats: {
              statToModify: "tenacity",
              amount: 0.2,
              modifiedType: "multiplicative",
            },
            scalesBy: {
              targets: [
                { allies: true },
                { tags: ["Rebel"] },
                { isLeader: true },
              ],
            },
          },
        ],
      },
      {
        id: uuid(),
        triggerType: "always",
        targets: [{ allies: true }, { tags: ["Rebel"] }],
        effects: [
          {
            stats: {
              statToModify: "critAvoid",
              amount: 0.15,
              modifiedType: "additive",
            },
          },
        ],
      },
    ],
  },
};

export default chewpio;
