const Light = "Light Side";
const light = Light.toLowerCase().replace(" ", "");
const Dark = "Dark Side";
const dark = Dark.toLowerCase().replace(" ", "");
const Fleet = "Fleet";
const fleet = Fleet.toLowerCase().replace(" ", "");
const Cantina = "Cantina";
const cantina = Cantina.toLowerCase().replace(" ", "");

const Normal = "Normal";
const normal = Normal.toLowerCase();
const Hard = "Hard";
const hard = Hard.toLowerCase();

const nodeList = [
  {
    id: `${light}_${hard}_1a`,
    table: Light,
    difficulty: Hard,
    map: 1,
    mission: "A",
    energy: 12,
    characters: ["REY"],
    gear: [
      {
        id: "002",
        dropRate: 1,
      },
      {
        id: "004",
        dropRate: 1,
      },
      {
        id: "005",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_1b`,
    table: Light,
    difficulty: Hard,
    map: 1,
    mission: "B",
    energy: 12,
    characters: ["AHSOKATANO"],
    gear: [
      {
        id: "002",
        dropRate: 1,
      },
      {
        id: "007",
        dropRate: 1,
      },
      {
        id: "011",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_1c`,
    table: Light,
    difficulty: Hard,
    map: 1,
    mission: "C",
    energy: 12,
    characters: ["DARKTROOPER"],
    gear: [
      {
        id: "012",
        dropRate: 1,
      },
      {
        id: "009",
        dropRate: 1,
      },
      {
        id: "001",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_1d`,
    table: Light,
    difficulty: Hard,
    map: 1,
    mission: "D",
    energy: 12,
    characters: ["KYLORENUNMASKED"],
    gear: [
      {
        id: "002",
        dropRate: 1,
      },
      {
        id: "003",
        dropRate: 1,
      },
      {
        id: "008",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2a`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "A",
    energy: 12,
    characters: ["EWOKSCOUT"],
    gear: [
      {
        id: "006",
        dropRate: 1,
      },
      {
        id: "014Prototype",
        dropRate: 1,
      },
      {
        id: "010",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2b`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "B",
    energy: 12,
    characters: ["FIRSTORDERTROOPER"],
    gear: [
      {
        id: "019",
        dropRate: 1,
      },
      {
        id: "002",
        dropRate: 1,
      },
      {
        id: "017Prototype",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2c`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "C",
    characters: ["EWOKELDER"],
    gear: [
      {
        id: "007",
        dropRate: 1,
      },
      {
        id: "008",
        dropRate: 1,
      },
      {
        id: "001",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2d`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "D",
    characters: ["MOFFGIDEONS1"],
    gear: [
      {
        id: "033",
        dropRate: 1,
      },
      {
        id: "004",
        dropRate: 1,
      },
      {
        id: "021",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2e`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "E",
    characters: ["MACEWINDU"],
    gear: [
      {
        id: "020",
        dropRate: 1,
      },
      {
        id: "009",
        dropRate: 1,
      },
      {
        id: "001",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_2f`,
    table: Light,
    difficulty: Hard,
    map: 2,
    mission: "F",
    characters: ["TALIA"],
    gear: [
      {
        id: "035",
        dropRate: 1,
      },
      {
        id: "003",
        dropRate: 1,
      },
      {
        id: "015Prototype",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3a`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "A",
    characters: ["RESISTANCETROOPER"],
    gear: [
      {
        id: "050Salvage",
        dropRate: 1,
      },
      {
        id: "016",
        dropRate: 1,
      },
      {
        id: "001",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3b`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "B",
    characters: ["IG11"],
    gear: [
      {
        id: "034",
        dropRate: 1,
      },
      {
        id: "030",
        dropRate: 1,
      },
      {
        id: "006",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3c`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "C",
    characters: ["STORMTROOPER"],
    gear: [
      {
        id: "025",
        dropRate: 1,
      },
      {
        id: "004",
        dropRate: 1,
      },
      {
        id: "013",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3d`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "D",
    characters: ["LUMINARAUNDULI"],
    gear: [
      {
        id: "036",
        dropRate: 1,
      },
      {
        id: "031Prototype",
        dropRate: 1,
      },
      {
        id: "013",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3e`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "E",
    characters: ["GREEFKARGA"],
    gear: [
      {
        id: "057Salvage",
        dropRate: 1,
      },
      {
        id: "015",
        dropRate: 1,
      },
      {
        id: "009",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_3f`,
    table: Light,
    difficulty: Hard,
    map: 3,
    mission: "F",
    characters: ["DATHCHA"],
    gear: [
      {
        id: "028Prototype",
        dropRate: 1,
      },
      {
        id: "012",
        dropRate: 1,
      },
      {
        id: "005",
        dropRate: 1,
      },
      {
        id: "010",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4a`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "A",
    characters: ["TEEBO"],
    gear: [
      {
        id: "078Prototype",
        dropRate: 1,
      },
      {
        id: "069Prototype",
        dropRate: 1,
      },
      {
        id: "015Prototype",
        dropRate: 1,
      },
      {
        id: "010",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4b`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "B",
    characters: ["LOBOT"],
    gear: [
      {
        id: "055Prototype",
        dropRate: 1,
      },
      {
        id: "052Salvage",
        dropRate: 1,
      },
      {
        id: "007",
        dropRate: 1,
      },
      {
        id: "017Prototype",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4c`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "C",
    characters: ["VEERS"],
    gear: [
      {
        id: "055PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "040Prototype",
        dropRate: 1,
      },
      {
        id: "013",
        dropRate: 1,
      },
      {
        id: "007",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4d`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "D",
    characters: ["IDENVERSIOEMPIRE", "VULTUREDROID"],
    gear: [
      {
        id: "051Salvage",
        dropRate: 1,
      },
      {
        id: "044Prototype",
        dropRate: 1,
      },
      {
        id: "009",
        dropRate: 1,
      },
      {
        id: "021Prototype",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4e`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "E",
    characters: ["POGGLETHELESSER"],
    gear: [
      {
        id: "062Salvage",
        dropRate: 1,
      },
      {
        id: "049Prototype",
        dropRate: 1,
      },
      {
        id: "003",
        dropRate: 1,
      },
      {
        id: "008",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_4f`,
    table: Light,
    difficulty: Hard,
    map: 4,
    mission: "F",
    characters: ["ROSETICO"],
    gear: [
      {
        id: "053Salvage",
        dropRate: 1,
      },
      {
        id: "035",
        dropRate: 1,
      },
      {
        id: "036",
        dropRate: 1,
      },
      {
        id: "001",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5a`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "A",
    characters: ["URORRURRR"],
    gear: [
      {
        id: "051Salvage",
        dropRate: 1,
      },
      {
        id: "062Salvage",
        dropRate: 1,
      },
      {
        id: "071PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "027",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5b`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "B",
    characters: ["BADBATCHHUNTER"],
    gear: [
      {
        id: "086PrototypeSalvage",
        dropRate: 1,
      },
      { id: "028Prototype", dropRate: 1 },
      {
        id: "061Prototype",
        dropRate: 1,
      },
      {
        id: "095Salvage",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5c`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "C",
    characters: ["CLONESERGEANTPHASEI"],
    gear: [
      {
        id: "091Salvage",
        dropRate: 1,
      },
      {
        id: "071PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "033",
        dropRate: 1,
      },
      {
        id: "030",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5d`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "D",
    characters: ["ZAALBAR"],
    gear: [
      {
        id: "097PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "054Salvage",
        dropRate: 1,
      },
      {
        id: "027",
        dropRate: 1,
      },
      {
        id: "025",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5e`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "E",
    characters: ["MONMOTHMA"],
    gear: [
      {
        id: "084PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "085PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "034",
        dropRate: 1,
      },
      {
        id: "031Prototype",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_5f`,
    table: Light,
    difficulty: Hard,
    map: 5,
    mission: "F",
    characters: ["BADBATCHTECH"],
    gear: [
      {
        id: "101Salvage",
        dropRate: 1,
      },
      {
        id: "052Salvage",
        dropRate: 1,
      },
      {
        id: "066",
        dropRate: 1,
      },
      {
        id: "004",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_6a`,
    table: Light,
    difficulty: Hard,
    map: 6,
    mission: "A",
    characters: ["JUHANI"],
    gear: [
      {
        id: "100PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "102Salvage",
        dropRate: 1,
      },
      {
        id: "076Salvage",
        dropRate: 1,
      },
      {
        id: "093PrototypeSalvage",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_6b`,
    table: Light,
    difficulty: Hard,
    map: 6,
    mission: "B",
    characters: ["ADMIRALPIETT", "EPIXPOE"],
    gear: [
      {
        id: "090PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "103PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "057Salvage",
        dropRate: 1,
      },
      {
        id: "071PrototypeSalvage",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_6c`,
    table: Light,
    difficulty: Hard,
    map: 6,
    mission: "C",
    characters: ["FENNECSHAND", "SITHBOMBER"],
    gear: [
      {
        id: "104PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "050Salvage",
        dropRate: 1,
      },
      {
        id: "078PrototypeSalvage",
        dropRate: 1,
      },
      {
        id: "095Salvage",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${light}_${hard}_6d`,
    table: Light,
    difficulty: Hard,
    map: 6,
    mission: "D",
    characters: ["MARAJADE"],
    gear: [],
  },
  {
    id: `${light}_${hard}_6e`,
    table: Light,
    difficulty: Hard,
    map: 6,
    mission: "E",
    characters: ["POGGLETHELESSER", "IG2000"],
    gear: [],
  },
  {
    id: `${light}_${hard}_7a`,
    table: Light,
    difficulty: Hard,
    map: 7,
    mission: "A",
    characters: ["C3POCHEWBACCA"],
    gear: [],
  },
  {
    id: `${light}_${hard}_7b`,
    table: Light,
    difficulty: Hard,
    map: 7,
    mission: "B",
    characters: ["POE"],
    gear: [],
  },
  {
    id: `${light}_${hard}_7c`,
    table: Light,
    difficulty: Hard,
    map: 7,
    mission: "C",
    characters: ["BADBATCHWRECKER", "YWINGCLONEWARS"],
    gear: [],
  },
  {
    id: `${light}_${hard}_7d`,
    table: Light,
    difficulty: Hard,
    map: 7,
    mission: "D",
    characters: ["BADBATCHECHO", "LUKESKYWALKER"],
    gear: [],
  },
  {
    id: `${light}_${hard}_8a`,
    table: Light,
    difficulty: Hard,
    map: 8,
    mission: "A",
    characters: ["MOTHERTALZIN"],
    gear: [],
  },
  {
    id: `${light}_${hard}_8b`,
    table: Light,
    difficulty: Hard,
    map: 8,
    mission: "B",
    characters: ["DROIDEKA", "XANADUBLOOD"],
    gear: [],
  },
  {
    id: `${light}_${hard}_8c`,
    table: Light,
    difficulty: Hard,
    map: 8,
    mission: "C",
    characters: ["EPIXFINN", "SNOWTROOPER"],
    gear: [],
  },
  {
    id: `${light}_${hard}_8d`,
    table: Light,
    difficulty: Hard,
    map: 8,
    mission: "D",
    characters: ["JANGOFETT", "HOUNDSTOOTH"],
    gear: [],
  },
  {
    id: `${light}_${hard}_9a`,
    table: Light,
    difficulty: Hard,
    map: 9,
    mission: "A",
    characters: ["DARTHSION", "COMMANDSHUTTLE"],
    gear: [],
  },
  {
    id: `${light}_${hard}_9a`,
    table: Light,
    difficulty: Hard,
    map: 9,
    mission: "A",
    characters: ["SHORETROOPER", "TIEREAPER"],
    gear: [],
  },
  {
    id: `${light}_${hard}_9c`,
    table: Light,
    difficulty: Hard,
    map: 9,
    mission: "C",
    characters: ["ARMORER", "BAZEMALBUS"],
    gear: [],
  },
  {
    id: `${light}_${hard}_9d`,
    table: Light,
    difficulty: Hard,
    map: 9,
    mission: "D",
    characters: ["DIRECTORKRENNIC", "GEONOSIANSTARFIGHTER2"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_1a`,
    table: Dark,
    difficulty: Hard,
    map: 1,
    mission: "A",
    characters: ["SABINEWRENS3"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_1b`,
    table: Dark,
    difficulty: Hard,
    map: 1,
    mission: "B",
    characters: ["ANAKINKNIGHT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_1c`,
    table: Dark,
    difficulty: Hard,
    map: 1,
    mission: "C",
    characters: ["COUNTDOOKU"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_1d`,
    table: Dark,
    difficulty: Hard,
    map: 1,
    mission: "D",
    characters: ["JEDIKNIGHTCONSULAR"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2a`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "A",
    characters: ["FIRSTORDERTROOPER"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2b`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "B",
    characters: ["BOBAFETT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2c`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "C",
    characters: ["OLDBENKENOBI"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2d`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "D",
    energy: 12,
    characters: ["CT5555"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2e`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "E",
    energy: 12,
    characters: ["LUMINARAUNDULI"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_2f`,
    table: Dark,
    difficulty: Hard,
    map: 2,
    mission: "F",
    energy: 12,
    characters: ["IG86SENTINELDROID"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3a`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "A",
    energy: 12,
    characters: ["RANGETROOPER"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3b`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "B",
    energy: 12,
    characters: ["HOTHREBELSCOUT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3c`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "C",
    energy: 12,
    characters: ["THEMANDALORIAN"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3d`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "D",
    energy: 12,
    characters: ["TEEBO"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3e`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "E",
    energy: 12,
    characters: ["ANAKINKNIGHT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_3f`,
    table: Dark,
    difficulty: Hard,
    map: 3,
    mission: "F",
    energy: 12,
    characters: ["JEDIKNIGHTGUARDIAN"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4a`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "A",
    energy: 12,
    characters: ["BIGGSDARKLIGHTER"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4b`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "B",
    energy: 12,
    characters: ["DAKA"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4c`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "C",
    energy: 12,
    characters: ["SECONDSISTER"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4d`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "D",
    energy: 12,
    characters: ["YOUNGCHEWBACCA"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4e`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "E",
    energy: 12,
    characters: ["BOBAFETT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_4f`,
    table: Dark,
    difficulty: Hard,
    map: 4,
    mission: "F",
    energy: 12,
    characters: ["JAWA"],
    gear: [
      {
        id: "006",
        dropRate: 1,
      },
    ],
  },
  {
    id: `${dark}_${hard}_5a`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "A",
    energy: 16,
    characters: ["KUIIL", "TIEBOMBERIMPERIAL"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_5b`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "B",
    energy: 16,
    characters: ["BASTILASHAN"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_5c`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "C",
    energy: 16,
    characters: ["BARRISSOFFEE", "IMAGUNDI"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_5d`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "D",
    energy: 16,
    characters: ["REY", "MILLENNIUMFALCONEP7"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_5e`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "E",
    energy: 16,
    characters: ["CARADUNE"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_5f`,
    table: Dark,
    difficulty: Hard,
    map: 5,
    mission: "F",
    energy: 16,
    characters: ["ROYALGUARD"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_6a`,
    table: Dark,
    difficulty: Hard,
    map: 6,
    mission: "A",
    energy: 16,
    characters: ["GENERALHUX", "HOTHREBELSCOUT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_6b`,
    table: Dark,
    difficulty: Hard,
    map: 6,
    mission: "B",
    energy: 16,
    characters: ["FIRSTORDERTIEPILOT"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_6c`,
    table: Dark,
    difficulty: Hard,
    map: 6,
    mission: "C",
    energy: 16,
    characters: ["FOSITHTROOPER", "TUSKENRAIDER"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_6d`,
    table: Dark,
    difficulty: Hard,
    map: 6,
    mission: "D",
    energy: 16,
    characters: ["BOKATAN", "JOLEEBINDO"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_6e`,
    table: Dark,
    difficulty: Hard,
    map: 6,
    mission: "E",
    energy: 16,
    characters: ["MAGNAGUARD"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_7a`,
    table: Dark,
    difficulty: Hard,
    map: 7,
    mission: "A",
    energy: 20,
    characters: ["BASTILASHANDARK"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_7b`,
    table: Dark,
    difficulty: Hard,
    map: 7,
    mission: "B",
    energy: 20,
    characters: ["VISASMARR"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_7c`,
    table: Dark,
    difficulty: Hard,
    map: 7,
    mission: "C",
    energy: 20,
    characters: ["AMILYNHOLDO"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_7d`,
    table: Dark,
    difficulty: Hard,
    map: 7,
    mission: "D",
    energy: 20,
    characters: ["EMPERORSSHUTTLE"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_8a`,
    table: Dark,
    difficulty: Hard,
    map: 8,
    mission: "A",
    energy: 20,
    characters: ["WICKET"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_8b`,
    table: Dark,
    difficulty: Hard,
    map: 8,
    mission: "B",
    energy: 20,
    characters: ["HYENABOMBER", "JEDISTARFIGHTERCONSULAR"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_8c`,
    table: Dark,
    difficulty: Hard,
    map: 8,
    mission: "C",
    energy: 20,
    characters: ["EMBO"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_8d`,
    table: Dark,
    difficulty: Hard,
    map: 8,
    mission: "D",
    energy: 20,
    characters: ["NIGHTSISTERZOMBIE"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_9a`,
    table: Dark,
    difficulty: Hard,
    map: 9,
    mission: "A",
    energy: 20,
    characters: ["DARTHNIHILUS"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_9b`,
    table: Dark,
    difficulty: Hard,
    map: 9,
    mission: "B",
    energy: 20,
    characters: ["BOSSK"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_9c`,
    table: Dark,
    difficulty: Hard,
    map: 9,
    mission: "C",
    energy: 20,
    characters: ["GHOST"],
    gear: [],
  },
  {
    id: `${dark}_${hard}_9d`,
    table: Dark,
    difficulty: Hard,
    map: 9,
    mission: "D",
    energy: 20,
    characters: ["PHANTOM2"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_1a`,
    table: Fleet,
    difficulty: Hard,
    map: 1,
    mission: "A",
    energy: 16,
    characters: ["ARC170CLONESERGEANT"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_1b`,
    table: Fleet,
    difficulty: Hard,
    map: 1,
    mission: "B",
    energy: 16,
    characters: ["JEDISTARFIGHTERANAKIN"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_1c`,
    table: Fleet,
    difficulty: Hard,
    map: 1,
    mission: "C",
    energy: 16,
    characters: ["TIEFIGHTERIMPERIAL"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_1d`,
    table: Fleet,
    difficulty: Hard,
    map: 1,
    mission: "D",
    energy: 16,
    characters: ["YOUNGLANDO", "MILLENNIUMFALCONPRISTINE"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_1d`,
    table: Fleet,
    difficulty: Hard,
    map: 1,
    mission: "D",
    energy: 16,
    characters: ["XWINGRESISTANCE"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_2a`,
    table: Fleet,
    difficulty: Hard,
    map: 2,
    mission: "A",
    energy: 20,
    characters: ["GEONOSIANSTARFIGHTER1"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_2b`,
    table: Fleet,
    difficulty: Hard,
    map: 2,
    mission: "B",
    energy: 20,
    characters: ["SLAVE1"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_2c`,
    table: Fleet,
    difficulty: Hard,
    map: 2,
    mission: "C",
    energy: 20,
    characters: ["UWINGSCARIF"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_2d`,
    table: Fleet,
    difficulty: Hard,
    map: 2,
    mission: "D",
    energy: 20,
    characters: ["BASTILASHAN"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_2e`,
    table: Fleet,
    difficulty: Hard,
    map: 2,
    mission: "E",
    energy: 20,
    characters: ["CARTHONASI"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_3a`,
    table: Fleet,
    difficulty: Hard,
    map: 3,
    mission: "A",
    energy: 20,
    characters: ["XWINGBLACKONE"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_3b`,
    table: Fleet,
    difficulty: Hard,
    map: 3,
    mission: "B",
    energy: 20,
    characters: ["UMBARANSTARFIGHTER"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_3c`,
    table: Fleet,
    difficulty: Hard,
    map: 3,
    mission: "C",
    energy: 20,
    characters: ["ZAALBAR"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_3d`,
    table: Fleet,
    difficulty: Hard,
    map: 3,
    mission: "D",
    energy: 20,
    characters: ["SITHINFILTRATOR"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_3e`,
    table: Fleet,
    difficulty: Hard,
    map: 3,
    mission: "E",
    energy: 20,
    characters: ["SITHFIGHTER"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_4a`,
    table: Fleet,
    difficulty: Hard,
    map: 4,
    mission: "A",
    energy: 20,
    characters: ["GAUNTLETSTARFIGHTER"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_4b`,
    table: Fleet,
    difficulty: Hard,
    map: 4,
    mission: "B",
    energy: 20,
    characters: ["TIEADVANCED"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_4c`,
    table: Fleet,
    difficulty: Hard,
    map: 4,
    mission: "C",
    energy: 20,
    characters: ["GREEFKARGA", "YWINGREBEL"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_4e`,
    table: Fleet,
    difficulty: Hard,
    map: 4,
    mission: "D",
    energy: 20,
    characters: ["BADBATCHOMEGA"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_4e`,
    table: Fleet,
    difficulty: Hard,
    map: 4,
    mission: "E",
    energy: 20,
    characters: ["JOLEEBINDO"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_5a`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "A",
    energy: 20,
    characters: ["SHAAKTI"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_5b`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "B",
    energy: 20,
    characters: ["B1BATTLEDROIDV2"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_5c`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "C",
    energy: 20,
    characters: [],
    gear: [],
  },

  {
    id: `${fleet}_${hard}_5d`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "D",
    energy: 20,
    characters: ["ENFYSNEST"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_5e`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "E",
    energy: 20,
    characters: ["THEMANDALORIAN"],
    gear: [],
  },
  {
    id: `${fleet}_${hard}_5f`,
    table: Fleet,
    difficulty: Hard,
    map: 5,
    mission: "F",
    energy: 20,
    characters: [],
    gear: [],
  },
  {
    id: `${cantina}_1a`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "A",
    energy: 8,
    characters: ["GEONOSIANSOLDIER"],
    gear: [],
  },
  {
    id: `${cantina}_1b`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "B",
    energy: 8,
    characters: ["LUKESKYWALKER"],
    gear: [],
  },
  {
    id: `${cantina}_1c`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "C",
    energy: 8,
    characters: ["OLDBENKENOBI"],
    gear: [],
  },
  {
    id: `${cantina}_1d`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "D",
    energy: 8,
    characters: ["SCARIFREBEL"],
    gear: [],
  },
  {
    id: `${cantina}_1e`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "E",
    energy: 8,
    characters: ["ADMINISTRATORLANDO"],
    gear: [],
  },
  {
    id: `${cantina}_1f`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "F",
    energy: 8,
    characters: ["HERASYNDULLAS3"],
    gear: [],
  },
  {
    id: `${cantina}_1g`,
    table: Cantina,
    difficulty: "",
    map: 1,
    mission: "G",
    energy: 8,
    characters: ["TALIA"],
    gear: [],
  },
  {
    id: `${cantina}_2a`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "A",
    energy: 8,
    characters: ["NIGHTSISTERACOLYTE"],
    gear: [],
  },
  {
    id: `${cantina}_2b`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "B",
    energy: 8,
    characters: ["EZRABRIDGERS3"],
    gear: [],
  },
  {
    id: `${cantina}_2c`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "C",
    energy: 8,
    characters: ["IMPERIALSUPERCOMMANDO"],
    gear: [],
  },
  {
    id: `${cantina}_2d`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "D",
    energy: 8,
    characters: ["JAWA"],
    gear: [],
  },
  {
    id: `${cantina}_2e`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "E",
    energy: 8,
    characters: ["GARSAXON"],
    gear: [],
  },
  {
    id: `${cantina}_2f`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "F",
    energy: 8,
    characters: ["CLONEWARSCHEWBACCA"],
    gear: [],
  },
  {
    id: `${cantina}_2g`,
    table: Cantina,
    difficulty: "",
    map: 2,
    mission: "G",
    energy: 8,
    characters: ["FIRSTORDEREXECUTIONER"],
    gear: [],
  },
  {
    id: `${cantina}_3a`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "A",
    energy: 10,
    characters: ["JEDIKNIGHTCONSULAR"],
    gear: [],
  },
  {
    id: `${cantina}_3b`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "B",
    energy: 10,
    characters: ["QIRA"],
    gear: [],
  },
  {
    id: `${cantina}_3c`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "C",
    energy: 10,
    characters: ["MAGNAGUARD"],
    gear: [],
  },
  {
    id: `${cantina}_3d`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "D",
    energy: 10,
    characters: ["PAPLOO"],
    gear: [],
  },
  {
    id: `${cantina}_3e`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "E",
    energy: 10,
    characters: ["FINN"],
    gear: [],
  },
  {
    id: `${cantina}_3f`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "F",
    energy: 10,
    characters: ["KYLORENUNMASKED", "TIESILENCER"],
    gear: [],
  },
  {
    id: `${cantina}_3g`,
    table: Cantina,
    difficulty: "",
    map: 3,
    mission: "G",
    energy: 10,
    characters: ["BIGGSDARKLIGHTER"],
    gear: [],
  },
  {
    id: `${cantina}_4a`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "A",
    energy: 10,
    characters: ["MACEWINDU"],
    gear: [],
  },
  {
    id: `${cantina}_4b`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "B",
    energy: 10,
    characters: ["TIEFIGHTERPILOT"],
    gear: [],
  },
  {
    id: `${cantina}_4c`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "C",
    energy: 10,
    characters: ["KYLOREN"],
    gear: [],
  },
  {
    id: `${cantina}_4d`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "D",
    energy: 10,
    characters: ["GEONOSIANSPY"],
    gear: [],
  },
  {
    id: `${cantina}_4e`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "E",
    energy: 10,
    characters: ["MOFFGIDEONS1"],
    gear: [],
  },
  {
    id: `${cantina}_4f`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "F",
    energy: 10,
    characters: ["KITFISTO"],
    gear: [],
  },
  {
    id: `${cantina}_4g`,
    table: Cantina,
    difficulty: "",
    map: 4,
    mission: "G",
    energy: 10,
    characters: ["PLOKOON"],
    gear: [],
  },
  {
    id: `${cantina}_5a`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "A",
    energy: 12,
    characters: ["L3_37"],
    gear: [],
  },
  {
    id: `${cantina}_5b`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "B",
    energy: 12,
    characters: ["AAYLASECURA"],
    gear: [],
  },
  {
    id: `${cantina}_5c`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "C",
    energy: 12,
    characters: ["CANDEROUSORDO"],
    gear: [],
  },
  {
    id: `${cantina}_5d`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "D",
    energy: 12,
    characters: ["CHIEFCHIRPA"],
    gear: [],
  },
  {
    id: `${cantina}_5e`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "E",
    energy: 12,
    characters: ["SMUGGLERHAN"],
    gear: [],
  },
  {
    id: `${cantina}_5f`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "F",
    energy: 12,
    characters: ["SMUGGLERCHEWBACCA"],
    gear: [],
  },
  {
    id: `${cantina}_5g`,
    table: Cantina,
    difficulty: "",
    map: 5,
    mission: "G",
    energy: 12,
    characters: ["ARCTROOPER501ST"],
    gear: [],
  },
  {
    id: `${cantina}_6a`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "A",
    energy: 12,
    characters: ["KYLEKATARN"],
    gear: [],
  },
  {
    id: `${cantina}_6b`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "B",
    energy: 12,
    characters: ["T3_M4"],
    gear: [],
  },
  {
    id: `${cantina}_6c`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "C",
    energy: 12,
    characters: ["SITHASSASSIN"],
    gear: [],
  },
  {
    id: `${cantina}_6d`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "D",
    energy: 12,
    characters: ["B2SUPERBATTLEDROID"],
    gear: [],
  },
  {
    id: `${cantina}_6e`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "E",
    energy: 12,
    characters: ["SITHMARAUDER"],
    gear: [],
  },
  {
    id: `${cantina}_6f`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "F",
    energy: 12,
    characters: ["WEDGEANTILLES"],
    gear: [],
  },
  {
    id: `${cantina}_6g`,
    table: Cantina,
    difficulty: "",
    map: 6,
    mission: "G",
    energy: 12,
    characters: ["COUNTDOOKU"],
    gear: [],
  },
  {
    id: `${cantina}_7a`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "A",
    energy: 16,
    characters: ["MISSIONVAO"],
    gear: [],
  },
  {
    id: `${cantina}_7b`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "B",
    energy: 16,
    characters: ["SNOWTROOPER"],
    gear: [],
  },
  {
    id: `${cantina}_7c`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "C",
    energy: 16,
    characters: ["AURRA_SING"],
    gear: [],
  },
  {
    id: `${cantina}_7d`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "D",
    energy: 16,
    characters: ["HOTHHAN"],
    gear: [],
  },
  {
    id: `${cantina}_7e`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "E",
    energy: 16,
    characters: ["DASHRENDAR"],
    gear: [],
  },
  {
    id: `${cantina}_7f`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "F",
    energy: 16,
    characters: ["NIGHTSISTERSPIRIT", "BLADEOFDORIN"],
    gear: [],
  },
  {
    id: `${cantina}_7g`,
    table: Cantina,
    difficulty: "",
    map: 7,
    mission: "G",
    energy: 16,
    characters: ["DARTHTALON"],
    gear: [],
  },
  {
    id: `${cantina}_8a`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "A",
    energy: 16,
    characters: ["DEATHTROOPER"],
    gear: [],
  },
  {
    id: `${cantina}_8b`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "B",
    energy: 16,
    characters: ["SITHTROOPER"],
    gear: [],
  },
  {
    id: `${cantina}_8c`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "C",
    energy: 16,
    characters: [],
    gear: [],
  },
  {
    id: `${cantina}_8d`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "D",
    energy: 16,
    characters: ["GEONOSIANBROODALPHA"],
    gear: [],
  },
  {
    id: `${cantina}_8e`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "E",
    energy: 16,
    characters: ["EBONHAWK"],
    gear: [],
  },
  {
    id: `${cantina}_8f`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "F",
    energy: 16,
    characters: [],
    gear: [],
  },
  {
    id: `${cantina}_8g`,
    table: Cantina,
    difficulty: "",
    map: 8,
    mission: "G",
    energy: 16,
    characters: [],
    gear: [],
  },
];

const gearList = [
  {
    id: "dark_normal_1d",
    gear: [
      {
        id: "001",
      },
      {
        id: "036",
      },
    ],
  },
  {
    id: "dark_hard_1b",
    gear: [
      {
        id: "001",
      },
      {
        id: "005",
      },
      {
        id: "023",
      },
    ],
  },
  {
    id: "dark_normal_6g",
    gear: [
      {
        id: "001",
      },
      {
        id: "065Salvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "light_normal_1c",
    gear: [
      {
        id: "001",
      },
      {
        id: "002",
      },
      {
        id: "003",
      },
      {
        id: "004",
      },
      {
        id: "005",
      },
    ],
  },
  {
    id: "light_normal_1e",
    gear: [
      {
        id: "001",
      },
      {
        id: "002",
      },
      {
        id: "003",
      },
      {
        id: "005",
      },
      {
        id: "006",
      },
    ],
  },
  {
    id: "light_hard_1e",
    gear: [
      {
        id: "001",
      },
      {
        id: "009",
      },
      {
        id: "012",
      },
    ],
  },
  {
    id: "light_normal_2f",
    gear: [
      {
        id: "001",
      },
      {
        id: "007",
      },
    ],
  },
  {
    id: "light_hard_2e",
    gear: [
      {
        id: "001",
      },
      {
        id: "007",
      },
      {
        id: "008",
      },
    ],
  },
  {
    id: "light_hard_2h",
    gear: [
      {
        id: "001",
      },
      {
        id: "009",
      },
      {
        id: "020",
      },
    ],
  },
  {
    id: "light_normal_3b",
    gear: [
      {
        id: "001",
      },
      {
        id: "034",
      },
    ],
  },
  {
    id: "light_hard_3b",
    gear: [
      {
        id: "001",
      },
      {
        id: "016",
      },
      {
        id: "050Salvage",
      },
    ],
  },
  {
    id: "light_normal_4l",
    gear: [
      {
        id: "001",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "light_hard_4l",
    gear: [
      {
        id: "001",
      },
      {
        id: "035",
      },
      {
        id: "036",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_2b",
    gear: [
      {
        id: "001",
      },
      {
        id: "053Salvage",
      },
      {
        id: "092Salvage",
      },
    ],
  },
  {
    id: "dark_normal_2c",
    gear: [
      {
        id: "002",
      },
      {
        id: "040Prototype",
      },
      {
        id: "050Salvage",
      },
    ],
  },
  {
    id: "dark_normal_5c",
    gear: [
      {
        id: "002",
      },
      {
        id: "049Prototype",
      },
      {
        id: "073PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_1d",
    gear: [
      {
        id: "002",
      },
      {
        id: "006",
      },
      {
        id: "007",
      },
      {
        id: "011",
      },
    ],
  },
  {
    id: "light_hard_1b",
    gear: [
      {
        id: "002",
      },
      {
        id: "004",
      },
      {
        id: "005",
      },
    ],
  },
  {
    id: "light_hard_1c",
    gear: [
      {
        id: "002",
      },
      {
        id: "007",
      },
      {
        id: "011",
      },
    ],
  },
  {
    id: "light_hard_1f",
    gear: [
      {
        id: "002",
      },
      {
        id: "003",
      },
      {
        id: "008",
      },
    ],
  },
  {
    id: "light_normal_2d",
    gear: [
      {
        id: "002",
      },
      {
        id: "008",
      },
    ],
  },
  {
    id: "light_hard_2c",
    gear: [
      {
        id: "002",
      },
      {
        id: "019",
      },
      {
        id: "017Prototype",
      },
    ],
  },
  {
    id: "light_normal_4g",
    gear: [
      {
        id: "002",
      },
      {
        id: "021Prototype",
      },
      {
        id: "051Salvage",
      },
    ],
  },
  {
    id: "light_normal_8e",
    gear: [
      {
        id: "002",
      },
      {
        id: "028Prototype",
      },
      {
        id: "113Salvage",
      },
      {
        id: "175Ingredient_Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_1a",
    gear: [
      {
        id: "002",
      },
      {
        id: "027",
      },
    ],
  },
  {
    id: "dark_hard_2c",
    gear: [
      {
        id: "003",
      },
      {
        id: "049Prototype",
      },
      {
        id: "065Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4k",
    gear: [
      {
        id: "003",
      },
      {
        id: "084PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_4l",
    gear: [
      {
        id: "003",
      },
      {
        id: "006",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "084PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_1f",
    gear: [
      {
        id: "003",
      },
      {
        id: "004",
      },
      {
        id: "007",
      },
      {
        id: "009",
      },
      {
        id: "012",
      },
    ],
  },
  {
    id: "light_normal_2a",
    gear: [
      {
        id: "003",
      },
      {
        id: "008",
      },
    ],
  },
  {
    id: "light_normal_2h",
    gear: [
      {
        id: "003",
      },
      {
        id: "033",
      },
    ],
  },
  {
    id: "light_hard_2i",
    gear: [
      {
        id: "003",
      },
      {
        id: "035",
      },
      {
        id: "015Prototype",
      },
    ],
  },
  {
    id: "light_normal_4i",
    gear: [
      {
        id: "003",
      },
      {
        id: "062Salvage",
      },
    ],
  },
  {
    id: "light_hard_4k",
    gear: [
      {
        id: "003",
      },
      {
        id: "008",
      },
      {
        id: "049Prototype",
      },
      {
        id: "062Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4f",
    gear: [
      {
        id: "004",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_4g",
    gear: [
      {
        id: "004",
      },
      {
        id: "044Prototype",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_2f",
    gear: [
      {
        id: "004",
      },
      {
        id: "033",
      },
      {
        id: "021Prototype",
      },
    ],
  },
  {
    id: "light_normal_3c",
    gear: [
      {
        id: "004",
      },
      {
        id: "025",
      },
    ],
  },
  {
    id: "light_hard_3e",
    gear: [
      {
        id: "004",
      },
      {
        id: "008",
      },
      {
        id: "025",
      },
    ],
  },
  {
    id: "light_normal_5l",
    gear: [
      {
        id: "004",
      },
      {
        id: "052Salvage",
      },
    ],
  },
  {
    id: "light_hard_5l",
    gear: [
      {
        id: "004",
      },
      {
        id: "066",
      },
      {
        id: "052Salvage",
      },
      {
        id: "101Salvage",
      },
    ],
  },
  {
    id: "light_normal_6i",
    gear: [
      {
        id: "004",
      },
      {
        id: "051Salvage",
      },
      {
        id: "101Salvage",
      },
    ],
  },
  {
    id: "dark_normal_1b",
    gear: [
      {
        id: "005",
      },
      {
        id: "029",
      },
    ],
  },
  {
    id: "dark_normal_5g",
    gear: [
      {
        id: "005",
      },
      {
        id: "016",
      },
      {
        id: "063PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_3i",
    gear: [
      {
        id: "005",
      },
      {
        id: "028Prototype",
      },
    ],
  },
  {
    id: "light_hard_3i",
    gear: [
      {
        id: "005",
      },
      {
        id: "010",
      },
      {
        id: "012",
      },
      {
        id: "028Prototype",
      },
    ],
  },
  {
    id: "dark_normal_4l",
    gear: [
      {
        id: "006",
      },
      {
        id: "075PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_6b",
    gear: [
      {
        id: "006",
      },
      {
        id: "029",
      },
      {
        id: "075PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_2c",
    gear: [
      {
        id: "006",
      },
      {
        id: "014Prototype",
      },
    ],
  },
  {
    id: "light_hard_2b",
    gear: [
      {
        id: "006",
      },
      {
        id: "010",
      },
      {
        id: "014Prototype",
      },
    ],
  },
  {
    id: "light_normal_3h",
    gear: [
      {
        id: "006",
      },
      {
        id: "030",
      },
    ],
  },
  {
    id: "light_hard_3c",
    gear: [
      {
        id: "006",
      },
      {
        id: "030",
      },
      {
        id: "034",
      },
    ],
  },
  {
    id: "light_normal_8h",
    gear: [
      {
        id: "006",
      },
      {
        id: "091Salvage",
      },
      {
        id: "133Salvage",
      },
      {
        id: "174Ingredient_Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4j",
    gear: [
      {
        id: "007",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_4k",
    gear: [
      {
        id: "007",
      },
      {
        id: "024",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_6c",
    gear: [
      {
        id: "007",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "light_normal_4c",
    gear: [
      {
        id: "007",
      },
      {
        id: "052Salvage",
      },
    ],
  },
  {
    id: "light_normal_4f",
    gear: [
      {
        id: "007",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "light_hard_4d",
    gear: [
      {
        id: "007",
      },
      {
        id: "017Prototype",
      },
      {
        id: "055Prototype",
      },
      {
        id: "052Salvage",
      },
    ],
  },
  {
    id: "light_hard_4g",
    gear: [
      {
        id: "007",
      },
      {
        id: "013",
      },
      {
        id: "037Prototype",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "dark_normal_2d",
    gear: [
      {
        id: "008",
      },
      {
        id: "069Prototype",
      },
    ],
  },
  {
    id: "dark_hard_2b",
    gear: [
      {
        id: "008",
      },
      {
        id: "023",
      },
      {
        id: "069Prototype",
      },
    ],
  },
  {
    id: "dark_normal_6f",
    gear: [
      {
        id: "008",
      },
      {
        id: "026",
      },
      {
        id: "095Salvage",
      },
    ],
  },
  {
    id: "light_normal_3d",
    gear: [
      {
        id: "008",
      },
      {
        id: "031Prototype",
      },
    ],
  },
  {
    id: "light_normal_4j",
    gear: [
      {
        id: "008",
      },
      {
        id: "049Prototype",
      },
    ],
  },
  {
    id: "light_normal_2g",
    gear: [
      {
        id: "009",
      },
      {
        id: "020",
      },
    ],
  },
  {
    id: "light_normal_3g",
    gear: [
      {
        id: "009",
      },
      {
        id: "012",
      },
      {
        id: "027",
      },
    ],
  },
  {
    id: "light_hard_3h",
    gear: [
      {
        id: "009",
      },
      {
        id: "027",
      },
      {
        id: "057Salvage",
      },
    ],
  },
  {
    id: "light_normal_4h",
    gear: [
      {
        id: "009",
      },
      {
        id: "044Prototype",
      },
    ],
  },
  {
    id: "light_hard_4h",
    gear: [
      {
        id: "009",
      },
      {
        id: "021Prototype",
      },
      {
        id: "044Prototype",
      },
      {
        id: "051Salvage",
      },
    ],
  },
  {
    id: "dark_normal_2i",
    gear: [
      {
        id: "010",
      },
      {
        id: "058Salvage",
      },
    ],
  },
  {
    id: "light_normal_2b",
    gear: [
      {
        id: "010",
      },
      {
        id: "021Prototype",
      },
    ],
  },
  {
    id: "light_normal_3e",
    gear: [
      {
        id: "010",
      },
      {
        id: "013",
      },
    ],
  },
  {
    id: "light_normal_4a",
    gear: [
      {
        id: "010",
      },
      {
        id: "078PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_4c",
    gear: [
      {
        id: "010",
      },
      {
        id: "015Prototype",
      },
      {
        id: "069Prototype",
      },
      {
        id: "078PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_6h",
    gear: [
      {
        id: "010",
      },
      {
        id: "062Salvage",
      },
      {
        id: "092Salvage",
      },
    ],
  },
  {
    id: "light_normal_6j",
    gear: [
      {
        id: "010",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4g",
    gear: [
      {
        id: "011",
      },
      {
        id: "064PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_4h",
    gear: [
      {
        id: "011",
      },
      {
        id: "012",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_6d",
    gear: [
      {
        id: "011",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_2c",
    gear: [
      {
        id: "011",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "094PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_2a",
    gear: [
      {
        id: "011",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_4h",
    gear: [
      {
        id: "012",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_6a",
    gear: [
      {
        id: "012",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "087PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_6h",
    gear: [
      {
        id: "012",
      },
      {
        id: "035",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_8g",
    gear: [
      {
        id: "012",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
    ],
  },
  {
    id: "dark_normal_1f",
    gear: [
      {
        id: "013",
      },
      {
        id: "032Prototype",
      },
    ],
  },
  {
    id: "dark_hard_1c",
    gear: [
      {
        id: "013",
      },
      {
        id: "016",
      },
      {
        id: "029",
      },
    ],
  },
  {
    id: "dark_normal_2b",
    gear: [
      {
        id: "013",
      },
      {
        id: "049Prototype",
      },
    ],
  },
  {
    id: "dark_hard_2e",
    gear: [
      {
        id: "013",
      },
      {
        id: "040Prototype",
      },
      {
        id: "050Salvage",
      },
    ],
  },
  {
    id: "dark_hard_3c",
    gear: [
      {
        id: "013",
      },
      {
        id: "032Prototype",
      },
      {
        id: "076Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4c",
    gear: [
      {
        id: "013",
      },
      {
        id: "075PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_4d",
    gear: [
      {
        id: "013",
      },
      {
        id: "015Prototype",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "076Salvage",
      },
    ],
  },
  {
    id: "dark_normal_6e",
    gear: [
      {
        id: "013",
      },
      {
        id: "076Salvage",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8d",
    gear: [
      {
        id: "013",
      },
      {
        id: "050Salvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_3f",
    gear: [
      {
        id: "013",
      },
      {
        id: "036",
      },
      {
        id: "031Prototype",
      },
    ],
  },
  {
    id: "light_normal_4e",
    gear: [
      {
        id: "013",
      },
      {
        id: "037Prototype",
      },
    ],
  },
  {
    id: "fleet_hard_1e",
    gear: [
      {
        id: "013",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_2d",
    gear: [
      {
        id: "013",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_1a",
    gear: [
      {
        id: "016",
      },
      {
        id: "023",
      },
    ],
  },
  {
    id: "dark_normal_3g",
    gear: [
      {
        id: "016",
      },
      {
        id: "063PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_3h",
    gear: [
      {
        id: "016",
      },
      {
        id: "050Salvage",
      },
      {
        id: "063PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_5h",
    gear: [
      {
        id: "016",
      },
      {
        id: "023",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "071PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_5k",
    gear: [
      {
        id: "016",
      },
      {
        id: "037Prototype",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_3a",
    gear: [
      {
        id: "016",
      },
      {
        id: "050Salvage",
      },
    ],
  },
  {
    id: "light_normal_7g",
    gear: [
      {
        id: "016",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "dark_normal_1c",
    gear: [
      {
        id: "019",
      },
      {
        id: "056Prototype",
      },
    ],
  },
  {
    id: "dark_hard_1e",
    gear: [
      {
        id: "019",
      },
      {
        id: "036",
      },
      {
        id: "056Prototype",
      },
    ],
  },
  {
    id: "dark_normal_5i",
    gear: [
      {
        id: "019",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8e",
    gear: [
      {
        id: "019",
      },
      {
        id: "053Salvage",
      },
      {
        id: "119PrototypeSalvage",
      },
      {
        id: "176Ingredient_Salvage",
      },
    ],
  },
  {
    id: "light_normal_2e",
    gear: [
      {
        id: "019",
      },
      {
        id: "017Prototype",
      },
    ],
  },
  {
    id: "light_normal_7d",
    gear: [
      {
        id: "019",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
    ],
  },
  {
    id: "light_normal_8b",
    gear: [
      {
        id: "019",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "096PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_3c",
    gear: [
      {
        id: "019",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "113Salvage",
      },
      {
        id: "170PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_3b",
    gear: [
      {
        id: "019",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
    ],
  },
  {
    id: "dark_normal_3a",
    gear: [
      {
        id: "020",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_3b",
    gear: [
      {
        id: "020",
      },
      {
        id: "014Prototype",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_5d",
    gear: [
      {
        id: "020",
      },
      {
        id: "096PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7h",
    gear: [
      {
        id: "020",
      },
      {
        id: "058Salvage",
      },
      {
        id: "104PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_2a",
    gear: [
      {
        id: "023",
      },
      {
        id: "065Salvage",
      },
    ],
  },
  {
    id: "dark_normal_3f",
    gear: [
      {
        id: "023",
      },
      {
        id: "050Salvage",
      },
    ],
  },
  {
    id: "dark_hard_3f",
    gear: [
      {
        id: "023",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_5h",
    gear: [
      {
        id: "023",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "dark_normal_8g",
    gear: [
      {
        id: "023",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_2h",
    gear: [
      {
        id: "024",
      },
      {
        id: "037Prototype",
      },
    ],
  },
  {
    id: "dark_hard_2i",
    gear: [
      {
        id: "024",
      },
      {
        id: "035",
      },
      {
        id: "017Prototype",
      },
      {
        id: "058Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4i",
    gear: [
      {
        id: "024",
      },
      {
        id: "071PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7f",
    gear: [
      {
        id: "024",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9h",
    gear: [
      {
        id: "024",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "138Salvage",
      },
      {
        id: "154Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_3g",
    gear: [
      {
        id: "024",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_4a",
    gear: [
      {
        id: "024",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_5g",
    gear: [
      {
        id: "025",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "light_hard_5h",
    gear: [
      {
        id: "025",
      },
      {
        id: "027",
      },
      {
        id: "054Salvage",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_7h",
    gear: [
      {
        id: "025",
      },
      {
        id: "054Salvage",
      },
      {
        id: "092Salvage",
      },
    ],
  },
  {
    id: "light_normal_8f",
    gear: [
      {
        id: "025",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "dark_normal_1e",
    gear: [
      {
        id: "026",
      },
      {
        id: "031Prototype",
      },
    ],
  },
  {
    id: "dark_hard_1f",
    gear: [
      {
        id: "026",
      },
      {
        id: "031Prototype",
      },
      {
        id: "032Prototype",
      },
    ],
  },
  {
    id: "dark_hard_3e",
    gear: [
      {
        id: "026",
      },
      {
        id: "033",
      },
      {
        id: "064PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_5a",
    gear: [
      {
        id: "026",
      },
      {
        id: "087PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_6h",
    gear: [
      {
        id: "026",
      },
      {
        id: "076Salvage",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "095Salvage",
      },
    ],
  },
  {
    id: "dark_normal_7c",
    gear: [
      {
        id: "026",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "119PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_3e",
    gear: [
      {
        id: "026",
      },
      {
        id: "171PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_3d",
    gear: [
      {
        id: "026",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "117PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_5b",
    gear: [
      {
        id: "027",
      },
      {
        id: "051Salvage",
      },
    ],
  },
  {
    id: "light_normal_5h",
    gear: [
      {
        id: "027",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_5c",
    gear: [
      {
        id: "027",
      },
      {
        id: "051Salvage",
      },
      {
        id: "062Salvage",
      },
      {
        id: "071PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_1g",
    gear: [
      {
        id: "027",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_1c",
    gear: [
      {
        id: "027",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_3i",
    gear: [
      {
        id: "029",
      },
      {
        id: "068PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_3i",
    gear: [
      {
        id: "029",
      },
      {
        id: "021Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "078PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_6d",
    gear: [
      {
        id: "029",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "087PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7b",
    gear: [
      {
        id: "029",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_3f",
    gear: [
      {
        id: "029",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "119PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_3e",
    gear: [
      {
        id: "029",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_5e",
    gear: [
      {
        id: "030",
      },
      {
        id: "071PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_5g",
    gear: [
      {
        id: "030",
      },
      {
        id: "033",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "light_normal_6f",
    gear: [
      {
        id: "030",
      },
      {
        id: "050Salvage",
      },
      {
        id: "104PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_2e",
    gear: [
      {
        id: "030",
      },
      {
        id: "050Salvage",
      },
      {
        id: "087PrototypeSalvage",
      },
      {
        id: "168PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_2b",
    gear: [
      {
        id: "030",
      },
      {
        id: "050Salvage",
      },
      {
        id: "104PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_3e",
    gear: [
      {
        id: "033",
      },
      {
        id: "093PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8c",
    gear: [
      {
        id: "033",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
    ],
  },
  {
    id: "light_normal_5f",
    gear: [
      {
        id: "033",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "light_normal_8c",
    gear: [
      {
        id: "033",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "100PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9a",
    gear: [
      {
        id: "033",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "076Salvage",
      },
      {
        id: "131Salvage",
      },
      {
        id: "159PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_1e",
    gear: [
      {
        id: "033",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_1a",
    gear: [
      {
        id: "033",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "light_normal_5a",
    gear: [
      {
        id: "034",
      },
      {
        id: "062Salvage",
      },
    ],
  },
  {
    id: "light_normal_5i",
    gear: [
      {
        id: "034",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_5k",
    gear: [
      {
        id: "034",
      },
      {
        id: "031Prototype",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "085PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_4b",
    gear: [
      {
        id: "035",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "dark_hard_4c",
    gear: [
      {
        id: "035",
      },
      {
        id: "036",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_6i",
    gear: [
      {
        id: "035",
      },
      {
        id: "065Salvage",
      },
      {
        id: "072PrototypeSalvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "light_normal_2i",
    gear: [
      {
        id: "035",
      },
      {
        id: "015Prototype",
      },
    ],
  },
  {
    id: "light_normal_4k",
    gear: [
      {
        id: "035",
      },
      {
        id: "036",
      },
    ],
  },
  {
    id: "light_normal_7c",
    gear: [
      {
        id: "035",
      },
      {
        id: "052Salvage",
      },
      {
        id: "114PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9f",
    gear: [
      {
        id: "035",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "102Salvage",
      },
      {
        id: "129Salvage",
      },
      {
        id: "160PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_1b",
    gear: [
      {
        id: "035",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_3b",
    gear: [
      {
        id: "035",
      },
      {
        id: "052Salvage",
      },
      {
        id: "106PrototypeSalvage",
      },
      {
        id: "167PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_hard_3a",
    gear: [
      {
        id: "035",
      },
      {
        id: "052Salvage",
      },
      {
        id: "114PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_2f",
    gear: [
      {
        id: "036",
      },
      {
        id: "055Prototype",
      },
    ],
  },
  {
    id: "dark_hard_2f",
    gear: [
      {
        id: "036",
      },
      {
        id: "055Prototype",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4a",
    gear: [
      {
        id: "036",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8f",
    gear: [
      {
        id: "036",
      },
      {
        id: "054Salvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9e",
    gear: [
      {
        id: "036",
      },
      {
        id: "076Salvage",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "157Salvage",
      },
      {
        id: "129Component",
      },
    ],
  },
  {
    id: "light_normal_3f",
    gear: [
      {
        id: "036",
      },
      {
        id: "057Salvage",
      },
    ],
  },
  {
    id: "light_normal_6g",
    gear: [
      {
        id: "036",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "094PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9e",
    gear: [
      {
        id: "036",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
      {
        id: "138Component",
      },
      {
        id: "162PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_1c",
    gear: [
      {
        id: "036",
      },
      {
        id: "078PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_5k",
    gear: [
      {
        id: "066",
      },
      {
        id: "101Salvage",
      },
    ],
  },
  {
    id: "light_normal_6c",
    gear: [
      {
        id: "066",
      },
      {
        id: "057Salvage",
      },
      {
        id: "090PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_7b",
    gear: [
      {
        id: "066",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "101Salvage",
      },
      {
        id: "172Salvage",
      },
    ],
  },
  {
    id: "light_normal_8a",
    gear: [
      {
        id: "066",
      },
      {
        id: "057Salvage",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9b",
    gear: [
      {
        id: "066",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "133Component",
      },
      {
        id: "161PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_1d",
    gear: [
      {
        id: "066",
      },
      {
        id: "080PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_3c",
    gear: [
      {
        id: "014Prototype",
      },
      {
        id: "064PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_6e",
    gear: [
      {
        id: "014Prototype",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "095Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4d",
    gear: [
      {
        id: "015Prototype",
      },
      {
        id: "076Salvage",
      },
    ],
  },
  {
    id: "dark_normal_6i",
    gear: [
      {
        id: "015Prototype",
      },
      {
        id: "058Salvage",
      },
      {
        id: "087PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_4b",
    gear: [
      {
        id: "015Prototype",
      },
      {
        id: "069Prototype",
      },
    ],
  },
  {
    id: "dark_normal_2g",
    gear: [
      {
        id: "017Prototype",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "dark_normal_6d",
    gear: [
      {
        id: "017Prototype",
      },
      {
        id: "032Prototype",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_4d",
    gear: [
      {
        id: "017Prototype",
      },
      {
        id: "055Prototype",
      },
    ],
  },
  {
    id: "dark_normal_3h",
    gear: [
      {
        id: "021Prototype",
      },
      {
        id: "078PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_6j",
    gear: [
      {
        id: "021Prototype",
      },
      {
        id: "040Prototype",
      },
      {
        id: "106PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_1d",
    gear: [
      {
        id: "021Prototype",
      },
      {
        id: "040Prototype",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_2a",
    gear: [
      {
        id: "021Prototype",
      },
      {
        id: "040Prototype",
      },
      {
        id: "091Salvage",
      },
    ],
  },
  {
    id: "light_normal_5c",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "095Salvage",
      },
    ],
  },
  {
    id: "light_hard_5d",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "061Prototype",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "095Salvage",
      },
    ],
  },
  {
    id: "light_normal_7a",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_1f",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_1b",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_4a",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "131Salvage",
      },
      {
        id: "171PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_hard_4b",
    gear: [
      {
        id: "028Prototype",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "158Salvage",
      },
    ],
  },
  {
    id: "dark_normal_8a",
    gear: [
      {
        id: "031Prototype",
      },
      {
        id: "065Salvage",
      },
      {
        id: "106PrototypeSalvage",
      },
      {
        id: "173Salvage",
      },
    ],
  },
  {
    id: "light_normal_5j",
    gear: [
      {
        id: "031Prototype",
      },
      {
        id: "084PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_3b",
    gear: [
      {
        id: "032Prototype",
      },
      {
        id: "076Salvage",
      },
    ],
  },
  {
    id: "dark_normal_7e",
    gear: [
      {
        id: "032Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "117PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_3d",
    gear: [
      {
        id: "032Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "114PrototypeSalvage",
      },
      {
        id: "170PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_hard_3c",
    gear: [
      {
        id: "032Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "119PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_2h",
    gear: [
      {
        id: "037Prototype",
      },
      {
        id: "044Prototype",
      },
      {
        id: "053Salvage",
      },
    ],
  },
  {
    id: "dark_normal_5j",
    gear: [
      {
        id: "037Prototype",
      },
      {
        id: "084PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7g",
    gear: [
      {
        id: "037Prototype",
      },
      {
        id: "050Salvage",
      },
      {
        id: "092Salvage",
      },
    ],
  },
  {
    id: "dark_normal_9a",
    gear: [
      {
        id: "037Prototype",
      },
      {
        id: "050Salvage",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "133Salvage",
      },
      {
        id: "163PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9b",
    gear: [
      {
        id: "037Prototype",
      },
      {
        id: "053Salvage",
      },
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "123Component",
      },
    ],
  },
  {
    id: "dark_normal_5f",
    gear: [
      {
        id: "040Prototype",
      },
      {
        id: "090PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_6j",
    gear: [
      {
        id: "040Prototype",
      },
      {
        id: "058Salvage",
      },
      {
        id: "087PrototypeSalvage",
      },
      {
        id: "106PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8b",
    gear: [
      {
        id: "040Prototype",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "117PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9d",
    gear: [
      {
        id: "040Prototype",
      },
      {
        id: "058Salvage",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "138Salvage",
      },
      {
        id: "153Salvage",
      },
      {
        id: "158PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_2e",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "054Salvage",
      },
    ],
  },
  {
    id: "dark_normal_4e",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "073PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_8h",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "dark_normal_9c",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "065Salvage",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "150Salvage",
      },
      {
        id: "161Salvage",
      },
      {
        id: "164PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_6b",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "100PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_8d",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "052Salvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9d",
    gear: [
      {
        id: "044Prototype",
      },
      {
        id: "072PrototypeSalvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "123Salvage",
      },
      {
        id: "149Salvage",
      },
    ],
  },
  {
    id: "dark_hard_5d",
    gear: [
      {
        id: "049Prototype",
      },
      {
        id: "053Salvage",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "096PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7a",
    gear: [
      {
        id: "049Prototype",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "114PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9f",
    gear: [
      {
        id: "049Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "130Component",
      },
      {
        id: "155Salvage",
      },
    ],
  },
  {
    id: "dark_normal_3d",
    gear: [
      {
        id: "055Prototype",
      },
      {
        id: "071PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_5b",
    gear: [
      {
        id: "055Prototype",
      },
      {
        id: "068PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_5c",
    gear: [
      {
        id: "055Prototype",
      },
      {
        id: "050Salvage",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "087PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_7f",
    gear: [
      {
        id: "055Prototype",
      },
      {
        id: "072PrototypeSalvage",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_9h",
    gear: [
      {
        id: "055Prototype",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "092Salvage",
      },
      {
        id: "129Salvage",
      },
      {
        id: "148Salvage",
      },
    ],
  },
  {
    id: "dark_normal_5k",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "092Salvage",
      },
    ],
  },
  {
    id: "dark_hard_5l",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "069Prototype",
      },
      {
        id: "092Salvage",
      },
      {
        id: "094PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_7d",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "053Salvage",
      },
      {
        id: "096PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_9g",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "156Salvage",
      },
      {
        id: "161Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_2g",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "065Salvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_2d",
    gear: [
      {
        id: "056Prototype",
      },
      {
        id: "065Salvage",
      },
      {
        id: "113Salvage",
      },
    ],
  },
  {
    id: "dark_normal_5e",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "072PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_5g",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "054Salvage",
      },
      {
        id: "072PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_5d",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "086PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_6a",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "076Salvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "light_normal_9g",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "101Salvage",
      },
      {
        id: "130Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_2f",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "076Salvage",
      },
      {
        id: "100PrototypeSalvage",
      },
      {
        id: "168PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_hard_2c",
    gear: [
      {
        id: "061Prototype",
      },
      {
        id: "076Salvage",
      },
      {
        id: "106PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_normal_5l",
    gear: [
      {
        id: "069Prototype",
      },
      {
        id: "094PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_normal_7e",
    gear: [
      {
        id: "069Prototype",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "113Salvage",
      },
    ],
  },
  {
    id: "light_normal_9c",
    gear: [
      {
        id: "069Prototype",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "158Salvage",
      },
      {
        id: "165PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_2e",
    gear: [
      {
        id: "069Prototype",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_3a",
    gear: [
      {
        id: "069Prototype",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "104PrototypeSalvage",
      },
      {
        id: "167PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_7h",
    gear: [
      {
        id: "050Salvage",
      },
      {
        id: "058Salvage",
      },
      {
        id: "092Salvage",
      },
      {
        id: "104PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_8d",
    gear: [
      {
        id: "050Salvage",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_6h",
    gear: [
      {
        id: "050Salvage",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "095Salvage",
      },
      {
        id: "104PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_6j",
    gear: [
      {
        id: "051Salvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
      {
        id: "101Salvage",
      },
    ],
  },
  {
    id: "light_hard_7d",
    gear: [
      {
        id: "052Salvage",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "112Salvage",
      },
      {
        id: "114PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_8d",
    gear: [
      {
        id: "052Salvage",
      },
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "100PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_7d",
    gear: [
      {
        id: "053Salvage",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "096PrototypeSalvage",
      },
      {
        id: "119PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_8g",
    gear: [
      {
        id: "053Salvage",
      },
      {
        id: "054Salvage",
      },
      {
        id: "119PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_7h",
    gear: [
      {
        id: "054Salvage",
      },
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "092Salvage",
      },
      {
        id: "108Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_4d",
    gear: [
      {
        id: "054Salvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "159Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_4e",
    gear: [
      {
        id: "054Salvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "123Salvage",
      },
    ],
  },
  {
    id: "light_hard_6e",
    gear: [
      {
        id: "057Salvage",
      },
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "light_hard_8c",
    gear: [
      {
        id: "057Salvage",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "096PrototypeSalvage",
      },
      {
        id: "097PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_4f",
    gear: [
      {
        id: "058Salvage",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "138Component",
      },
    ],
  },
  {
    id: "fleet_hard_5b",
    gear: [
      {
        id: "058Salvage",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "138Salvage",
      },
    ],
  },
  {
    id: "light_hard_6i",
    gear: [
      {
        id: "062Salvage",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "092Salvage",
      },
      {
        id: "094PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_7c",
    gear: [
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "114PrototypeSalvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_8h",
    gear: [
      {
        id: "063PrototypeSalvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "light_hard_9b",
    gear: [
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "097PrototypeSalvage",
      },
      {
        id: "123Salvage",
      },
      {
        id: "158Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_5e",
    gear: [
      {
        id: "064PrototypeSalvage",
      },
      {
        id: "095Salvage",
      },
      {
        id: "130Salvage",
      },
    ],
  },
  {
    id: "dark_hard_8c",
    gear: [
      {
        id: "065Salvage",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "106PrototypeSalvage",
      },
      {
        id: "117PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_7g",
    gear: [
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "117PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_5g",
    gear: [
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "151Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_5d",
    gear: [
      {
        id: "068PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "161Salvage",
      },
    ],
  },
  {
    id: "light_hard_8g",
    gear: [
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "108Salvage",
      },
      {
        id: "113Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_4c",
    gear: [
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "116PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_4d",
    gear: [
      {
        id: "071PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "133Component",
      },
    ],
  },
  {
    id: "light_hard_7g",
    gear: [
      {
        id: "072PrototypeSalvage",
      },
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "097PrototypeSalvage",
      },
      {
        id: "113Salvage",
      },
    ],
  },
  {
    id: "light_hard_8h",
    gear: [
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
      {
        id: "112Salvage",
      },
      {
        id: "133Salvage",
      },
    ],
  },
  {
    id: "light_hard_9a",
    gear: [
      {
        id: "073PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
      {
        id: "131Salvage",
      },
      {
        id: "133Component",
      },
    ],
  },
  {
    id: "dark_hard_9b",
    gear: [
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "087PrototypeSalvage",
      },
      {
        id: "138Salvage",
      },
      {
        id: "161Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_4b",
    gear: [
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "076Salvage",
      },
      {
        id: "158Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_4c",
    gear: [
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "076Salvage",
      },
      {
        id: "131Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_5h",
    gear: [
      {
        id: "075PrototypeSalvage",
      },
      {
        id: "152Salvage",
      },
    ],
  },
  {
    id: "light_hard_6d",
    gear: [
      {
        id: "076Salvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "100PrototypeSalvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_4g",
    gear: [
      {
        id: "076Salvage",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "166PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_hard_5c",
    gear: [
      {
        id: "076Salvage",
      },
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "129Component",
      },
    ],
  },
  {
    id: "fleet_normal_4e",
    gear: [
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "166PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_hard_5a",
    gear: [
      {
        id: "078PrototypeSalvage",
      },
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "159Salvage",
      },
    ],
  },
  {
    id: "dark_hard_9c",
    gear: [
      {
        id: "080PrototypeSalvage",
      },
      {
        id: "096PrototypeSalvage",
      },
      {
        id: "129Component",
      },
      {
        id: "130Component",
      },
    ],
  },
  {
    id: "dark_hard_6e",
    gear: [
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "091Salvage",
      },
      {
        id: "103PrototypeSalvage",
      },
    ],
  },
  {
    id: "dark_hard_9d",
    gear: [
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "090PrototypeSalvage",
      },
      {
        id: "138Salvage",
      },
      {
        id: "161Salvage",
      },
    ],
  },
  {
    id: "light_hard_9d",
    gear: [
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
      {
        id: "120PrototypeSalvage",
      },
      {
        id: "130Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_5d",
    gear: [
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "149Salvage",
      },
    ],
  },
  {
    id: "fleet_hard_5f",
    gear: [
      {
        id: "084PrototypeSalvage",
      },
      {
        id: "103PrototypeSalvage",
      },
      {
        id: "138Component",
      },
    ],
  },
  {
    id: "dark_hard_9a",
    gear: [
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "092Salvage",
      },
      {
        id: "133Salvage",
      },
      {
        id: "123Component",
      },
    ],
  },
  {
    id: "light_hard_7c",
    gear: [
      {
        id: "085PrototypeSalvage",
      },
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "101Salvage",
      },
      {
        id: "102Salvage",
      },
    ],
  },
  {
    id: "light_hard_9c",
    gear: [
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "100PrototypeSalvage",
      },
      {
        id: "129Salvage",
      },
      {
        id: "138Component",
      },
    ],
  },
  {
    id: "fleet_normal_5e",
    gear: [
      {
        id: "086PrototypeSalvage",
      },
      {
        id: "169PrototypeSalvage_V2",
      },
    ],
  },
  {
    id: "fleet_normal_5a",
    gear: [
      {
        id: "093PrototypeSalvage",
      },
      {
        id: "169PrototypeSalvage",
      },
    ],
  },
  {
    id: "fleet_normal_5c",
    gear: [
      {
        id: "103PrototypeSalvage",
      },
      {
        id: "150Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_5b",
    gear: [
      {
        id: "106PrototypeSalvage",
      },
      {
        id: "153Salvage",
      },
    ],
  },
  {
    id: "fleet_normal_5f",
    gear: [
      {
        id: "114PrototypeSalvage",
      },
      {
        id: "147Salvage",
      },
    ],
  },
];

const storesData = {
  guildStore: [
    {
      id: "150Salvage",
      dropRate: 0.33,
      slot: 2,
      count: 5,
    },
    {
      id: "149Salvage",
      dropRate: 0.33,
      slot: 2,
      count: 5,
    },
    {
      id: "153Salvage",
      dropRate: 0.33,
      slot: 2,
      count: 5,
    },
    {
      id: "150Salvage",
      dropRate: 0.33,
      slot: 3,
      count: 10,
    },
    {
      id: "149Salvage",
      dropRate: 0.33,
      slot: 3,
      count: 10,
    },
    {
      id: "153Salvage",
      dropRate: 0.33,
      slot: 3,
      count: 10,
    },
    {
      id: "140Salvage",
      dropRate: 0.25,
      slot: 4,
      count: 5,
    },
    {
      id: "143Salvage",
      dropRate: 0.25,
      slot: 4,
      count: 5,
    },
    {
      id: "144Salvage",
      dropRate: 0.25,
      slot: 4,
      count: 5,
    },
    {
      id: "120PrototypeSalvage",
      dropRate: 0.25,
      slot: 4,
      count: 5,
    },
    {
      id: "140Salvage",
      dropRate: 0.25,
      slot: 5,
      count: 10,
    },
    {
      id: "143Salvage",
      dropRate: 0.25,
      slot: 5,
      count: 10,
    },
    {
      id: "144Salvage",
      dropRate: 0.25,
      slot: 5,
      count: 10,
    },
    {
      id: "120PrototypeSalvage",
      dropRate: 0.25,
      slot: 5,
      count: 10,
    },
    {
      id: "133Component",
      dropRate: 0.2,
      slot: 6,
      count: 5,
    },
    {
      id: "133Salvage",
      dropRate: 0.2,
      slot: 6,
      count: 5,
    },
    {
      id: "129Salvage",
      dropRate: 0.2,
      slot: 6,
      count: 5,
    },
    {
      id: "160Salvage",
      dropRate: 0.2,
      slot: 6,
      count: 5,
    },
    {
      id: "129Component",
      dropRate: 0.2,
      slot: 6,
      count: 5,
    },
    {
      id: "133Component",
      dropRate: 0.2,
      slot: 7,
      count: 10,
    },
    {
      id: "133Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 10,
    },
    {
      id: "129Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 10,
    },
    {
      id: "160Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 10,
    },
    {
      id: "129Component",
      dropRate: 0.2,
      slot: 7,
      count: 10,
    },
    {
      id: "108Salvage",
      dropRate: 0.33,
      slot: 8,
      count: 5,
    },
    {
      id: "112Salvage",
      dropRate: 0.33,
      slot: 8,
      count: 5,
    },
    {
      id: "102Salvage",
      dropRate: 0.33,
      slot: 8,
      count: 5,
    },
    {
      id: "108Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 10,
    },
    {
      id: "112Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 10,
    },
    {
      id: "102Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 10,
    },
    {
      id: "102Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 5,
    },
    {
      id: "135Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 5,
    },
    {
      id: "136Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 5,
    },
    {
      id: "145Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 5,
    },
    {
      id: "146Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 5,
    },
    {
      id: "135Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 10,
    },
    {
      id: "136Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 10,
    },
    {
      id: "145Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 10,
    },
    {
      id: "146Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 10,
    },
    {
      id: "078",
      dropRate: 0.2,
      slot: 12,
      count: 5,
    },
    {
      id: "080PrototypeSalvage",
      dropRate: 0.2,
      slot: 12,
      count: 5,
    },
    {
      id: "090PrototypeSalvage",
      dropRate: 0.2,
      slot: 12,
      count: 5,
    },
    {
      id: "077",
      dropRate: 0.2,
      slot: 12,
      count: 5,
    },
    {
      id: "092Salvage",
      dropRate: 0.2,
      slot: 12,
      count: 5,
    },
    {
      id: "049",
      dropRate: 0.2,
      slot: 13,
      count: 5,
    },
    {
      id: "056",
      dropRate: 0.2,
      slot: 13,
      count: 5,
    },
    {
      id: "044Prototype",
      dropRate: 0.2,
      slot: 13,
      count: 5,
    },
    {
      id: "036",
      dropRate: 0.2,
      slot: 13,
      count: 5,
    },
    {
      id: "073",
      dropRate: 0.2,
      slot: 13,
      count: 5,
    },
    {
      id: "061Prototype",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
    {
      id: "067",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
    {
      id: "053Salvage",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
    {
      id: "064PrototypeSalvage",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
    {
      id: "060",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
    {
      id: "072",
      dropRate: 0.1667,
      slot: 14,
      count: 5,
    },
  ],
  squadArenaStore: [
    {
      id: "055Prototype",
      dropRate: 0.25,
      slot: 21,
      count: 10,
    },
    {
      id: "065Salvage",
      dropRate: 0.25,
      slot: 21,
      count: 10,
    },
    {
      id: "072PrototypeSalvage",
      dropRate: 0.25,
      slot: 21,
      count: 10,
    },
    {
      id: "002",
      dropRate: 0.25,
      slot: 21,
      count: 10,
    },
    {
      id: "093PrototypeSalvage",
      dropRate: 0.3,
      slot: 22,
      count: 5,
    },
    {
      id: "104PrototypeSalvage",
      dropRate: 0.3,
      slot: 22,
      count: 5,
    },
    {
      id: "100PrototypeSalvage",
      dropRate: 0.3,
      slot: 22,
      count: 5,
    },
    {
      id: "093PrototypeSalvage",
      dropRate: 0.25,
      slot: 23,
      count: 5,
    },
    {
      id: "094PrototypeSalvage",
      dropRate: 0.25,
      slot: 23,
      count: 5,
    },
    {
      id: "097PrototypeSalvage",
      dropRate: 0.25,
      slot: 23,
      count: 5,
    },
    {
      id: "103PrototypeSalvage",
      dropRate: 0.25,
      slot: 23,
      count: 5,
    },
    {
      id: "136Salvage",
      dropRate: 0.33,
      slot: 24,
      count: 5,
    },
    {
      id: "146Salvage",
      dropRate: 0.33,
      slot: 24,
      count: 5,
    },
    {
      id: "145Salvage",
      dropRate: 0.33,
      slot: 24,
      count: 5,
    },
  ],
  guildEventsStore_get2: [
    {
      id: "176Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 4,
    },
    {
      id: "176Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 8,
    },
    {
      id: "174Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 4,
    },
    {
      id: "174Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 8,
    },
    {
      id: "175Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 4,
    },
    {
      id: "175Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 3,
      count: 8,
    },
    {
      id: "167PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 4,
    },
    {
      id: "167PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 8,
    },
    {
      id: "168PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 4,
    },
    {
      id: "168PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 8,
    },
    {
      id: "166PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 4,
    },
    {
      id: "166PrototypeSalvage",
      dropRate: 0.1667,
      slot: 4,
      count: 8,
    },
    {
      id: "171PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 4,
    },
    {
      id: "171PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 8,
    },
    {
      id: "169PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 4,
    },
    {
      id: "169PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 8,
    },
    {
      id: "170PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 4,
    },
    {
      id: "170PrototypeSalvage",
      dropRate: 0.1667,
      slot: 5,
      count: 8,
    },
    {
      id: "166PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 4,
    },
    {
      id: "166PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 8,
    },
    {
      id: "168PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 4,
    },
    {
      id: "168PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 8,
    },
    {
      id: "167PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 4,
    },
    {
      id: "167PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 6,
      count: 8,
    },
    {
      id: "171PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 4,
    },
    {
      id: "171PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 8,
    },
    {
      id: "169PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 4,
    },
    {
      id: "169PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 8,
    },
    {
      id: "170PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 4,
    },
    {
      id: "170PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 7,
      count: 8,
    },
    {
      id: "172Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 5,
    },
    {
      id: "172Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 15,
    },
    {
      id: "173Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 5,
    },
    {
      id: "173Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 15,
    },
  ],
  guildEventsStore_get1: [
    {
      id: "158PrototypeSalvage",
      dropRate: 0.25,
      slot: 5,
      count: 5,
    },
    {
      id: "159PrototypeSalvage",
      dropRate: 0.25,
      slot: 5,
      count: 5,
    },
    {
      id: "161PrototypeSalvage",
      dropRate: 0.25,
      slot: 5,
      count: 5,
    },
    {
      id: "160PrototypeSalvage",
      dropRate: 0.25,
      slot: 5,
      count: 5,
    },
    {
      id: "158PrototypeSalvage",
      dropRate: 0.25,
      slot: 6,
      count: 10,
    },
    {
      id: "159PrototypeSalvage",
      dropRate: 0.25,
      slot: 6,
      count: 10,
    },
    {
      id: "161PrototypeSalvage",
      dropRate: 0.25,
      slot: 6,
      count: 10,
    },
    {
      id: "160PrototypeSalvage",
      dropRate: 0.25,
      slot: 6,
      count: 10,
    },
    {
      id: "164PrototypeSalvage",
      dropRate: 0.25,
      slot: 7,
      count: 5,
    },
    {
      id: "163PrototypeSalvage",
      dropRate: 0.25,
      slot: 7,
      count: 5,
    },
    {
      id: "165PrototypeSalvage",
      dropRate: 0.25,
      slot: 7,
      count: 5,
    },
    {
      id: "162PrototypeSalvage",
      dropRate: 0.25,
      slot: 7,
      count: 5,
    },
    {
      id: "164PrototypeSalvage",
      dropRate: 0.25,
      slot: 8,
      count: 10,
    },
    {
      id: "163PrototypeSalvage",
      dropRate: 0.25,
      slot: 8,
      count: 10,
    },
    {
      id: "165PrototypeSalvage",
      dropRate: 0.25,
      slot: 8,
      count: 10,
    },
    {
      id: "162PrototypeSalvage",
      dropRate: 0.25,
      slot: 8,
      count: 10,
    },
    {
      id: "147Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 5,
    },
    {
      id: "151Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 5,
    },
    {
      id: "148Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 5,
    },
    {
      id: "152Salvage",
      dropRate: 0.25,
      slot: 9,
      count: 5,
    },
    {
      id: "147Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 10,
    },
    {
      id: "151Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 10,
    },
    {
      id: "148Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 10,
    },
    {
      id: "152Salvage",
      dropRate: 0.25,
      slot: 10,
      count: 10,
    },
    {
      id: "157Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 5,
    },
    {
      id: "154Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 5,
    },
    {
      id: "156Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 5,
    },
    {
      id: "155Salvage",
      dropRate: 0.25,
      slot: 11,
      count: 5,
    },
    {
      id: "157Salvage",
      dropRate: 0.25,
      slot: 12,
      count: 10,
    },
    {
      id: "154Salvage",
      dropRate: 0.25,
      slot: 12,
      count: 10,
    },
    {
      id: "156Salvage",
      dropRate: 0.25,
      slot: 12,
      count: 10,
    },
    {
      id: "155Salvage",
      dropRate: 0.25,
      slot: 12,
      count: 10,
    },
    {
      id: "123Salvage",
      dropRate: 0.25,
      slot: 13,
      count: 5,
    },
    {
      id: "123Salvage",
      dropRate: 0.1667,
      slot: 13,
      count: 10,
    },
    {
      id: "131Salvage",
      dropRate: 0.1667,
      slot: 13,
      count: 5,
    },
    {
      id: "131Salvage",
      dropRate: 0.1667,
      slot: 13,
      count: 10,
    },
    {
      id: "116PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 5,
    },
    {
      id: "116PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 10,
    },
    {
      id: "138Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 5,
    },
    {
      id: "138Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 10,
    },
    {
      id: "138Component",
      dropRate: 0.125,
      slot: 14,
      count: 5,
    },
    {
      id: "138Component",
      dropRate: 0.125,
      slot: 14,
      count: 10,
    },
    {
      id: "130Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 5,
    },
    {
      id: "130Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 10,
    },
    {
      id: "130Component",
      dropRate: 0.125,
      slot: 14,
      count: 5,
    },
    {
      id: "130Component",
      dropRate: 0.125,
      slot: 14,
      count: 10,
    },
    {
      id: "161Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 5,
    },
    {
      id: "161Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 10,
    },
    {
      id: "159Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 5,
    },
    {
      id: "159Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 10,
    },
    {
      id: "158Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 5,
    },
    {
      id: "158Salvage",
      dropRate: 0.125,
      slot: 15,
      count: 10,
    },
    {
      id: "117PrototypeSalvage",
      dropRate: 0.125,
      slot: 15,
      count: 5,
    },
    {
      id: "117PrototypeSalvage",
      dropRate: 0.125,
      slot: 15,
      count: 10,
    },
    {
      id: "113Salvage",
      dropRate: 0.2,
      slot: 16,
      count: 5,
    },
    {
      id: "104PrototypeSalvage",
      dropRate: 0.2,
      slot: 16,
      count: 5,
    },
    {
      id: "108Salvage",
      dropRate: 0.2,
      slot: 16,
      count: 5,
    },
    {
      id: "112Salvage",
      dropRate: 0.2,
      slot: 16,
      count: 5,
    },
    {
      id: "106PrototypeSalvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "113Salvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "104PrototypeSalvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "108Salvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "112Salvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "106PrototypeSalvage",
      dropRate: 0.2,
      slot: 17,
      count: 10,
    },
    {
      id: "097PrototypeSalvage",
      dropRate: 0.2,
      slot: 18,
      count: 5,
    },
    {
      id: "094PrototypeSalvage",
      dropRate: 0.2,
      slot: 18,
      count: 5,
    },
    {
      id: "090PrototypeSalvage",
      dropRate: 0.2,
      slot: 18,
      count: 5,
    },
    {
      id: "092Salvage",
      dropRate: 0.2,
      slot: 18,
      count: 5,
    },
    {
      id: "102Salvage",
      dropRate: 0.2,
      slot: 18,
      count: 5,
    },
    {
      id: "101Salvage",
      dropRate: 0.25,
      slot: 19,
      count: 5,
    },
    {
      id: "091Salvage",
      dropRate: 0.25,
      slot: 19,
      count: 5,
    },
    {
      id: "093PrototypeSalvage",
      dropRate: 0.25,
      slot: 19,
      count: 5,
    },
    {
      id: "095Salvage",
      dropRate: 0.25,
      slot: 19,
      count: 5,
    },
    {
      id: "066",
      dropRate: 0.2,
      slot: 20,
      count: 5,
    },
    {
      id: "086PrototypeSalvage",
      dropRate: 0.2,
      slot: 20,
      count: 5,
    },
    {
      id: "043",
      dropRate: 0.2,
      slot: 20,
      count: 5,
    },
    {
      id: "072PrototypeSalvage",
      dropRate: 0.2,
      slot: 20,
      count: 5,
    },
    {
      id: "080PrototypeSalvage",
      dropRate: 0.2,
      slot: 20,
      count: 5,
    },
  ],
  championshipStore: [
    {
      id: "176Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 2,
    },
    {
      id: "176Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 5,
    },
    {
      id: "174Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 2,
    },
    {
      id: "174Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 5,
    },
    {
      id: "175Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 2,
    },
    {
      id: "175Ingredient_Salvage",
      dropRate: 0.1667,
      slot: 1,
      count: 5,
    },
    {
      id: "168PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 2,
    },
    {
      id: "168PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 5,
    },
    {
      id: "171PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 2,
    },
    {
      id: "171PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 5,
    },
    {
      id: "166PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 2,
    },
    {
      id: "166PrototypeSalvage",
      dropRate: 0.1667,
      slot: 2,
      count: 5,
    },
    {
      id: "167PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 2,
    },
    {
      id: "167PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 5,
    },
    {
      id: "169PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 2,
    },
    {
      id: "169PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 5,
    },
    {
      id: "170PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 2,
    },
    {
      id: "170PrototypeSalvage",
      dropRate: 0.1667,
      slot: 3,
      count: 5,
    },
    {
      id: "171PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 2,
    },
    {
      id: "171PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 5,
    },
    {
      id: "166PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 2,
    },
    {
      id: "166PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 5,
    },
    {
      id: "168PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 2,
    },
    {
      id: "168PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 4,
      count: 5,
    },
    {
      id: "170PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 2,
    },
    {
      id: "170PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 5,
    },
    {
      id: "169PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 2,
    },
    {
      id: "169PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 5,
    },
    {
      id: "167PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 2,
    },
    {
      id: "167PrototypeSalvage_V2",
      dropRate: 0.1667,
      slot: 5,
      count: 5,
    },
    {
      id: "172Salvage",
      dropRate: 0.25,
      slot: 6,
      count: 4,
    },
    {
      id: "172Salvage",
      dropRate: 0.25,
      slot: 6,
      count: 8,
    },
    {
      id: "173Salvage",
      dropRate: 0.25,
      slot: 6,
      count: 4,
    },
    {
      id: "173Salvage",
      dropRate: 0.25,
      slot: 6,
      count: 8,
    },
    {
      id: "159Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 5,
    },
    {
      id: "159Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 10,
    },
    {
      id: "146Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 5,
    },
    {
      id: "146Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 10,
    },
    {
      id: "136Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 5,
    },
    {
      id: "136Salvage",
      dropRate: 0.125,
      slot: 7,
      count: 10,
    },
    {
      id: "116PrototypeSalvage",
      dropRate: 0.125,
      slot: 7,
      count: 5,
    },
    {
      id: "116PrototypeSalvage",
      dropRate: 0.125,
      slot: 7,
      count: 10,
    },
    {
      id: "129Component",
      dropRate: 0.125,
      slot: 8,
      count: 5,
    },
    {
      id: "129Component",
      dropRate: 0.125,
      slot: 8,
      count: 10,
    },
    {
      id: "135Salvage",
      dropRate: 0.125,
      slot: 8,
      count: 5,
    },
    {
      id: "135Salvage",
      dropRate: 0.125,
      slot: 8,
      count: 10,
    },
    {
      id: "091Salvage",
      dropRate: 0.125,
      slot: 8,
      count: 5,
    },
    {
      id: "091Salvage",
      dropRate: 0.125,
      slot: 8,
      count: 10,
    },
    {
      id: "130Component",
      dropRate: 0.125,
      slot: 9,
      count: 5,
    },
    {
      id: "130Component",
      dropRate: 0.125,
      slot: 9,
      count: 10,
    },
    {
      id: "130Salvage",
      dropRate: 0.125,
      slot: 9,
      count: 5,
    },
    {
      id: "130Salvage",
      dropRate: 0.125,
      slot: 9,
      count: 10,
    },
    {
      id: "131Salvage",
      dropRate: 0.125,
      slot: 9,
      count: 5,
    },
    {
      id: "131Salvage",
      dropRate: 0.125,
      slot: 9,
      count: 10,
    },
    {
      id: "120PrototypeSalvage",
      dropRate: 0.125,
      slot: 10,
      count: 5,
    },
    {
      id: "120PrototypeSalvage",
      dropRate: 0.125,
      slot: 10,
      count: 10,
    },
    {
      id: "138Component",
      dropRate: 0.125,
      slot: 10,
      count: 5,
    },
    {
      id: "138Component",
      dropRate: 0.125,
      slot: 10,
      count: 10,
    },
    {
      id: "113Salvage",
      dropRate: 0.125,
      slot: 10,
      count: 5,
    },
    {
      id: "113Salvage",
      dropRate: 0.125,
      slot: 10,
      count: 10,
    },
  ],
  shardShop: [
    {
      id: "168PrototypeSalvage",
      dropRate: 0.333,
      slot: 2,
      count: 4,
    },
    {
      id: "171PrototypeSalvage",
      dropRate: 0.333,
      slot: 2,
      count: 4,
    },
    {
      id: "166PrototypeSalvage",
      dropRate: 0.333,
      slot: 2,
      count: 4,
    },
    {
      id: "167PrototypeSalvage",
      dropRate: 0.333,
      slot: 3,
      count: 4,
    },
    {
      id: "170PrototypeSalvage",
      dropRate: 0.333,
      slot: 3,
      count: 4,
    },
    {
      id: "169PrototypeSalvage",
      dropRate: 0.333,
      slot: 3,
      count: 4,
    },
    {
      id: "166PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 4,
      count: 4,
    },
    {
      id: "171PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 4,
      count: 4,
    },
    {
      id: "168PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 4,
      count: 4,
    },
    {
      id: "167PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 5,
      count: 4,
    },
    {
      id: "170PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 5,
      count: 4,
    },
    {
      id: "169PrototypeSalvage_V2",
      dropRate: 0.333,
      slot: 5,
      count: 4,
    },
    {
      id: "158PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "164PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "161PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "163PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "165PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "162PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "159PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "160PrototypeSalvage",
      dropRate: 0.125,
      slot: 6,
      count: 4,
    },
    {
      id: "157Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 4,
    },
    {
      id: "148Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 4,
    },
    {
      id: "156Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 4,
    },
    {
      id: "154Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 4,
    },
    {
      id: "155Salvage",
      dropRate: 0.2,
      slot: 7,
      count: 4,
    },
    {
      id: "147Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 4,
    },
    {
      id: "151Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 4,
    },
    {
      id: "152Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 4,
    },
    {
      id: "131Salvage",
      dropRate: 0.25,
      slot: 8,
      count: 4,
    },
    {
      id: "159Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 5,
    },
    {
      id: "129Component",
      dropRate: 0.1111,
      slot: 10,
      count: 5,
    },
    {
      id: "130Component",
      dropRate: 0.1111,
      slot: 10,
      count: 5,
    },
    {
      id: "135Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 3,
    },
    {
      id: "139Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 3,
    },
    {
      id: "144Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 3,
    },
    {
      id: "150Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 5,
    },
    {
      id: "136Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 3,
    },
    {
      id: "149Salvage",
      dropRate: 0.1111,
      slot: 10,
      count: 5,
    },
    {
      id: "138Component",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "161Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "158Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "123Component",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "129Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "145Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 3,
    },
    {
      id: "160Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 3,
    },
    {
      id: "119PrototypeSalvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "112Salvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "108Salvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "104PrototypeSalvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "106PrototypeSalvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "117PrototypeSalvage",
      dropRate: 0.1667,
      slot: 12,
      count: 6,
    },
    {
      id: "087PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "103PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "090PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "097PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "096PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "100PrototypeSalvage",
      dropRate: 0.1667,
      slot: 13,
      count: 6,
    },
    {
      id: "092Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 6,
    },
    {
      id: "091Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 6,
    },
    {
      id: "101Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 6,
    },
    {
      id: "095Salvage",
      dropRate: 0.125,
      slot: 14,
      count: 6,
    },
    {
      id: "065",
      dropRate: 0.125,
      slot: 14,
      count: 1,
    },
    {
      id: "052",
      dropRate: 0.125,
      slot: 14,
      count: 1,
    },
    {
      id: "062",
      dropRate: 0.125,
      slot: 14,
      count: 1,
    },
    {
      id: "064",
      dropRate: 0.125,
      slot: 14,
      count: 1,
    },
    {
      id: "057",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "071Prototype",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "073Prototype",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "054",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "075Prototype",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "086Prototype",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "078Prototype",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
    {
      id: "084",
      dropRate: 0.125,
      slot: 15,
      count: 1,
    },
  ],
  conquestStore: [
    {
      id: "160Salvage",
      dropRate: 0.2,
      slot: 10,
      count: 5,
    },
    {
      id: "139Salvage",
      dropRate: 0.2,
      slot: 10,
      count: 5,
    },
    {
      id: "146Salvage",
      dropRate: 0.2,
      slot: 10,
      count: 5,
    },
    {
      id: "143Salvage",
      dropRate: 0.2,
      slot: 10,
      count: 5,
    },
    {
      id: "149Salvage",
      dropRate: 0.2,
      slot: 10,
      count: 5,
    },
    {
      id: "149Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "117PrototypeSalvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "135Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "150Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "153Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "112Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
    {
      id: "095Salvage",
      dropRate: 100 / 7,
      slot: 11,
      count: 5,
    },
  ],
};

export { nodeList, gearList, storesData };
