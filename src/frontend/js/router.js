import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

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

export const router = new VueRouter({
    mode: 'history',
    routes
});