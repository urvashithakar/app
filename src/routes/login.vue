<template>
  <PublicView :heading="$t('sign_in')">
    <form @submit.prevent="onSubmit">
      <project-chooser />
      <button v-if="currentProject.authenticated" type="submit">
        {{ $t("continue_as", { name: firstName }) }}
      </button>
      <template v-else>
        <input v-model="email" type="email" :placeholder="$t('email')" required />
        <input v-model="password" type="password" :placeholder="$t('password')" required />
        <div class="buttons">
          <button type="submit">{{ $t("sign_in") }}</button>
          <router-link class="forgot" to="/forgot-password">
            {{ $t("forgot_password") }}
          </router-link>
        </div>
      </template>
    </form>
    <sso :providers="ssoProviders" />
    <public-notice
      v-if="notice.text"
      slot="notice"
      :loading="signingIn"
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
      notice: {
        text: null,
        color: null,
        icon: null
      },
      firstName: null,
      ssoProviders: []
    };
  },
  computed: {
    ...mapGetters(["currentProject"]),
    ...mapState(["currentProjectIndex"])
  },
  watch: {
    currentProjectIndex() {
      this.fetchUserName();
    }
  },
  methods: {
    ...mapMutations([UPDATE_PROJECT]),
    async enterApp() {
      this.notice = {
        text: this.$t("fetching_data")
      };

      // This will fetch all the needed information about the project in order to run Directus
      await hydrateStore();

      // Default to /collections as homepage
      let route = "/collections";

      // If the last visited page is saved in the current user record, use that
      if (this.$store.state.currentUser.last_page) {
        route = this.$store.state.currentUser.last_page;
      }

      // In the case the URL contains a redirect query, use that instead
      if (this.$route.query.redirect) {
        route = this.$route.query.redirect;
      }

      this.$router.push(route);
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
    onSubmit() {
      if (this.currentProject.authenticated) {
        return this.enterApp();
      } else {
        return this.login();
      }
    },
    // Fetch the users name if logged in
    async fetchUserName() {
      this.firstName = null;
      this.ssoProviders = [];

      this.$api.config.url = this.currentProject.url;
      this.$api.config.project = this.currentProject.project;

      if (this.currentProject.authenticated) {
        const { data } = await this.$api.getMe({ fields: "first_name" });
        this.firstName = data.first_name;
      } else {
        const { data } = await this.$api.getThirdPartyAuthProviders();
        this.ssoProviders = data;
      }
    }
  },
  created() {
    this.fetchUserName();
  }
};
</script>

<style lang="scss" scoped>
button {
  position: relative;
  background-color: var(--darkest-gray);
  border: 2px solid var(--darkest-gray);
  border-radius: var(--border-radius);
  color: var(--white);
  width: 100%;
  height: 60px;
  max-width: 154px;
  padding: 18px 10px;
  font-size: 16px;
  font-weight: 400;
  transition: background-color var(--fast) var(--transition);

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

input {
  position: relative;
  width: 100%;
  margin-bottom: 32px;
  border: 0;
  font-size: 16px;
  border: 2px solid var(--blue-grey-100);
  width: 100%;
  padding: 20px 10px;
  color: var(--darker-gray);
  transition: border-color var(--fast) var(--transition);
  border-radius: var(--border-radius);

  &::placeholder {
    color: var(--light-gray);
  }

  &:-webkit-autofill {
    color: var(--darker-gray) !important;
    -webkit-text-fill-color: var(--darker-gray);
    -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
  }

  &:hover:not([disabled]) {
    transition: none;
    border-color: var(--gray);
    &:focus {
      border-color: var(--darker-gray);
    }
  }

  &[disabled] {
    cursor: not-allowed;
  }

  &:focus {
    outline: 0;
    border-color: var(--darker-gray);

    &:-webkit-autofill {
      color: var(--darker-gray) !important;
      -webkit-text-fill-color: var(--darker-gray);
      -webkit-box-shadow: 0 0 0px 1000px var(--white) inset;
    }
  }
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
