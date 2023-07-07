import { v4 as uuid } from "uuid";

import { iAbility, iUniqueAbility } from "types/characters";

const chewpio: Record<string, iAbility | iUniqueAbility> = {
  basicskill_C3PO: {
    id: "basicskill_C3PO",
    name: "Baffling Trick",
    targets: [
      {
        target: { targetCount: 1, allies: false },
        actions: [
          {
            condition: {
              debuffs: ["Confuse"],
            },
            //all stacks duration set to 3
          },
          {
            debuffs: [
              {
                name: "Confuse",
                duration: 3,
                id: uuid(),
                unique: true,
                cantMiss: true,
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
              target: { tags: ["Self"], allies: true },
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
