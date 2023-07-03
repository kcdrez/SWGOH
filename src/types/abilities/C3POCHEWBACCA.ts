import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const chewpio: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3POCHEWBACCA: {
    id: "basicskill_C3POCHEWBACCA",
    name: "Frantic Shot",
    targets: [
      {
        damageType: "physical",
        target: { targetCount: 1, allies: false },
        damage: 2,
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
  specialskill_C3POCHEWBACCA01: {
    id: "specialskill_C3POCHEWBACCA01",
    name: "Shining Distraction",
    targets: [
      {
        target: {
          tags: ["Self"],
          allies: true,
        },
        actions: [
          {
            dispel: {
              debuffs: "all",
            },
          },
        ],
      },
      {
        target: {
          tags: ["Rebel"],
          allies: true,
        },
        actions: [
          {
            heal: {
              amount: 0.15,
              type: "percent",
              healthType: "protection",
            },
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
        target: {
          allies: false,
        },
        cantMiss: true,
        actions: [
          {
            dispel: {
              debuffs: "all",
            },
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
};

export default chewpio;
