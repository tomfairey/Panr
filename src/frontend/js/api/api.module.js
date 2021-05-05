import server from "./http-common";

export const api = {
    namespaced: true,
    state: {
        locations: null,
        hotspots: null,
        meta: null
    },
    actions: {
        getLocations({ commit, getters }) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log("Updating locations");
                    let response = await server.get("/location");
                    resolve(response.data.locations);
                } catch (e) {
                    reject(e);
                }
            });
        },
        getHotspots({ commit, getters }) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log("Updating hotspots");
                    let response = await server.get("/hotspot");
                    resolve(response.data.hotspots);
                } catch (e) {
                    reject(e);
                }
            });
        },
        getMeta({ commit, getters }) {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log("Updating meta");
                    let response = await server.get("/meta");
                    resolve(response.data.meta);
                } catch (e) {
                    reject(e);
                }
            });
        },
        getAllAndStore({ commit, getters }) {
            return new Promise(async (resolve, reject) => {
                try {
                    await commit('updateLocations', await this.dispatch('api/getLocations'));
                    await commit('updateHotspots', await this.dispatch('api/getHotspots'));
                    await commit('updateMeta', await this.dispatch('api/getMeta'));
                } catch(e) { reject(e); }

                resolve();
            });
        }
    },
    getters: {
        locations: (state) => {
            return state.locations;
        },
        hotspots: (state) => {
            return state.hotspots;
        },
        meta: (state) => {
            return state.meta;
        },
        locationByUuid: (state, getters) => (locationUuid) => {
            return getters.locations[locationUuid];
        },
        hotspotByUuid: (state, getters) => (hotspotUuid) => {
            return getters.hotspots[hotspotUuid];
        },
        locationsByCampus: (state, getters) => (campusUuid) => {
            return [...Object.values(getters.locations)].filter(l => l.campus == campusUuid);
        },
        hotspotsByCampus: (state, getters) => (campusUuid) => {
            return [...Object.values(getters.hotspots)].filter(h => h.campus == campusUuid);
        },
        metasByName: (state, getters) => (metaName) => {
            return [...getters.meta].filter(m => m.name == metaName);
        },
    },
    mutations: {
        updateLocations(state, locations) {
            state.locations = locations;
        },
        updateHotspots(state, hotspots) {
            state.hotspots = hotspots;
        },
        updateMeta(state, meta) {
            state.meta = meta;
        },
        clearAll(state) {
            delete state.locations;
            delete state.hotspots;
            delete state.meta;
        }
    }
};