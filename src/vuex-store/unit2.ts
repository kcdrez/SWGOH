import { BareActionContext } from "vuex-typex";

import { loadingState } from "../enums/loading";
import { CombinedUnit, Player, UnitData } from "../api/interfaces";
import { storeBuilder, RootState } from "./store2";

export const moduleName = "unit";

export class State {
  requestState: loadingState = loadingState.initial;
  unit: CombinedUnit | null = null;
}

const b = storeBuilder.module<State>(moduleName, new State());

export const getters = {
  get currentGearLevel(): number {
    return b.read((state) => {
      if (state.unit) {
        return (
          state.unit?.gear_level +
          state.unit.gear.filter((x: any) => x.is_obtained).length / 10
        );
      } else {
        return 0;
      }
    })();
  },
};

export const mutations = {
  SET_REQUEST_STATE: b.commit((state: State, payload: loadingState) => {
    state.requestState = payload;
  }),
  SET_UNIT: b.commit((state: State, payload: CombinedUnit) => {
    state.unit = payload;
  }),
};

type ActionContext = BareActionContext<State, RootState>;

export const actions = {
  fetchPlayer: b.dispatch(async ({ rootState }: ActionContext, id: string) => {
    mutations.SET_REQUEST_STATE(loadingState.loading);
    const response = await rootState.helpClient?.fetchUnit(id);
    const match = rootState.player?.player?.units.find(
      (u: UnitData) => u.data.base_id === response?.id
    );
    if (match && response) {
      mutations.SET_UNIT({ ...match.data, ...response });
      mutations.SET_REQUEST_STATE(loadingState.ready);
    } else {
      mutations.SET_REQUEST_STATE(loadingState.error);
    }
  }),
};
