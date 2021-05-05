import '../css/main.css';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

// import * as idb from 'idb';

import Vue from 'vue';
import Vuetify from 'vuetify';
import Toasted from 'vue-toasted';
import '@mdi/font/css/materialdesignicons.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VuexRouterSync from 'vuex-router-sync';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

import { router } from './router';
import { store } from './store';

import App from '../components/App.vue';
// import Home from '../components/pages/Home.vue';

(async () => {
    Vue.use(Vuetify);
    Vue.use(Toasted, {
        iconPack: 'mdi'
    });
    Vue.use(VueSweetalert2);

    const opts = {};
    const vuetify = new Vuetify(opts);

    // Vue.config.devtools = true;
    // Vue.config.productionTip = false;

    VuexRouterSync.sync(store, router);

    new Vue({
        store,
        router,
        vuetify,
        render: createElement => createElement(App)
    }).$mount('#app');
})();