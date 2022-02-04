import { createStore } from "vuex";
import { store as gearStore, State as GearState } from "./gear";
import { store as unitStore, State as UnitState } from "./unit";
import { store as playerStore, State as PlayerState } from "./player";
import { store as relicStore, State as RelicState } from "./relic";
import { store as plannerStore, State as PlannerState } from "./planner";
import { store as speedStore, State as SpeedState } from "./speed";
import { loadingState } from "../types/loading";

type ModuleTypes = "gear" | "relic" | "unit" | "player" | "planner" | "speed";

export interface State {
  requestState: loadingState;
  collapseSections: any;
  //modules' state
  gear: GearState;
  relic: RelicState;
  unit: UnitState;
  player: PlayerState;
  planner: PlannerState;
  speed: SpeedState;
}

const store = createStore<State>({
  modules: {
    gear: gearStore,
    relic: relicStore,
    unit: unitStore,
    player: playerStore,
    planner: plannerStore,
    speed: speedStore,
  },
  state: {
    requestState: loadingState.initial,
    collapseSections: {},
    gear: gearStore.state,
    relic: relicStore.state,
    unit: unitStore.state,
    player: playerStore.state,
    planner: plannerStore.state,
    speed: speedStore.state,
  },
  getters: {
    someLoading(state: State) {
      return (moduleNames: ModuleTypes[]): loadingState => {
        const someLoading = moduleNames.some((name) => {
          if (name in state) {
            const { requestState } = state[name];
            return requestState !== loadingState.ready;
          } else {
            return false;
          }
        });
        return someLoading ? loadingState.loading : loadingState.ready;
      };
    },
  },
  mutations: {
    SET_REQUEST_STATE(state, payload: loadingState) {
      state.requestState = payload;
    },
    TOGGLE_COLLAPSE(state, { name, hidden }: any) {
      state.collapseSections[name] = hidden;
    },
    SET_COLLAPSE(state, payload) {
      state.collapseSections = payload;
    },
  },
  actions: {
    async initialize({ commit, dispatch }) {
      commit("SET_REQUEST_STATE", loadingState.loading);
      const collapseData = JSON.parse(
        window.localStorage.getItem("collapseSections") || "{}"
      );
      commit("SET_COLLAPSE", collapseData);
      await dispatch("player/initialize", { root: true });
      await dispatch("unit/initialize", { root: true });
      await dispatch("gear/fetchGear", { root: true });
      commit("SET_REQUEST_STATE", loadingState.ready);
    },
    toggleCollapse({ commit, state }, payload) {
      commit("TOGGLE_COLLAPSE", payload);
      window.localStorage.setItem(
        "collapseSections",
        JSON.stringify(state.collapseSections)
      );
    },
  },
});

export default store;
