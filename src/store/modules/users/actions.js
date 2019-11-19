import api from "../../../api";
import { SET_USERS, SET_USER, REMOVE_USER, UPDATE_USER } from "../../mutation-types";

export function getUsers({ commit }) {
  return api
    .getUsers({
      fields: [
        "id",
        "first_name",
        "last_name",
        "title",
        "status",
        "timezone",
        "roles.*",
        "avatar.*",
        "company"
      ]
    })
    .then(res => res.data)
    .then(users =>
      users.map(user => ({
        ...user,
        roles: user.roles.map(({ role }) => role)
      }))
    )
    .then(users => {
      commit(SET_USERS, users);
    });
}
export function setUser({ commit }, primaryKey) {
  return api
    .getUser(primaryKey, {
      fields: [
        "id",
        "first_name",
        "last_name",
        "title",
        "status",
        "timezone",
        "roles.*",
        "avatar.*",
        "company"
      ]
    })
    .then(result => {
      const user = result.data;
      user.roles = user.roles.map(({ role }) => role);
      commit(SET_USER, user);
    });
}
export function removeUser({ commit }, primaryKey) {
  commit(REMOVE_USER, primaryKey);
}

export function updateUser({ commit }, { userId, userData }) {
  const user = userData;
  if (user.roles) {
    user.roles = user.roles.map(({ role }) => role);
  }
  commit(UPDATE_USER, { userId, user });
}

export function getAvatar({ commit }, primaryKey) {
  commit(REMOVE_USER, primaryKey);
}
