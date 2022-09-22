type tMap = {
  [key: number]: number;
};
type tGearLevelMap = {
  [key: number]: {
    perPiece: number;
    priorTier: number;
    cumulative: number;
  };
};
type tRelicLevelMap = {
  [key: number]: {
    rating: number;
    multiplier: number;
  };
};
type tModsMap = {
  [key: number]: tMap;
};

export const multiplierMap: tMap = {
  1: 1,
  2: 1.05,
  3: 1.1,
  4: 1.15,
  5: 1.25,
  6: 1.35,
  7: 1.5,
};

export const crewStarsMap: tMap = {
  1: 200,
  2: 300,
  3: 450,
  4: 675,
  5: 1013,
  6: 1773,
  7: 3103,
};

export const crewLevelMap: tMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 10,
  10: 12,
  11: 14,
  12: 16,
  13: 18,
  14: 20,
  15: 22,
  16: 24,
  17: 26,
  18: 28,
  19: 31,
  20: 34,
  21: 37,
  22: 40,
  23: 43,
  24: 46,
  25: 49,
  26: 53,
  27: 57,
  28: 61,
  29: 65,
  30: 69,
  31: 74,
  32: 79,
  33: 84,
  34: 89,
  35: 95,
  36: 101,
  37: 107,
  38: 113,
  39: 120,
  40: 127,
  41: 134,
  42: 142,
  43: 150,
  44: 159,
  45: 168,
  46: 177,
  47: 187,
  48: 197,
  49: 208,
  50: 219,
  51: 231,
  52: 244,
  53: 257,
  54: 271,
  55: 286,
  56: 301,
  57: 317,
  58: 334,
  59: 352,
  60: 371,
  61: 391,
  62: 412,
  63: 434,
  64: 457,
  65: 481,
  66: 506,
  67: 532,
  68: 560,
  69: 589,
  70: 619,
  71: 651,
  72: 685,
  73: 720,
  74: 757,
  75: 796,
  76: 837,
  77: 880,
  78: 925,
  79: 972,
  80: 1022,
  81: 1075,
  82: 1131,
  83: 1190,
  84: 1252,
  85: 1317,
  86: 1386,
  87: 1459,
  88: 1536,
  89: 1618,
  90: 1705,
};

export const gearLevelMap: tGearLevelMap = {
  1: {
    perPiece: 7,
    priorTier: 0,
    cumulative: 0,
  },
  2: {
    perPiece: 22,
    priorTier: 42,
    cumulative: 42,
  },
  3: {
    perPiece: 28,
    priorTier: 132,
    cumulative: 174,
  },
  4: {
    perPiece: 37,
    priorTier: 168,
    cumulative: 342,
  },
  5: {
    perPiece: 44,
    priorTier: 222,
    cumulative: 564,
  },
  6: {
    perPiece: 56,
    priorTier: 264,
    cumulative: 828,
  },
  7: {
    perPiece: 75,
    priorTier: 336,
    cumulative: 1164,
  },
  8: {
    perPiece: 81,
    priorTier: 450,
    cumulative: 1614,
  },
  9: {
    perPiece: 95,
    priorTier: 486,
    cumulative: 2100,
  },
  10: {
    perPiece: 118,
    priorTier: 570,
    cumulative: 2670,
  },
  11: {
    perPiece: 132,
    priorTier: 708,
    cumulative: 3378,
  },
  12: {
    perPiece: 140,
    priorTier: 792,
    cumulative: 3378,
  },
  13: {
    perPiece: 0,
    priorTier: 840,
    cumulative: 5010,
  },
};

export const relicLevelMap: tRelicLevelMap = {
  0: {
    rating: 0,
    multiplier: 0,
  },
  1: {
    rating: 150,
    multiplier: 1.2,
  },
  2: {
    rating: 300,
    multiplier: 1.4,
  },
  3: {
    rating: 450,
    multiplier: 1.6,
  },
  4: {
    rating: 600,
    multiplier: 1.8,
  },
  5: {
    rating: 750,
    multiplier: 2,
  },
  6: {
    rating: 1050,
    multiplier: 2.2,
  },
  7: {
    rating: 1350,
    multiplier: 2.4,
  },
  8: {
    rating: 1800,
    multiplier: 2.6,
  },
  9: {
    rating: 2250,
    multiplier: 2.8,
  },
};

export const abilityMap: tMap = {
  0: 0,
  1: 0,
  2: 28,
  3: 65,
  4: 109,
  5: 184,
  6: 265,
  7: 383,
  8: 523,
  9: 663,
};

//top level is the mod level, secondary is the pips count
export const modsMap: tModsMap = {
  1: {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
  },
  2: {
    1: 2,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 3,
    7: 4,
  },
  3: {
    1: 3,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 9,
  },
  4: {
    1: 4,
    2: 4,
    3: 6,
    4: 8,
    5: 10,
    6: 13,
    7: 17,
  },
  5: {
    1: 5,
    2: 5,
    3: 8,
    4: 12,
    5: 15,
    6: 20,
    7: 28,
  },
  6: {
    1: 6,
    2: 6,
    3: 11,
    4: 16,
    5: 21,
    6: 29,
    7: 43,
  },
  7: {
    1: 8,
    2: 8,
    3: 14,
    4: 20,
    5: 28,
    6: 41,
    7: 61,
  },
  8: {
    1: 9,
    2: 9,
    3: 17,
    4: 26,
    5: 36,
    6: 54,
    7: 84,
  },
  9: {
    1: 10,
    2: 10,
    3: 20,
    4: 31,
    5: 45,
    6: 70,
    7: 111,
  },
  10: {
    1: 11,
    2: 11,
    3: 24,
    4: 37,
    5: 55,
    6: 87,
    7: 142,
  },
  11: {
    1: 12,
    2: 13,
    3: 27,
    4: 44,
    5: 66,
    6: 107,
    7: 178,
  },
  12: {
    1: 13,
    2: 14,
    3: 31,
    4: 51,
    5: 78,
    6: 130,
    7: 220,
  },
  13: {
    1: 14,
    2: 15,
    3: 35,
    4: 59,
    5: 91,
    6: 154,
    7: 267,
  },
  14: {
    1: 16,
    2: 17,
    3: 39,
    4: 67,
    5: 105,
    6: 181,
    7: 319,
  },
  15: {
    1: 17,
    2: 18,
    3: 44,
    4: 76,
    5: 120,
    6: 211,
    7: 337,
  },
};
