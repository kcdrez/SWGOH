const AB_FREQUENCY_IN_DAYS = 28;
const CONQUEST_FREQUENCY_IN_DAYS = 28;
const GC_FREQUENCY_IN_DAYS = 3;
const GAC_FREQUENCY_IN_DAYS = 28;

/*
Formulas:
  conquest:
    (salvage per drop) * (num of boxes) * ((drops per box) * (total available drops)) / frequency
*/

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
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (10 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
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
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (10 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "112Salvage": {
      //mk3 stun cuff
      challenges: (3 * 21) / 7,
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
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (10 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
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
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2:
            (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1:
            (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (10 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "129Component": {
      //mk8 biotech implant component
      challenges: (3 * 19) / 7,
      tw: ((1 / 5) * 20 * 4) / 30.5,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "091Salvage": {
      //mk4 keypad
      challenges: (3 * 15) / 7,
    },
    "092Salvage": {
      //mk4 droid caller
      challenges: (3 * 15) / 7,
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "050Salvage": {
      //mk4 armor mod
      challenges: (3 * 27) / 7,
    },
    "129Salvage": {
      //mk8 biotech implant
      challenges: (3 * 12) / 7,
      daily: (1 / 5) * 5 + (1 / 26) * 5,
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
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "143Salvage": {
      //mk6 fusion furnace
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "114PrototypeSalvage": {
      //mk7 biotech
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "119PrototypeSalvage": {
      //mk4 carbanti
      daily: (1 / 26) * 5,
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "136Salvage": {
      //mk5 fusion furnace
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
    },
    "145Salvage": {
      //mk7 security scanner
      daily: (1 / 26) * 5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
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
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      gac: {
        rank: {
          rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "130Salvage": {
      //mk5 medpac
      daily: (1 / 26) * 5,
    },
    "130Component": {
      //mk5 medpac component
      daily: (1 / 26) * 5,
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "138Prototype": {
      //mk9 fabritech prototype
      daily: (1 / 26) * 5,
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "138Salvage": {
      //mk9 data pad
      challenges: (3 * 12) / 7,
    },
    "172Salvage": {
      //kyro shock prod
      daily: 3 / 2,
      assaultBattles: {
        ct1: 5 / AB_FREQUENCY_IN_DAYS,
      },
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 12 * 4) / 30.5,
      gac: 0,
      gc: {
        box10: (5 * 1 * (1 / 2)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 2)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "173Salvage": {
      //kyro computer
      daily: 3 / 2,
      assaultBattles: {
        ct1: 5 / AB_FREQUENCY_IN_DAYS,
      },
      tb: (15 * 2) / 30.5,
      tw: ((8 / 21) * 12 * 4) / 30.5,
      gac: 0,
      gc: {
        box10: (5 * 1 * (1 / 2)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 2)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "171PrototypeSalvage": {
      //mk12 stun gun
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "169PrototypeSalvage_V2": {
      //mk12 shield generator
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "168PrototypeSalvage_V2": {
      //mk12 stun cuff
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "166PrototypeSalvage": {
      //mk12 thermal detonator
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "171PrototypeSalvage_V2": {
      //mk12 hypo syringe
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 10 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "166PrototypeSalvage_V2": {
      //mk12 sensor array
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "167PrototypeSalvage_V2": {
      //mk12 security scanner
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "170PrototypeSalvage_V2": {
      //mk12 implant
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "168PrototypeSalvage": {
      //mk12 fusion furnace
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "174Ingredient_Salvage": {
      //injector cell
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5 / AB_FREQUENCY_IN_DAYS,
      },
      conquest: {
        hard: {
          box7: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 3)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "175Ingredient_Salvage": {
      //injector handle
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5 / AB_FREQUENCY_IN_DAYS,
      },
      conquest: {
        hard: {
          box7: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 3)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "176Ingredient_Salvage": {
      //injector head
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct1: 5 / AB_FREQUENCY_IN_DAYS,
      },
      conquest: {
        hard: {
          box7: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (25 * 2 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (25 * 1 * (1 / 3)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 3)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "169PrototypeSalvage": {
      //mk12 data pad
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "123Component": {
      //mk8 electro binoculars component
      tb: (10 * 2) / 30.5,
    },
    "170PrototypeSalvage": {
      //mk12 holo  lens
      tb: (10 * 2) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "151Salvage": {
      //mk7 hypo syringe
      tb: (10 * 2) / 30.5,
      assaultBattles: {
        ct0:
          (6 * 2) / 5 / AB_FREQUENCY_IN_DAYS / 6 +
          6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
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
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2:
            (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1:
            (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "148Salvage": {
      //mk7 design tech
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 10 * 4) / 30.5,
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "159PrototypeSalvage": {
      //mk12 armor plating
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "165PrototypeSalvage": {
      //mk12 medpac
      tb: (10 * 2) / 30.5,
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "131Salvage": {
      //mk7 shield generator
      tb: (10 * 2) / 30.5,
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "158PrototypeSalvage": {
      //mk12 multi tool
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "147Salvage": {
      //mk8 security scanner
      tw: ((8 / 21) * 10 * 4) / 30.5,
    },
    "160Prototype": {
      //mk12 bayonet
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "152Salvage": {
      //mk6 medpac
      tw: ((8 / 21) * 10 * 4) / 30.5,
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "102Salvage": {
      //mk3 holo lens
      tw: ((8 / 21) * 20 * 4) / 30.5,
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      gac: {
        rank: {
          rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "162PrototypeSalvage": {
      //mk12 visor
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "161PrototypeSalvage": {
      //mk12 tactical data
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "163PrototypeSalvage": {
      //mk12 wrist band
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "164PrototypeSalvage": {
      //mk12 cybernetics
      tw: ((8 / 21) * 8 * 4) / 30.5,
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 3 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 1 * (1 / 8)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "154Salvage": {
      //mk6 carbanti
      tw: ((8 / 21) * 10 * 4) / 30.5,
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "155Salvage": {
      //mk7 fusion furnace
      tw: ((8 / 21) * 10 * 4) / 30.5,
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "156Salvage": {
      //mk7 thermal detonator
      tw: ((8 / 21) * 10 * 4) / 30.5,
      gc: {
        box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "123Salvage": {
      //mk8 electrobinocular
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
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
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
      challenges: (3 * 15) / 7,
    },
    "139Salvage": {
      //mk4 holo projector
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gac: {
        rank: {
          rank1: (10 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank2: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank3: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank4: (7 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank5: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank6: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
          rank7: (5 * 3) / GAC_FREQUENCY_IN_DAYS,
        },
      },
    },
    "149Salvage": {
      //mk6 droid caller
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      assaultBattles: {
        ct0: 6 / 8 / AB_FREQUENCY_IN_DAYS / 6,
      },
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2:
            (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1:
            (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS +
            (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "158Salvage": {
      //mk9 electro binoculars
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "140Salvage": {
      //mk3 bacta gel
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "146Salvage": {
      //mk6 design tech
      tw: ((2 / 16) * 35 * 4) / 30.5,
      daily: (1 / 26) * 5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box8: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (5 * 3 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (5 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "160Salvage": {
      //mk11 blastech
      tw: ((2 / 16) * 35 * 4) / 30.5,
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
    },
    "103PrototypeSalvage": {
      //mk2 bacta gel
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "101Salvage": {
      //mk5 keypad
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      challenges: (3 * 21) / 7,
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
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "095Salvage": {
      //mk4 stun gun
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      conquest: {
        hard: {
          box7: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (30 * 3 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (30 * 2 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (30 * 1 * (1 / 9)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
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
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "104PrototypeSalvage": {
      //mk5 hypo syringe
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "097PrototypeSalvage": {
      //mk8 blastech weapon
      assaultBattles: {
        ct0:
          (8 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6 +
          (12 * 3) / 10 / AB_FREQUENCY_IN_DAYS / 6,
      },
      gc: {
        box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
        box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
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
      conquest: {
        normal: {
          box2: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box9: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box8: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box7: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box6: (10 * 2 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
        box5: (10 * 1 * (1 / 9)) / GC_FREQUENCY_IN_DAYS,
      },
    },
    "167PrototypeSalvage": {
      //mk12 key pad
      conquest: {
        hard: {
          box7: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box2: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box1: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
        normal: {
          box7: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box6: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box5: (15 * 3 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box4: (15 * 2 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
          box3: (15 * 1 * (1 / 12)) / CONQUEST_FREQUENCY_IN_DAYS,
        },
      },
      gc: {
        box10: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box9: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
        box8: (5 * 1 * (1 / 12)) / GC_FREQUENCY_IN_DAYS,
      },
    },
  },
  "157Salvage": {
    //mk8 design tech
    gc: {
      box10: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      box9: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      box8: (5 * 2 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
      box7: (5 * 1 * (1 / 8)) / GC_FREQUENCY_IN_DAYS,
    },
  },
  "057Salvage": {
    //mk1 medpac
    gc: {
      box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
    },
  },
  "096PrototypeSalvage": {
    //mk4 fusion furnace
    gc: {
      box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
    },
  },
  "133Component": {
    //mk10 weapon mod component
    gc: {
      box5: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box4: (5 * 3 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box3: (5 * 2 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
      box2: (5 * 1 * (1 / 13)) / GC_FREQUENCY_IN_DAYS,
    },
  },
  "053Salvage": {
    //mk3 droid caller
    challenges: (3 * 27) / 7,
  },
  "051Salvage": {
    //mk5 electro binoculars
    challenges: (3 * 15) / 7,
  },
  "050Salvage": {
    //mk4 baw armor mod
    gac: {
      rank: {
        rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
      },
    },
  },
  "062Salvage": {
    //mk5 baw armor mod
    gac: {
      rank: {
        rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
      },
    },
  },
  "080PrototypeSalvage": {
    //mk1 bacta gel
    gac: {
      rank: {
        rank1: (12 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank2: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank3: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank4: (8 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank5: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank6: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank7: (4 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank8: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
      },
    },
  },
  "034": {
    //mk1 holo projector
    gac: {
      rank: {
        rank1: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank2: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank3: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank4: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank5: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank6: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank7: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank8: (1 * 3) / GAC_FREQUENCY_IN_DAYS,
      },
    },
  },
  "024": {
    //mk2 shield generator
    gac: {
      rank: {
        rank1: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank2: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank3: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank4: (3 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank5: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank6: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank7: (2 * 3) / GAC_FREQUENCY_IN_DAYS,
        rank8: (1 * 3) / GAC_FREQUENCY_IN_DAYS,
      },
    },
  },
};
