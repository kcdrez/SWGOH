type Phase = {
  darkSide: PhaseAlignment;
  mixed: PhaseAlignment;
  lightSide: PhaseAlignment;
};

type PhaseAlignment = {
  stars: StarsMapping;
  key?: "darkSide" | "mixed" | "lightSide";
};

type StarsMapping = {
  1: number;
  2: number;
  3: number;
};

const phaseData: Record<string, Phase> = {
  phase1: {
    darkSide: {
      key: "darkSide",
      stars: {
        1: 116406250,
        2: 186250000 - 116406250,
        3: 248333333 - 186250000 - 116406250,
      },
    },
    mixed: {
      key: "mixed",
      stars: {
        1: 111718750,
        2: 178750000 - 111718750,
        3: 238333333 - 178750000 - 111718750,
      },
    },
    lightSide: {
      key: "lightSide",
      stars: {
        1: 116406250,
        2: 186250000 - 116406250,
        3: 248333333 - 186250000 - 116406250,
      },
    },
  },
};

type Results = {
  day1: {
    darkSide: PhaseAlignment;
    mixed: PhaseAlignment;
    lightSide: PhaseAlignment;
  };
};

const results: Results = {
  day1: {
    darkSide: {
      stars: {
        1: 0,
        2: 0,
        3: 0,
      },
    },
    mixed: {
      stars: {
        1: 0,
        2: 0,
        3: 0,
      },
    },
    lightSide: {
      stars: {
        1: 0,
        2: 0,
        3: 0,
      },
    },
  },
};

const totalGP = 500000000;
const preloadSafety = 0.9;

export const processData = () => {
  let remainingGP = totalGP;
  let ignoreKeys: PhaseAlignment["key"][] = [];

  Object.values(phaseData).forEach((phase) => {
    let i = 1;
    do {
      ignoreKeys = [];
      do {
        const lowest = findLowest(phase, i, ignoreKeys);
        if (lowest && lowest.key) {
          let assignGP = 0;
          if (i === 1) {
            assignGP = Math.min(lowest.stars[i] * preloadSafety, remainingGP);
          } else if (remainingGP > lowest.stars[i]) {
            assignGP = lowest.stars[i];
          }
          results.day1[lowest.key].stars[i] = assignGP;
          remainingGP -= assignGP;
          ignoreKeys.push(lowest.key);
        }
      } while (ignoreKeys.length < 3);
      i++;
    } while (remainingGP > 0 && i <= 3);
  });

  console.log(getResults(results, remainingGP));
};

const findLowest = (
  phase: Phase,
  starsKey: number,
  ignoreKeys: PhaseAlignment["key"][]
): PhaseAlignment | null => {
  if (starsKey > 3 || starsKey < 1) {
    throw new Error("Stars count must be 1, 2, or 3: " + starsKey);
  }

  const alignmentArray = Object.values(phase).filter((x) => {
    return !ignoreKeys.includes(x.key);
  });

  if (alignmentArray.length > 0) {
    let lowest = alignmentArray[0];

    for (let i = 1; i < alignmentArray.length; i++) {
      if (alignmentArray[i].stars[starsKey] < lowest.stars[starsKey]) {
        lowest = alignmentArray[i];
      }
    }

    return lowest;
  }
  return null;
};

const getResults = (results: Results, remainingGP: number) => {
  let totalStars = 0;
  let achievedStars = 0;

  Object.values(results).forEach((day) => {
    Object.values(day).forEach((x) => {
      if (x.stars[3] > 0) {
        achievedStars += 3;
      } else if (x.stars[2] > 0) {
        achievedStars += 2;
      } else if (x.stars[1] > 0) {
        achievedStars += 1;
      }
      totalStars += 3;
    });
  });

  return {
    remainingGP,
    achievedStars,
    totalStars,
    results,
  };
};
