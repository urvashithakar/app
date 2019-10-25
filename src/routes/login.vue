<template>
  <PublicView>
    <h1>{{ $t("sign_in") }}</h1>
    <form @submit.prevent="logIn">
      <ProjectChooser />
      <input v-model="email" type="email" :placeholder="$t('email')" />
      <input v-model="password" type="password" :placeholder="$t('password')" />
      <router-link to="/forgot-password">{{ $t("forgot_password") }}</router-link>
      <button type="submit">{{ $t("sign_in") }}</button>
    </form>
    <PublicNotice slot="notice" color="warning" icon="warning">This is a warning</PublicNotice>
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
      password: ""
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

          await hydrateStore();

          // TODO: Base this on user's last page and or ref param
          this.$router.push("/collections");
        })
        // TODO: Render this error to notice slot
        .catch(console.error);
    }
  }
};
</script>
