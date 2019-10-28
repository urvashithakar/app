<template>
  <PublicView>
    <h1>{{ $t("sign_in") }}</h1>
    <form @submit.prevent="logIn">
      <project-chooser />
      <input v-model="email" type="email" :placeholder="$t('email')" required />
      <input v-model="password" type="password" :placeholder="$t('password')" required />
      <router-link to="/forgot-password">{{ $t("forgot_password") }}</router-link>
      <button type="submit">{{ $t("sign_in") }}</button>
    </form>
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
import ProjectChooser from "@/components/project-chooser";
import { mapState, mapGetters, mapMutations } from "vuex";
import { UPDATE_PROJECT } from "@/store/mutation-types";
import hydrateStore from "@/hydrate";

export default {
  name: "Login",
  components: {
    PublicView,
    PublicNotice,
    ProjectChooser
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
      }
    };
  },
  computed: {
    ...mapGetters(["currentProject"]),
    ...mapState(["currentProjectIndex"])
  },
  methods: {
    ...mapMutations([UPDATE_PROJECT]),
    logIn() {
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
    }
  }
};
</script>
