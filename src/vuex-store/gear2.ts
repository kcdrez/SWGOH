import { BareActionContext } from "vuex-typex";

import {
  CombinedUnit,
  Gear,
  Mission,
  Player,
  UnitData,
} from "@/api/interfaces";
import {
  challenges,
  difficultyIds,
  mapIds,
  missionIds,
  tableIds,
} from "../api/locationMapping";
import { loadingState } from "../enums/loading";
import { storeBuilder, RootState } from "./store2";

export const moduleName = "gear";

export class State {
  requestState: loadingState = loadingState.initial;
  unit: CombinedUnit | null = null;
  gearList: Gear[] = [];
  gearLocations: any[] = []; //todo: type
  ownedGear: any = {}; //todo: type
}

const b = storeBuilder.module<State>(moduleName, new State());

type gearLocationFn = (missions: Mission[]) => string[];
type gearOwnedCountFn = (gear: Gear) => number;
type findGearDataFn = (id: string) => Gear | undefined;

export const getters = {
  get gearLocation(): gearLocationFn {
    return (missions: Mission[]): string[] => {
      return b.read((_state) => {
        const locations: string[] = [];
        missions?.forEach((mission) => {
          const {
            campaignId,
            campaignNodeDifficulty,
            campaignMapId,
            campaignMissionId,
            campaignNodeId,
          } = mission.missionIdentifier;
          const difficulty: any = difficultyIds[campaignNodeDifficulty];
          const table: any = tableIds[campaignId];
          const level: any = mapIds[campaignMapId];
          const node: any = missionIds[campaignMissionId];

          if (campaignMapId === "CHALLENGES") {
            const label = `Daily Challenges (${challenges[campaignNodeId]})`;
            if (!locations.includes(label)) {
              locations.push(label);
            }
          } else if (table) {
            locations.push(`${table} ${level}-${node} (${difficulty})`);
          }
        });
        return locations.sort((a, b) => (a > b ? 1 : -1));
      })();
    };
  },
  get gearOwnedCount(): gearOwnedCountFn {
    return (gear: Gear): number => {
      return b.read((state) => {
        return state.ownedGear[gear.base_id] || 0;
      })();
    };
  },
  get findGearData(): findGearDataFn {
    return (id: string): Gear | undefined => {
      return b.read((state) => {
        return state.gearList.find((el: Gear) => el.base_id === id);
      })();
    };
  },
};

export const mutations = {
  SET_REQUEST_STATE: b.commit((state: State, payload: loadingState) => {
    state.requestState = payload;
  }),
  SET_GEAR: b.commit((state: State, payload: Gear[]) => {
    state.gearList = payload;
  }),
  SET_GEAR_OWNED: b.commit((state: State, payload: Object) => {
    //todo strongly typed payload
    state.ownedGear = payload;
  }),
};

type ActionContext = BareActionContext<State, RootState>;

export const actions = {
  fetchGear: b.dispatch(async ({ rootState }: ActionContext, id: string) => {
    mutations.SET_REQUEST_STATE(loadingState.loading);
    let gearList = await rootState.ggClient?.gear();
    const gearLocations = await rootState.helpClient?.fetchGear();
    const gearOwned = JSON.parse(
      window.localStorage.getItem("ownedGear") || "{}"
    );
    mutations.SET_GEAR_OWNED(gearOwned);

    gearList = gearList.map((gear: any) => {
      const match = gearLocations.find((x: any) => x.id === gear.base_id);
      if (match) {
        const { lookupMissionList, raidLookupList, actionLinkLookupList } =
          match;
        return {
          ...gear,
          lookupMissionList,
          raidLookupList,
          actionLinkLookupList,
        };
      } else {
        return gear;
      }
    });

    mutations.SET_GEAR(gearList);
    mutations.SET_REQUEST_STATE(loadingState.ready);
  }),
};
