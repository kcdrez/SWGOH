import { createApp } from "vue";
import "./styles/main.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

import App from "./App.vue";
import store from "./vuex-store/store";
import router from "./router/router";
import "./styles/main.scss";

createApp(App).use(store).use(router).mount("#app");
