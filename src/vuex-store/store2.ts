import { getStoreBuilder } from "vuex-typex";

import apiClientHelp from "../api/swgoh.help";
import apiClientGG from "../api/swgoh.gg";
import { loadingState } from "../enums/loading";
import { State as GearState, moduleName as gearModuleName } from "./gear2";
import { State as UnitState, moduleName as unitModuleName } from "./unit2";
import {
  State as PlayerState,
  moduleName as playerModuleName,
} from "./player2";

export interface RootState {
  helpClient: apiClientHelp | null;
  ggClient: apiClientGG | null;
  requestState: loadingState;
  //modules' state
  [playerModuleName]: PlayerState;
  [unitModuleName]: UnitState;
  [gearModuleName]: GearState;
}

export const storeBuilder = getStoreBuilder<RootState>();

// export default storeBuilder.vuexStore();
