import '../css/main.css';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';

// import * as idb from 'idb';

import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Toasted from 'vue-toasted';
import '@mdi/font/css/materialdesignicons.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VuexRouterSync from 'vuex-router-sync';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

import App from '../components/App.vue';
// import Home from '../components/pages/Home.vue';

(async () => {
    Vue.use(Vuex);
    Vue.use(VueRouter);
    Vue.use(Vuetify);
    Vue.use(Toasted, {
        iconPack: 'mdi'
    });
    Vue.use(VueSweetalert2);

    let routes = [];

    // let routes = [
    //     {
    //         name: "PanrHome",
    //         path: "/",
    //         component: PanrHome
    //     },
    //     {
    //         name: "PanrLocation",
    //         path: "/location/:uuid",
    //         component: PanrLocation
    //     },
    //     {
    //         name: "PanrLicenses",
    //         path: "/licenses",
    //         component: PanrLicenses
    //     }
    // ];
    
    const store = new Vuex.Store({
        state: {
            locations: {
                "bac59ce4-14ac-4b97-8497-3a555f6e22ed": {
                    uuid: "bac59ce4-14ac-4b97-8497-3a555f6e22ed",
                    src: require('../img/scene/GS__0017_1612183740963.JPG'),
                    hotspots: [
                        {
                            location: "4b7150d2-bab2-4f68-9b7d-757176f45820",
                            position: [
                                0,
                                0,
                                -75
                            ],
                            rotation: [
                                0
                            ],
                            colour: 0x00ff22,
                            icon: null
                        }
                    ]
                },
                "4b7150d2-bab2-4f68-9b7d-757176f45820": {
                    uuid: "4b7150d2-bab2-4f68-9b7d-757176f45820",
                    src: require('../img/scene/GS__0016_1612183740963.JPG'),
                    hotspots: [
                        {
                            location: "bac59ce4-14ac-4b97-8497-3a555f6e22ed",
                            position: [
                                90,
                                0,
                                -75
                            ],
                            rotation: [
                                -45
                            ],
                            colour: 0x00ffff,
                            icon: null
                        },
                        {
                            location: "c4da576f-be69-4d9f-8368-b93df2ada6b5",
                            position: [
                                -50,
                                0,
                                -75
                            ],
                            rotation: [
                                0
                            ],
                            colour: 0x00ff22,
                            icon: null
                        },
                    ]
                },
                "c4da576f-be69-4d9f-8368-b93df2ada6b5": {
                    uuid: "c4da576f-be69-4d9f-8368-b93df2ada6b5",
                    src: require('../img/scene/Corridor01.JPG'),
                    hotspots: [
                        {
                            location: "4b7150d2-bab2-4f68-9b7d-757176f45820",
                            position: [
                                -420,
                                -20,
                                0
                            ],
                            rotation: [
                                45
                            ],
                            colour: 0x00ffff,
                            icon: null
                        }
                    ]
                }
            }
        },
        getters: {
            // getTicket: state => uuid => {
            //     return state.profile.tickets.filter(r => r.uuid == uuid)[0];
            // },
            // getStop: state => atco => {
            //     return state.stops[atco];
            // }
        },
        mutations: {

        }
    });

    const router = new VueRouter({
        mode: 'history',
        routes
    });

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