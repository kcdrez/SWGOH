import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "@vueform/toggle/themes/default.css";
import "bootstrap";
import "vue3-resize/dist/vue3-resize.css";
import Toaster from "vue-dk-toast";
import moment from "moment";
import Toggle from "@vueform/toggle";
import Popper from "vue3-popper";
import { ResizeObserver } from "vue3-resize";

import App from "./App.vue";
import store from "vuex-store/store";
import router from "./router/router";
import "styles/main.scss";
import Confirm from "components/general/confirm.vue";
import SearchInput from "components/general/search-input.vue";
import ProgressBar from "components/general/progressBar.vue";
import Loading from "components/general/loading.vue";
import Error from "components/general/error.vue";
import MultiSelect from "components/general/multiSelect.vue";
import ExpandableSection from "components/general/expandableSection.vue";
import SwgohTable from "components/general/table/swgohTable.vue";
import { formatDate, pluralText, daysFromNow, numbersOnly } from "utils";

const app = createApp(App);

app.config.globalProperties.$filters = {
  dateTime(value: number, format: string = "MMM D, YYYY"): string {
    if (value <= 0) {
      return "-";
    } else {
      const date = moment().add(value, "days").format(format);
      return `${value} Days (${date})`;
    }
  },
  daysFromNow,
  pluralText,
  numbersOnly,
  formatDate,
};

app
  .use(Toaster)
  .use(store)
  .use(router)
  .component("Confirm", Confirm)
  .component("ExpandableSection", ExpandableSection)
  .component("SwgohTable", SwgohTable)
  .component("SearchInput", SearchInput)
  .component("ProgressBar", ProgressBar)
  .component("Loading", Loading)
  .component("Error", Error)
  .component("MultiSelect", MultiSelect)
  .component("Toggle", Toggle)
  .component("Popper", Popper)
  .component("ResizeObserver", ResizeObserver)
  .mount("#app");
