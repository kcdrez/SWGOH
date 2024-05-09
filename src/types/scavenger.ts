const scavengerFarming: IScavenger[] = [
  {
    id: "guild_store",
    currency: "guildStoreCurrency",
    gear: [
      {
        id: "036", //Mk 3 BioTech Implant
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "053", //Mk 3 Arakyd Droid Caller
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "060", //Mk 2 Merr-Sonn Thermal Detonator
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "044", //Mk 4 BioTech Implant
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "056", //Mk 5 BioTech Implant
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "061", //Mk 6 BlasTech Weapon Mod
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "064", //Mk 4 Nubian Security Scanner
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-30 in reserves.",
        cost: 100,
        amount: 5,
      },
      {
        id: "049", //Mk 5 BlasTech Weapon Mod
        scavenger: [
          { id: "bronzium_wiring", amount: 10 },
          { id: "chromium_transistor", amount: 150 / 2 },
        ],
        notes:
          "Recommended to save 100-200 in reserves. Used to craft Mk 7 Fabritech Data Pad for Chromium Transistors.",
        cost: 100,
        amount: 5,
      },
      {
        id: "073", //MK 7 BlasTech Weapon Mod
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        cost: 150,
        amount: 5,
      },
      {
        id: "078", //Mk 2 Sienar Holo Projector
        scavenger: [{ id: "chromium_transistor", amount: 150 / 2 }],
        notes:
          "Used to craft Mk 8 Fabritech Data Pad for Chromium Transistors. Recommended to save 20-30 in reserves.",
        cost: 150,
        amount: 5,
      },
      {
        id: "102Salvage", //Mk 3 Sienar Holo Projector Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 250 / 20 }],
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
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 100-150 in reserves.",
        cost: 180,
        amount: 10,
      },
      {
        id: "002", //Mk 1 BAW Armor Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 300-600 in reserves.",
        cost: 180,
        amount: 10,
      },
      {
        id: "035", //Mk 2 Chiewab Hypo Syringe
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 20-40 in reserves.",
        cost: 180,
        amount: 10,
      },
      // {
      //   id: "062Salvage", //Mk 5 BAW Armor Mod Salvage
      //   scavenger: [{ id: "bronzium_wiring", amount: 2 }],
      //   cost: 150,
      //   amount: 10,
      // },
      // {
      //   id: "065Salvage", //Mk 6 Loronar Power Cell Salvage
      //   scavenger: [{ id: "bronzium_wiring", amount: 2 }],
      //   cost: 150,
      //   amount: 10,
      // },
      {
        id: "049Prototype", //Mk 5 BlasTech Weapon Mod Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 6 }],
        cost: 180,
        amount: 10,
      },
      {
        id: "055Prototype", //Mk 4 Fabritech Data Pad Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 6 }],
        cost: 150,
        amount: 10,
      },
      {
        id: "097PrototypeSalvage", //Mk 8 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 190,
        amount: 5,
      },
      // {
      //   id: "114PrototypeSalvage", //Mk 7 BioTech Implant Prototype Salvage
      //   scavenger: [{ id: "chromium_transistor", amount: 3 }],
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
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        cost: 170,
        amount: 5,
      },
      {
        id: "066", //Mk 5 Fabritech Data Pad
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
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
      {
        id: "176Ingredient_Salvage", //Injector Head Salvage
        cost: 920,
        amount: 8,
      },
    ],
  },
  {
    id: "guild_events_store3",
    currency: "get3",
    gear: [
      {
        id: "172Salvage", //Mk 7 Kyrotech Shock Prod Prototype Salvage
        cost: 300,
        amount: 5,
      },
      {
        id: "173Salvage", //Mk 9 Kyrotech Battle Computer Prototype Salvage
        cost: 300,
        amount: 5,
      },
    ],
  },
  {
    id: "raid_store1",
    currency: "raid1",
    gear: [
      {
        id: "117PrototypeSalvage", //Mk 5 A/KT Stun Gun Prototype Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 5 }],
        notes: "Recommended to save 200-300 in reserves.",
        cost: 200,
        amount: 10,
      },
      {
        id: "135Salvage", //Mk 5 Arakyd Droid Caller Salvage
        scavenger: [
          { id: "bronzium_wiring", amount: 2 },
          { id: "aurodium_heatsink", amount: 5 },
        ],
        cost: 220,
        amount: 10,
      },
      {
        id: "130Component", //Mk 5 Athakam Medpac Component
        scavenger: [{ id: "aurodium_heatsink", amount: 5 }],
        cost: 220,
        amount: 10,
      },
      {
        id: "133Salvage", //Mk 10 BlasTech Weapon Mod Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        notes: "Recommended to save 150-300 in reserves.",
        cost: 360,
        amount: 10,
      },
      {
        id: "085PrototypeSalvage", //Mk 7 BAW Armor Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes:
          "Recommended to craft 5x with Mk 1 Czerka Stun Cuffs x2 and Mk 2 Fabritech Data Pad x1 rather than scavenge by itself.",
        cost: 220,
        amount: 10,
      },
      {
        id: "116PrototypeSalvage", //Mk 4 Chedak Comlink Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 160,
        amount: 10,
      },
      {
        id: "136Salvage", //Mk 5 CEC Fusion Furnace Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 160,
        amount: 10,
      },
      {
        id: "160Salvage", //Mk 11 BlasTech Weapon Mod Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 / 50 }],
        notes: "Used to craft Mk 11 BlasTech Weapon Mod",
        cost: 160,
        amount: 10,
      },
      {
        id: "123Salvage", //MK 8 Neuro-Saav Electrobinoculars Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 150,
        amount: 10,
      },
      {
        id: "144Salvage", //Mk 6 Merr-Sonn Thermal Detonator Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 160,
        amount: 10,
      },
      {
        id: "140Salvage", //Mk 3 Zaltin Bacta Gel Salvage
        scavenger: [{ id: "carbonite_circuit_board", amount: 1 }],
        cost: 160,
        amount: 10,
      },
      {
        id: "145Salvage", //Mk 7 Nubian Security Scanner Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 160,
        amount: 10,
      },
      {
        id: "129Salvage", //Mk 8 BioTech Implant Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 / 50 }],
        notes: "Recommended to save 1800-2000 in reserves.",
        cost: 770,
        amount: 35,
      },
      {
        id: "150Salvage", //Mk 4 Zaltin Bacta Gel Salvage
        notes: "Do not scrap; Save for gearing characters.",
        cost: 1295,
        amount: 35,
      },
      {
        id: "161Salvage", //Mk 10 Neuro-Saav Electrobinoculars Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes: "Recommended to save 300-400 in reserves.",
        cost: 1440,
        amount: 40,
      },
      {
        id: "138Component", //Mk 9 Fabritech Data Pad Component
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes: "Recommended to save 500-800 in reserves.",
        cost: 880,
        amount: 40,
      },
      {
        id: "159Salvage", //Mk 10 TaggeCo Holo Lens Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 1440,
        amount: 40,
      },
      {
        id: "102Salvage", //Mk 3 Sienar Holo Projector Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 250 / 20 }],
        notes:
          "Best source by far, but also used frequently in gearing characters. Recommended to save 60-100 in reserves. ALWAYS craft this piece, never scavenge the base salvage.",
        cost: 520,
        amount: 40,
      },
      {
        id: "113Salvage", //Mk 6 Chiewab Hypo Syringe Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 / 50 }],
        cost: 800,
        amount: 50,
      },
      {
        id: "146Salvage", //Mk 6 Nubian Design Tech Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 800,
        amount: 50,
      },
      {
        id: "123Component", //MK 8 Neuro-Saav Electrobinoculars Component
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 750,
        amount: 50,
      },
      {
        id: "129Component", //Mk 8 BioTech Implant Component
        scavenger: [
          { id: "chromium_transistor", amount: 3 },
          { id: "aurodium_heatsink", amount: 5 },
        ],
        cost: 910,
        amount: 70,
      },
      {
        id: "131Salvage", //Mk 7 Merr-Sonn Shield Generator Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 250 }],
        notes: "Recommended to save 300-600 in reserves.",
        cost: 1050,
        amount: 70,
      },
      {
        id: "158Salvage", //Mk 9 Neuro-Saav Electrobinoculars Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 1050,
        amount: 70,
      },
      {
        id: "108Salvage", //Mk 3 Carbanti Sensor Array Salvage
        scavenger: [
          { id: "carbonite_circuit_board", amount: 1 },
          { id: "aurodium_heatsink", amount: 5 },
        ],
        cost: 2750,
        amount: 125,
      },
      {
        id: "153Salvage", //Mk 9 BioTech Implant Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 2750,
        amount: 125,
      },
      {
        id: "139Salvage", //Mk 4 Sienar Holo Projector Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 2750,
        amount: 125,
      },
      {
        id: "114PrototypeSalvage", //Mk 7 BioTech Implant Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        cost: 1875,
        amount: 125,
      },
      {
        id: "073PrototypeSalvage", //MK 7 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 / 5 }],
        notes:
          "Recommended to craft 5 of these with 5x Mk 5 Loronar Power Cell Salvage, 1x Mk 1 Arakyd Droid Caller, and Mk 3 BlasTech Weapon Mod rather than scavenge by itself.",
        cost: 220,
        amount: 10,
      },
      {
        id: "149Salvage", //Mk 6 Arakyd Droid Caller Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 1295,
        amount: 35,
      },
      {
        id: "119PrototypeSalvage", //Mk 4 Carbanti Sensor Array Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 1190,
        amount: 35,
      },
      {
        id: "143Salvage", //Mk 6 CEC Fusion Furnace Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 2 }],
        cost: 800,
        amount: 50,
      },
    ],
  },
  {
    id: "raid_store2",
    currency: "raid2",
    gear: [
      {
        id: "169PrototypeSalvage", //Mk 12 ArmaTek Data Pad Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        notes: "Recommended to save 150-250 in reserves.",
        cost: 1005,
        amount: 15,
      },
      {
        id: "166PrototypeSalvage_V2", //Mk 12 Czerka Sensor Array Prototype Salvage
        scavenger: [],
        cost: 855,
        amount: 15,
      },
      {
        id: "159PrototypeSalvage", //Mk 12 ArmaTek Armor Plating Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes: "Recommended to save 90-120 in reserves.",
        cost: 1275,
        amount: 15,
      },
      {
        id: "155Salvage", //Mk 6 Carbanti Sensor Array Salvage
        scavenger: [{ id: "electrium_conductor", amount: 1050 / 40 }],
        notes:
          "Required to use 40x with 30x Mk 12 Armatek Wrist Band Prototype to craft Mk 12 Armatek Wrist Band",
        cost: 1425,
        amount: 15,
      },
      {
        id: "151Salvage", //Mk 7 Chiewab Hypo Syringe Salvage
        scavenger: [],
        cost: 1425,
        amount: 15,
      },
      {
        id: "148Salvage", //Mk 7 Nubian Design Tech Salvage
        scavenger: [{ id: "electrium_conductor", amount: 1050 / 40 }],
        notes:
          "Required to use 40x with 30x Mk 12 Armatek Armor Plating Prototype to craft Mk 12 Armatek Armor Plating",
        cost: 1425,
        amount: 15,
      },
      {
        id: "163PrototypeSalvage", //Mk 12 ArmaTek Wrist Band Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes:
          "Recommended to save 60-90 in reserves. Recommended to craft 30x salvage into Mk 12 Armatek Wrist Band with Mk 6 Carbanti Sensor Array Salvage to get a better conversion ratio",
        cost: 425,
        amount: 5,
      },
      {
        id: "165PrototypeSalvage", //Mk 12 ArmaTek Medpac Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 120-150 in reserves.",
        cost: 425,
        amount: 5,
      },
      {
        id: "156Salvage", //Mk 7 Merr-Sonn Thermal Detonator Salvage
        scavenger: [{ id: "electrium_conductor", amount: 1050 / 40 }],
        notes:
          "Required to use 40x with 30x Mk 12 Armatek Cybernetics Prototype to craft Mk 12 Armatek Cybernetics",
        cost: 1425,
        amount: 15,
      },
      {
        id: "164PrototypeSalvage", //Mk 12 ArmaTek Cybernetics Prototype Salvage
        scavenger: [{ id: "electrium_conductor", amount: 15 }],
        notes:
          "Recommended to save 60-90 in reserves. Recommended to craft 30x salvage into Mk 12 Armatek Cybernetics with Mk 7 Merr-Sonn Thermal Detonator Salvage to get a better conversion ratio",
        cost: 425,
        amount: 5,
      },
      {
        id: "168PrototypeSalvage_V2", //Mk 12 Czerka Stun Cuffs Prototype Salvage
        scavenger: [],
        cost: 285,
        amount: 5,
      },
      {
        id: "166PrototypeSalvage", //Mk 12 ArmaTek Thermal Detonator Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 100-200 in reserves.",
        cost: 335,
        amount: 5,
      },
      {
        id: "167PrototypeSalvage", //Mk 12 ArmaTek Key Pad Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 150-200 in reserves.",
        cost: 335,
        amount: 5,
      },
      {
        id: "167PrototypeSalvage_V2", //Mk 12 Czerka Security Scanner Prototype Salvage
        scavenger: [],
        cost: 285,
        amount: 5,
      },
      {
        id: "154Salvage", //Mk 7 CEC Fusion Furnace Salvage
        scavenger: [{ id: "electrium_conductor", amount: 1050 / 40 }],
        notes:
          "Required to use 40x with 30x Mk 12 Armatek Visor Prototype to craft Mk 12 Armatek Visor",
        cost: 1425,
        amount: 15,
      },
      {
        id: "157Salvage", //Mk 8 Nubian Design Tech Salvage
        scavenger: [],
        cost: 1425,
        amount: 15,
      },
      {
        id: "158PrototypeSalvage", //Mk 12 ArmaTek Multi-tool Prototype Salvage
        scavenger: [{ id: "impulse_detector", amount: 12 }],
        notes: "Recommended to save 120-150 in reserves.",
        cost: 1275,
        amount: 15,
      },
      {
        id: "161PrototypeSalvage", //Mk 12 ArmaTek Tactical Data Prototype Salvage
        scavenger: [],
        cost: 1275,
        amount: 15,
      },
      {
        id: "170PrototypeSalvage_V2", //Mk 12 Czerka Implant Prototype Salvage
        scavenger: [],
        cost: 855,
        amount: 15,
      },
      {
        id: "169PrototypeSalvage_V2", //Mk 12 Czerka Shield Generator Prototype Salvage
        scavenger: [],
        cost: 855,
        amount: 15,
      },
      {
        id: "147Salvage", //Mk 8 Nubian Security Scanner Salvage
        scavenger: [],
        cost: 475,
        amount: 5,
      },
      {
        id: "168PrototypeSalvage", //Mk 12 ArmaTek Fusion Furnace Prototype Salvage
        scavenger: [{ id: "gyrda_keypad", amount: 10 }],
        cost: 335,
        amount: 5,
      },
      {
        id: "152Salvage", //Mk 6 Athakam Medpac Salvage
        scavenger: [],
        cost: 1425,
        amount: 15,
      },
      {
        id: "170PrototypeSalvage", //Mk 12 ArmaTek Holo Lens Prototype Salvage
        scavenger: [{ id: "zinbiddle_card", amount: 18 }],
        notes: "Recommended to save 150-200 in reserves.",
        cost: 400,
        amount: 4,
      },
    ],
  },
  {
    id: "raid_store3",
    currency: "raid3",
    gear: [],
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
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
      },
      {
        id: "050Salvage", //Mk 4 BAW Armor Mod Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 250-300 in reserves.",
      },
      {
        id: "030", //Mk 2 Fabritech Data Pad
        scavenger: [
          { id: "carbonite_circuit_board", amount: 3 },
          { id: "chromium_transistor", amount: 150 },
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
        scavenger: [{ id: "chromium_transistor", amount: 150 / 50 }],
        notes: "Recommended to save 1800-2000 in reserves.",
      },
      {
        id: "102Salvage", //Mk 3 Sienar Holo Projector Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 250 / 20 }],
        notes:
          "Best source by far, but also used frequently in gearing characters. Recommended to save 60-100 in reserves. ALWAYS craft this piece, never scavenge the base salvage.",
      },
      {
        id: "078PrototypeSalvage", //Mk 2 Sienar Holo Projector Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes: "Used to craft Mk 8 Fabritech Data Pad.",
      },
      {
        id: "035", //Mk 2 Chiewab Hypo Syringe
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 20-40 in reserves.",
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
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 40-100 in reserves.",
      },
      {
        id: "075PrototypeSalvage", //Mk 6 TaggeCo Holo Lens Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-50 in reserves.",
      },
      {
        id: "069Prototype", //Mk 2 Chedak Comlink Prototype
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
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
        scavenger: [{ id: "chromium_transistor", amount: 3 }],
        notes: "Recommended to save 150-300 in reserves.",
      },
      {
        id: "071", //Mk 1 Carbanti Sensor Array
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
      },
      {
        id: "050Salvage", //Mk 4 BAW Armor Mod Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 300-500 in reserves.",
      },
      {
        id: "037Prototype", //Mk 4 BlasTech Weapon Mod Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
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
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes: "Recommended to save 500-800 in reserves.",
      },
      {
        id: "091Salvage", //Mk 4 SoroSuub Keypad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 800-1200 in reserves.",
      },
      {
        id: "073PrototypeSalvage", //MK 7 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 / 5 }],
        notes:
          "Recommended to craft 5 of these with 5x Mk 5 Loronar Power Cell Salvage, 1x Mk 1 Arakyd Droid Caller, and Mk 3 BlasTech Weapon Mod rather than scavenge by itself.",
      },
      {
        id: "036", //Mk 3 BioTech Implant
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
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
        id: "161Salvage", //Mk 10 Neuro-Saav Electrobinoculars Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes: "Recommended to save 300-400 in reserves.",
      },
      {
        id: "150Salvage", //Mk 4 Zaltin Bacta Gel Salvage
        notes: "Do not scrap; Save for gearing characters.",
      },
      {
        id: "097PrototypeSalvage", //Mk 8 BlasTech Weapon Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 }],
        notes:
          "Used to craft Mk 7 BlasTech Weapon Mod for Chromium Transistors.",
      },
      {
        id: "065Salvage", //Mk 6 Loronar Power Cell Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 30-60 in reserves.",
      },
      {
        id: "044Prototype", //Mk 4 BioTech Implant Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
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
        scavenger: [{ id: "aurodium_heatsink", amount: 250 }],
        notes: "Recommended to save 300-600 in reserves.",
      },
      {
        id: "076Salvage", //Mk 6 Fabritech Data Pad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 40-50 in reserves.",
      },
      {
        id: "075PrototypeSalvage", //Mk 6 TaggeCo Holo Lens Prototype Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 20-50 in reserves.",
      },
      {
        id: "033", //Mk 2 Arakyd Droid Caller
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
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
        scavenger: [{ id: "chromium_transistor", amount: 150 / 5 }],
        notes:
          "Recommended to craft 5x with Mk 1 Czerka Stun Cuffs x2 and Mk 2 Fabritech Data Pad x1 rather than scavenge by itself.",
      },
      {
        id: "101Salvage", //Mk 5 SoroSuub Keypad Salvage
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
        notes: "Recommended to save 500-800 in reserves.",
      },
      {
        id: "066", //Mk 5 Fabritech Data Pad
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
      },
    ],
  },
  {
    id: "darkside_normal_8b",
    gear: [
      {
        id: "117PrototypeSalvage", //Mk 5 A/KT Stun Gun Prototype Salvage
        scavenger: [{ id: "aurodium_heatsink", amount: 5 }],
        notes: "Recommended to save 200-300 in reserves.",
      },
      {
        id: "085PrototypeSalvage", //Mk 7 BAW Armor Mod Prototype Salvage
        scavenger: [{ id: "chromium_transistor", amount: 150 / 5 }],
        notes:
          "Recommended to craft 5x with Mk 1 Czerka Stun Cuffs x2 and Mk 2 Fabritech Data Pad x1 rather than scavenge by itself.",
      },
      {
        id: "040Prototype", //Mk 4 Loronar Power Cell Prototype
        scavenger: [{ id: "bronzium_wiring", amount: 10 }],
      },
    ],
  },
  {
    id: "lightside_normal_1c",
    gear: [
      {
        id: "002", //Mk 1 BAW Armor Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 300-600 in reserves.",
      },
      {
        id: "001", //Mk 1 BlasTech Weapon Mod
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
        notes: "Recommended to save 150-300 in reserves.",
      },
      {
        id: "003", //Mk 1 Neuro-Saav Electrobinoculars
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
      },
      {
        id: "005", //Mk 1 Nubian Security Scanner
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
      },
      {
        id: "004", //Mk 1 TaggeCo Holo Lens
        scavenger: [{ id: "carbonite_circuit_board", amount: 3 }],
      },
    ],
  },
];

export interface IScavenger {
  id: string;
  gear?: IScavengerGear[];
  currency?:
    | "get1"
    | "get2"
    | "get3"
    | "guildStoreCurrency"
    | "squadArenaCurrency"
    | "raid1"
    | "raid2"
    | "raid3";
}

interface IScavengerGear {
  id: string;
  scavenger?: { id: string; amount: number }[];
  notes?: string;
  cost?: number;
  amount?: number;
}

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
