// import { v4 as uuid } from "uuid";

// import { iAbility, iUniqueAbility } from "types/gameEngine/abilities";

// const chewpio: Record<string, iAbility | iUniqueAbility> = {
//   basicskill_C3PO: {
//     id: "basicskill_C3PO",
//     name: "Baffling Trick",
//     gameText: `C-3PO inflicts the unique debuff Confuse for 3 turns (max 3 stacks, can't be evaded or copied). If target is already Confused, duration of their stacks resets to 3 turns. Reduce target's Turn Meter by 6% and 3% more for each stack of Translation on C-3PO. (See Protocol Droid for Translation.)\n\nConfuse - Detrimental effects build based on the cumulative number of stacks:\n1: Cannot gain buffs\n2: Cannot counter, assist, or gain bonus Turn Meter (Raid bosses and Galactic Legends: -30% Counter Chance)\n3: When this character uses their Basic ability, increase their cooldowns by 1, which can't be resisted (Raid bosses and Galactic Legends: -50% Defense, doesn't stack with Defense Down)`,
//     actions: [
//       {
//         targets: { filters: [{ allies: false }], targetCount: 1 },
//         effects: [
//           {
//             condition: {
//               debuffs: ["Confuse"],
//             },
//             //all stacks duration set to 3
//           },
//           {
//             debuffs: [
//               {
//                 name: "Confuse",
//                 duration: 3,
//                 id: uuid(),
//                 unique: true,
//                 maxStacks: 3,
//               },
//             ],
//           },
//           {
//             debuffs: [
//               {
//                 name: "TM Decrease",
//                 duration: -6,
//                 id: uuid(),
//               },
//             ],
//           },
//           {
//             scalesBy: {
//               buffs: ["Translation"],
//               targets: { self: true },
//             },
//             debuffs: [
//               {
//                 name: "TM Decrease",
//                 duration: -3,
//                 id: uuid(),
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// };

// export default chewpio;
