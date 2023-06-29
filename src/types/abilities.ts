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
          actions: [
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
          target: { targetCount: 1, allies: false },
          actions: [
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
                },
              },
            },
          ],
        },
        {
          target: { targetCount: 1, allies: false },
          actions: [
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
      targets: [
        {
          target: { targetCount: 1, allies: false },
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
          actions: [
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
          actions: [
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
              actions: [
                {
                  buffs: [
                    {
                      id: uuid(),
                      name: "TM",
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
      triggers: [
        {
          triggerType: "always",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          actions: [
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
          actions: [
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
          actions: [
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
              actions: [
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
    leaderskill_COMMANDERLUKESKYWALKER: {
      name: "Rebel Maneuvers",
      id: "leaderskill_COMMANDERLUKESKYWALKER",
      triggers: [
        {
          triggerType: "always",
          id: uuid(),
          target: {
            allies: true,
            tags: ["Rebel"],
          },
          actions: [
            {
              stats: {
                amount: 0.5,
                statToModify: "counter",
                type: "flat",
              },
            },
            {
              stats: {
                amount: 0.5,
                statToModify: "defense",
                type: "percent",
              },
            },
            {
              stats: {
                amount: 0.15,
                statToModify: "offense",
                type: "percent",
              },
            },
          ],
        },
        {
          target: {
            allies: false,
          },
          triggerType: "resistDetrimentalEffect",
          id: uuid(),
          events: [
            {
              target: {
                allies: false,
                tags: ["Rebel"],
              },
              actions: [
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
      targets: [
        {
          target: { targetCount: 1, allies: false },
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
            allies: true,
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
          target: { allies: true },
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
              triggerData: {
                limit: 1,
                frequency: "match",
                count: 1,
              },
              target: {
                allies: true,
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
              actions: [
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
    leaderskill_OLDBENKENOBI: {
      id: "leaderskill_OLDBENKENOBI",
      name: "Old Jedi Knight",
      triggers: [
        {
          triggerType: "always",
          id: uuid(),
          target: {
            allies: true,
          },
          actions: [
            {
              stats: {
                type: "flat",
                statToModify: "dodge",
                amount: 0.15,
              },
            },
          ],
        },
        {
          triggerType: "dodge",
          id: uuid(),
          target: {
            allies: true,
          },
          events: [
            {
              target: {
                tags: ["Self"],
                allies: true,
              },
              actions: [
                {
                  buffs: [
                    {
                      name: "TM",
                      duration: 30,
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
  AAYLASECURA: {
    basicskill_AAYLASECURA: {
      name: "Inspiring Strike",
      id: "basicskill_AAYLASECURA",
      targets: [
        {
          target: { targetCount: 1, allies: false },
          damage: 1.645,
          damageType: "physical",
          actions: [
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
          actions: [
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
          target: { targetCount: 1, allies: false },
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
          actions: [
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
  HANSOLO: {
    basicskill_HANSOLO: {
      id: "basicskill_HANSOLO",
      name: "Quick Draw",
      targets: [
        {
          damageType: "physical",
          cantMiss: true,
          target: { targetCount: 1, allies: false },
          damage: 1.85,
          modifyDamage: {
            condition: {
              tm: {
                amount: 50,
                greaterThan: false,
              },
            },
            stats: {
              type: "percent",
              statToModify: "offense",
              amount: 1.75,
            },
          },
        },
      ],
      triggers: [
        {
          triggerType: "dealDamage",
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
              actions: [
                {
                  condition: {
                    tm: {
                      amount: 49.999999,
                      greaterThan: true,
                    },
                  },
                  debuffs: [
                    {
                      name: "TM",
                      duration: -35,
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
    specialskill_HANSOLO01: {
      name: "Deadeye",
      id: "specialskill_HANSOLO011",
      cooldown: 3,
      turnsRemaining: 0,
      targets: [
        {
          damageType: "physical",
          target: { targetCount: 1, allies: false },
          damage: 3.699,
          debuffs: [
            {
              name: "Stun",
              duration: 1,
              id: uuid(),
            },
          ],
        },
        {
          target: {
            tags: ["Self"],
            allies: true,
            scale: "physical critChance",
          },
          buffs: [
            {
              name: "TM",
              duration: 1,
              id: uuid(),
            },
          ],
        },
      ],
    },
    specialskill_HANSOLO02: {
      id: "specialskill_HANSOLO01",
      name: "Never Tell Me The Odds",
      turnsRemaining: 0,
      cooldown: 4,
      targets: [
        {
          target: {
            allies: true,
          },
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
        {
          target: {
            allies: true,
            tags: ["Self"],
          },
          buffs: [
            {
              name: "Critical Damage Up",
              duration: 2,
              id: uuid(),
            },
            {
              name: "TM",
              duration: 50,
              id: uuid(),
            },
          ],
        },
      ],
    },
    uniqueskill_HANSOLO01: {
      id: "uniqueskill_HANSOLO01",
      name: "Shoots First",
      triggers: [
        {
          triggerType: "always",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          actions: [
            {
              stats: {
                amount: 0.2,
                statToModify: "critChance",
                type: "flat",
              },
            },
            {
              stats: {
                amount: 0.35,
                statToModify: "counter",
                type: "flat",
              },
            },
          ],
        },
        {
          triggerType: "ability",
          id: uuid(),
          target: {
            tags: ["Self"],
            allies: true,
          },
          triggerData: {
            limit: 1,
            count: 1,
            frequency: "turn",
          },
          events: [
            {
              target: {
                targetIds: ["target"],
              },
              actions: [
                {
                  ability: {
                    abilityTrigger: "basicskill_HANSOLO",
                    abilityToUse: "basicskill_HANSOLO",
                  },
                  stats: {
                    type: "percent",
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
          target: {
            tags: ["Self"],
            allies: true,
          },
          events: [
            {
              target: {
                targetCount: 1,
                allies: false,
                ignoreTaunt: true,
              },
              actions: [
                {
                  ability: {
                    abilityToUse: "basicskill_HANSOLO",
                    modifiers: [
                      {
                        target: {
                          targetCount: 1,
                          allies: false,
                          ignoreTaunt: true,
                        },
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
  },
  CHEWBACCALEGENDARY: {
    basicskill_CHEWBACCALEGENDARY: {
      id: "basicskill_CHEWBACCALEGENDARY",
      name: "Overcharged Shot",
      targets: [
        {
          target: { targetCount: 1, allies: false },
          debuffs: [
            {
              name: "Tenacity Down",
              duration: 2,
              id: uuid(),
            },
          ],
          damage: 1.4,
          damageType: "physical",
        },
      ],
    },
    specialskill_CHEWBACCALEGENDARY01: {
      id: "specialskill_CHEWBACCALEGENDARY01",
      name: "Pulverize",
      cooldown: 4,
      turnsRemaining: 0,
      targets: [
        {
          target: { allies: false },
          actions: [
            {
              dispel: {
                buffs: "all",
              },
            },
          ],
        },
        {
          target: { allies: false },
          damage: 0.9,
          damageType: "physical",
          stats: {
            statToModify: "armor",
            amount: 0,
            type: "percent",
          },
        },
        {
          target: { tags: ["Self"], allies: true },
          buffs: [
            {
              name: "Offense Up",
              duration: 2,
              id: uuid(),
            },
            {
              name: "Critical Chance Up",
              duration: 2,
              id: uuid(),
            },
          ],
        },
      ],
    },
    specialskill_CHEWBACCALEGENDARY02: {
      id: "specialskill_CHEWBACCALEGENDARY01",
      name: "Furious Bowcaster",
      cooldown: 3,
      turnsRemaining: 0,
      targets: [
        {
          target: {
            targetCount: 1,
            allies: false,
          },
          cantMiss: true,
          debuffs: [
            {
              name: "Stun",
              duration: 1,
              id: uuid(),
            },
          ],
          damage: 2.4,
          damageType: "physical",
          actions: [
            {
              condition: {
                stats: {
                  statToModify: "protection",
                  type: "flat",
                  amount: 1,
                  amountType: "less",
                },
              },
              cooldown: {
                amount: -100,
                target: "Self",
                id: "specialskill_CHEWBACCALEGENDARY01",
              },
            },
          ],
        },
      ],
    },
    uniqueskill_CHEWBACCALEGENDARY01: {
      id: "uniqueskill_CHEWBACCALEGENDARY01",
      name: "Loyal Friend",
      triggers: [
        {
          id: uuid(),
          triggerType: "start",
          triggerData: {
            limit: 1,
            count: 1,
            frequency: "match",
          },
          target: {
            tags: ["Self"],
          },
          events: [
            {
              target: {
                weakest: true,
                allies: true,
                tags: ["!Self"],
              },
              blueEffects: [
                {
                  name: "Guard",
                  duration: Infinity,
                  id: uuid(),
                },
              ],
              // actions: [
              //   {
              //     ability: {
              //       abilityToUse: "basicskill_HANSOLO",
              //       modifiers: [
              //         {
              //           target: {
              //             targetCount: 1,
              //             allies: false,
              //             ignoreTaunt: true,
              //           },
              //           debuffs: [
              //             {
              //               name: "Stun",
              //               duration: 1,
              //               cantResist: true,
              //               id: uuid(),
              //             },
              //           ],
              //         },
              //       ],
              //     },
              //   },
              // ],
            },
          ],
        },
      ],
    },
  },
};

export default characterMapping;
