<template>
  <PublicView>
    <h1>{{ $t("forgot_password") }}</h1>
    <project-chooser />
    <form @submit.prevent="onSubmit">
      <input v-model="email" type="email" />
      <button type="submit">{{ $t("reset_password") }}</button>
    </form>
    <router-link to="/login">{{ $t("sign_in") }}</router-link>
    <public-notice
      v-if="notice.text"
      slot="notice"
      :color="notice.color"
      :icon="notice.icon"
      :loading="resetting"
    >
      {{ notice.text }}
    </public-notice>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import ProjectChooser from "@/components/public/project-chooser";
import PublicNotice from "@/components/public/notice";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Login",
  components: {
    PublicView,
    ProjectChooser,
    PublicNotice
  },
  data() {
    return {
      email: "",
      resetting: false,
      notice: {
        text: "",
        color: "grey",
        icon: "warning"
      }
    };
  },
  computed: {
    ...mapGetters(["currentProject"])
  },
  methods: {
    async onSubmit() {
      this.resetting = true;
      const { url, project } = this.currentProject;
      const apiUrl = `${url}/${project}`;

      try {
        const response = await axios.post(apiUrl + "/auth/password/request", {
          email: this.email
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
