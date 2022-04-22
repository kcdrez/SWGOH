import store from "../vuex-store/store";
import { Unit, UnitGear, Ability } from "./unit";
import { round2Decimals } from "../utils";

export interface GuildPayload {
  territoryWar?: TerritoryWarEvent[];
  territoryBattle?: TerritoryBattleEvent[];
}

export interface TerritoryWarEvent {
  id: string;
  date: string;
  win: boolean;
  get1: number;
  get2: number;
  zetas: number;
}

export interface TerritoryBattleEvent {
  id: string;
  date: string;
  type: "Dark" | "Light";
  name:
    | "Separatist Might"
    | "Republic Offensive"
    | "Rebel Assault"
    | "Imperial Retaliation";
  get1: number;
  get2: number;
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
  name: "SEE + Sith Buddies",
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
  name: "Sith Empire",
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
  name: "First Order",
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
const bh = {
  name: "Bounty Hunters",
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
const geos = {
  name: "Poggle Geos",
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
};
const shaakClones = {
  name: "Shaak Ti + Clones",
  units: [
    {
      id: "SHAAKTI",
      level: 5,
      type: "Relic",
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
};

// export const tbRecommended = {
//   DSSeparatistMight: {
//     phase1: {
//       top: {
//         combatMission1: {
//           teams: [
//             {
//               label: "Poggle Geos",
//               id: "poggleGeos",
//               units: [
//                 {
//                   id: "POGGLETHELESSER",
//                   level: 12,
//                   type: "Gear",
//                 },
//                 {
//                   id: "GEONOSIANSPY",
//                   level: 12,
//                   type: "Gear",
//                 },
//                 {
//                   id: "GEONOSIANSOLDIER",
//                   level: 12,
//                   type: "Gear",
//                 },
//                 {
//                   id: "GEONOSIANBROODALPHA",
//                   level: 12,
//                   type: "Gear",
//                 },
//                 {
//                   id: "SUNFAC",
//                   level: 12,
//                   type: "Gear",
//                 },
//               ],
//             },
//           ],
//           required: "POGGLETHELESSER",
//         },
//         combatMission2: {
//           teams: [see, sithEmpire, fo, bh],
//         },
//       },
//     },
//   },
//   LSRepublicOffensive: {
//     phase3: {
//       bottom: {
//         special: {
//           teams: [
//             {
//               label: "Shaak Ti + Clones",
//               id: "shaakClones",
//               units: [
//                 {
//                   id: "SHAAKTI",
//                   stats: [
//                     {
//                       key: "speed",
//                       min: 300,
//                       label: "Speed",
//                     },
//                     {
//                       key: "health",
//                       min: 85000,
//                       label: "Health",
//                     },
//                     {
//                       key: "critAvoidance",
//                       min: 24,
//                       label: "Crit Avoidance",
//                     },
//                   ],
//                 },
//                 {
//                   id: "CT210408",
//                   stats: [
//                     {
//                       key: "specialCritChance",
//                       min: 30,
//                       label: "Special Crit",
//                     },
//                     {
//                       key: "health",
//                       min: 65000,
//                       label: "Health",
//                     },
//                     {
//                       key: "specialOffense",
//                       min: 10000,
//                       label: "Special Offense",
//                     },
//                   ],
//                 },
//                 {
//                   id: "CT7567",
//                   stats: [
//                     {
//                       key: "speed",
//                       min: 300,
//                       label: "Speed",
//                     },
//                     {
//                       key: "health",
//                       min: 65000,
//                       label: "Health",
//                     },
//                   ],
//                 },
//                 {
//                   id: "CT5555",
//                   stats: [
//                     {
//                       key: "speed",
//                       min: 220,
//                       label: "Speed",
//                     },
//                     {
//                       key: "health",
//                       min: 100000,
//                       label: "Health",
//                     },
//                   ],
//                 },
//                 {
//                   id: "ARCTROOPER501ST",
//                   stats: [
//                     {
//                       key: "speed",
//                       min: 270,
//                       label: "Speed",
//                     },
//                     {
//                       key: "health",
//                       min: 85000,
//                       label: "Health",
//                     },
//                     {
//                       key: "physicalOffense",
//                       min: 10000,
//                       label: "Physical Offense",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     },
//   },
// };

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
                id: "mission1",
                label: "Combat Mission 1",
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
                            min: 300,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 85000,
                            label: "Health",
                          },
                          {
                            key: "critAvoidance",
                            min: 24,
                            label: "Crit Avoidance",
                          },
                        ],
                      },
                      {
                        id: "CT210408",
                        stats: [
                          {
                            key: "specialCritChance",
                            min: 30,
                            label: "Special Crit",
                          },
                          {
                            key: "health",
                            min: 65000,
                            label: "Health",
                          },
                          {
                            key: "specialOffense",
                            min: 10000,
                            label: "Special Offense",
                          },
                        ],
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
                            min: 65000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "CT5555",
                        stats: [
                          {
                            key: "speed",
                            min: 220,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 100000,
                            label: "Health",
                          },
                        ],
                      },
                      {
                        id: "ARCTROOPER501ST",
                        stats: [
                          {
                            key: "speed",
                            min: 270,
                            label: "Speed",
                          },
                          {
                            key: "health",
                            min: 85000,
                            label: "Health",
                          },
                          {
                            key: "physicalOffense",
                            min: 10000,
                            label: "Physical Offense",
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
    ],
  },
];
