import { iAbility } from "types/characters";

type tCharacter = {
  [key: string]: tAbility;
};

type tAbility = {
  [key: string]: iAbility;
};

const characterMapping: tCharacter = {
  COMMANDERLUKESKYWALKER: {
    basicskill_COMMANDERLUKESKYWALKER: {
      name: "Destined Strike",
      damage: 1.781,
      cooldown: 0,
      turnsRemaining: 0,
      damageType: "physical",
      targets: [
        {
          amount: 1,
          debuffs: [
            {
              name: "Speed Down",
              duration: 1,
            },
          ],
          effects: [
            {
              condition: {
                debuffs: ["Speed Down"],
              },
              debuffs: [
                {
                  name: "TM",
                  duration: -30,
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
                },
              ],
            },
          ],
          damage: true,
        },
      ],
    },
    // specialskill_COMMANDERLUKESKYWALKER01: {
    //   name: "Use the Force",
    //   damage: 2.978,
    //   cooldown: 4,
    //   turnsRemaining: 0,
    //   damageType: "physical",
    //   targets: [
    //     {
    //       amount: 1,
    //       effects: [
    //         {
    //           dispell: {
    //             debuffs: "all",
    //           },
    //         },
    //         {
    //           debuffs: [
    //             { name: "TM", duration: -100 },
    //             { name: "Buff Immunity", duration: 2 },
    //             { name: "Tenacity Down", duration: 2 },
    //           ],
    //         },
    //         {
    //           cooldown: {
    //             id: "specialskill_COMMANDERLUKESKYWALKER01",
    //             amount: 1,
    //           },
    //           condition: {
    //             stats: {
    //               value: "health",
    //               amount: 1,
    //               type: "percent",
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
  OLDBENKENOBI: {
    basicskill_OLDBENKENOBI: {
      name: "Elegant Form",
      cooldown: 0,
      turnsRemaining: 0,
      damage: 1.758,
      damageType: "physical",
      targets: [
        {
          amount: 1,
          damage: true,
          debuffs: [
            {
              name: "Evasion Down",
              duration: 2,
            },
          ],
          cantMiss: true,
        },
        {
          amount: "self",
          buffs: [
            {
              name: "Potency Up",
              duration: 2,
            },
          ],
        },
      ],
    },
  },
};

export default characterMapping;
