import Vue from "vue";
import { RESET, SET_USERS, SET_USER, REMOVE_USER, UPDATE_USER } from "../../mutation-types";

export default {
  [RESET](state) {
    // Default state is an empty object, this will delete all properties
    Object.keys(state).forEach(key => {
      Vue.delete(state, key);
    });
  },
  [SET_USERS](state, users) {
    Object.values(users).forEach(user => {
      Vue.set(state, user.id, user);
    });
  },
  [SET_USER](state, user) {
    Vue.set(state, user.id, user);
  },
  [REMOVE_USER](state, user) {
    if (_.isArray(user)) {
      Object.values(user).forEach(value => {
        Vue.delete(state, value);
      });
    } else {
      Vue.delete(state, user);
    }
  },
  [UPDATE_USER](state, { userId, user }) {
    console.log(userId);
    console.log(user);
  }
};
