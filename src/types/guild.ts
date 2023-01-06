import store from "vuex-store/store";
import { Unit } from "./unit";
import { unvue } from "utils";

export interface GuildPayload {
  territoryWar?: ITerritoryWarEvent[];
  territoryBattle?: TerritoryBattleEvent[];
}

export interface ITerritoryWarEvent {
  id: string;
  date: string;
  win: boolean;
  guildGP: number;
  currencies: {
    get1: number;
    get2: number;
    get3: number;
    guildStore: number;
    credits: number;
  };
  abilityMats: {
    zetas: number;
    omegas: number;
    purple: number;
  };
  relicMats: {
    aeros: number;
    droidBrains: number;
  };
  datacronMats: {
    mk1: number;
    mk2: number;
    mk3: number;
    dataCache: number;
  };
}

export interface TerritoryBattleEvent {
  id: string;
  date: string;
  type: "Dark" | "Light" | "-" | undefined;
  name:
    | "Separatist Might"
    | "Republic Offensive"
    | "Rebel Assault"
    | "Imperial Retaliation";
  get1: number;
  get2: number;
  get3: number;
  stars: number;
  gear: any[];
  crystals: number;
  characterShards: { id: string; count: number };
}

type unitMappingData = {
  [key: number]: number;
};

interface IUnitOwned {
  allyCode: number;
  name: string;
  stars: number;
  gearLevel: number;
  relicLevel: number;
  zetas: number;
  omicrons: number;
  speed: number;
  speedMod: number;
  physicalOffense: number;
  specialOffense: number;
  protection: number;
  health: number;
  tenacity: number;
  potency: number;
  physicalCrit: number;
  specialCrit: number;
  critDamage: number;
  armor: number;
  resistance: number;
  ultimate: boolean;
}

export type tUnitOwnedKeys =
  | "allyCode"
  | "name"
  | "gearLevel"
  | "relicLevel"
  | "zetas"
  | "omicrons"
  | "speed"
  | "speedMod"
  | "physicalOffense"
  | "specialOffense"
  | "protection"
  | "health"
  | "tenacity"
  | "potency"
  | "physicalCrit"
  | "specialCrit"
  | "critDamage"
  | "armor"
  | "resistance"
  | "ultimate";

interface IUnitUnowned {
  allyCode: number;
  name: string;
}

export interface IGuildUnitMap {
  zetas: unitMappingData;
  speed?: {
    min: number;
    max: number;
    average: number;
  };
  gearLevels: unitMappingData;
  relicLevels: unitMappingData;
  owned: IUnitOwned[];
  unowned: IUnitUnowned[];
}

export function estimatedTime(unit: Unit): number {
  const type =
    unit.id === "KIADIMUNDI" || unit.id === "IMPERIALPROBEDROID"
      ? "Light"
      : "Dark";
  const avgShardsPerEvent = store.getters["guild/tbAvgShards"](type, unit.id);
  return Math.ceil(unit.remainingShards / (avgShardsPerEvent / 30));
}

const see = {
  label: "SEE + Sith Buddies",
  id: "SEE",
  units: [
    {
      id: "SITHPALPATINE",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHSION",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHNIHILUS",
      level: 12,
      type: "Gear",
    },
    {
      id: "MAUL",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHSIDIOUS",
      level: 12,
      type: "Gear",
    },
  ],
};
const sithEmpire = {
  label: "Sith Empire",
  id: "sithEmpire",
  units: [
    {
      id: "DARTHREVAN",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHMALAK",
      level: 12,
      type: "Gear",
    },
    {
      id: "HK47",
      level: 12,
      type: "Gear",
    },
    {
      id: "BASTILASHANDARK",
      level: 12,
      type: "Gear",
    },
    {
      id: "SITHMARAUDER",
      level: 12,
      type: "Gear",
    },
  ],
};
const fo = {
  label: "First Order",
  id: "firstOrder",
  units: [
    {
      id: "KYLORENUNMASKED",
      level: 12,
      type: "Gear",
    },
    {
      id: "KYLOREN",
      level: 12,
      type: "Gear",
    },
    {
      id: "FIRSTORDEREXECUTIONER",
      level: 12,
      type: "Gear",
    },
    {
      id: "FIRSTORDEROFFICERMALE",
      level: 12,
      type: "Gear",
    },
    {
      id: "FIRSTORDERTROOPER",
      level: 12,
      type: "Gear",
    },
  ],
};
const slkr = {
  label: "SLKR + FO",
  id: "slkr",
  units: [
    {
      id: "SUPREMELEADERKYLOREN",
      level: 12,
      type: "Gear",
    },
    {
      id: "KYLOREN",
      level: 12,
      type: "Gear",
    },
    {
      id: "KYLORENUNMASKED",
      level: 12,
      type: "Gear",
    },
    {
      id: "GENERALHUX",
      level: 12,
      type: "Gear",
    },
    {
      id: "FOSITHTROOPER",
      level: 12,
      type: "Gear",
    },
  ],
};
const bh = {
  label: "Bounty Hunters",
  id: "bountyHunters",
  units: [
    {
      id: "BOSSK",
      level: 12,
      type: "Gear",
    },
    {
      id: "JANGOFETT",
      level: 12,
      type: "Gear",
    },
    {
      id: "BOBAFETT",
      level: 12,
      type: "Gear",
    },
    {
      id: "DENGAR",
      level: 12,
      type: "Gear",
    },
    {
      id: "CADBANE",
      level: 12,
      type: "Gear",
    },
  ],
};
const empire = {
  label: "Empire",
  id: "empire",
  units: [
    {
      id: "EMPERORPALPATINE",
      level: 12,
      type: "Gear",
    },
    {
      id: "Vader",
      level: 12,
      type: "Gear",
    },
    {
      id: "GRANDADMIRALTHRAWN",
      level: 12,
      type: "Gear",
    },
    {
      id: "GRANDMOFFTARKIN",
      level: 12,
      type: "Gear",
    },
    {
      id: "TIEFIGHTERPILOT",
      level: 12,
      type: "Gear",
    },
  ],
};
const iTroopers = {
  label: "Imperial Troopers",
  id: "iTroopers",
  units: [
    {
      id: "VEERS",
      level: 12,
      type: "Gear",
    },
    {
      id: "COLONELSTARCK",
      level: 12,
      type: "Gear",
    },
    {
      id: "ADMIRALPIETT",
      level: 12,
      type: "Gear",
    },
    {
      id: "RANGETROOPER",
      level: 12,
      type: "Gear",
    },
    {
      id: "SHORETROOPER",
      level: 12,
      type: "Gear",
    },
  ],
};
const nightSisters = {
  label: "Night Sisters",
  id: "nightSisters",
  units: [
    {
      id: "MOTHERTALZIN",
      level: 12,
      type: "Gear",
    },
    {
      id: "ASAJVENTRESS",
      level: 12,
      type: "Gear",
    },
    {
      id: "DAKA",
      level: 12,
      type: "Gear",
    },
    {
      id: "NIGHTSISTERZOMBIE",
      level: 12,
      type: "Gear",
    },
    {
      id: "NIGHTSISTERSPIRIT",
      level: 12,
      type: "Gear",
    },
  ],
};
const triumvirate = {
  label: "Sith Triumvirate",
  id: "triumvirate",
  units: [
    {
      id: "DARTHTRAYA",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHSION",
      level: 12,
      type: "Gear",
    },
    {
      id: "DARTHNIHILUS",
      level: 12,
      type: "Gear",
    },
    {
      id: "COUNTDOOKU",
      level: 12,
      type: "Gear",
    },
    {
      id: "SITHTROOPER",
      level: 12,
      type: "Gear",
    },
  ],
};
const sepDroids = {
  label: "Grievous & Droids",
  id: "grievousFriends",
  units: [
    {
      id: "GRIEVOUS",
      level: 12,
      type: "Gear",
      zetas: ["leaderskill_GRIEVOUS", "uniqueskill_GRIEVOUS01"],
    },
    {
      id: "MAGNAGUARD",
      level: 12,
      type: "Gear",
    },
    {
      id: "B1BATTLEDROIDV2",
      level: 12,
      type: "Gear",
      zetas: ["uniqueskill_b1battledroidv2_02"],
    },
    {
      id: "B2SUPERBATTLEDROID",
      level: 12,
      type: "Gear",
      zetas: ["uniqueskill_B2SUPERBATTLEDROID02"],
    },
    {
      id: "DROIDEKA",
      level: 12,
      type: "Gear",
      zetas: ["uniqueskill_DROIDEKA01"],
    },
  ],
};
const geos = {
  label: "Geonosians",
  id: "geos",
  units: [
    {
      id: "GEONOSIANBROODALPHA",
      level: 12,
      type: "Gear",
      zetas: ["uniqueskill_GEONOSIANBROODALPHA01"],
    },
    {
      id: "GEONOSIANSPY",
      level: 12,
      type: "Gear",
    },
    {
      id: "GEONOSIANSOLDIER",
      level: 12,
      type: "Gear",
    },
    {
      id: "POGGLETHELESSER",
      level: 12,
      type: "Gear",
    },
    {
      id: "SUNFAC",
      level: 12,
      type: "Gear",
    },
  ],
};
const executor = {
  label: "Executor",
  id: "executor",
  units: [
    {
      id: "CAPITALEXECUTOR",
      level: 65000,
      type: "Power",
    },
    {
      id: "HOUNDSTOOTH",
      level: 65000,
      type: "Power",
    },
    {
      id: "SLAVE1",
      level: 65000,
      type: "Power",
    },
    {
      id: "XANADUBLOOD",
      level: 65000,
      type: "Power",
    },
    {
      id: "IG2000",
      level: 65000,
      type: "Power",
    },
  ],
};

const finalizer = {
  label: "Finalizer",
  id: "finalizer",
  units: [
    {
      id: "CAPITALFINALIZER",
      level: 65000,
      type: "Power",
    },
    {
      id: "TIESILENCER",
      level: 65000,
      type: "Power",
    },
    {
      id: "COMMANDSHUTTLE",
      level: 65000,
      type: "Power",
    },
    {
      id: "TIEFIGHTERFIRSTORDER",
      level: 65000,
      type: "Power",
    },
    {
      id: "TIEFIGHTERFOSF",
      level: 65000,
      type: "Power",
    },
    {
      id: "SITHINFILTRATOR",
      level: 65000,
      type: "Power",
    },
  ],
};

const malevolence = {
  label: "Malevolence",
  id: "malevolence",
  units: [
    {
      id: "CAPITALMALEVOLENCE",
      level: 65000,
      type: "Power",
    },
    {
      id: "HYENABOMBER",
      level: 65000,
      type: "Power",
    },
    {
      id: "VULTUREDROID",
      level: 65000,
      type: "Power",
    },
    {
      id: "GEONOSIANSTARFIGHTER1",
      level: 65000,
      type: "Power",
    },
    {
      id: "GEONOSIANSTARFIGHTER2",
      level: 65000,
      type: "Power",
    },
    {
      id: "GEONOSIANSTARFIGHTER3",
      level: 65000,
      type: "Power",
    },
  ],
};

const chimaera = {
  label: "Chimaera",
  id: "chimaera",
  units: [
    {
      id: "CAPITALCHIMAERA",
      level: 65000,
      type: "Power",
    },
    {
      id: "HOUNDSTOOTH",
      level: 65000,
      type: "Power",
    },
    {
      id: "TIESILENCER",
      level: 65000,
      type: "Power",
    },
    {
      id: "TIEFIGHTERIMPERIAL",
      level: 65000,
      type: "Power",
    },
    {
      id: "XANADUBLOOD",
      level: 65000,
      type: "Power",
    },
    {
      id: "EMPERORSSHUTTLE",
      level: 65000,
      type: "Power",
    },
  ],
};

function dsGenericTeams(
  list: any[] = [
    see,
    sithEmpire,
    fo,
    slkr,
    bh,
    empire,
    iTroopers,
    nightSisters,
    triumvirate,
  ],
  type: "Gear" | "Relic" | "Power" = "Gear",
  level: number = 12
) {
  return unvue(list).map((team: any) => {
    team.units.forEach((unit: any) => {
      unit.type = type;
      unit.level = level;
    });
    return team;
  });
}

export const tbRecommended = [
  {
    id: "DSSeparatistMight",
    label: "Separatist Might",
    phases: [
      {
        id: "phase1",
        label: "Phase 1",
        positions: [
          {
            id: "top",
            label: "Top",
            missions: [
              {
                id: "poggleMission",
                label: "Poggle Mission",
                teams: [
                  {
                    label: "Poggle Geos",
                    id: "poggleGeos",
                    units: [
                      {
                        id: "POGGLETHELESSER",
                        level: 12,
                        type: "Gear",
                      },
                      {
                        id: "GEONOSIANSPY",
                        level: 12,
                        type: "Gear",
                      },
                      {
                        id: "GEONOSIANSOLDIER",
                        level: 12,
                        type: "Gear",
                      },
                      {
                        id: "GEONOSIANBROODALPHA",
                        level: 12,
                        type: "Gear",
                      },
                      {
                        id: "SUNFAC",
                        level: 12,
                        type: "Gear",
                      },
                    ],
                  },
                ],
              },
              {
                id: "mission1",
                label: "Combat Mission 1",
                teams: dsGenericTeams([
                  see,
                  sithEmpire,
                  fo,
                  bh,
                  empire,
                  iTroopers,
                ]),
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "nuteSpecialMission",
                label: "Special Mission: Nute & Droid Friends",
                teams: [
                  {
                    label: "Nute & Wat",
                    id: "nuteWat",
                    units: [
                      {
                        id: "NUTEGUNRAY",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_NUTEGUNRAY01"],
                      },
                      {
                        id: "WATTAMBOR",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_WATTAMBOR02"],
                      },
                      {
                        id: "B1BATTLEDROIDV2",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_b1battledroidv2_02"],
                      },
                      {
                        id: "B2SUPERBATTLEDROID",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_B2SUPERBATTLEDROID02"],
                      },
                      {
                        id: "DROIDEKA",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_DROIDEKA01"],
                      },
                    ],
                  },
                  {
                    label: "Nute & Maggie",
                    id: "nuteMaggie",
                    units: [
                      {
                        id: "NUTEGUNRAY",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_NUTEGUNRAY01"],
                      },
                      {
                        id: "MAGNAGUARD",
                        level: 12,
                        type: "Gear",
                      },
                      {
                        id: "B1BATTLEDROIDV2",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_b1battledroidv2_02"],
                      },
                      {
                        id: "B2SUPERBATTLEDROID",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_B2SUPERBATTLEDROID02"],
                      },
                      {
                        id: "DROIDEKA",
                        level: 12,
                        type: "Gear",
                        zetas: ["uniqueskill_DROIDEKA01"],
                      },
                    ],
                  },
                ],
              },
              {
                id: "mission2",
                label: "Combat Mission 2",
                teams: dsGenericTeams([
                  slkr,
                  fo,
                  empire,
                  nightSisters,
                  triumvirate,
                ]),
              },
              {
                id: "mission3",
                label: "Combat Mission 3",
                teams: dsGenericTeams([
                  slkr,
                  fo,
                  empire,
                  nightSisters,
                  triumvirate,
                ]),
              },
            ],
          },
        ],
      },
      {
        id: "phase2",
        label: "Phase 2",
        positions: [
          {
            id: "top",
            label: "Top",
            missions: [
              {
                id: "shipMission1",
                label: "Ship Combat Mission 1",
                teams: dsGenericTeams(
                  [malevolence, executor, finalizer, chimaera],
                  "Power",
                  50000
                ),
              },
              {
                id: "shipMission2",
                label: "Ship Combat Mission 2",
                teams: dsGenericTeams(
                  [malevolence, executor, finalizer, chimaera],
                  "Power",
                  50000
                ),
              },
            ],
          },
          {
            id: "mid",
            label: "Middle",
            missions: [
              {
                id: "dookuCombatMission",
                label: "Combat Mission: Dooku & Asajj",
                teams: [
                  {
                    label: "Dooku & Asajj",
                    id: "dookuAsajj",
                    units: [
                      {
                        id: "COUNTDOOKU",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 40000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 25000,
                            label: "Health",
                          },
                          {
                            key: "potency",
                            min: 100,
                            label: "Potency",
                          },
                        ],
                        zetas: ["uniqueskill_COUNTDOOKU01"],
                      },
                      {
                        id: "ASAJVENTRESS",
                        stats: [
                          {
                            key: "speed",
                            min: 220,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 65000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_ASAJVENTRESS01"],
                      },
                    ],
                  },
                ],
              },
              {
                id: "mission1",
                label: "Combat Mission 1",
                teams: dsGenericTeams([see, slkr, fo, iTroopers, empire, bh]),
              },
              {
                id: "mission2",
                label: "Combat Mission 2",
                teams: dsGenericTeams([see, slkr, fo, iTroopers, empire, bh]),
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "geoAcklay",
                label: "Special Mission: Geos vs Acklay",
                teams: [
                  {
                    label: "Geonosians",
                    id: "geos",
                    units: [
                      {
                        id: "GEONOSIANBROODALPHA",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 80000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 80000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 55,
                            label: "Armor",
                          },
                        ],
                        zetas: ["uniqueskill_GEONOSIANBROODALPHA01"],
                      },
                      {
                        id: "SUNFAC",
                        stats: [
                          {
                            key: "speed",
                            min: 180,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 60000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 30000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 55,
                            label: "Armor",
                          },
                        ],
                      },
                      {
                        id: "GEONOSIANSOLDIER",
                        stats: [
                          {
                            key: "speed",
                            min: 225,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 20000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 20000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 35,
                            label: "Armor",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit Chance",
                          },
                        ],
                      },
                      {
                        id: "POGGLETHELESSER",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 20000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 25000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 35,
                            label: "Armor",
                          },
                        ],
                      },
                      {
                        id: "GEONOSIANSPY",
                        stats: [
                          {
                            key: "speed",
                            min: 200,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 20000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 25000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 65,
                            label: "Physical Crit Chance",
                          },
                          {
                            key: "critDamage",
                            min: 216,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalOffense",
                            min: 3200,
                            label: "Physical Offense",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "mission3",
                label: "Combat Mission 3",
                teams: dsGenericTeams([
                  see,
                  slkr,
                  sithEmpire,
                  empire,
                  iTroopers,
                  sepDroids,
                ]),
              },
              {
                id: "mission4",
                label: "Combat Mission 4",
                teams: dsGenericTeams([
                  see,
                  slkr,
                  sithEmpire,
                  empire,
                  iTroopers,
                  sepDroids,
                ]),
              },
            ],
          },
        ],
      },
      {
        id: "phase3",
        label: "Phase 3",
        positions: [
          {
            id: "top",
            label: "Top",
            missions: [
              {
                id: "shipMission1",
                label: "Ship Combat Mission 1",
                teams: dsGenericTeams(
                  [malevolence, executor, finalizer, chimaera],
                  "Power",
                  55000
                ),
              },
              {
                id: "shipGeos",
                label: "Ship Combat: Geos",
                teams: dsGenericTeams([malevolence], "Power", 55000),
              },
            ],
          },
          {
            id: "mid",
            label: "Middle",
            missions: [
              {
                id: "watTamborMission",
                label: "Special Mission: Wat Tambor",
                teams: [
                  {
                    label: "Geonosians",
                    id: "geos",
                    units: [
                      {
                        id: "GEONOSIANBROODALPHA",
                        stats: [
                          {
                            key: "speed",
                            min: 225,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 60000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 40000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_GEONOSIANBROODALPHA01"],
                      },
                      {
                        id: "SUNFAC",
                        stats: [
                          {
                            key: "speed",
                            min: 180,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 75000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 30000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "GEONOSIANSOLDIER",
                        stats: [
                          {
                            key: "speed",
                            min: 225,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 20000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 20000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit Chance",
                          },
                          {
                            key: "critDamage",
                            min: 186,
                            label: "Critical Damage",
                          },
                        ],
                      },
                      {
                        id: "POGGLETHELESSER",
                        stats: [
                          {
                            key: "speed",
                            min: 215,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 30000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 20000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "GEONOSIANSPY",
                        stats: [
                          {
                            key: "speed",
                            min: 200,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 20000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 20000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 60,
                            label: "Physical Crit Chance",
                          },
                          {
                            key: "critDamage",
                            min: 216,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalOffense",
                            min: 2800,
                            label: "Physical Offense",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "grievousMission",
                label: "Special Combat Mission: Grievous",
                teams: [sepDroids],
              },
              {
                id: "mission1",
                label: "Combat Mission 1",
                teams: dsGenericTeams([
                  see,
                  slkr,
                  empire,
                  iTroopers,
                  nightSisters,
                ]),
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "mission2",
                label: "Combat Mission 2",
                teams: dsGenericTeams(
                  [see, slkr, sithEmpire, bh, empire],
                  "Relic",
                  3
                ),
              },
              {
                id: "mission3",
                label: "Combat Mission 3",
                teams: dsGenericTeams(
                  [see, slkr, sithEmpire, bh, empire],
                  "Relic",
                  3
                ),
              },
            ],
          },
        ],
      },
      {
        id: "phase4",
        label: "Phase 4",
        positions: [
          {
            id: "top",
            label: "Top",
            missions: [
              {
                id: "shipMission1",
                label: "Ship Combat Mission 1",
                teams: dsGenericTeams(
                  [malevolence, executor, finalizer, chimaera],
                  "Power",
                  60000
                ),
              },
            ],
          },
          {
            id: "mid",
            label: "Middle",
            missions: [
              {
                id: "dookuSeparatists",
                label: "Combat Mission: Separatists",
                teams: [
                  {
                    label: "Dooku & Droids",
                    id: "dookuDroids",
                    units: [
                      {
                        id: "COUNTDOOKU",
                        stats: [
                          {
                            key: "speed",
                            min: 320,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 50000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 50000,
                            label: "Health",
                          },
                        ],
                        zetas: [],
                      },
                      {
                        id: "MAGNAGUARD",
                        stats: [
                          {
                            key: "speed",
                            min: 220,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 70000,
                            label: "Health",
                          },
                          {
                            key: "protection",
                            min: 110000,
                            label: "Protection",
                          },
                        ],
                      },
                      {
                        id: "B2SUPERBATTLEDROID",
                        stats: [
                          {
                            key: "speed",
                            min: 210,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                          {
                            key: "protection",
                            min: 90000,
                            label: "Protection",
                          },
                          {
                            key: "potency",
                            min: 100,
                            label: "Potency",
                          },
                          {
                            key: "tenacity",
                            min: 100,
                            label: "Tenacity",
                          },
                        ],
                      },
                      {
                        id: "B1BATTLEDROIDV2",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "physicalOffense",
                            max: 10000,
                            label: "Physical Offense",
                          },
                        ],
                      },
                      {
                        id: "DROIDEKA",
                        stats: [
                          {
                            key: "speed",
                            max: 150,
                            label: "Speed",
                          },
                          {
                            key: "physicalOffense",
                            max: 10000,
                            label: "Physical Offense",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "misison1",
                label: "Combat Mission 1",
                teams: dsGenericTeams(
                  [see, empire, nightSisters, iTroopers, geos],
                  "Relic",
                  5
                ),
              },
              {
                id: "misison2",
                label: "Combat Mission 2",
                teams: dsGenericTeams(
                  [see, empire, nightSisters, iTroopers, geos],
                  "Relic",
                  5
                ),
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "watFriends",
                label: "Special Mission: Wat & Friends",
                teams: [
                  {
                    label: "Wat & Geos",
                    id: "watGeos",
                    units: [
                      {
                        id: "GEONOSIANBROODALPHA",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 90000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 70000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_GEONOSIANBROODALPHA01"],
                      },
                      {
                        id: "GEONOSIANSPY",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 30000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 40000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 65,
                            label: "Physical Crit Chance",
                          },
                          {
                            key: "critDamage",
                            min: 226.5,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalOffense",
                            min: 6000,
                            label: "Physical Offense",
                          },
                        ],
                      },
                      {
                        id: "SUNFAC",
                        stats: [
                          {
                            key: "speed",
                            min: 270,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 80000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 70000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "GEONOSIANSOLDIER",
                        stats: [
                          {
                            key: "speed",
                            min: 325,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 40000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 25000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 85,
                            label: "Physical Crit Chance",
                          },
                        ],
                      },
                      {
                        id: "WATTAMBOR",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "protection",
                            min: 65000,
                            label: "Protection",
                          },
                          {
                            key: "health",
                            min: 120000,
                            label: "Health",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: "Wat & Droids",
                    id: "watDroids",
                    units: [
                      {
                        id: "GRIEVOUS",
                        level: 5,
                        type: "Relic",
                        zetas: [
                          "leaderskill_GRIEVOUS",
                          "uniqueskill_GRIEVOUS01",
                        ],
                      },
                      {
                        id: "B1BATTLEDROIDV2",
                        level: 5,
                        type: "Relic",
                        zetas: ["uniqueskill_b1battledroidv2_02"],
                      },
                      {
                        id: "B2SUPERBATTLEDROID",
                        level: 5,
                        type: "Relic",
                        zetas: ["uniqueskill_B2SUPERBATTLEDROID02"],
                      },
                      {
                        id: "MAGNAGUARD",
                        level: 5,
                        type: "Relic",
                      },
                      {
                        id: "WATTAMBOR",
                        level: 5,
                        type: "Relic",
                        zetas: ["uniqueskill_WATTAMBOR02"],
                      },
                    ],
                  },
                ],
              },
              {
                id: "misison3",
                label: "Combat Mission 3",
                teams: dsGenericTeams(
                  [see, slkr, sithEmpire, iTroopers, empire],
                  "Relic",
                  5
                ),
              },
              {
                id: "misison4",
                label: "Combat Mission 4",
                teams: dsGenericTeams(
                  [see, slkr, sithEmpire, iTroopers, empire],
                  "Relic",
                  5
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "LSRepublicOffensive",
    label: "Republic Offensive",
    phases: [
      {
        id: "phase1",
        label: "Phase 1",
        positions: [
          {
            id: "middle",
            label: "Middle",
            missions: [
              {
                id: "special",
                label: "Special Mission: Padme & Friends",
                teams: [
                  {
                    label: "Padme + CAT",
                    id: "padmeCAT",
                    units: [
                      {
                        id: "PADMEAMIDALA",
                        stats: [
                          {
                            key: "speed",
                            min: 280,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 90000,
                            label: "Health",
                          },
                        ],
                        zetas: [
                          "leaderskill_PADMEAMIDALA",
                          "uniqueskill_PADMEAMIDALA01",
                        ],
                      },
                      {
                        id: "AHSOKATANO",
                        stats: [
                          {
                            key: "speed",
                            min: 220,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                          {
                            key: "critDamage",
                            min: 216,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit",
                          },
                        ],
                        zetas: ["uniqueskill_AHSOKATANO01"],
                      },
                      {
                        id: "ANAKINKNIGHT",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 75000,
                            label: "Health",
                          },
                          {
                            key: "critDamage",
                            min: 192,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit",
                          },
                        ],
                        zetas: ["uniqueskill_ANAKINKNIGHT01"],
                      },
                      {
                        id: "GENERALKENOBI",
                        stats: [
                          {
                            key: "speed",
                            min: 200,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 100000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 40,
                            label: "Armor",
                          },
                        ],
                        zetas: ["uniqueskill_GENERALKENOBI01"],
                      },
                      {
                        id: "COMMANDERAHSOKA",
                        stats: [
                          {
                            key: "speed",
                            min: 310,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 75000,
                            label: "Health",
                          },
                        ],
                        zetas: [
                          "specialskill_COMMANDERAHSOKA01",
                          "specialskill_COMMANDERAHSOKA02",
                          "uniqueskill_COMMANDERAHSOKA01",
                        ],
                      },
                    ],
                  },
                  {
                    label: "Padme (No CAT)",
                    id: "padmeNoCAT",
                    units: [
                      {
                        id: "PADMEAMIDALA",
                        stats: [
                          {
                            key: "speed",
                            min: 280,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 90000,
                            label: "Health",
                          },
                        ],
                        zetas: [
                          "leaderskill_PADMEAMIDALA",
                          "uniqueskill_PADMEAMIDALA01",
                        ],
                      },
                      {
                        id: "AHSOKATANO",
                        stats: [
                          {
                            key: "speed",
                            min: 220,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                          {
                            key: "critDamage",
                            min: 216,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit",
                          },
                        ],
                        zetas: ["uniqueskill_AHSOKATANO01"],
                      },
                      {
                        id: "ANAKINKNIGHT",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 75000,
                            label: "Health",
                          },
                          {
                            key: "critDamage",
                            min: 192,
                            label: "Critical Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 75,
                            label: "Physical Crit",
                          },
                        ],
                        zetas: ["uniqueskill_ANAKINKNIGHT01"],
                      },
                      {
                        id: "GENERALKENOBI",
                        stats: [
                          {
                            key: "speed",
                            min: 200,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 100000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 40,
                            label: "Armor",
                          },
                        ],
                        zetas: ["uniqueskill_GENERALKENOBI01"],
                      },
                      {
                        id: "C3POLEGENDARY",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 75000,
                            label: "Health",
                          },
                        ],
                        zetas: [
                          "specialskill_C3POLEGENDARY01",
                          "uniqueskill_C3POLEGENDARY02",
                        ],
                      },
                    ],
                  },
                  {
                    label: "Padme & Clones",
                    id: "padmeClones",
                    units: [
                      {
                        id: "PADMEAMIDALA",
                        stats: [
                          {
                            key: "speed",
                            min: 280,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 90000,
                            label: "Health",
                          },
                        ],
                        zetas: [
                          "leaderskill_PADMEAMIDALA",
                          "uniqueskill_PADMEAMIDALA01",
                        ],
                      },
                      {
                        id: "CT210408",
                        stats: [
                          {
                            key: "speed",
                            min: 270,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                          {
                            key: "potency",
                            min: 100,
                            label: "Potency",
                          },
                        ],
                        zetas: ["uniqueskill_ct21040802"],
                      },
                      {
                        id: "ARCTROOPER501ST",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 75000,
                            label: "Health",
                          },
                          {
                            key: "physicalOffense",
                            min: 10000,
                            label: "Physical Offense",
                          },
                        ],
                        zetas: ["uniqueskill_ARCTROOPER501ST01"],
                      },
                      {
                        id: "CT7567",
                        stats: [
                          {
                            key: "speed",
                            min: 320,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 65000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_REX01"],
                      },
                      {
                        id: "CT5555",
                        stats: [
                          {
                            key: "speed",
                            min: 200,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 100000,
                            label: "Health",
                          },
                          {
                            key: "physicalArmor",
                            min: 70,
                            label: "Armor",
                          },
                        ],
                        zetas: ["uniqueskill_CT555501", "uniqueskill_CT555502"],
                      },
                    ],
                  },
                ],
              },
              {
                id: "jedi",
                label: "Combat Mission: Jedi",
                teams: [
                  {
                    label: "Double Luke",
                    id: "jkl",
                    units: [
                      {
                        id: "JEDIKNIGHTLUKE",
                        level: 7,
                        type: "Relic",
                        zetas: [
                          "leaderskill_JEDIKNIGHTLUKE",
                          "uniqueskill_JEDIKNIGHTLUKE01",
                        ],
                      },
                      {
                        id: "GRANDMASTERLUKE",
                        level: 8,
                        type: "Relic",
                        zetas: [
                          "basicskill_GRANDMASTERLUKE",
                          "specialskill_GRANDMASTERLUKE01",
                          "specialskill_GRANDMASTERLUKE02",
                          "uniqueskill_GRANDMASTERLUKE01",
                          "uniqueskill_GALACTICLEGEND01",
                        ],
                      },
                      {
                        id: "HERMITYODA",
                        level: 5,
                        type: "Relic",
                        zetas: ["specialskill_HERMITYODA02"],
                      },
                      {
                        id: "OLDBENKENOBI",
                        level: 5,
                        type: "Relic",
                      },
                      {
                        id: "GRANDMASTERYODA",
                        level: 12,
                        type: "Gear",
                        zetas: ["specialskill_GRANDMASTERYODA03"],
                      },
                    ],
                  },
                  {
                    label: "Jedi Knight Revan",
                    id: "jkr",
                    units: [
                      {
                        id: "JEDIKNIGHTREVAN",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                        ],
                        zetas: [
                          "leaderskill_JEDIKNIGHTREVAN",
                          "uniqueskill_JEDIKNIGHTREVAN01",
                          "uniqueskill_JEDIKNIGHTREVAN02",
                        ],
                      },
                      {
                        id: "GENERALSKYWALKER",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "critDamage",
                            min: 222,
                            label: "Crit Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 70,
                            label: "Physical Crit Chance",
                          },
                        ],
                        zetas: [
                          "basicskill_GENERALSKYWALKER",
                          "uniqueskill_GENERALSKYWALKER01",
                        ],
                      },
                      {
                        id: "HERMITYODA",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                        ],
                        zetas: ["specialskill_HERMITYODA03"],
                      },
                      {
                        id: "GRANDMASTERYODA",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                        ],
                        zetas: ["specialskill_GRANDMASTERYODA01"],
                      },
                      {
                        id: "JOLEEBINDO",
                        stats: [
                          {
                            key: "speed",
                            min: 215,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 50000,
                            label: "Health",
                          },
                        ],
                        zetas: ["specialskill_JOLEEBINDO02"],
                      },
                    ],
                  },
                  {
                    label: "Jedi Master Kenobi",
                    id: "jmk",
                    units: [
                      {
                        id: "JEDIMASTERKENOBI",
                        level: 8,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "MACEWINDU",
                        level: 3,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "AAYLASECURA",
                        level: 3,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "QUIGONJINN",
                        level: 3,
                        type: "Relic",
                      },
                      {
                        id: "AHSOKATANO",
                        level: 12,
                        type: "Gear",
                        zetas: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "jedi",
                label: "Combat Mission: Jedi",
                teams: [
                  {
                    label: "Double Luke",
                    id: "jkl",
                    units: [
                      {
                        id: "JEDIKNIGHTLUKE",
                        level: 7,
                        type: "Relic",
                        zetas: [
                          "leaderskill_JEDIKNIGHTLUKE",
                          "uniqueskill_JEDIKNIGHTLUKE01",
                        ],
                      },
                      {
                        id: "GRANDMASTERLUKE",
                        level: 8,
                        type: "Relic",
                        zetas: [
                          "basicskill_GRANDMASTERLUKE",
                          "specialskill_GRANDMASTERLUKE01",
                          "specialskill_GRANDMASTERLUKE02",
                          "uniqueskill_GRANDMASTERLUKE01",
                          "uniqueskill_GALACTICLEGEND01",
                        ],
                      },
                      {
                        id: "HERMITYODA",
                        level: 5,
                        type: "Relic",
                        zetas: ["specialskill_HERMITYODA02"],
                      },
                      {
                        id: "OLDBENKENOBI",
                        level: 5,
                        type: "Relic",
                      },
                      {
                        id: "GRANDMASTERYODA",
                        level: 12,
                        type: "Gear",
                        zetas: ["specialskill_GRANDMASTERYODA03"],
                      },
                    ],
                  },
                  {
                    label: "Jedi Knight Revan",
                    id: "jkr",
                    units: [
                      {
                        id: "JEDIKNIGHTREVAN",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                        ],
                        zetas: [
                          "leaderskill_JEDIKNIGHTREVAN",
                          "uniqueskill_JEDIKNIGHTREVAN01",
                          "uniqueskill_JEDIKNIGHTREVAN02",
                        ],
                      },
                      {
                        id: "GENERALSKYWALKER",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "critDamage",
                            min: 222,
                            label: "Crit Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 70,
                            label: "Physical Crit Chance",
                          },
                        ],
                        zetas: [
                          "basicskill_GENERALSKYWALKER",
                          "uniqueskill_GENERALSKYWALKER01",
                        ],
                      },
                      {
                        id: "HERMITYODA",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                        ],
                        zetas: ["specialskill_HERMITYODA03"],
                      },
                      {
                        id: "GRANDMASTERYODA",
                        stats: [
                          {
                            key: "speed",
                            min: 275,
                            label: "Speed",
                          },
                        ],
                        zetas: ["specialskill_GRANDMASTERYODA01"],
                      },
                      {
                        id: "JOLEEBINDO",
                        stats: [
                          {
                            key: "speed",
                            min: 215,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 50000,
                            label: "Health",
                          },
                        ],
                        zetas: ["specialskill_JOLEEBINDO02"],
                      },
                    ],
                  },
                  {
                    label: "Jedi Master Kenobi",
                    id: "jmk",
                    units: [
                      {
                        id: "JEDIMASTERKENOBI",
                        level: 8,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "MACEWINDU",
                        level: 3,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "AAYLASECURA",
                        level: 3,
                        type: "Relic",
                        zetas: [],
                      },
                      {
                        id: "QUIGONJINN",
                        level: 3,
                        type: "Relic",
                      },
                      {
                        id: "AHSOKATANO",
                        level: 12,
                        type: "Gear",
                        zetas: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "phase2",
        label: "Phase 2",
        positions: [
          {
            id: "mid",
            label: "Middle",
            missions: [
              {
                id: "gasAhsokaCombat",
                label: "GAS + Ahsoka",
                teams: [
                  {
                    id: "gasAhsoka",
                    label: "GAS + Ahsoka",
                    units: [
                      {
                        id: "GENERALSKYWALKER",
                        stats: [
                          {
                            key: "speed",
                            min: 290,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 100000,
                            label: "Health",
                          },
                          {
                            key: "physicalOffense",
                            min: 7700,
                            label: "Physical Offense",
                          },
                          {
                            key: "critDamage",
                            min: 222,
                            label: "Crit Damage",
                          },
                        ],
                      },
                      {
                        id: "AHSOKATANO",
                        stats: [
                          {
                            key: "speed",
                            min: 230,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                          {
                            key: "physicalCritChance",
                            min: 90,
                            label: "Physical Crit Chance",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "bot",
            label: "Bottom",
            missions: [
              {
                id: "specialKenobi",
                label: "Special: Kenobi + Friends",
                teams: [
                  {
                    id: "kenobiFriends",
                    label: "Kenobi + Friends",
                    units: [
                      {
                        id: "GENERALKENOBI",
                        stats: [
                          {
                            key: "speed",
                            min: 315,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 90000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "CLONESERGEANTPHASEI",
                        stats: [
                          {
                            key: "speed",
                            min: 230,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 70000,
                            label: "Health",
                          },
                          {
                            key: "critDamage",
                            min: 222,
                            label: "Crit Damage",
                          },
                          {
                            key: "physicalCritChance",
                            min: 90,
                            label: "Physical Crit Chance",
                          },
                        ],
                      },
                      {
                        id: "CC2224",
                        stats: [
                          {
                            key: "speed",
                            min: 250,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 85000,
                            label: "Health",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "phase3",
        label: "Phase 3",
        positions: [
          {
            id: "bottom",
            label: "Bottom",
            missions: [
              {
                id: "special",
                label: "Special Mission (KAM)",
                teams: [
                  {
                    label: "Shaak Ti + Clones",
                    id: "shaakClones",
                    units: [
                      {
                        id: "SHAAKTI",
                        stats: [
                          {
                            key: "speed",
                            min: 315,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 80000,
                            label: "Health",
                          },
                          {
                            key: "critAvoidance",
                            min: 24,
                            label: "Crit Avoidance",
                          },
                        ],
                        zetas: ["leaderskill_SHAAKTI", "uniqueskill_SHAAKTI01"],
                      },
                      {
                        id: "CT210408",
                        stats: [
                          {
                            key: "speed",
                            min: 215,
                            label: "Speed",
                          },
                          {
                            key: "specialCritChance",
                            min: 30,
                            label: "Special Crit",
                          },
                          {
                            key: "health",
                            min: 50000,
                            label: "Health",
                          },
                          {
                            key: "specialOffense",
                            min: 10000,
                            label: "Special Offense",
                          },
                        ],
                        zetas: ["uniqueskill_ct21040802"],
                      },
                      {
                        id: "CT7567",
                        stats: [
                          {
                            key: "speed",
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 60000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_REX01"],
                      },
                      {
                        id: "CT5555",
                        stats: [
                          {
                            key: "speed",
                            min: 215,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 95000,
                            label: "Health",
                          },
                        ],
                        zetas: ["uniqueskill_CT555501", "uniqueskill_CT555502"],
                      },
                      {
                        id: "ARCTROOPER501ST",
                        stats: [
                          {
                            key: "speed",
                            min: 280,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 70000,
                            label: "Health",
                          },
                          {
                            key: "physicalOffense",
                            min: 10000,
                            label: "Physical Offense",
                          },
                        ],
                        zetas: ["uniqueskill_ARCTROOPER501ST01"],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "top",
            label: "Top",
            missions: [
              {
                id: "ships_special",
                label: "Ships Special Mission (GET2)",
                teams: [
                  {
                    id: "grShips",
                    label: "Galactic Republic Ships",
                    units: [
                      {
                        id: "CAPITALNEGOTIATOR",
                        level: 73000,
                        type: "Power",
                      },
                      {
                        id: "UMBARANSTARFIGHTER",
                        level: 79000,
                        type: "Power",
                      },
                      {
                        id: "ARC170REX",
                        level: 67000,
                        type: "Power",
                      },
                      {
                        id: "JEDISTARFIGHTERANAKIN",
                        level: 73000,
                        type: "Power",
                      },
                      {
                        id: "JEDISTARFIGHTERAHSOKATANO",
                        level: 63000,
                        type: "Power",
                      },
                      {
                        id: "ARC170CLONESERGEANT",
                        level: 44000,
                        type: "Power",
                      },
                      {
                        id: "GAUNTLETSTARFIGHTER",
                        level: 44000,
                        type: "Power",
                      },
                      {
                        id: "JEDISTARFIGHTERCONSULAR",
                        level: 42000,
                        type: "Power",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
