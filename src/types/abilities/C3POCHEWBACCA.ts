// import { v4 as uuid } from "uuid";

// import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

// const chewpio: Record<string, iAbility | iUniqueAbility> = {
//   basicskill_C3POCHEWBACCA: {
//     id: "basicskill_C3POCHEWBACCA",
//     name: "Frantic Shot",
//     actions: [
//       {
//         targets: { filters: [{ allies: false }], targetCount: 1 },
//         effects: [
//           {
//             damage: {
//               modifier: {
//                 value: 2,
//               },
//               damageType: "physical",
//             },
//           },
//           {
//             debuffs: [
//               {
//                 name: "Evasion Down",
//                 duration: 2,
//                 id: uuid(),
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   specialskill_C3POCHEWBACCA01: {
//     id: "specialskill_C3POCHEWBACCA01",
//     name: "Shining Distraction",
//     actions: [
//       {
//         targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//         effects: [
//           {
//             dispel: {
//               debuffs: "all",
//             },
//           },
//         ],
//       },
//       {
//         targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
//         effects: [
//           {
//             heal: {
//               amount: 0.15,
//               amountType: "multiplicative",
//               healthType: "protection",
//             },
//           },
//           {
//             buffs: [
//               {
//                 name: "Advantage",
//                 duration: 2,
//                 id: uuid(),
//               },
//             ],
//           },
//         ],
//       },
//       {
//         targets: {
//           filters: [{ allies: false }],
//         },
//         effects: [
//           {
//             cantMiss: true,
//             dispel: {
//               buffs: "all",
//             },
//           },
//           {
//             cantMiss: true,
//             debuffs: [
//               {
//                 name: "Blind",
//                 duration: 2,
//                 id: uuid(),
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   specialskill_C3POCHEWBACCA02: {
//     id: "specialskill_C3POCHEWBACCA01",
//     name: "Chewie's Rage",
//     actions: [
//       {
//         targets: { filters: [{ allies: false }] },
//         effects: [
//           {
//             damage: {
//               damageType: "physical",
//               modifier: {
//                 value: 2,
//               },
//             },
//           },
//         ],
//         repeats: {
//           count: 0,
//           limit: 0,
//           limitCounter: "deadOpponents",
//           reset: "turn",
//         },
//       },
//     ],
//     triggers: [
//       {
//         id: uuid(),
//         triggerType: "defeat",
//         actions: [
//           {
//             targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//             effects: [
//               {
//                 stats: {
//                   statToModify: "offense",
//                   amount: 0.1,
//                   modifiedType: "multiplicative",
//                   stacking: true,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   uniqueskill_C3POCHEWBACCA01: {
//     id: "uniqueskill_C3POCHEWBACCA01",
//     name: "I Must Tell The Others",
//     triggers: [
//       {
//         id: uuid(),
//         triggerType: "always",
//         targets: { filters: [{ allies: false }] },
//         actions: [
//           {
//             targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//             effects: [
//               {
//                 condition: { debuffs: ["Blind"] },
//                 stats: {
//                   modifiedType: "additive",
//                   amount: -0.4,
//                   statToModify: "tenacity",
//                 },
//               },
//               {
//                 condition: { debuffs: ["Blind"] },
//                 immune: {
//                   assists: true,
//                   counterAttack: true,
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: uuid(),
//         triggerType: "useAbility",
//         triggerData: {
//           limit: 1,
//           count: 0,
//           frequency: "turn",
//         },
//         targets: { filters: [{ allies: true }, { tags: ["Rebel & !Self"] }] },
//         actions: [
//           {
//             targets: {
//               filters: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
//             },
//             effects: [
//               {
//                 assist: {
//                   chance: 1,
//                   modifier: {
//                     stats: {
//                       statToModify: "offense",
//                       amount: 0.7,
//                       modifiedType: "multiplicative",
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: uuid(),
//         triggerType: "revive",
//         targets: { filters: [{ allies: true }, { tags: ["Rebel & !Self"] }] },
//         actions: [
//           {
//             targets: {
//               filters: [{ allies: true }, { targetIds: ["C3POCHEWBACCA"] }],
//             },
//             effects: [
//               {
//                 revive: {
//                   health: {
//                     amount: 0.5,
//                     percent: true,
//                   },
//                   protection: {
//                     amount: 0.5,
//                     percent: true,
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: uuid(),
//         triggerType: "always",
//         targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//         actions: [
//           {
//             targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//             effects: [
//               {
//                 stats: {
//                   statToModify: "maxHealth",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "maxProtection",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "offense",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "defense",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "potency",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "tenacity",
//                   amount: 0.4,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: uuid(),
//         triggerType: "always",
//         targets: { filters: [{ allies: true }, { tags: ["!Self & Rebel"] }] },
//         actions: [
//           {
//             targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//             effects: [
//               {
//                 stats: {
//                   statToModify: "maxHealth",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "maxProtection",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "offense",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "defense",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "potency",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//               {
//                 stats: {
//                   statToModify: "tenacity",
//                   amount: 0.2,
//                   modifiedType: "multiplicative",
//                 },
//                 scalesBy: {
//                   targets: {
//                     filters: [
//                       { allies: true },
//                       { tags: ["Rebel"] },
//                       { isLeader: true },
//                     ],
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       {
//         id: uuid(),
//         triggerType: "always",
//         targets: { filters: [{ allies: true }, { tags: ["Rebel"] }] },
//         actions: [
//           {
//             targets: { filters: [{ allies: true }, { tags: ["Self"] }] },
//             effects: [
//               {
//                 stats: {
//                   statToModify: "critAvoid",
//                   amount: 0.15,
//                   modifiedType: "additive",
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// };

// export default chewpio;
