import Vue from 'vue';
import Vuex from 'vuex';

import { api } from './api/api.module';

Vue.use(Vuex);

export const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        
    },
    modules: {
        api
    },
    getters: {
        
    },
    mutations: {

    }
});