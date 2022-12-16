/*
scavenger: [
  {
    id: "carbonite_circuit_board",
    count: 6,
    priority: 1,
    nodes: ["guild_events_store1"],
  },
],
*/

const scavengerFarming = [
  {
    id: "guild_store",
    currency: "guildStoreCurrency",
    gear: [
      {
        id: "036", //Mk 3 BioTech Implant
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "053", //Mk 3 Arakyd Droid Caller
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "060", //Mk 2 Merr-Sonn Thermal Detonator
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "044", //Mk 4 BioTech Implant
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "056", //Mk 5 BioTech Implant
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "061", //Mk 6 BlasTech Weapon Mod
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "064", //Mk 4 Nubian Security Scanner
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "049", //Mk 5 BlasTech Weapon Mod
        scavenger: [
          { id: "bronzium_wiring", amount: 20 },
          { id: "chromium_transistor", amount: 300 / 2 },
        ],
        notes:
          "Recommended to save 100-200 in reserves. Used to craft Mk 7 Fabritech Data Pad for Chromium Transistors.",
        cost: 100,
        amount: 5,
      },
      {
        id: "073", //MK 7 BlasTech Weapon Mod
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        cost: 150,
        amount: 5,
      },
      {
        id: "078", //Mk 2 Sienar Holo Projector
        scavenger: [{ id: "chromium_transistor", amount: 300 / 2 }],
        notes:
          "Used to craft Mk 8 Fabritech Data Pad for Chromium Transistors. Recommended to save 20-30 in reserves.",
        cost: 150,
        amount: 5,
      },
      {
        id: "102Salvage", //Mk 3 Sienar Holo Projector Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 500 }],
        notes:
          "Best source by far, but also used frequently in gearing characters. Recommended to save 60-100 in reserves. ALWAYS craft this piece, never scavenge the base salvage.",
        cost: 280,
        amount: 5,
      },
    ],
  },
  {
    id: "squad_arena_store",
    currency: "squadArenaCurrency",
    gear: [
      {
        id: "025", //Mk 3 BlasTech Weapon Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 100-150 in reserves.",
        cost: 180,
        amount: 10,
      },
      {
        id: "002", //Mk 1 BAW Armor Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 300-600 in reserves.",
        cost: 180,
        amount: 10,
      },
      {
        id: "035", //Mk 2 Chiewab Hypo Syringe
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 20-40 in reserves.",
        cost: 180,
        amount: 10,
      },
      // {
      //   id: "062Salvage", //Mk 5 BAW Armor Mod Salvage
      //   scavenger: [{ id: "bronzium_wiring", amount: 4 }],
      //   cost: 150,
      //   amount: 10,
      // },
      // {
      //   id: "065Salvage", //Mk 6 Loronar Power Cell Salvage
      //   scavenger: [{ id: "bronzium_wiring", amount: 4 }],
      //   cost: 150,
      //   amount: 10,
      // },
      {
        id: "049Prototype", //Mk 5 BlasTech Weapon Mod Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 12 }],
        cost: 180,
        amount: 10,
      },
      {
        id: "055Prototype", //Mk 4 Fabritech Data Pad Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 12 }],
        cost: 150,
        amount: 10,
      },
      {
        id: "097PrototypeSalvage", //Mk 8 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 6 }],
        cost: 190,
        amount: 5,
      },
      // {
      //   id: "114PrototypeSalvage", //Mk 7 BioTech Implant Prototype Salvage
      //   scavenger: [{ id: "chromium_transistor", amount: 6 }],
      //   cost: 345,
      //   amount: 5,
      // },
    ],
  },
  {
    id: "guild_events_store1",
    currency: "get1",
    gear: [
      {
        id: "043", //Mk 3 SoroSuub Keypad
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        cost: 170,
        amount: 5,
      },
      {
        id: "066", //Mk 5 Fabritech Data Pad
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        cost: 90,
        amount: 5,
      },
      {
        id: "159PrototypeSalvage", //Mk 12 ArmaTek Armor Plating Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 90-120 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "162PrototypeSalvage", //Mk 12 ArmaTek Visor Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "164PrototypeSalvage", //Mk 12 ArmaTek Cybernetics Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "163PrototypeSalvage", //Mk 12 ArmaTek Wrist Band Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "160PrototypeSalvage", //Mk 12 ArmaTek Bayonet Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 60-90 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "165PrototypeSalvage", //Mk 12 ArmaTek Medpac Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 120-150 in reserves.",
        cost: 400,
        amount: 5,
      },
      {
        id: "158PrototypeSalvage", //Mk 12 ArmaTek Multi-tool Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 120-150 in reserves.",
        cost: 400,
        amount: 5,
      },
    ],
  },
  {
    id: "guild_events_store2",
    currency: "get2",
    gear: [
      {
        id: "167PrototypeSalvage", //Mk 12 ArmaTek Key Pad Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 150-200 in reserves.",
        cost: 400,
        amount: 4,
      },
      {
        id: "170PrototypeSalvage", //Mk 12 ArmaTek Holo Lens Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 150-200 in reserves.",
        cost: 400,
        amount: 4,
      },
      {
        id: "166PrototypeSalvage", //Mk 12 ArmaTek Thermal Detonator Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 100-200 in reserves.",
        cost: 400,
        amount: 4,
      },
      {
        id: "168PrototypeSalvage", //Mk 12 ArmaTek Fusion Furnace Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 150-200 in reserves.",
        cost: 400,
        amount: 4,
      },
      {
        id: "169PrototypeSalvage", //Mk 12 ArmaTek Data Pad Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 150-250 in reserves.",
        cost: 400,
        amount: 4,
      },
      {
        id: "171PrototypeSalvage", //Mk 12 ArmaTek Stun Gun Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 50-100 in reserves.",
        cost: 400,
        amount: 4,
      },
    ],
  },
  {
    id: "guild_events_store3",
    currency: "get3",
    gear: [
      {
        //todo
      },
    ],
  },
  {
    id: "fleet_normal_3e",
    gear: [
      {
        id: "171PrototypeSalvage", //Mk 12 ArmaTek Stun Gun Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 50-100 in reserves.",
      },
      {
        id: "026", //Mk 3 BAW Armor Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 20-30 in reserves.",
      },
    ],
  },
  {
    id: "fleet_normal_2e",
    gear: [
      {
        id: "168PrototypeSalvage", //Mk 12 ArmaTek Fusion Furnace Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 150-200 in reserves.",
      },
      {
        id: "087PrototypeSalvage", //Mk 5 Nubian Security Scanner Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
      },
      {
        id: "050Salvage", //Mk 4 BAW Armor Mod Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 250-300 in reserves.",
      },
      {
        id: "030", //Mk 2 Fabritech Data Pad
        scavenger: [
          { id: "carbonite_circuit_board", amount: 6 },
          { id: "chromium_transistor", amount: 300 },
        ],
        notes:
          "Can be used for Carbonite Circuit Boards, but it's recommended to use these to craft Mk 7 BAW Armor Mod for Chromium Transistors.",
      },
    ],
  },
  {
    id: "lightside_normal_9f",
    gear: [
      {
        id: "160PrototypeSalvage", //Mk 12 ArmaTek Bayonet Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 60-90 in reserves.",
      },
      {
        id: "129Salvage", //Mk 8 BioTech Implant
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Recommended to save 1800-2000 in reserves.",
      },
      {
        id: "102Salvage", //Mk 3 Sienar Holo Projector Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 500 }],
        notes:
          "Best source by far, but also used frequently in gearing characters. ALWAYS craft this piece, never scavenge the base salvage.",
      },
      {
        id: "078PrototypeSalvage", //Mk 2 Sienar Holo Projector Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Used to craft Mk 8 Fabritech Data Pad.",
      },
      {
        id: "035", //Mk 2 Chiewab Hypo Syringe
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 100-120 in reserves.",
      },
    ],
  },
  {
    id: "fleet_normal_3a",
    gear: [
      {
        id: "167PrototypeSalvage", //Mk 12 ArmaTek Key Pad Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 150-200 in reserves.",
      },
      {
        id: "104PrototypeSalvage", //Mk 5 Chiewab Hypo Syringe Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 40-100 in reserves.",
      },
      {
        id: "075PrototypeSalvage", //Mk 6 TaggeCo Holo Lens Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-50 in reserves.",
      },
      {
        id: "069Prototype", //Mk 2 Chedak Comlink Prototype
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
    ],
  },
  {
    id: "darkside_normal_9a",
    gear: [
      {
        id: "163PrototypeSalvage", //Mk 12 ArmaTek Wrist Band Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
      },
      {
        id: "133Salvage", //Mk 10 BlasTech Weapon Mod Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Recommended to save 150-300 in reserves.",
      },
      {
        id: "071", //Mk 1 Carbanti Sensor Array
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
      {
        id: "050Salvage", //Mk 4 BAW Armor Mod Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 300-500 in reserves.",
      },
      {
        id: "037Prototype", //Mk 4 BlasTech Weapon Mod Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
      },
    ],
  },
  {
    id: "lightside_normal_9e",
    gear: [
      {
        id: "162PrototypeSalvage", //Mk 12 ArmaTek Visor Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
      },
      {
        id: "138Component", //Mk 9 Fabritech Data Pad Component
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Recommended to save 500-800 in reserves.",
      },
      {
        id: "091Salvage", //Mk 4 SoroSuub Keypad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 800-1200 in reserves.",
      },
      {
        id: "073PrototypeSalvage", //MK 7 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes:
          "Used to craft Mk 7 BlasTech Weapon Mod for Chromium Transistors.",
      },
      {
        id: "036", //Mk 3 BioTech Implant
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 100-200 in reserves.",
      },
    ],
  },
  {
    id: "darkside_normal_9c",
    gear: [
      {
        id: "164PrototypeSalvage", //Mk 12 ArmaTek Cybernetics Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 60-90 in reserves.",
      },
      {
        id: "161Salvage", //Mk 10 Neuro-Saav Electrobinoculars Salvag
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Recommended to save 300-400 in reserves.",
      },
      {
        id: "150Salvage", //Mk 4 Zaltin Bacta Gel Salvage
        notes: "Do not scrap; Save for gearing characters.",
      },
      {
        id: "097PrototypeSalvage", //Mk 8 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes:
          "Used to craft Mk 7 BlasTech Weapon Mod for Chromium Transistors.",
      },
      {
        id: "065Salvage", //Mk 6 Loronar Power Cell Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 30-60 in reserves.",
      },
      {
        id: "044Prototype", //Mk 4 BioTech Implant Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
      },
    ],
  },
  {
    id: "lightside_normal_9a",
    gear: [
      {
        id: "159PrototypeSalvage", //Mk 12 ArmaTek Armor Plating Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 90-120 in reserves.",
      },
      {
        id: "131Salvage", //Mk 7 Merr-Sonn Shield Generator Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 500 }],
        notes: "Recommended to save 300-600 in reserves.",
      },
      {
        id: "076Salvage", //Mk 6 Fabritech Data Pad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 40-50 in reserves.",
      },
      {
        id: "075PrototypeSalvage", //Mk 6 TaggeCo Holo Lens Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 20-50 in reserves.",
      },
      {
        id: "033", //Mk 2 Arakyd Droid Caller
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
    ],
  },
  {
    id: "lightside_normal_7b",
    gear: [
      {
        id: "172Salvage", //Mk 7 Kyrotech Shock Prod Prototype Salvage
        notes: "Do not scrap; Save for gearing characters.",
      },
      {
        id: "085PrototypeSalvage", //Mk 7 BAW Armor Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Used to craft Mk 7 BAW Armor Mod for Chromium Transistors.",
      },
      {
        id: "101Salvage", //Mk 5 SoroSuub Keypad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
        notes: "Recommended to save 500-800 in reserves.",
      },
      {
        id: "066", //Mk 5 Fabritech Data Pad
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
      },
    ],
  },
  {
    id: "darkside_normal_8b",
    gear: [
      {
        id: "117PrototypeSalvage", //Mk 5 A/KT Stun Gun Prototype Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 500 }],
        notes: "Recommended to save 200-300 in reserves.",
      },
      {
        id: "085PrototypeSalvage", //Mk 7 BAW Armor Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 300 }],
        notes: "Used to craft Mk 7 BAW Armor Mod for Chromium Transistors.",
      },
      {
        id: "040Prototype", //Mk 4 Loronar Power Cell Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 20 }],
      },
    ],
  },
  {
    id: "lightside_normal_1c",
    gear: [
      {
        id: "002", //Mk 1 BAW Armor Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 300-600 in reserves.",
      },
      {
        id: "001", //Mk 1 BlasTech Weapon Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
        notes: "Recommended to save 150-300 in reserves.",
      },
      {
        id: "003", //Mk 1 Neuro-Saav Electrobinoculars
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
      {
        id: "005", //Mk 1 Nubian Security Scanner
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
      {
        id: "004", //Mk 1 TaggeCo Holo Lens
        scavenger: [{ id: "carbonite_circuit_board", amount: 6 }],
      },
    ],
  },
];

const scavengerCost = {
  carbonite_circuit_board: 35,
  bronzium_wiring: 45,
  chromium_transistor: 45,
  aurodium_heatsink: 50,
  electrium_conductor: 80,
  zinbiddle_card: 90,
  impulse_detector: 110,
  gyrda_keypad: 130,
};

export { scavengerFarming, scavengerCost };
