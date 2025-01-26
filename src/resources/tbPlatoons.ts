const redundancyCoverageAmount = 3;

const platoonData = [
  {
    phase: 1,
    label: "Phase 1",
    characters: {
      requirement: {
        type: "Relic",
        amount: 5,
      },
      darkside: [
        {
          id: "DARTHTRAYA",
          amount: 7,
          difficulty: 3,
        },
        {
          id: "DARTHREVAN",
          amount: 5,
          difficulty: 5,
        },
        {
          id: "GRIEVOUS",
          amount: 5,
          difficulty: 5,
        },
        {
          id: "TRIPLEZERO",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "EMPERORPALPATINE",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "WATTAMBOR",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "GRANDADMIRALTHRAWN",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "UGNAUGHT",
          amount: 3,
          difficulty: 1,
        },
        {
          id: "BT1",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "CANDEROUSORDO",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "MAUL",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "DARTHSIDIOUS",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "DARTHSION",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "VADER",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "DROIDEKA",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "FIRSTORDEROFFICERMALE",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "FIRSTORDERSPECIALFORCESPILOT",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "IG88",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "ASAJVENTRESS",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "B1BATTLEDROIDV2",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "BOBAFETT",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "COUNTDOOKU",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "DARKTROOPER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "DENGAR",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "EMBO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FIFTHBROTHER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GAMORREANGUARD",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "IG86SENTINELDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "IMPERIALSUPERCOMMANDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JANGOFETT",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "MARAJADE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "NIGHTSISTERINITIATE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NINTHSISTER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "NUTEGUNRAY",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SITHASSASSIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "TIEFIGHTERPILOT",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TUSKENSHAMAN",
          amount: 1,
          difficulty: 3,
        },
      ],
      mixed: [
        {
          id: "BOBAFETTSCION",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "DARTHREVAN",
          amount: 5,
          difficulty: 5,
        },
        {
          id: "C3POLEGENDARY",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "DARTHTRAYA",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "BENSOLO",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "DARTHMALGUS",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "GENERALKENOBI",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "GEONOSIANBROODALPHA",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "HANSOLO",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "KIADIMUNDI",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "THEMANDALORIANBESKARARMOR",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "WATTAMBOR",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "ADMIRALPIETT",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "BB8",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "BOSSK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "BT1",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CLONESERGEANTPHASEI",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "COLONELSTARCK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MAUL",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "DARTHSION",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "VADER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "EETHKOTH",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "EMPERORPALPATINE",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "GRANDADMIRALTHRAWN",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HERMITYODA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "BADBATCHHUNTER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "IMAGUNDI",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JAWAENGINEER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "JOLEEBINDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "LOGRAY",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "PAPLOO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "POE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HOTHLEIA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "REYJEDITRAINING",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SANASTARROS",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "T3_M4",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TALIA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "C3POCHEWBACCA",
          amount: 1,
          difficulty: 5,
        },
      ],
      lightside: [
        {
          id: "GENERALSKYWALKER",
          amount: 10,
          difficulty: 4,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 8,
          difficulty: 4,
        },
        {
          id: "HERMITYODA",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "BB8",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "THEMANDALORIANBESKARARMOR",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "SANASTARROS",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "C3POLEGENDARY",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "HANSOLO",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "GENERALKENOBI",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "LOGRAY",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "REYJEDITRAINING",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "C3POCHEWBACCA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "FULCRUMAHSOKA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "AMILYNHOLDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "BARRISSOFFEE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CC2224",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GREEFKARGA",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HONDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "JOLEEBINDO",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "JYNERSO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "KIADIMUNDI",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "KUIIL",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "L3_37",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "LOBOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HOTHLEIA",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SABINEWRENS3",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TEEBO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ARMORER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "VISASMARR",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "ZAALBAR",
          amount: 1,
          difficulty: 1,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "CAPITALCHIMAERA",
          amount: 6,
          difficulty: 4,
        },
        {
          id: "HOUNDSTOOTH",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "GAUNTLETSTARFIGHTER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "GEONOSIANSTARFIGHTER3",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "HYENABOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEBOMBERIMPERIAL",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIEFIGHTERIMPERIAL",
          amount: 1,
          difficulty: 4,
        },
      ],
      mixed: [
        {
          id: "TIEINTERCEPTOR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "JEDISTARFIGHTERANAKIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "ARC170CLONESERGEANT",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HYENABOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "COMMANDSHUTTLE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CAPITALMALEVOLENCE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "BLADEOFDORIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "RAZORCREST",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TIESILENCER",
          amount: 1,
          difficulty: 4,
        },
      ],
      lightside: [
        {
          id: "PHANTOM2",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "JEDISTARFIGHTERANAKIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CAPITALMONCALAMARICRUISER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "BLADEOFDORIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "RAVENSCLAW",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "XWINGRESISTANCE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "UMBARANSTARFIGHTER",
          amount: 1,
          difficulty: 4,
        },
      ],
    },
  },
  {
    phase: 2,
    label: "Phase 2",
    characters: {
      requirement: {
        type: "Relic",
        amount: 6,
      },
      darkside: [
        {
          id: "BOBAFETTSCION",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "DARTHREVAN",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "DARTHMALGUS",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "EMPERORPALPATINE",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "GRANDADMIRALTHRAWN",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "MAULS7",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "DARTHMALAK",
          amount: 4,
          difficulty: 3,
        },
        {
          id: "GRANDINQUISITOR",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 3,
          difficulty: 1,
        },
        {
          id: "STARKILLER",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "B2SUPERBATTLEDROID",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "FIRSTORDEROFFICERMALE",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "KYLORENUNMASKED",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "SITHPALPATINE",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "WATTAMBOR",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "ASAJVENTRESS",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CADBANE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "COLONELSTARCK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "DARTHTALON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "DEATHTROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "DENGAR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "DROIDEKA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "DARKTROOPER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "GRIEVOUS",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "VEERS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MAGMATROOPER",
          amount: 1,
          difficulty: 1,
        },
      ],
      mixed: [
        {
          id: "COMMANDERAHSOKA",
          amount: 6,
          difficulty: 4,
        },
        {
          id: "BOBAFETTSCION",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "MAULS7",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "HOTHLEIA",
          amount: 4,
          difficulty: 3,
        },
        {
          id: "BENSOLO",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "GRANDINQUISITOR",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "EMBO",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "SITHPALPATINE",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "WATTAMBOR",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "AAYLASECURA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ADMIRALACKBAR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BASTILASHAN",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "BT1",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "COUNTDOOKU",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "DARTHMALAK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "DEATHTROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GENERALHUX",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "GENERALKENOBI",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "VEERS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HANSOLO",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HERMITYODA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JAWA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "KIADIMUNDI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KUIIL",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "L3_37",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ADMINISTRATORLANDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "LOGRAY",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "LORDVADER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "GLREY",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SANASTARROS",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SNOWTROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "STARKILLER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "THEMANDALORIAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "C3POCHEWBACCA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "ZAALBAR",
          amount: 1,
          difficulty: 1,
        },
      ],
      lightside: [
        {
          id: "BENSOLO",
          amount: 10,
          difficulty: 4,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "BB8",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "C3POLEGENDARY",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "GREEFKARGA",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "KANANJARRUSS3",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "GLREY",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "REYJEDITRAINING",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "AAYLASECURA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ADMIRALRADDUS",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "ARCTROOPER501ST",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "BODHIROOK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CLONESERGEANTPHASEI",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "CT210408",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CT5555",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CT7567",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "ENFYSNEST",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EZRABRIDGERS3",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "JUHANI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "L3_37",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MONMOTHMA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHOMEGA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "PAO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ROSETICO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "YOUNGCHEWBACCA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SMUGGLERCHEWBACCA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "WEDGEANTILLES",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "YOUNGHAN",
          amount: 1,
          difficulty: 1,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "SCYTHE",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "TIEINTERCEPTOR",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "CAPITALCHIMAERA",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CAPITALSTARDESTROYER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HYENABOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "COMMANDSHUTTLE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CAPITALMALEVOLENCE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "SITHINFILTRATOR",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FIRSTORDERTIEECHELON",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TIEREAPER",
          amount: 1,
          difficulty: 4,
        },
      ],
      mixed: [
        {
          id: "SCYTHE",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "RAZORCREST",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "TIEINTERCEPTOR",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "BLADEOFDORIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "UWINGROGUEONE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 3,
        },
      ],
      lightside: [
        {
          id: "RAZORCREST",
          amount: 12,
          difficulty: 2,
        },
        {
          id: "YWINGCLONEWARS",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "GHOST",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "OUTRIDER",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "CAPITALPROFUNDITY",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "UWINGSCARIF",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CAPITALJEDICRUISER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "MILLENNIUMFALCON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "JEDISTARFIGHTERCONSULAR",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "XWINGBLACKONE",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "RAVENSCLAW",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "EBONHAWK",
          amount: 1,
          difficulty: 3,
        },
      ],
    },
  },
  {
    phase: 3,
    label: "Phase 3",
    characters: {
      requirement: {
        type: "Relic",
        amount: 7,
      },
      darkside: [
        {
          id: "DARTHMALGUS",
          amount: 9,
          difficulty: 4,
        },
        {
          id: "LORDVADER",
          amount: 6,
          difficulty: 3,
        },
        {
          id: "MAULS7",
          amount: 6,
          difficulty: 3,
        },
        {
          id: "BOBAFETTSCION",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "SITHPALPATINE",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "GRIEVOUS",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "WATTAMBOR",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "DENGAR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "TUSKENRAIDER",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "TRIPLEZERO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "AURRA_SING",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CADBANE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DARKTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAUL",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "DARTHREVAN",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "DARTHTRAYA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "DIRECTORKRENNIC",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EMBO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDERSPECIALFORCESPILOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GARSAXON",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GENERALHUX",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GRANDADMIRALTHRAWN",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "GRANDMOFFTARKIN",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "IG88",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MOTHERTALZIN",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "SAVAGEOPRESS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SEVENTHSISTER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "SITHASSASSIN",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "TALIA",
          amount: 1,
          difficulty: 1,
        },
      ],
      mixed: [
        {
          id: "BOBAFETTSCION",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "MAULS7",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "SITHPALPATINE",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "BASTILASHANDARK",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "DARTHMALAK",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "OLDBENKENOBI",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "STARKILLER",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "50RT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "B1BATTLEDROIDV2",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BARRISSOFFEE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "BODHIROOK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CARADUNE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CHIRRUTIMWE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CORUSCANTUNDERWORLDPOLICE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "EWOKELDER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "EWOKSCOUT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "TUSKENCHIEFTAIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GEONOSIANSPY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HONDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HOTHREBELSCOUT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BADBATCHHUNTER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KYLORENUNMASKED",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "LUMINARAUNDULI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MARAJADE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "NIGHTSISTERACOLYTE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "QUIGONJINN",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "EPIXFINN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EPIXPOE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ROSETICO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "UNDERCOVERLANDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TEEBO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "YOUNGHAN",
          amount: 1,
          difficulty: 1,
        },
      ],
      lightside: [
        {
          id: "BENSOLO",
          amount: 6,
          difficulty: 4,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "LOGRAY",
          amount: 5,
          difficulty: 1,
        },
        {
          id: "GLREY",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "BB8",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "C3POLEGENDARY",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "KIADIMUNDI",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "PADMEAMIDALA",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "HANSOLO",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "HERMITYODA",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "HOTHLEIA",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "RESISTANCETROOPER",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "CLONESERGEANTPHASEI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CT5555",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "EWOKSCOUT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GENERALKENOBI",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HOTHREBELSCOUT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "HOTHREBELSOLDIER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ANAKINKNIGHT",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "K2SO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MACEWINDU",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "REYJEDITRAINING",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "UNDERCOVERLANDO",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GREEFKARGA",
          amount: 5,
          difficulty: 2,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "SCYTHE",
          amount: 9,
          difficulty: 2,
        },
        {
          id: "TIEINTERCEPTOR",
          amount: 8,
          difficulty: 2,
        },
        {
          id: "CAPITALCHIMAERA",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEFIGHTERFOSF",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GEONOSIANSTARFIGHTER2",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GEONOSIANSTARFIGHTER3",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HYENABOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEFIGHTERIMPERIAL",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIEADVANCED",
          amount: 1,
          difficulty: 4,
        },
      ],
      mixed: [
        {
          id: "TIEINTERCEPTOR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "SCYTHE",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "RAZORCREST",
          amount: 4,
          difficulty: 3,
        },
        {
          id: "CAPITALFINALIZER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEFIGHTERFOSF",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GAUNTLETSTARFIGHTER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "IG2000",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEREAPER",
          amount: 1,
          difficulty: 4,
        },
      ],
      lightside: [
        {
          id: "RAZORCREST",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "MILLENNIUMFALCON",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "MILLENNIUMFALCONPRISTINE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CAPITALNEGOTIATOR",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "RAVENSCLAW",
          amount: 1,
          difficulty: 3,
        },
      ],
    },
  },
  {
    phase: 4,
    label: "Phase 4",
    characters: {
      requirement: {
        type: "Relic",
        amount: 8,
      },
      darkside: [
        {
          id: "STARKILLER",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "LORDVADER",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "SITHPALPATINE",
          amount: 4,
          difficulty: 3,
        },
        {
          id: "DARTHMALAK",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "MAULS7",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "ASAJVENTRESS",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "AURRA_SING",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "SNOWTROOPER",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "B2SUPERBATTLEDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BASTILASHANDARK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BT1",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CADBANE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAUL",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "VADER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DATHCHA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "DENGAR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DIRECTORKRENNIC",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EIGHTHBROTHER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EMBO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDERTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDERTIEPILOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "VEERS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HONDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "IDENVERSIOEMPIRE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "IG88",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KRRSANTAN",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "MARAJADE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "NIGHTSISTERACOLYTE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERINITIATE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERSPIRIT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERZOMBIE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "RANGETROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SAVAGEOPRESS",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SECONDSISTER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "SEVENTHSISTER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIEFIGHTERPILOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "WAMPA",
          amount: 1,
          difficulty: 2,
        },
      ],
      mixed: [
        {
          id: "STARKILLER",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 6,
          difficulty: 3,
        },
        {
          id: "SITHPALPATINE",
          amount: 5,
          difficulty: 3,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "DARTHMALAK",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "MAULS7",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "BOBAFETTSCION",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "DARTHMALGUS",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "LORDVADER",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "NIGHTSISTERINITIATE",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "50RT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ADMIRALACKBAR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ASAJVENTRESS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "AURRA_SING",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BAZEMALBUS",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BISTAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BOKATAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CORUSCANTUNDERWORLDPOLICE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BADBATCHECHO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DARKTROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GAMORREANGUARD",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "VEERS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HOTHREBELSOLDIER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "IG88",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "KYLOREN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "POGGLETHELESSER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SEVENTHSISTER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "SITHTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "THEMANDALORIAN",
          amount: 1,
          difficulty: 1,
        },
      ],
      lightside: [
        {
          id: "GRANDMASTERLUKE",
          amount: 8,
          difficulty: 3,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 5,
          difficulty: 5,
        },
        {
          id: "HERMITYODA",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "HOTHLEIA",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "GENERALKENOBI",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "50RT",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "HANSOLO",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "KIADIMUNDI",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "LOGRAY",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "PADMEAMIDALA",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "SCARIFREBEL",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "ZAALBAR",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "AAYLASECURA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "RESISTANCETROOPER",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BB8",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BISTAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CHIEFNEBIT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "DASHRENDAR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHECHO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EETHKOTH",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "FINN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "MACEWINDU",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HONDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTCONSULAR",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SMUGGLERCHEWBACCA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "THEMANDALORIANBESKARARMOR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHTECH",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SANASTARROS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "REYJEDITRAINING",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "KYLEKATARN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JOLEEBINDO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "WICKET",
          amount: 1,
          difficulty: 1,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "TIEINTERCEPTOR",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "SCYTHE",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "HYENABOMBER",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "CAPITALMALEVOLENCE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "TIESILENCER",
          amount: 1,
          difficulty: 4,
        },
      ],
      mixed: [
        {
          id: "TIEINTERCEPTOR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "RAZORCREST",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "SCYTHE",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "EBONHAWK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "JEDISTARFIGHTERCONSULAR",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "YWINGREBEL",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "ARC170REX",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SITHFIGHTER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "SLAVE1",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIESILENCER",
          amount: 1,
          difficulty: 4,
        },
      ],
      lightside: [
        {
          id: "CAPITALPROFUNDITY",
          amount: 7,
          difficulty: 1,
        },
        {
          id: "RAZORCREST",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "BLADEOFDORIN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "EBONHAWK",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MILLENNIUMFALCON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "RAVENSCLAW",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "XWINGRED2",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "YWINGREBEL",
          amount: 1,
          difficulty: 4,
        },
      ],
    },
  },
  {
    phase: 5,
    label: "Phase 5",
    characters: {
      requirement: {
        type: "Relic",
        amount: 9,
      },
      darkside: [
        {
          id: "STARKILLER",
          amount: 9,
          difficulty: 2,
        },
        {
          id: "BOBAFETTSCION",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "SITHPALPATINE",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "DARTHMALAK",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "LORDVADER",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "GRANDINQUISITOR",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "IG88",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "MAULS7",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "FIRSTORDERSPECIALFORCESPILOT",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "SITHTROOPER",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BOBAFETT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "COLONELSTARCK",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDEROFFICERMALE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "COUNTDOOKU",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDERTIEPILOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GEONOSIANSOLDIER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "IDENVERSIOEMPIRE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JANGOFETT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KYLOREN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KYLORENUNMASKED",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAGMATROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MOFFGIDEONS1",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERZOMBIE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SNOWTROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "SITHASSASSIN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TALIA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "TUSKENSHAMAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "WAMPA",
          amount: 1,
          difficulty: 2,
        },
      ],
      mixed: [
        {
          id: "GRANDINQUISITOR",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "STARKILLER",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "DARTHMALAK",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BOBAFETTSCION",
          amount: 2,
          difficulty: 2,
        },

        {
          id: "DARTHMALGUS",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "DAKA",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "SITHPALPATINE",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "50RT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FULCRUMAHSOKA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "BARRISSOFFEE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BASTILASHAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BISTAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BODHIROOK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DARTHSIDIOUS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHECHO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EMPERORPALPATINE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDEREXECUTIONER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HONDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHHUNTER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAGNAGUARD",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JOLEEBINDO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "KYLOREN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "LORDVADER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MACEWINDU",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MAULS7",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "NIGHTSISTERINITIATE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "EPIXFINN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TALIA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "TUSKENSHAMAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "WICKET",
          amount: 1,
          difficulty: 2,
        },
      ],
      lightside: [
        {
          id: "JEDIKNIGHTLUKE",
          amount: 11,
          difficulty: 2,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 6,
          difficulty: 3,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "50RT",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BAZEMALBUS",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "C3POLEGENDARY",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "EETHKOTH",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BADBATCHTECH",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "AMILYNHOLDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BARRISSOFFEE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BASTILASHAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BODHIROOK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BOUSHH",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CHIRRUTIMWE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CHOPPERS3",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CLONEWARSCHEWBACCA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CT7567",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHECHO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HOTHREBELSOLDIER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "IMAGUNDI",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ADMINISTRATORLANDO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "LOBOT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MONMOTHMA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHOMEGA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "RESISTANCETROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ROSETICO",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "T3_M4",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ARMORER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SMUGGLERCHEWBACCA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ZAALBAR",
          amount: 1,
          difficulty: 1,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "SCYTHE",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "SITHBOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CAPITALSTARDESTROYER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIEFIGHTERFIRSTORDER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GAUNTLETSTARFIGHTER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GEONOSIANSTARFIGHTER2",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HYENABOMBER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "IG2000",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "VULTUREDROID",
          amount: 1,
          difficulty: 3,
        },
      ],
      mixed: [
        {
          id: "CAPITALPROFUNDITY",
          amount: 5,
          difficulty: 1,
        },
        {
          id: "SCYTHE",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "HYENABOMBER",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "JEDISTARFIGHTERCONSULAR",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "RAZORCREST",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "JEDISTARFIGHTERANAKIN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GAUNTLETSTARFIGHTER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIEBOMBERIMPERIAL",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "RAVENSCLAW",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "FIRSTORDERTIEECHELON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "XWINGRED2",
          amount: 1,
          difficulty: 4,
        },
      ],
      lightside: [
        {
          id: "CAPITALPROFUNDITY",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "XWINGRED2",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "ARC170CLONESERGEANT",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GHOST",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MILLENNIUMFALCON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CAPITALNEGOTIATOR",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "UMBARANSTARFIGHTER",
          amount: 1,
          difficulty: 4,
        },
      ],
    },
  },
  {
    phase: 6,
    label: "Phase 6",
    characters: {
      requirement: {
        type: "Relic",
        amount: 9,
      },
      darkside: [
        {
          id: "LORDVADER",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "BOBAFETTSCION",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "MAULS7",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "HONDO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "COUNTDOOKU",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "GEONOSIANBROODALPHA",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "IG88",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "IMPERIALSUPERCOMMANDO",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERACOLYTE",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "SITHPALPATINE",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "UGNAUGHT",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "ASAJVENTRESS",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "B1BATTLEDROIDV2",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "B2SUPERBATTLEDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MAUL",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DARTHTALON",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIFTHBROTHER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GENERALHUX",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "GEONOSIANSOLDIER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GEONOSIANSPY",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GRANDMOFFTARKIN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAGNAGUARD",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "IG86SENTINELDROID",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JAWA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JAWAENGINEER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JAWASCAVENGER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "KRRSANTAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KYLORENUNMASKED",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MARAJADE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "NIGHTSISTERSPIRIT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NINTHSISTER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "RANGETROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ROYALGUARD",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SAVAGEOPRESS",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SHORETROOPER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "TUSKENRAIDER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "URORRURRR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "ZAMWESELL",
          amount: 1,
          difficulty: 2,
        },
      ],
      mixed: [
        {
          id: "DARTHMALGUS",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 5,
          difficulty: 5,
        },
        {
          id: "GLREY",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "BOBAFETTSCION",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "DARTHTRAYA",
          amount: 3,
          difficulty: 2,
        },

        {
          id: "GENERALKENOBI",
          amount: 3,
          difficulty: 3,
        },

        {
          id: "HANSOLO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "LORDVADER",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "MAULS7",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "IMPERIALPROBEDROID",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "SANASTARROS",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "WATTAMBOR",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "ADMIRALRADDUS",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "ASAJVENTRESS",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "AURRA_SING",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "B1BATTLEDROIDV2",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CHIEFNEBIT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "CLONESERGEANTPHASEI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DARKTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DENGAR",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FIRSTORDEROFFICERMALE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HERMITYODA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "HK47",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "MAGNAGUARD",
          amount: 1,
          difficulty: 2,
        },

        {
          id: "JEDIKNIGHTCONSULAR",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NIGHTSISTERINITIATE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "NINTHSISTER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "NUTEGUNRAY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "DAKA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "PAO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "HOTHLEIA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "RESISTANCEPILOT",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SITHTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SITHPALPATINE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "FOSITHTROOPER",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "SMUGGLERCHEWBACCA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "YOUNGLANDO",
          amount: 1,
          difficulty: 1,
        },
      ],
      lightside: [
        {
          id: "BENSOLO",
          amount: 7,
          difficulty: 2,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 7,
          difficulty: 3,
        },
        {
          id: "BASTILASHAN",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "DASHRENDAR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 4,
          difficulty: 5,
        },
        {
          id: "HERMITYODA",
          amount: 4,
          difficulty: 2,
        },
        {
          id: "HANSOLO",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "KIADIMUNDI",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "HOTHLEIA",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "IMAGUNDI",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "REY",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "UNDERCOVERLANDO",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "BB8",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BASTILASHAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BODHIROOK",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BOUSHH",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CORUSCANTUNDERWORLDPOLICE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "GENERALKENOBI",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "GRANDMASTERYODA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KANANJARRUSS3",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "L3_37",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "LOBOT",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "LOGRAY",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "MARAJADE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "POE",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "BADBATCHTECH",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "THEMANDALORIAN",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ZAALBAR",
          amount: 1,
          difficulty: 1,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      darkside: [
        {
          id: "CAPITALEXECUTOR",
          amount: 5,
          difficulty: 2,
        },
        {
          id: "HYENABOMBER",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "SCYTHE",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "CAPITALMALEVOLENCE",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "CAPITALSTARDESTROYER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "GEONOSIANSTARFIGHTER3",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "HOUNDSTOOTH",
          amount: 1,
          difficulty: 4,
        },
      ],
      mixed: [
        {
          id: "SCYTHE",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "RAZORCREST",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "EMPERORSSHUTTLE",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "FIRSTORDERTIEECHELON",
          amount: 1,
          difficulty: 3,
        },
      ],
      lightside: [
        {
          id: "RAZORCREST",
          amount: 7,
          difficulty: 3,
        },
        {
          id: "RAVENSCLAW",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "XWINGRED3",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "MILLENNIUMFALCON",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "OUTRIDER",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "XWINGRESISTANCE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "XANADUBLOOD",
          amount: 1,
          difficulty: 4,
        },
      ],
    },
  },
  {
    phase: "zeffo",
    label: "Zeffo",
    characters: {
      requirement: {
        type: "Relic",
        amount: 7,
      },
      lightside: [
        {
          id: "COMMANDERAHSOKA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 5,
          difficulty: 4,
        },
        {
          id: "GENERALKENOBI",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "KYLEKATARN",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "GRANDMASTERLUKE",
          amount: 6,
          difficulty: 4,
        },
        {
          id: "BB8",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "HANSOLO",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "CHIRRUTIMWE",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "JOLEEBINDO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 6,
          difficulty: 5,
        },
        {
          id: "KIADIMUNDI",
          amount: 6,
          difficulty: 2,
        },
        {
          id: "JEDIKNIGHTCONSULAR",
          amount: 3,
          difficulty: 1,
        },
        {
          id: "HERMITYODA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "CHEWBACCALEGENDARY",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "CLONESERGEANTPHASEI",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "CHIEFCHIRPA",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "JEDIKNIGHTGUARDIAN",
          amount: 3,
          difficulty: 1,
        },
        {
          id: "BENSOLO",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "C3POLEGENDARY",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "JUHANI",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "REYJEDITRAINING",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "LUKESKYWALKER",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "QIRA",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "JEDIKNIGHTREVAN",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "COMMANDERLUKESKYWALKER",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "KITFISTO",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BADBATCHWRECKER",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "ENFYSNEST",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "R2D2_LEGENDARY",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "ZEBS3",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "AAYLASECURA",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "PLOKOON",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "PADMEAMIDALA",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "VISASMARR",
          amount: 1,
          difficulty: 2,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      lightside: [
        {
          id: "JEDISTARFIGHTERCONSULAR",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "MG100STARFORTRESSSF17",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "RAZORCREST",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "ARC170CLONESERGEANT",
          amount: 2,
          difficulty: 5,
        },
        {
          id: "CAPITALRADDUS",
          amount: 1,
          difficulty: 5,
        },
      ],
    },
  },
  {
    phase: "mandalore",
    label: "Mandalore",
    characters: {
      requirement: {
        type: "Relic",
        amount: 8,
      },
      mixed: [
        {
          id: "GLLEIA",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "DOCTORAPHRA",
          amount: 4,
          difficulty: 3,
        },
        {
          id: "COMMANDERAHSOKA",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "CAPTAINDROGAN",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "PRINCESSKNEESAA",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "GLREY",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "WATTAMBOR",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "BENSOLO",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "CEREJUNDA",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "SITHPALPATINE",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "DARTHMALAK",
          amount: 1,
          difficulty: 5,
        },
        {
          id: "KELLERANBEQ",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "LORDVADER",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "JEDIKNIGHTLUKE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "BOBAFETTSCION",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "KRRSANTAN",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "TARONMALICOS",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "TRENCH",
          amount: 3,
          difficulty: 2,
        },
        {
          id: "GENERALSKYWALKER",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "STARKILLER",
          amount: 3,
          difficulty: 3,
        },
        {
          id: "TUSKENHUNTRESS",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "KIADIMUNDI",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "DARTHBANE",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "TUSKENCHIEFTAIN",
          amount: 1,
          difficulty: 2,
        },
        {
          id: "CAPTAINREX",
          amount: 2,
          difficulty: 3,
        },
        {
          id: "SUPREMELEADERKYLOREN",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "JEDIMASTERKENOBI",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "MERRIN",
          amount: 2,
          difficulty: 2,
        },
        {
          id: "DARTHMALGUS",
          amount: 1,
          difficulty: 3,
        },
        {
          id: "STAP",
          amount: 2,
          difficulty: 1,
        },
        {
          id: "CORUSCANTUNDERWORLDPOLICE",
          amount: 1,
          difficulty: 1,
        },
        {
          id: "BENSOLO",
          amount: 1,
          difficulty: 3,
        },
      ],
    },
    ships: {
      requirement: {
        type: "Stars",
        amount: 7,
      },
      lightside: [
        {
          id: "CAPITALLEVIATHAN",
          amount: 4,
          difficulty: 4,
        },
        {
          id: "COMEUPPANCE",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "TIEDAGGER",
          amount: 3,
          difficulty: 5,
        },
        {
          id: "CAPITALEXECUTOR",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "FURYCLASSINTERCEPTOR",
          amount: 3,
          difficulty: 4,
        },
        {
          id: "SITHSUPREMACYCLASS",
          amount: 2,
          difficulty: 4,
        },
        {
          id: "SCYTHE",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "TIEINTERCEPTOR",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "RAZORCREST",
          amount: 1,
          difficulty: 4,
        },
        {
          id: "CAPITALPROFUNDITY",
          amount: 1,
          difficulty: 5,
        },
      ],
    },
  },
];

const characterMapping = platoonData.reduce((acc, phase) => {
  const addCharacter = (character) => {
    if (acc[character.id]) {
      if (acc[character.id][relicLevel]) {
        acc[character.id][relicLevel].requirements += character.amount;
      } else {
        acc[character.id][relicLevel] = {
          requirements: character.amount,
          coverage: 0,
        };
      }
    } else {
      acc[character.id] = {
        [relicLevel]: { requirements: character.amount, coverage: 0 },
      };
    }
  };

  const relicLevel = phase.characters.requirement.amount;
  phase.characters.darkside?.forEach((character) => {
    addCharacter(character);
  });
  phase.characters.mixed?.forEach((character) => {
    addCharacter(character);
  });
  phase.characters.lightside?.forEach((character) => {
    addCharacter(character);
  });
  return acc;
}, {});

export { platoonData, characterMapping, redundancyCoverageAmount };
