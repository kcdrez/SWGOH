import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./styles/main.scss";
import Toaster from "vue-dk-toast";
import moment from "moment";

import App from "./App.vue";
import store from "./vuex-store/store";
import router from "./router/router";
import "./styles/main.scss";
import Confirm from "./components/confirm.vue";
import SearchInput from "./components/search-input.vue";

const app = createApp(App);

app.config.globalProperties.$filters = {
  dateTime(value: number): string {
    if (value <= 0) {
      return "-";
    } else {
      const date = moment().add(value, "days").format("MM-DD-YYYY");
      return `${value} Days (${date})`;
    }
  },
};

app
  .use(Toaster)
  .use(store)
  .use(router)
  .component("Confirm", Confirm)
  .component("SearchInput", SearchInput)
  .mount("#app");
