const AB_FREQUENCY_IN_DAYS = 28;

export default {
  aquisition: {
    "108Salvage": {
      //mk3 carbanti
      challenges: (3 * 21) / 7,
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 20 * 4) / 30.5 + ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
      assaultBattles: {
        ct0:
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "117PrototypeSalvage": {
      //mk5 stun gun
      challenges: (3 * 19) / 7,
      tb: (15 * 2) / 30.5,
      tw: ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
      assaultBattles: {
        ct0:
          (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6 +
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "112Salvage": {
      //mk3 stun cuff
      challenges: (3 * 19) / 7,
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 20 * 4) / 30.5 + ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "135Salvage": {
      //mk5 droid caller
      challenges: (3 * 21) / 7,
      tw: ((2 / 16) * 35 * 4) / 30.5 + ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
      assaultBattles: {
        ct0: (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "129Component": {
      //mk8 biotech implant component
      challenges: (3 * 19) / 7,
      tw: ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
    },
    "091Salvage": {
      //mk4 keypad
      challenges: (3 * 15) / 7,
    },
    "092Salvage": {
      //mk4 droid caller
      challenges: (3 * 15) / 7,
    },
    "050Salvage": {
      //mk4 armor mod
      challenges: (3 * 27) / 7,
    },
    "129Salvage": {
      //mk8 biotech implant
      challenges: (3 * 12) / 7,
      daily: (1 / 5) * 5,
    },
    "116PrototypeSalvage": {
      //mk4 chedak
      daily: (1 / 26) * 5,
    },
    "120PrototypeSalvage": {
      //mk5 thermal detonator
      daily: (1 / 26) * 5,
      assaultBattles: {
        ct0: (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "143Salvage": {
      //mk6 fusion furnace
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "114PrototypeSalvage": {
      //mk7 biotech
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "119PrototypeSalvage": {
      //mk4 carbanti
      daily: (1 / 26) * 5,
    },
    "136Salvage": {
      //mk5 fusion furnace
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "145Salvage": {
      //mk7 security scanner
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "159Salvage": {
      //mk10 holo lens
      daily: (1 / 26) * 5,
    },
    "161Salvage": {
      //mk10 electro binoculars
      daily: (1 / 26) * 5,
    },
    "133Prototype": {
      //mk10 weapon mod
      daily: (1 / 26) * 5,
    },
    "144Salvage": {
      //mk6 thermal detonator
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "130Salvage": {
      //mk5 medpac
      daily: (1 / 26) * 5,
    },
    "130Component": {
      //mk5 medpac component
      daily: (1 / 26) * 5,
    },
    "138Prototype": {
      //mk9 fabritech
      daily: (1 / 26) * 5,
    },
    "172Salvage": {
      //kyro shock prod
      daily: 3 / 2,
      assaultBattles: {
        ct1: 5,
      },
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 12 * 4) / 30.5,
      gac: 0,
    },
    "173Salvage": {
      //kyro computer
      daily: 3 / 2,
      assaultBattles: {
        ct1: 5,
      },
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 12 * 4) / 30.5,
      gac: 0,
    },
    "171PrototypeSalvage": {
      //mk12 stun gun
      tb: (10 * 2) / 30.5,
    },
    "166PrototypeSalvage": {
      //mk12 thermal detonator
      tb: (10 * 2) / 30.5,
    },
    "171PrototypeSalvage_V2": {
      //mk12 hypo syringe
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "166PrototypeSalvage_V2": {
      //mk12 sensor array
      tb: (10 * 2) / 30.5,
    },
    "168PrototypeSalvage": {
      //mk12 fusion furnace
      tb: (10 * 2) / 30.5,
    },
    "174Ingredient_Salvage": {
      //injector cell
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5,
      },
    },
    "175Ingredient_Salvage": {
      //injector handle
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5,
      },
    },
    "176Ingredient_Salvage": {
      //injector head
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5,
      },
    },
    "169PrototypeSalvage": {
      //mk12 data pad
      tb: (10 * 2) / 30.5,
    },
    "123Component": {
      //mk8 electro binoculars component
      tb: (10 * 2) / 30.5,
    },
    "170PrototypeSalvage": {
      //mk12 holo  lens
      tb: (10 * 2) / 30.5,
    },
    "151Salvage": {
      //mk7 hypo syringe
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct0:
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "150Salvage": {
      //mk4 bacta gel
      tb: (10 * 2) / 30.5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      assaultBattles: {
        ct0: 6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "148Salvage": {
      //mk7 design tech
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "159PrototypeSalvage": {
      //mk12 armor plating
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "165PrototypeSalvage": {
      //mk12 medpac
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "131Salvage": {
      //mk7 shield generator
      tb: (10 * 2) / 30.5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
    },
    "158PrototypeSalvage": {
      //mk12 multi tool
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "147Salvage": {
      //mk8 security scanner
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "160Prototype": {
      //mk12 bayonet
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "152Salvage": {
      //mk6 medpac
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "102Salvage": {
      //mk3 holo lens
      tw: ((8 / 21) * 20 * 4) / 30.5,
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "162PrototypeSalvage": {
      //mk12 visor
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "161PrototypeSalvage": {
      //mk12 tactical data
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "163PrototypeSalvage": {
      //mk12 wrist band
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "164PrototypeSalvage": {
      //mk12 cybernetics
      tw: ((8 / 21) * 8 * 4) / 30.5,
    },
    "154Salvage": {
      //mk6 carbanti
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "155Salvage": {
      //mk7 fusion furnace
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "156Salvage": {
      //mk7 thermal detonator
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "123Salvage": {
      //mk8 electrobinocular
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
    },
    "113Salvage": {
      //mk6 hypo syringe
      tw: ((2 / 16) * 35 * 4) / 30.5,
      assaultBattles: {
        ct0:
          (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6 +
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "139Salvage": {
      //mk4 holo projector
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "149Salvage": {
      //mk6 droid caller
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      assaultBattles: {
        ct0: 6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "158Salvage": {
      //mk9 electro binoculars
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
    },
    "140Salvage": {
      //mk3 bacta gel
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "146Salvage": {
      //mk6 design tech
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "160Salvage": {
      //mk11 blastech
      tw: ((2 / 16) * 35 * 4) / 30.5,
    },
    "103PrototypeSalvage": {
      //mk2 bacta gel
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "101Salvage": {
      //mk5 keypad
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "100PrototypeSalvage": {
      //mk6 security scanner
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "106PrototypeSalvage": {
      //mk3 chedak
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "095Salvage": {
      //mk4 stun gun
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "094PrototypeSalvage": {
      //mk6 biotech
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "104PrototypeSalvage": {
      //mk5 hypo syringe
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "097PrototypeSalvage": {
      //mk8 blastech weapon
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "093PrototypeSalvage": {
      //mk4 hypo syringe
      assaultBattles: {
        ct0: (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "087PrototypeSalvage": {
      //mk5 security scanner
      assaultBattles: {
        ct0: (9 * 3) / 9 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
    "153Salvage": {
      //mk9 biotech
      assaultBattles: {
        ct0: 6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
    },
  },
};
