import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import extensions from "./modules/extensions";
import collections from "./modules/collections";
import edits from "./modules/edits";
import permissions from "./modules/permissions";
import settings from "./modules/settings";
import users from "./modules/users";
import relations from "./modules/relations";
import serverInfo from "./modules/server-info";
import notifications from "./modules/notifications";

import initialState from "./state";
import * as actions from "./actions";
import * as getters from "./getters";
import mutations from "./mutations";
import { RESET } from "./mutation-types";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production"; // eslint-disable-line no-undef

const store = new Vuex.Store({
  state: _.clone(initialState),
  actions,
  getters,
  mutations: {
    [RESET](state) {
      Object.keys(initialState).forEach(key => {
        // don't reset the currentprojectkey flag, that's saved / restored from
        // vuex-persistedstate
        if (key === "currentProjectKey") return;
        state[key] = initialState[key];
      });
    },
    ...mutations
  },
  strict: debug,
  modules: {
    collections,
    extensions,
    edits,
    permissions,
    users,
    relations,
    serverInfo,
    notifications,
    settings
  },
  plugins: [
    createPersistedState({
      key: "directus-app",
      paths: ["currentProjectKey"],
      storage: window.sessionStorage
    })
  ]
});

export default store;
