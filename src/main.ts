import { createApp } from "vue";
import "./styles/main.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Toaster from "vue-dk-toast";
import moment from "moment";

import App from "./App.vue";
import store from "./vuex-store/store";
import router from "./router/router";
import "./styles/main.scss";

const app = createApp(App);

app.config.globalProperties.$filters = {
  dateTime(value: number): string {
    const date = moment().add(value, "days").format("MM-DD-YYYY");
    return `${value} Days (${date})`;
  },
};

app.use(Toaster).use(store).use(router).mount("#app");
