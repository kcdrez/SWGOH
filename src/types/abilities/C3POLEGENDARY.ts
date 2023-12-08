import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

const c3po: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3POLEGENDARY: {
    id: "basicskill_C3POLEGENDARY",
    name: "Baffling Trick",
    gameText: `C-3PO inflicts the unique debuff Confuse for 3 turns (max 3 stacks, can't be evaded or copied). If target is already Confused, duration of their stacks resets to 3 turns. Reduce target's Turn Meter by 6% and 3% more for each stack of Translation on C-3PO. (See Protocol Droid for Translation.)\n\nConfuse - Detrimental effects build based on the cumulative number of stacks:\n1: Cannot gain buffs\n2: Cannot counter, assist, or gain bonus Turn Meter (Raid bosses and Galactic Legends: -30% Counter Chance)\n3: When this character uses their Basic ability, increase their cooldowns by 1, which can't be resisted (Raid bosses and Galactic Legends: -50% Defense, doesn't stack with Defense Down)`,
    actions: [
      {
        targets: {
          filters: [
            { debuffs: ["Confuse"], stacks: 3 },
            { tags: ["!Galactic Legend"] },
          ],
        },
        effects: [
          {
            cooldown: {
              amount: 1,
              target: {},
              cantResist: true,
            },
          },
        ],
      },
      //todo: add galactic legend stacking defense removal
      {
        targets: { allies: false, targetCount: 1 },
        effects: [
          {
            reset: {
              debuffs: ["Confuse"],
              duration: 3,
            },
          },
          {
            cantMiss: true,
            debuffs: [
              {
                name: "Confuse",
                duration: 3,
                id: uuid(),
                unique: true,
                maxStacks: 3,
                isStackable: true,
              },
            ],
          },
          {
            debuffs: [
              {
                name: "TM Decrease",
                duration: -6,
                id: uuid(),
              },
            ],
          },
          {
            scalesBy: {
              buffs: ["Translation"],
              targets: { self: true },
            },
            debuffs: [
              {
                name: "TM Decrease",
                duration: -3,
                id: uuid(),
              },
            ],
          },
        ],
      },
      {
        targets: {
          allies: true,
          filters: [{ buffs: ["Translation"], stacks: 3 }],
        },
        effects: [
          {
            cooldown: {
              amount: -1,
              target: {},
            },
          },
        ],
      },
    ],
  },
  specialskill_C3POLEGENDARY01: {
    id: "specialskill_C3POLEGENDARY01",
    name: "Oh My Goodness!",
    gameText: `C-3PO gains Potency Up and Stealth for 2 turns, then he and target other ally gain Translation for 3 turns. C-3PO inflicts Confuse twice on target enemy for 3 turns, then calls all other allies with Translation to assist, dealing 50% less damage.\n\n(See Protocol Droid for a description of Translation.)`,
    actions: [
      {
        targets: { self: true },
        effects: [
          {
            buffs: [
              {
                id: uuid(),
                name: "Potency Up",
                duration: 2,
              },
              {
                id: uuid(),
                name: "Stealth",
                duration: 2,
              },
              {
                id: uuid(),
                name: "Translation",
                duration: 3,
                isStackable: true,
                maxStacks: 3,
              },
            ],
          },
        ],
      },
      {
        targets: { allies: true, targetCount: 1, self: false },
        effects: [
          {
            buffs: [
              {
                id: uuid(),
                name: "Translation",
                duration: 3,
                isStackable: true,
                maxStacks: 3,
              },
            ],
          },
        ],
      },
      {
        targets: { targetCount: 1, allies: false },
        effects: [
          {
            debuffs: [
              {
                id: uuid(),
                name: "Confuse",
                duration: 3,
                isStackable: true,
                maxStacks: 3,
              },
            ],
          },
          {
            assist: {
              chance: 1,
              targets: {
                allies: true,
                targetCount: 1,
                self: false,
                filters: [{ buffs: ["Translation"] }],
              },
              modifier: {
                stats: {
                  statToModify: "offense",
                  amount: 0.5,
                  modifiedType: "multiplicative",
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export default c3po;
