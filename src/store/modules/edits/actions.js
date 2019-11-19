import api from "../../../api";
import {
  DISCARD_CHANGES,
  START_EDITING,
  STAGE_VALUE,
  UNSTAGE_VALUE,
  ITEM_CREATED,
  UPDATE_CURRENT_USER
} from "../../mutation-types";

export function discardChanges({ commit }) {
  commit(DISCARD_CHANGES);
}

export function startEditing({ commit }, { collection, primaryKey, savedValues }) {
  commit(START_EDITING, { collection, primaryKey, savedValues });
}

export function stageValue({ commit, state }, { field, value }) {
  // NOTE: Don't check type here, since the original value can be a number, but the edited value
  //   might be a string if it comes from the fallback interface
  if (state.savedValues[field] == value) {
    // eslint-disable-line eqeqeq
    return commit(UNSTAGE_VALUE, { field });
  }
  return commit(STAGE_VALUE, { field, value });
}

export function unstageValue({ commit }, field) {
  return commit(UNSTAGE_VALUE, { field });
}

export function save({ commit, state, rootState, dispatch }, overrides) {
  const info = {
    ...state,
    ...overrides
  };

  if (info.collection === "directus_users" && info.primaryKey == rootState.currentUser.id) {
    commit(UPDATE_CURRENT_USER, info.values);
  }

  if (info.primaryKey === "+") {
    return api.createItem(info.collection, info.values).then(res => {
      commit(ITEM_CREATED);
      if (info.collection === "directus_users") {
        dispatch("setUser", res.data.id, { root: true });
      }
      return res;
    });
  }

  if (info.collection.startsWith("directus_")) {
    return api.updateItem(info.collection, info.primaryKey, info.values).then(res => {
      commit(ITEM_CREATED);
      if (info.collection === "directus_users") {
        dispatch(
          "updateUser",
          { userId: info.primaryKey.split(","), userData: info.values },
          { root: true }
        );
      }
      return res;
    });
  }

  return api
    .updateItem(info.collection, info.primaryKey, info.values, {
      fields: "*.*.*.*"
    })
    .then(res => {
      commit(ITEM_CREATED);
      return res;
    });
}
