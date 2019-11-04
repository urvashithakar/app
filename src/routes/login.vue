<template>
  <PublicView :heading="signingIn || fetchingData ? $t('signing_in') : $t('sign_in')">
    <form @submit.prevent="onSubmit">
      <project-chooser v-if="(signingIn || fetchingData) === false" />

      <template v-if="signingIn || fetchingData">
        <v-progress />
        <p>{{ currentProject.project_name }}</p>
      </template>

      <template v-else-if="currentProject.installed === false">
        <p>{{ $t("install_copy") }}</p>
        <div class="buttons">
          <router-link to="/install" class="button">
            {{ $t("install") }}
          </router-link>
        </div>
      </template>

      <template v-else>
        <div v-if="currentProject.authenticated === true">
          <p>
            <b>{{ firstName }} {{ lastName }}</b>
            {{ $t("continue_as") }}
          </p>
          <div class="buttons">
            <span class="secondary">{{ $t("sign_out") }}</span>
            <button type="submit">{{ $t("continue") }}</button>
          </div>
        </div>
        <template v-else>
          <input v-model="email" type="email" :placeholder="$t('email')" required />
          <input v-model="password" type="password" :placeholder="$t('password')" required />
          <div class="buttons">
            <button type="submit">{{ $t("sign_in") }}</button>
            <router-link class="secondary" to="/forgot-password">
              {{ $t("forgot_password") }}
            </router-link>
          </div>
        </template>
      </template>
    </form>
    <sso :providers="ssoProviders" />
    <public-notice
      v-if="notice.text"
      slot="notice"
      :loading="signingIn || fetchingData"
      :color="notice.color"
      :icon="notice.icon"
    >
      {{ notice.text }}
    </public-notice>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import PublicNotice from "@/components/public/notice";
import Sso from "@/components/public/sso";
import ProjectChooser from "@/components/public/project-chooser";
import { mapState, mapGetters, mapMutations } from "vuex";
import { UPDATE_PROJECT } from "@/store/mutation-types";
import hydrateStore from "@/hydrate";

export default {
  name: "Login",
  components: {
    PublicView,
    PublicNotice,
    ProjectChooser,
    Sso
  },
  data() {
    return {
      email: "",
      password: "",
      signingIn: false,
      fetchingData: false,
      notice: {
        text: "Not Authenticated",
        color: "blue-grey-100",
        icon: "lock_outline"
      },
      firstName: null,
      lastName: null,
      ssoProviders: []
    };
  },
  computed: {
    ...mapGetters(["currentProject"]),
    ...mapState(["currentProjectIndex"])
  },
  watch: {
    currentProjectIndex() {
      if (this.currentProject.authenticated === true) {
        this.fetchAuthenticatedUser();
      } else {
        this.fetchSSOProviders();
      }
    }
  },
  created() {
    if (this.currentProject.authenticated === true) {
      this.fetchAuthenticatedUser();
    } else {
      this.fetchSSOProviders();
    }
  },
  methods: {
    ...mapMutations([UPDATE_PROJECT]),
    onSubmit() {
      if (this.currentProject.authenticated) {
        return this.enterApp();
      } else {
        return this.login();
      }
    },
    login() {
      const { url, project } = this.currentProject;
      const { email, password } = this;
      this.signingIn = true;

      this.notice = {
        text: this.$t("signing_in"),
        color: "blue-grey",
        icon: null
      };

      this.$api
        .login({
          url,
          project,
          email,
          password,
          mode: "cookie"
        })
        .then(async () => {
          const { data: projectInfo } = await this.$api.api.get("/");
          const { requires2FA, version, database } = projectInfo.api;
          const { max_upload_size } = projectInfo.server;

          this[UPDATE_PROJECT]({
            index: this.currentProjectIndex,
            data: {
              requires2FA,
              version,
              database,
              max_upload_size
            }
          });

          this.enterApp();
        })
        .catch(error => {
          const { code } = error;
          if (code) {
            this.notice = {
              text: this.$t(`errors.${code}`),
              color: "warning",
              icon: "warning"
            };
          } else {
            this.notice = {
              text: this.$t(`errors.-1`),
              color: "danger",
              icon: "error_outline"
            };
          }
        })
        .finally(() => (this.signingIn = false));
    },
    async enterApp() {
      this.notice = {
        text: this.$t("fetching_data")
      };

      this.fetchingData = true;

      // This will fetch all the needed information about the project in order to run Directus
      await hydrateStore();

      // Default to /collections as homepage
      let route = `/${this.currentProject.project}/collections`;

      // If the last visited page is saved in the current user record, use that
      if (this.$store.state.currentUser.last_page) {
        route = this.$store.state.currentUser.last_page;
      }

      // In the case the URL contains a redirect query, use that instead
      if (this.$route.query.redirect) {
        route = this.$route.query.redirect;
      }

      this.$router.push(route, () => {
        // We only set the fetchingData flag to false when the page navigation is done
        // This makes sure we don't show a flash of "authenticated" style login view
        this.fetchingData = false;
      });
    },
    async fetchAuthenticatedUser() {
      this.firstName = null;
      this.latName = null;
      this.$api.config.url = this.currentProject.url;
      this.$api.config.project = this.currentProject.project;
      const { data } = await this.$api.getMe({ fields: "first_name,last_name" });
      this.firstName = data.first_name;
      this.lastName = data.last_name;
    },

    async fetchSSOProviders() {
      this.ssoProviders = [];
      this.$api.config.url = this.currentProject.url;
      this.$api.config.project = this.currentProject.project;
      const { data } = await this.$api.getThirdPartyAuthProviders();
      this.ssoProviders = data;
    }
  }
};
</script>

<style lang="scss" scoped>
// TODO: These styles should be extraced into their base components
//       They're currently duplicated on forgot-password, setup-2fa, and install
//       as well
form {
  margin-top: 32px;

  @media (min-height: 800px) {
    margin-top: 52px;
  }
}

.button,
button {
  position: relative;
  background-color: var(--button-primary-background-color);
  border: 2px solid var(--button-primary-background-color);
  border-radius: var(--border-radius);
  color: var(--button-primary-text-color);
  height: 60px;
  padding: 18px 20px;
  width: 100%;
  max-width: 154px;
  font-size: 16px;
  font-weight: 400;
  transition: background-color var(--fast) var(--transition);
  display: inline-block;
  text-decoration: none;
  text-align: center;

  &[disabled] {
    cursor: not-allowed;
  }

  &:not([disabled]) {
    &:hover {
      background-color: var(--darkest-gray);
      border-color: var(--darkest-gray);
    }
  }

  &.outline {
    background-color: transparent;
    color: var(--darkest-gray);

    &[disabled] {
      background-color: transparent;
    }

    &:not([disabled]) {
      &:hover {
        background-color: transparent;
      }
    }
  }
}

p {
  font-size: 16px;
  line-height: 26px;
  margin-top: 32px;
  margin-bottom: 32px;
  color: var(--blue-grey-300);
  b {
    font-weight: var(--weight-bold);
    color: var(--page-text-color);
  }
}

input {
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  border: 0;
  font-size: 16px;
  border: 2px solid var(--input-border-color);
  width: 100%;
  padding: 20px 10px;
  color: var(--input-text-color);
  transition: border-color var(--fast) var(--transition);
  border-radius: var(--border-radius);

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:-webkit-autofill {
    color: var(--input-text-color) !important;
    -webkit-text-fill-color: var(--input-text-color);
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
  }

  &:hover:not([disabled]) {
    transition: none;
    border-color: var(--input-border-color-hover);
    &:focus {
      border-color: var(--input-border-color-focus);
    }
  }

  &[disabled] {
    cursor: not-allowed;
  }

  &:focus {
    outline: 0;
    border-color: var(--input-border-color-focus);

    &:-webkit-autofill {
      color: var(--input-text-color) !important;
      -webkit-text-fill-color: var(--input-text-color);
      -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    }
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;

  .secondary {
    transition: all var(--fast) var(--transition);
    flex-shrink: 0;
    // margin-left: 24px; // Not when on left ("continue as")
    text-decoration: none;
    cursor: pointer;
    color: var(--input-placeholder-color);
    &:hover {
      color: var(--page-text-color);
    }
  }
}
</style>
