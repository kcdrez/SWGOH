import { createApp } from 'vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './styles/main.scss';
import store from './vuex-store/store';
import router from './router/router';

const app = {
  template: `<div>
    <router-view></router-view>
  </div>`,
  created() {
  }
};

createApp(app)
  .use(store)
  .use(router)
  .mount('#app');