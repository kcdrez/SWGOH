export default {
  aquisition: {
    "108Salvage": {
      //mk3 carbanti
      challenges: calculateChallenges(7),
      tb: calculateTB(15),
      tw: calculateTW(20, 8, 21) + calculateTW(20, 1, 5),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(6, 5, 2) + calculateAB(6, 8),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(20),
          rank2: calculateGAC(14),
          rank3: calculateGAC(14),
          rank4: calculateGAC(14),
          rank5: calculateGAC(10),
          rank6: calculateGAC(10),
          rank7: calculateGAC(10),
        },
      },
    },
    "117PrototypeSalvage": {
      //mk5 stun gun
      challenges: calculateChallenges(7),
      tb: calculateTB(15),
      tw: calculateTW(20, 1, 5),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(9, 9, 3) + calculateAB(6, 5, 2) + calculateAB(6, 8),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(20),
          rank2: calculateGAC(14),
          rank3: calculateGAC(14),
          rank4: calculateGAC(14),
          rank5: calculateGAC(10),
          rank6: calculateGAC(10),
          rank7: calculateGAC(10),
        },
      },
    },
    "112Salvage": {
      //mk3 stun cuff
      challenges: calculateChallenges(7),
      tb: calculateTB(15),
      tw: calculateTW(20, 8, 21) + calculateTW(20, 1, 5),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
      assaultBattles: {
        ct0:
          calculateAB(8, 10, 3) +
          calculateAB(9, 9, 3) +
          calculateAB(12, 10, 3) +
          calculateAB(6, 5, 2) +
          calculateAB(6, 8),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(20),
          rank2: calculateGAC(14),
          rank3: calculateGAC(14),
          rank4: calculateGAC(14),
          rank5: calculateGAC(10),
          rank6: calculateGAC(10),
          rank7: calculateGAC(10),
        },
      },
    },
    "135Salvage": {
      //mk5 droid caller
      challenges: calculateChallenges(7),
      tw: calculateTW(35, 2, 16) + calculateTW(20, 1, 5),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(9, 9, 3),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2:
            calculateConquest(30, 1, 2, 9) + calculateConquest(15, 1, 1, 12),
          box1:
            calculateConquest(30, 1, 1, 9) + calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(20),
          rank2: calculateGAC(14),
          rank3: calculateGAC(14),
          rank4: calculateGAC(14),
          rank5: calculateGAC(10),
          rank6: calculateGAC(10),
          rank7: calculateGAC(10),
        },
      },
    },
    "129Component": {
      //mk8 biotech implant component
      challenges: calculateChallenges(7),
      tw: calculateTW(20, 1, 5),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "091Salvage": {
      //mk4 keypad
      challenges: calculateChallenges(5),
    },
    "092Salvage": {
      //mk4 droid caller
      challenges: calculateChallenges(5),
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "050Salvage": {
      //mk4 armor mod
      challenges: calculateChallenges(9),
    },
    "129Salvage": {
      //mk8 biotech implant
      challenges: calculateChallenges(4),
      daily: calculateDaily(5, 5) + calculateDaily(5, 26),
    },
    "116PrototypeSalvage": {
      //mk4 chedak
      daily: calculateDaily(5, 26),
    },
    "120PrototypeSalvage": {
      //mk5 thermal detonator
      daily: calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(9, 9, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "143Salvage": {
      //mk6 fusion furnace
      daily: calculateDaily(5, 26),
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(24),
          rank2: calculateGAC(16),
          rank3: calculateGAC(16),
          rank4: calculateGAC(16),
          rank5: calculateGAC(8),
          rank6: calculateGAC(8),
          rank7: calculateGAC(8),
          rank8: calculateGAC(4),
        },
      },
    },
    "114PrototypeSalvage": {
      //mk7 biotech
      daily: calculateDaily(5, 26),
      tw: calculateTW(35, 2, 16),
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "119PrototypeSalvage": {
      //mk4 carbanti
      daily: calculateDaily(5, 26),
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
    },
    "136Salvage": {
      //mk5 fusion furnace
      daily: calculateDaily(5, 26),
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
    },
    "145Salvage": {
      //mk7 security scanner
      daily: calculateDaily(5, 26),
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "159Salvage": {
      //mk10 holo lens
      daily: calculateDaily(5, 26),
    },
    "161Salvage": {
      //mk10 electro binoculars
      daily: calculateDaily(5, 26),
    },
    "133Prototype": {
      //mk10 weapon mod
      daily: calculateDaily(5, 26),
    },
    "144Salvage": {
      //mk6 thermal detonator
      daily: calculateDaily(5, 26),
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
      gac: {
        rank: {
          rank1: calculateGAC(24),
          rank2: calculateGAC(16),
          rank3: calculateGAC(16),
          rank4: calculateGAC(16),
          rank5: calculateGAC(8),
          rank6: calculateGAC(8),
          rank7: calculateGAC(8),
          rank8: calculateGAC(4),
        },
      },
    },
    "130Salvage": {
      //mk5 medpac
      daily: calculateDaily(5, 26),
      challenges: calculateChallenges(4),
    },
    "130Component": {
      //mk5 medpac component
      daily: calculateDaily(5, 26),
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "138Prototype": {
      //mk9 fabritech prototype
      daily: calculateDaily(5, 26),
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "138Salvage": {
      //mk9 data pad
      challenges: calculateChallenges(4),
    },
    "172Salvage": {
      //kyro shock prod
      daily: calculateDaily(3, 2),
      assaultBattles: {
        ct1: calculateAB(5, 1),
      },
      tb: calculateTB(15),
      tw: calculateTW(12, 8, 21),
      gc: {
        box10: calculateGC(5, 1, 2),
        box9: calculateGC(5, 1, 2),
      },
    },
    "173Salvage": {
      //kyro computer
      daily: calculateDaily(3, 2),
      assaultBattles: {
        ct1: calculateAB(5, 1),
      },
      tb: calculateTB(15),
      tw: calculateTW(12, 8, 21),
      gc: {
        box10: calculateGC(5, 1, 2),
        box9: calculateGC(5, 1, 2),
      },
    },
    "171PrototypeSalvage": {
      //mk12 stun gun
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "169PrototypeSalvage_V2": {
      //mk12 shield generator
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "168PrototypeSalvage_V2": {
      //mk12 stun cuff
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "166PrototypeSalvage": {
      //mk12 thermal detonator
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "171PrototypeSalvage_V2": {
      //mk12 hypo syringe
      tb: calculateTB(10),
      tw: calculateTW(10, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "166PrototypeSalvage_V2": {
      //mk12 sensor array
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "167PrototypeSalvage_V2": {
      //mk12 security scanner
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "170PrototypeSalvage_V2": {
      //mk12 implant
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "168PrototypeSalvage": {
      //mk12 fusion furnace
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "174Ingredient_Salvage": {
      //injector cell
      tb: calculateTB(10),
      assaultBattles: {
        ct1: calculateAB(5, 1),
      },
      conquest: {
        hard: {
          box7: calculateConquest(25, 1, 1, 3),
          box6: calculateConquest(25, 1, 1, 3),
          box5: calculateConquest(25, 1, 1, 3),
          box4: calculateConquest(25, 1, 1, 3),
          box3: calculateConquest(25, 1, 1, 3),
          box2: calculateConquest(25, 1, 2, 3),
          box1: calculateConquest(25, 1, 2, 3),
        },
        normal: {
          box7: calculateConquest(25, 1, 2, 3),
          box6: calculateConquest(25, 1, 2, 3),
          box5: calculateConquest(25, 1, 2, 3),
          box4: calculateConquest(25, 1, 1, 3),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 3),
      },
    },
    "175Ingredient_Salvage": {
      //injector handle
      tb: calculateTB(10),
      assaultBattles: {
        ct1: calculateAB(5, 1),
      },
      conquest: {
        hard: {
          box7: calculateConquest(25, 1, 1, 3),
          box6: calculateConquest(25, 1, 1, 3),
          box5: calculateConquest(25, 1, 1, 3),
          box4: calculateConquest(25, 1, 1, 3),
          box3: calculateConquest(25, 1, 1, 3),
          box2: calculateConquest(25, 1, 2, 3),
          box1: calculateConquest(25, 1, 2, 3),
        },
        normal: {
          box7: calculateConquest(25, 1, 2, 3),
          box6: calculateConquest(25, 1, 2, 3),
          box5: calculateConquest(25, 1, 2, 3),
          box4: calculateConquest(25, 1, 1, 3),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 3),
      },
    },
    "176Ingredient_Salvage": {
      //injector head
      tb: calculateTB(10),
      assaultBattles: {
        ct1: calculateAB(5, 1),
      },
      conquest: {
        hard: {
          box7: calculateConquest(25, 1, 1, 3),
          box6: calculateConquest(25, 1, 1, 3),
          box5: calculateConquest(25, 1, 1, 3),
          box4: calculateConquest(25, 1, 1, 3),
          box3: calculateConquest(25, 1, 1, 3),
          box2: calculateConquest(25, 1, 2, 3),
          box1: calculateConquest(25, 1, 2, 3),
        },
        normal: {
          box7: calculateConquest(25, 1, 2, 3),
          box6: calculateConquest(25, 1, 2, 3),
          box5: calculateConquest(25, 1, 2, 3),
          box4: calculateConquest(25, 1, 1, 3),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 3),
      },
    },
    "169PrototypeSalvage": {
      //mk12 data pad
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "123Component": {
      //mk8 electro binoculars component
      tb: calculateTB(10),
    },
    "170PrototypeSalvage": {
      //mk12 holo  lens
      tb: calculateTB(10),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
    "151Salvage": {
      //mk7 hypo syringe
      tb: calculateTB(10),
      assaultBattles: {
        ct0: calculateAB(6, 5, 2) + calculateAB(6, 8),
      },
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "150Salvage": {
      //mk4 bacta gel
      tb: calculateTB(10),
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(6, 8),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2:
            calculateConquest(30, 1, 2, 9) + calculateConquest(15, 1, 1, 12),
          box1:
            calculateConquest(30, 1, 1, 9) + calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
    },
    "148Salvage": {
      //mk7 design tech
      tb: calculateTB(10),
      tw: calculateTW(10, 8, 21),
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "159PrototypeSalvage": {
      //mk12 armor plating
      tb: calculateTB(10),
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "165PrototypeSalvage": {
      //mk12 medpac
      tb: calculateTB(10),
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "131Salvage": {
      //mk7 shield generator
      tb: calculateTB(10),
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "158PrototypeSalvage": {
      //mk12 multi tool
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "147Salvage": {
      //mk8 security scanner
      tw: calculateTW(10, 8, 21),
    },
    "160PrototypeSalvage": {
      //mk12 bayonet
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "152Salvage": {
      //mk6 medpac
      tw: calculateTW(10, 8, 21),
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "102Salvage": {
      //mk3 holo lens
      tw: calculateTW(20, 8, 21),
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      gac: {
        rank: {
          rank1: calculateGAC(24),
          rank2: calculateGAC(16),
          rank3: calculateGAC(16),
          rank4: calculateGAC(16),
          rank5: calculateGAC(8),
          rank6: calculateGAC(8),
          rank7: calculateGAC(8),
          rank8: calculateGAC(4),
        },
      },
    },
    "162PrototypeSalvage": {
      //mk12 visor
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "161PrototypeSalvage": {
      //mk12 tactical data
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "163PrototypeSalvage": {
      //mk12 wrist band
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "164PrototypeSalvage": {
      //mk12 cybernetics
      tw: calculateTW(8, 8, 21),
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 8),
          box6: calculateConquest(15, 1, 1, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 2, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 2, 8),
          box1: calculateConquest(15, 1, 2, 8),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 8),
          box6: calculateConquest(15, 1, 2, 8),
          box5: calculateConquest(15, 1, 2, 8),
          box4: calculateConquest(15, 1, 3, 8),
          box3: calculateConquest(15, 1, 2, 8),
          box2: calculateConquest(15, 1, 1, 8),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 8),
        box9: calculateGC(5, 1, 8),
        box8: calculateGC(5, 1, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "154Salvage": {
      //mk6 carbanti
      tw: calculateTW(10, 8, 21),
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "155Salvage": {
      //mk7 fusion furnace
      tw: calculateTW(10, 8, 21),
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "156Salvage": {
      //mk7 thermal detonator
      tw: calculateTW(10, 8, 21),
      gc: {
        box10: calculateGC(5, 2, 8),
        box9: calculateGC(5, 2, 8),
        box8: calculateGC(5, 2, 8),
        box7: calculateGC(5, 1, 8),
      },
    },
    "123Salvage": {
      //mk8 electrobinocular
      challenges: calculateChallenges(5),
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "113Salvage": {
      //mk6 hypo syringe
      tw: calculateTW(35, 2, 16),
      assaultBattles: {
        ct0: calculateAB(9, 9, 3) + calculateAB(6, 5, 2) + calculateAB(6, 8),
      },
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
      challenges: calculateChallenges(5),
    },
    "139Salvage": {
      //mk4 holo projector
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gac: {
        rank: {
          rank1: calculateGAC(20),
          rank2: calculateGAC(14),
          rank3: calculateGAC(14),
          rank4: calculateGAC(14),
          rank5: calculateGAC(10),
          rank6: calculateGAC(10),
          rank7: calculateGAC(10),
        },
      },
    },
    "149Salvage": {
      //mk6 droid caller
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      assaultBattles: {
        ct0: calculateAB(6, 8),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2:
            calculateConquest(30, 1, 2, 9) + calculateConquest(15, 1, 1, 12),
          box1:
            calculateConquest(30, 1, 1, 9) + calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
    },
    "158Salvage": {
      //mk9 electro binoculars
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "140Salvage": {
      //mk3 bacta gel
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "146Salvage": {
      //mk6 design tech
      tw: calculateTW(35, 2, 16),
      daily: calculateDaily(5, 26),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box8: calculateGC(5, 1, 9),
        box7: calculateGC(5, 2, 9),
        box6: calculateGC(5, 3, 9),
        box5: calculateGC(5, 2, 9),
        box4: calculateGC(5, 1, 9),
      },
    },
    "160Salvage": {
      //mk11 blastech
      tw: calculateTW(35, 2, 16),
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
    },
    "103PrototypeSalvage": {
      //mk2 bacta gel
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "101Salvage": {
      //mk5 keypad
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      challenges: calculateChallenges(7),
    },
    "100PrototypeSalvage": {
      //mk6 security scanner
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
    },
    "106PrototypeSalvage": {
      //mk3 chedak
      assaultBattles: {
        ct0:
          calculateAB(8, 10, 3) + calculateAB(9, 9, 3) + calculateAB(12, 10, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "095Salvage": {
      //mk4 stun gun
      challenges: calculateChallenges(7),
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      conquest: {
        hard: {
          box7: calculateConquest(30, 1, 1, 9),
          box6: calculateConquest(30, 1, 1, 9),
          box5: calculateConquest(30, 1, 1, 9),
          box4: calculateConquest(30, 1, 1, 9),
          box3: calculateConquest(30, 1, 1, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 2, 9),
        },
        normal: {
          box7: calculateConquest(30, 1, 2, 9),
          box6: calculateConquest(30, 1, 2, 9),
          box5: calculateConquest(30, 1, 2, 9),
          box4: calculateConquest(30, 1, 3, 9),
          box3: calculateConquest(30, 1, 3, 9),
          box2: calculateConquest(30, 1, 2, 9),
          box1: calculateConquest(30, 1, 1, 9),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
    },
    "094PrototypeSalvage": {
      //mk6 biotech
      assaultBattles: {
        ct0:
          calculateAB(8, 10, 3) + calculateAB(9, 9, 3) + calculateAB(12, 10, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "104PrototypeSalvage": {
      //mk5 hypo syringe
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "097PrototypeSalvage": {
      //mk8 blastech weapon
      assaultBattles: {
        ct0: calculateAB(8, 10, 3) + calculateAB(12, 10, 3),
      },
      gc: {
        box5: calculateGC(5, 2, 13),
        box4: calculateGC(5, 3, 13),
        box3: calculateGC(5, 2, 13),
        box2: calculateGC(5, 1, 13),
      },
    },
    "093PrototypeSalvage": {
      //mk4 hypo syringe
      assaultBattles: {
        ct0: calculateAB(9, 9, 3),
      },
    },
    "087PrototypeSalvage": {
      //mk5 security scanner
      assaultBattles: {
        ct0: calculateAB(9, 9, 3),
      },
    },
    "153Salvage": {
      //mk9 biotech
      assaultBattles: {
        ct0: calculateAB(6, 8),
      },
      conquest: {
        normal: {
          box2: calculateConquest(15, 1, 1, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
      },
      gc: {
        box10: calculateGC(10, 2, 9),
        box9: calculateGC(10, 2, 9),
        box8: calculateGC(10, 2, 9),
        box7: calculateGC(10, 2, 9),
        box6: calculateGC(10, 2, 9),
        box5: calculateGC(10, 1, 9),
      },
    },
    "167PrototypeSalvage": {
      //mk12 key pad
      conquest: {
        hard: {
          box7: calculateConquest(15, 1, 1, 12),
          box6: calculateConquest(15, 1, 1, 12),
          box5: calculateConquest(15, 1, 2, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 2, 12),
          box2: calculateConquest(15, 1, 2, 12),
          box1: calculateConquest(15, 1, 2, 12),
        },
        normal: {
          box7: calculateConquest(15, 1, 2, 12),
          box6: calculateConquest(15, 1, 3, 12),
          box5: calculateConquest(15, 1, 3, 12),
          box4: calculateConquest(15, 1, 2, 12),
          box3: calculateConquest(15, 1, 1, 12),
        },
      },
      gc: {
        box10: calculateGC(5, 1, 12),
        box9: calculateGC(5, 1, 12),
        box8: calculateGC(5, 1, 12),
      },
    },
  },
  "157Salvage": {
    //mk8 design tech
    gc: {
      box10: calculateGC(5, 2, 8),
      box9: calculateGC(5, 2, 8),
      box8: calculateGC(5, 2, 8),
      box7: calculateGC(5, 1, 8),
    },
  },
  "057Salvage": {
    //mk1 medpac
    challenges: calculateChallenges(5),
    gc: {
      box5: calculateGC(5, 2, 13),
      box4: calculateGC(5, 3, 13),
      box3: calculateGC(5, 2, 13),
      box2: calculateGC(5, 1, 13),
    },
  },
  "096PrototypeSalvage": {
    //mk4 fusion furnace
    gc: {
      box5: calculateGC(5, 2, 13),
      box4: calculateGC(5, 3, 13),
      box3: calculateGC(5, 2, 13),
      box2: calculateGC(5, 1, 13),
    },
  },
  "133Component": {
    //mk10 weapon mod component
    gc: {
      box5: calculateGC(5, 2, 13),
      box4: calculateGC(5, 3, 13),
      box3: calculateGC(5, 2, 13),
      box2: calculateGC(5, 1, 13),
    },
  },
  "053Salvage": {
    //mk3 droid caller
    challenges: calculateChallenges(9),
  },
  "051Salvage": {
    //mk5 electro binoculars
    challenges: calculateChallenges(5),
  },
  "050Salvage": {
    //mk4 baw armor mod
    gac: {
      rank: {
        rank1: calculateGAC(24),
        rank2: calculateGAC(16),
        rank3: calculateGAC(16),
        rank4: calculateGAC(16),
        rank5: calculateGAC(8),
        rank6: calculateGAC(8),
        rank7: calculateGAC(8),
        rank8: calculateGAC(4),
      },
    },
  },
  "062Salvage": {
    //mk5 baw armor mod
    gac: {
      rank: {
        rank1: calculateGAC(24),
        rank2: calculateGAC(16),
        rank3: calculateGAC(16),
        rank4: calculateGAC(16),
        rank5: calculateGAC(8),
        rank6: calculateGAC(8),
        rank7: calculateGAC(8),
        rank8: calculateGAC(4),
      },
    },
  },
  "080PrototypeSalvage": {
    //mk1 bacta gel
    gac: {
      rank: {
        rank1: calculateGAC(24),
        rank2: calculateGAC(16),
        rank3: calculateGAC(16),
        rank4: calculateGAC(16),
        rank5: calculateGAC(8),
        rank6: calculateGAC(8),
        rank7: calculateGAC(8),
        rank8: calculateGAC(4),
      },
    },
  },
  "034": {
    //mk1 holo projector
    gac: {
      rank: {
        rank1: calculateGAC(6),
        rank2: calculateGAC(6),
        rank3: calculateGAC(6),
        rank4: calculateGAC(6),
        rank5: calculateGAC(4),
        rank6: calculateGAC(4),
        rank7: calculateGAC(4),
        rank8: calculateGAC(2),
      },
    },
  },
  "024": {
    //mk2 shield generator
    gac: {
      rank: {
        rank1: calculateGAC(6),
        rank2: calculateGAC(6),
        rank3: calculateGAC(6),
        rank4: calculateGAC(6),
        rank5: calculateGAC(4),
        rank6: calculateGAC(4),
        rank7: calculateGAC(4),
        rank8: calculateGAC(2),
      },
    },
  },
  "054Salvage": {
    //mk5 power cell
    challenges: calculateChallenges(9),
  },
};

function calculateGAC(baseValue: number): number {
  //baseValue = the amount of pieces dropped
  //3 = how many payouts (once a week for three weeks)
  //28 = how many days the payout lasts before repeating
  return (baseValue * 3) / 28;
}

function calculateChallenges(baseValue: number): number {
  //baseValue = the amount of pieces dropped
  //3 * 3 = number of runs per event * number of events per week
  //7 = how many days for each full cycle
  return (baseValue * 3 * 3) / 7;
}

function calculateGC(
  baseValue: number,
  numBoxes: number,
  totalOptions: number
): number {
  //baseValue = the amount of pieces dropped
  //numBoxes = how many boxes recieved
  //totalOptions = how many total options are available in this box
  //3 = frequency of the event
  return (baseValue * numBoxes * (1 / totalOptions)) / 3;
}

function calculateTB(baseValue: number): number {
  //baseValue = the amount of pieces dropped
  //28 = how many days of the frequency of the event
  return baseValue / 14;
}

function calculateTW(
  baseValue: number,
  piecesPerBox: number,
  totalOptions: number
): number {
  //baseValue = the amount of pieces dropped
  //piecesPerBox = number of pieces granted in a box
  //totalOptions = how many total options are available in this box
  //2 = number of TW in a cycle
  //14 = number of days in a full cycle before repeating
  return ((piecesPerBox / totalOptions) * baseValue * 2) / 14;
}

function calculateAB(
  baseValue: number,
  totalOptions: number,
  numOfMatches: number = 1
): number {
  //baseValue = number of items dropped
  //totalOptions = how many total options are available in this box
  //numOfMatches = how many different options drop this gear
  //28 = average frequency of a single AB
  //6 = total number of different types of AB
  return (baseValue * numOfMatches) / totalOptions / 28 / 6;
}

function calculateDaily(
  baseValue: number,
  totalOptions: number,
  piecesPerBox: number = 1
): number {
  //baseValue = number of items dropped
  //totalOptions = how many total options are available in this box
  //piecesPerBox = number of pieces granted in a box
  return (piecesPerBox / totalOptions) * baseValue;
}

function calculateConquest(
  baseValue: number,
  totalOptions: number,
  numBoxes: number,
  piecesPerBox: number = 1
): number {
  //baseValue = number of items dropped
  //totalOptions = how many total options are available in this box
  //piecesPerBox = number of pieces granted in a box
  //numBoxes = number of boxes granted
  //28 = number of days between each event
  return (baseValue * numBoxes * (piecesPerBox / totalOptions)) / 28;
}
