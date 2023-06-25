import { iAbility, iUniqueAbility } from "types/characters";
import { v4 as uuid } from "uuid";

const characterMapping: Record<
  string,
  Record<string, iAbility | iUniqueAbility>
> = {
  COMMANDERLUKESKYWALKER: {
    specialskill_COMMANDERLUKESKYWALKER02: {
      id: "specialskill_COMMANDERLUKESKYWALKER02",
      name: "Call to Action",
      cooldown: 4,
      turnsRemaining: 0,
      targets: [
        {
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              dispel: {
                debuffs: "all",
              },
              buffs: [
                {
                  duration: 100,
                  name: "TM",
                  id: uuid(),
                },
              ],
              recover: {
                healthType: "health",
                amount: 0.4,
                type: "percent",
              },
            },
            {
              recover: {
                healthType: "protection",
                amount: 0.4,
                type: "percent",
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
      cooldown: 4,
      turnsRemaining: 0,
      targets: [
        {
          target: { targetCount: 1 },
          effects: [
            {
              cooldown: {
                id: "specialskill_COMMANDERLUKESKYWALKER01",
                amount: -1,
                target: "Self",
              },
              condition: {
                stats: {
                  value: "health",
                  amount: 1,
                  type: "percent",
                  amountType: "less",
                },
              },
            },
          ],
        },
        {
          target: { targetCount: 1 },
          effects: [
            {
              dispel: {
                buffs: "all",
              },
            },
          ],
          debuffs: [
            { name: "TM", duration: -100, id: uuid() },
            // { name: "Buff Immunity", duration: 2, id: uuid() },
            { name: "Tenacity Down", duration: 2, id: uuid() },
          ],
          damage: 2.978,
          damageType: "physical",
        },
      ],
    },
    basicskill_COMMANDERLUKESKYWALKER: {
      id: "basicskill_COMMANDERLUKESKYWALKER",
      name: "Destined Strike",
      cooldown: 0,
      turnsRemaining: 0,
      targets: [
        {
          target: { targetCount: 1 },
          debuffs: [
            {
              name: "Speed Down",
              duration: 1,
              id: uuid(),
            },
            {
              name: "Defense Down",
              duration: 1,
              id: uuid(),
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
          ],
          damage: 1.781,
          damageType: "physical",
        },
      ],
    },
    uniqueskill_COMMANDERLUKESKYWALKER01: {
      name: "Learn Control",
      id: "uniqueskill_COMMANDERLUKESKYWALKER01",
      triggers: [
        {
          triggerType: "always",
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              condition: {
                buffs: ["Call to Action"],
                inverted: true,
              },
              stats: {
                amount: 0.5,
                value: "critAvoid",
                type: "flat",
              },
            },
            {
              condition: {
                buffs: ["Call to Action"],
                inverted: true,
              },
              stats: {
                amount: 100,
                value: "tenacity",
                type: "flat",
              },
            },
            {
              condition: {
                buffs: ["Call to Action"],
                inverted: true,
              },
              stats: {
                amount: 0.5,
                value: "counter",
                type: "flat",
              },
            },
            {
              condition: {
                buffs: ["Call to Action"],
                inverted: true,
              },
              stats: {
                amount: 0.5,
                value: "defense",
                type: "percent",
              },
            },
          ],
        },
        {
          triggerType: "damage",
          target: {
            tags: ["Rebel & !Self"],
            allies: true,
          },
          events: [
            {
              target: {
                targetIds: ["COMMANDERLUKESKYWALKER"],
                allies: true,
              },
              effects: [
                {
                  buffs: [
                    {
                      id: uuid(),
                      name: "TM",
                      duration: 50,
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
      triggers: [
        {
          triggerType: "always",
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              stats: {
                amount: 40,
                value: "potency",
                type: "flat",
              },
            },
          ],
        },
        {
          triggerType: "resistDetrimentalEffect",
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              recover: {
                healthType: "health",
                amount: 5,
                type: "percent",
              },
            },
            {
              recover: {
                healthType: "protection",
                amount: 5,
                type: "percent",
              },
            },
          ],
        },
        {
          triggerType: "inflictDebuff",
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              buffs: [
                {
                  name: "TM",
                  duration: 10,
                  id: uuid(),
                },
              ],
            },
          ],
        },
        {
          triggerType: "inflictDebuff",
          target: {
            tags: ["Self"],
            allies: true,
          },
          events: [
            {
              target: {
                all: true,
                allies: true,
              },
              effects: [
                {
                  buffs: [
                    {
                      name: "TM",
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
  },
  OLDBENKENOBI: {
    basicskill_OLDBENKENOBI: {
      id: "basicskill_OLDBENKENOBI",
      name: "Elegant Form",
      cooldown: 0,
      turnsRemaining: 0,
      targets: [
        {
          target: { targetCount: 1 },
          debuffs: [
            {
              name: "Evasion Down",
              duration: 2,
              id: uuid(),
            },
          ],
          damage: 1.758,
          damageType: "physical",
          cantMiss: true,
        },
        {
          target: {
            tags: ["Self"],
          },
          buffs: [
            {
              name: "Potency Up",
              duration: 2,
              id: uuid(),
            },
          ],
        },
      ],
    },
    specialskill_OLDBENKENOBI01: {
      id: "specialskill_OLDBENKENOBI01",
      name: "Mind Tricks",
      cooldown: 5,
      turnsRemaining: 0,
      targets: [
        {
          target: {
            all: true,
            allies: false,
          },
          cantMiss: true,
          debuffs: [
            {
              name: "Ability Block",
              duration: 1,
              id: uuid(),
            },
            {
              name: "Offense Down",
              duration: 2,
              id: uuid(),
            },
            {
              name: "TM",
              duration: -60,
              chance: 0.8,
              id: uuid(),
            },
          ],
        },
        {
          target: {
            tags: ["Jedi", "Rebel"],
            allies: true,
            scale: "Resisted",
          },
          buffs: [
            {
              duration: 3,
              name: "TM",
              id: uuid(),
            },
          ],
        },
      ],
    },
    specialskill_OLDBENKENOBI02: {
      id: "specialskill_OLDBENKENOBI02",
      name: "Devoted Protector",
      cooldown: 4,
      turnsRemaining: 0,
      targets: [
        {
          target: {
            tags: ["Self"],
            allies: true,
          },
          buffs: [
            {
              name: "Taunt",
              duration: 2,
              id: uuid(),
              expires: {
                target: {
                  tags: ["Self"],
                  allies: true,
                },
                buffs: [
                  {
                    name: "Taunt",
                    duration: 1,
                    id: uuid(),
                  },
                ],
              },
            },
          ],
        },
        {
          target: {
            all: true,
            allies: true,
          },
          buffs: [
            {
              name: "Defense Up",
              id: uuid(),
              duration: 2,
            },
          ],
        },
      ],
    },
    uniqueskill_OLDBENKENOBI01: {
      id: "uniqueskill_OLDBENKENOBI01",
      name: "If You Strike Me Down",
      triggers: [
        {
          triggerType: "damage",
          target: {
            tags: ["Jedi & !Self", "Rebel & !Self"],
            allies: true,
          },
          events: [
            {
              target: {
                tags: ["Self"],
                allies: true,
              },
              buffs: [
                {
                  duration: 5,
                  name: "TM",
                  id: uuid(),
                },
              ],
            },
          ],
        },
        {
          target: {
            tags: ["Self"],
            allies: true,
          },
          triggerType: "death",
          events: [
            {
              triggerCount: 1,
              target: {
                allies: true,
                all: true,
              },
              buffs: [
                {
                  duration: 2,
                  name: "Offense Up",
                  id: uuid(),
                },
                {
                  duration: 2,
                  name: "Speed Up",
                  id: uuid(),
                },
                {
                  duration: 25,
                  name: "TM",
                  id: uuid(),
                },
              ],
              effects: [
                {
                  recover: {
                    healthType: "protection",
                    amount: 0.5,
                    type: "percent",
                  },
                },
                {
                  recover: {
                    healthType: "health",
                    amount: 0.5,
                    type: "percent",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

export default characterMapping;
