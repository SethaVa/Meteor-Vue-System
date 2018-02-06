import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// State
import app from './app';

const store = new Vuex.Store({
    modules: {
        app: app,
    }
});

export default store;
