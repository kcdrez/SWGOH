import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import { State } from "./vuex-store/store";
// import Toaster from "@meforma/vue-toaster";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<State>;
    // $toast: Toaster
  }
}
