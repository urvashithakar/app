import { RESET, PUSH_NOTIFICATION, REMOVE_NOTIFICATION } from "../../mutation-types";
import { initialState } from "./";

const mutations = {
  [RESET](state) {
    Object.keys(initialState).forEach(key => {
      state[key] = initialState[key];
    });
  },
  [PUSH_NOTIFICATION](state, data) {
    state.queue.push(data);
  },
  [REMOVE_NOTIFICATION](state, id) {
    state.queue = state.queue.filter(item => item.id !== id);
  }
};

export default mutations;
