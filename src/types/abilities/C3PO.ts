import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const chewpio: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3PO: {
    id: "basicskill_C3PO",
    name: "Baffling Trick",
    actions: [
      {
        targets: { filters: [{ allies: false }], targetCount: 1 },
        effects: [
          {
            condition: {
              debuffs: ["Confuse"],
            },
            //all stacks duration set to 3
          },
          {
            cantMiss: true,
            debuffs: [
              {
                name: "Confuse",
                duration: 3,
                id: uuid(),
                unique: true,
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
              targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
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
    ],
  },
};

export default chewpio;
