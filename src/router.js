import Vue from "vue";
import Router from "vue-router";
import api from "./api";
import store from "./store";
import { TOGGLE_NAV, TOGGLE_INFO } from "./store/mutation-types";
import { i18n } from "./lang/";
import EventBus from "./events/";
import Collections from "./routes/collections.vue";
import Items from "./routes/items.vue";
import FileLibrary from "./routes/file-library.vue";
import Item from "./routes/item.vue";
import Login from "./routes/login.vue";
import Setup2FA from "./routes/setup-2fa.vue";
import ForgotPassword from "./routes/forgot-password.vue";
import Install from "./routes/install.vue";
import NotFound from "./routes/not-found.vue";
import Interfaces from "./routes/settings/interfaces.vue";
import InterfaceDebugger from "./routes/settings/interface-debugger.vue";
import Settings from "./routes/settings/settings.vue";
import SettingsGlobal from "./routes/settings/global.vue";
import SettingsCollections from "./routes/settings/collections.vue";
import SettingsFields from "./routes/settings/fields.vue";
import SettingsRoles from "./routes/settings/roles.vue";
import SettingsPermissions from "./routes/settings/permissions.vue";
import PageExtension from "./routes/page-extension.vue";
import hydrateStore from "@/hydrate";

Vue.use(Router);

const base =
  process.env.NODE_ENV === "production" // eslint-disable-line
    ? window.__DirectusConfig__ && window.__DirectusConfig__.routerBaseUrl
    : "/";

const router = new Router({
  mode: "hash",
  base: base,
  // Make sure that the page is scrolled to the top on navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // If the scroll position is saved from the previous route (eg back and forth buttons in the
      // browser, use those positions instead).
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: "/:project/collections",
      component: Collections
    },
    {
      path: "/:project/collections/:collection",
      props: true,
      component: Items
    },
    {
      path: "/:project/collections/:collection/:primaryKey",
      props: true,
      component: Item,
      meta: {
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/ext/:id",
      props: true,
      component: PageExtension
    },
    {
      path: "/:project/bookmarks/:collection/:bookmarkID",
      beforeEnter(to, from, next) {
        const { collection, bookmarkID } = to.params;

        const bookmark = store.state.bookmarks.filter(bookmark => bookmark.id == bookmarkID)[0];

        const { search_query, filters, view_query, view_options, view_type } = bookmark;

        api
          .getItems("directus_collection_presets", {
            "filter[user][eq]": store.state.currentUser.id,
            "filter[title][null]": 1,
            "filter[collection][eq]": collection,
            fields: "id"
          })
          .then(res => res.data)
          .then(data => (data && data.length >= 1 ? data[0] : null))
          .then(userPreferences => {
            if (userPreferences) {
              return api.updateItem("directus_collection_presets", userPreferences.id, {
                search_query,
                filters,
                view_query,
                view_options,
                view_type
              });
            }
          })
          .then(() => {
            return next({
              /*
              NOTE: This is a hack. The route doesn't update if you navigate from the same route to
                the same route. Therefore, redirecting to just /collections/:collection wouldn't update
                the view if you were already on that page (clicking on a bookmark while being on the
                listing page in question). By adding this param, it forces the update.
                The listing view will remove the query on load so it doesn't clutter the URL too much
               */
              path: `/:project/collections/${collection}?b=${bookmark.id}`
            });
          })
          .catch(error =>
            EventBus.emit("error", {
              notify: i18n.t("something_went_wrong_body"),
              error
            })
          );
      }
    },
    {
      path: "/:project/files",
      component: FileLibrary
    },
    {
      path: "/:project/collections/directus_files/:primaryKey",
      component: Item,
      alias: "/:project/files/:primaryKey",
      meta: {
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/:project/collections/directus_users",
      component: Items,
      alias: "/:project/users"
    },
    {
      path: "/:project/collections/directus_users/:primaryKey",
      component: Item,
      alias: "/:project/users/:primaryKey",
      meta: {
        infoSidebarWidth: "wide"
      }
    },
    {
      path: "/:project/collections/directus_activity",
      component: Items,
      alias: "/:project/activity"
    },
    {
      path: "/:project/collections/directus_activity/:primaryKey",
      component: Item,
      alias: "/:project/activity/:primaryKey"
    },
    {
      path: "/:project/settings",
      component: Settings
    },
    {
      path: "/:project/settings/global",
      component: SettingsGlobal
    },
    {
      path: "/:project/settings/collections",
      component: SettingsCollections
    },
    {
      path: "/:project/settings/collections/:collection",
      component: SettingsFields,
      props: true
    },
    {
      path: "/:project/settings/roles",
      component: SettingsRoles
    },
    {
      path: "/:project/settings/roles/:id",
      component: SettingsPermissions,
      props: true
    },
    {
      path: "/:project/settings/interfaces",
      component: Interfaces
    },
    {
      path: "/:project/settings/interfaces/:id",
      component: InterfaceDebugger,
      props: true
    },
    {
      path: "/login",
      component: Login,
      meta: {
        publicRoute: true
      }
    },
    {
      path: "/forgot-password",
      component: ForgotPassword,
      meta: {
        publicRoute: true
      }
    },
    {
      path: "/install",
      component: Install,
      meta: {
        publicRoute: true
      }
    },
    {
      path: "/setup-2fa",
      component: Setup2FA,
      meta: {
        publicRoute: true
      }
    },
    {
      path: "/logout",
      beforeEnter(to, from, next) {
        store.dispatch("logout");
        next("/login");
      }
    },
    {
      path: "*",
      component: NotFound
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const publicRoute = to.matched.some(record => record.meta.publicRoute);

  store.commit(TOGGLE_NAV, false);
  store.commit(TOGGLE_INFO, false);

  if (publicRoute) {
    document.body.classList.remove("private");
    document.body.classList.add("public");
  } else {
    document.body.classList.add("private");
    document.body.classList.remove("public");
  }

  // This runs on first load
  if (store.state.projects.length > 0 && store.state.projects[0].status === null) {
    await store.dispatch("getProjects");

    const loggedIn = store.getters.currentProject.data.authenticated;

    if (loggedIn) {
      await hydrateStore();
    }
  }

  if (publicRoute) return next();

  const loggedIn = store.getters.currentProject.data.authenticated;

  if (loggedIn) {
    return next();
  }

  if (to.fullPath === "/") {
    return next({ path: "/login" });
  }

  return next({
    path: "/login",
    query: { redirect: to.fullPath }
  });
});

router.afterEach(to => {
  // Prevent tracking if not logged in
  if (store.state.hydrated) {
    const pathsToIgnore = ["/setup-2fa", "/logout", "/login"];
    if (!pathsToIgnore.includes(to.path)) {
      store.dispatch("track", { page: to.path });
    }
  }
});

export default router;
