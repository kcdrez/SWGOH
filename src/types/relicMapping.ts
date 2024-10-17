import { Relic, RelicConfigType } from "./relic";

const AB_FREQUENCY_IN_DAYS = 28;
const CONQUEST_FREQUENCY_IN_DAYS = 28;

//https://docs.google.com/spreadsheets/d/10ReT0Q_4yYGd_fU45Clv7XYs23a96xpWgIxLVrg9Eqg/edit#gid=769217271
const relicConfig = {
  fragmented_white: new Relic({
    id: "fragmented_white",
    location: {
      node: "Cantina 8-C",
      energy: 16,
    },
    dropRate: 1.37,
    amount: {
      1: 0,
      2: 15,
      3: 20,
      4: 20,
      5: 20,
      6: 20,
      7: 20,
      8: 20,
      9: 30,
    },
    image:
      "https://swgoh.wiki/images/0/08/Gear-Fragmented_Signal_Data.png",
    name: "Fragmented Signal Data",
    rarity: 11,
  }),
  incomplete_green: new Relic({
    id: "incomplete_green",
    location: {
      node: "Cantina 8-F",
      energy: 16,
    },
    dropRate: 0.93,
    amount: {
      1: 0,
      2: 0,
      3: 15,
      4: 25,
      5: 25,
      6: 25,
      7: 25,
      8: 25,
      9: 30,
    },
    image:
      "https://swgoh.wiki/images/2/26/Gear-Incomplete_Signal_Data.png",
    name: "Incomplete Signal Data",
    rarity: 12,
  }),
  flawed_blue: new Relic({
    id: "flawed_blue",
    location: {
      node: "Cantina 8-G",
      energy: 16,
    },
    dropRate: 0.66,
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 15,
      6: 25,
      7: 35,
      8: 45,
      9: 55,
    },
    image: "https://swgoh.wiki/images/b/b7/Gear-Flawed_Signal_Data.png",
    name: "Flawed Signal Data",
    rarity: 13,
  }),
  carbonite_circuit_board: new Relic({
    id: "carbonite_circuit_board",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 40,
      2: 30,
      3: 30,
      4: 30,
      5: 30,
      6: 20,
      7: 20,
      8: 0,
      9: 0,
    },
    image:
      "https://swgoh.wiki/images/6/6d/Gear-Carbonite_Circuit_Board.png",
    name: "Carbonite Circuit Board",
    rarity: 1,
  }),
  bronzium_wiring: new Relic({
    id: "bronzium_wiring",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 40,
      3: 40,
      4: 40,
      5: 40,
      6: 30,
      7: 30,
      8: 0,
      9: 0,
    },
    image: "https://swgoh.wiki/images/e/e0/Gear-Bronzium_Wiring.png",
    name: "Bronzium Wiring",
    rarity: 2,
  }),
  chromium_transistor: new Relic({
    id: "chromium_transistor",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 20,
      4: 40,
      5: 30,
      6: 30,
      7: 20,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/2/23/Gear-Chromium_Transistor.png",
    name: "Chromium Transistor",
    rarity: 3,
  }),
  aurodium_heatsink: new Relic({
    id: "aurodium_heatsink",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 20,
      6: 20,
      7: 20,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/5/52/Gear-Aurodium_Heatsink.png",
    name: "Aurodium Heatsink",
    rarity: 4,
  }),
  electrium_conductor: new Relic({
    id: "electrium_conductor",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 20,
      7: 20,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/7/7b/Gear-Electrium_Conductor.png",
    name: "Electrium Conductor",
    rarity: 5,
  }),
  zinbiddle_card: new Relic({
    id: "zinbiddle_card",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 10,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/2/2e/Game-Icon-Zinbiddle_Card.png",
    name: "Zinbiddle Card",
    rarity: 6,
  }),
  impulse_detector: new Relic({
    id: "impulse_detector",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/1/1a/Game-Icon-Impulse_Detector.png",
    name: "Impulse Detector",
    rarity: 7,
  }),
  aeromagnifier: new Relic({
    id: "aeromagnifier",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 20,
      9: 20,
    },
    image: "https://swgoh.wiki/images/6/6a/Game-Icon-Aeromagnifier.png",
    name: "Aeromagnifier",
    rarity: 8,
  }),
  gyrda_keypad: new Relic({
    id: "gyrda_keypad",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 20,
    },
    image: "https://swgoh.wiki/images/6/67/Game-Icon-Gyrda_Keypad.png",
    name: "Gyrda Keypad",
    rarity: 9,
  }),
  droid_brains: new Relic({
    id: "droid_brains",
    location: {
      node: "Jawa Scavenger",
    },
    amount: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 20,
    },
    image: "https://swgoh.wiki/images/0/0f/Game-Icon-Droid_Brain.png",
    name: "Droid Brains",
    rarity: 10,
  }),
} as RelicConfigType;

const acquisition = {
  fragmented_white: {
    conquest: {
      hard: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box2: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box1: 20 / CONQUEST_FREQUENCY_IN_DAYS,
      },
      normal: {
        box7: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 15 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 5 / AB_FREQUENCY_IN_DAYS,
      ct3: 5 / AB_FREQUENCY_IN_DAYS,
    },
  },
  incomplete_green: {
    conquest: {
      hard: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box2: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box1: 20 / CONQUEST_FREQUENCY_IN_DAYS,
      },
      normal: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 5 / AB_FREQUENCY_IN_DAYS,
      ct3: 5 / AB_FREQUENCY_IN_DAYS,
    },
  },
  flawed_blue: {
    conquest: {
      hard: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 10 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 5 / AB_FREQUENCY_IN_DAYS,
      ct3: 5 / AB_FREQUENCY_IN_DAYS,
    },
  },
  carbonite_circuit_board: {
    tw: ((2 / 6) * 10 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box2: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box1: 15 / CONQUEST_FREQUENCY_IN_DAYS,
      },
      normal: {
        box7: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 30 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 30 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 40 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 40 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 10 / AB_FREQUENCY_IN_DAYS,
      ct3: 10 / AB_FREQUENCY_IN_DAYS,
    },
  },
  bronzium_wiring: {
    tw: ((2 / 6) * 10 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 25 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 25 / CONQUEST_FREQUENCY_IN_DAYS,
        box2: 40 / CONQUEST_FREQUENCY_IN_DAYS,
        box1: 40 / CONQUEST_FREQUENCY_IN_DAYS,
      },
      normal: {
        box7: 40 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 40 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 40 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 10 / AB_FREQUENCY_IN_DAYS,
      ct3: 10 / AB_FREQUENCY_IN_DAYS,
    },
  },
  chromium_transistor: {
    tw: ((2 / 6) * 10 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box2: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box1: 20 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 10,
      ct3: 10,
    },
  },
  aurodium_heatsink: {
    tw: ((2 / 6) * 10 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 10 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 15 / CONQUEST_FREQUENCY_IN_DAYS,
        box4: 20 / CONQUEST_FREQUENCY_IN_DAYS,
        box3: 20 / CONQUEST_FREQUENCY_IN_DAYS,
      },
      normal: {
        box7: 20 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 5 / AB_FREQUENCY_IN_DAYS,
      ct3: 5 / AB_FREQUENCY_IN_DAYS,
    },
  },
  electrium_conductor: {
    tw: ((2 / 6) * 8 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box5: 10 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
    assaultBattles: {
      ct2: 3 / AB_FREQUENCY_IN_DAYS,
      ct3: 3 / AB_FREQUENCY_IN_DAYS,
    },
  },
  zinbiddle_card: {
    tw: ((2 / 6) * 7.5 * 4) / 30.5,
    conquest: {
      hard: {
        box7: 5 / CONQUEST_FREQUENCY_IN_DAYS,
        box6: 5 / CONQUEST_FREQUENCY_IN_DAYS,
      },
    },
  },
  aeromagnifier: {
    tw: (3 * 4) / 30.5,
    conquest: {
      box7: 10 / CONQUEST_FREQUENCY_IN_DAYS,
      box6: 5 / CONQUEST_FREQUENCY_IN_DAYS,
      box5: 2 / CONQUEST_FREQUENCY_IN_DAYS,
    },
  },
  droid_brains: {
    tw: (2 * 4) / 30.5,
  },
};

export default relicConfig;
export { relicConfig, acquisition };

const conquest = {
  box7: {
    label: "Red Crate",
  },
  box6: {
    label: "Gold Crate",
  },
  box5: {
    label: "White Crate",
  },
  box4: {
    label: "Gray Crate",
  },
  box3: {
    label: "Dark Blue Crate",
  },
  box2: {
    label: "Bronze Crate",
  },
  box1: {
    label: "Light Blue Crate",
  },
};
