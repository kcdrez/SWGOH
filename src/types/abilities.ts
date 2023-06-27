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
              heal: {
                healthType: "health",
                amount: 0.4,
                type: "percent",
              },
            },
            {
              heal: {
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
                  statToModify: "health",
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
            { name: "Buff Immunity", duration: 2, id: uuid() },
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
          id: uuid(),
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
                statToModify: "critAvoid",
                type: "flat",
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
                statToModify: "counter",
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
                statToModify: "defense",
                type: "percent",
              },
            },
          ],
        },
        {
          triggerType: "receiveDamage",
          id: uuid(),
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
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              stats: {
                amount: 0.4,
                statToModify: "potency",
                type: "flat",
              },
            },
          ],
        },
        {
          triggerType: "resistDetrimentalEffect",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              heal: {
                healthType: "health",
                amount: 0.05,
                type: "percent",
              },
            },
            {
              heal: {
                healthType: "protection",
                amount: 0.05,
                type: "percent",
              },
            },
          ],
        },
        {
          triggerType: "inflictDebuff",
          id: uuid(),
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
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          events: [
            {
              target: {
                tags: ["!Self"],
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
        //todo: add the following to an event
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
          triggerType: "receiveDamage",
          id: uuid(),
          target: {
            tags: ["Jedi & !Self", "Rebel & !Self"],
            allies: true,
          },
          events: [
            {
              target: {
                targetIds: ["OLDBENKENOBI"],
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
          id: uuid(),
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
                  heal: {
                    healthType: "protection",
                    amount: 0.5,
                    type: "percent",
                  },
                },
                {
                  heal: {
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
  AAYLASECURA: {
    basicskill_AAYLASECURA: {
      name: "Inspiring Strike",
      id: "basicskill_AAYLASECURA",
      cooldown: 0,
      turnsRemaining: 0,
      targets: [
        {
          target: { targetCount: 1 },
          damage: 1.645,
          damageType: "physical",

          effects: [
            {
              assist: {
                chance: 0.35,
                modifier: {
                  stats: {
                    amount: 0.5,
                    type: "percent",
                    statToModify: "offense",
                  },
                  condition: {
                    tags: ["Jedi"],
                  },
                },
                target: {
                  target: { allies: true, targetCount: 1, tags: ["!Self"] },
                },
              },
            },
          ],
        },
      ],
    },
    specialskill_AAYLASECURA01: {
      id: "specialskill_AAYLASECURA01",
      name: "Survivor",
      cooldown: 3,
      turnsRemaining: 0,
      triggers: [
        {
          id: uuid(),
          triggerType: "dealDamage",
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              heal: {
                type: "flat",
                healthType: "health",
              },
              scale: 0.65,
            },
          ],
        },
      ],
      targets: [
        {
          target: { targetCount: 1 },
          damage: 3.008,
          damageType: "physical",
        },
      ],
    },
    uniqueskill_AAYLASECURA01: {
      id: "uniqueskill_AAYLASECURA01",
      name: "Superior Riposte",
      triggers: [
        {
          triggerType: "criticalHit",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          events: [
            {
              target: {
                targetIds: ["target"],
              },
              debuffs: [
                {
                  duration: 1,
                  name: "Stun",
                  id: uuid(),
                },
              ],
            },
          ],
        },
        {
          triggerType: "always",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          effects: [
            {
              stats: {
                amount: 0.1,
                statToModify: "critChance",
                type: "flat",
              },
            },
            {
              stats: {
                amount: 0.65,
                statToModify: "counter",
                type: "flat",
              },
            },
            {
              stats: {
                amount: 0.5,
                statToModify: "counterDamage",
                type: "percent",
              },
            },
          ],
        },
      ],
    },
  },
};

export default characterMapping;
