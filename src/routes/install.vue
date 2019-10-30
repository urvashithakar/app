<template>
  <PublicView wide :heading="$t('create_project')">
    <form @submit.prevent="onSubmit">
      <fieldset v-show="step === 0" class="step-1">
        <legend>Project Info</legend>
        <div class="field-grid">
          <div class="field">
            <label for="project_name">Project Name</label>
            <input id="project_name" v-model="project_name" name="project_name" type="text" />
          </div>
          <div class="field">
            <label for="project_key">Project Key</label>
            <input id="project_key" v-model="project_key" name="project_key" type="text" />
          </div>
          <div class="field">
            <label for="user_email">Admin Email</label>
            <input id="user_email" v-model="user_email" name="user_email" type="email" />
          </div>
          <div class="field">
            <label for="user_password">Admin Password</label>
            <input
              id="user_password"
              v-model="user_password"
              name="user_password"
              type="password"
            />
          </div>
        </div>

        <button type="button" @click="step++">Next</button>
      </fieldset>

      <fieldset v-show="step === 1" class="step-2">
        <legend>Database Credentials</legend>
        <div class="field-grid">
          <div class="field">
            <label for="db_host">Host</label>
            <input id="db_host" v-model="db_host" name="db_host" type="text" />
          </div>
          <div class="field">
            <label for="db_port">Port</label>
            <input id="db_port" v-model="db_port" name="db_port" type="number" />
          </div>
          <div class="field">
            <label for="db_user">User</label>
            <input id="db_user" v-model="db_user" name="db_user" type="text" />
          </div>
          <div class="field">
            <label for="db_password">Password</label>
            <input id="db_password" v-model="db_password" name="db_password" type="password" />
          </div>
          <div class="field">
            <label for="db_name">Name</label>
            <input id="db_name" v-model="db_name" name="db_name" type="text" />
          </div>
        </div>

        <button type="button" @click="step--">Back</button>
        <button type="submit">Install</button>
      </fieldset>
    </form>

    <div v-show="step === 2" class="step-3">
      <h2>All Set</h2>
    </div>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "Login",
  components: {
    PublicView
  },
  data() {
    return {
      step: 0,
      project_name: "",
      project_key: "",
      user_email: "",
      user_password: "",
      db_host: "localhost",
      db_port: 3306,
      db_user: "",
      db_password: "",
      db_name: "",
      installing: false,
      error: null
    };
  },
  computed: {
    ...mapGetters(["currentProject"])
  },
  methods: {
    async onSubmit() {
      this.installing = true;

      const {
        project_name,
        project_key,
        user_email,
        user_password,
        db_host,
        db_port,
        db_user,
        db_password,
        db_name
      } = this;

      try {
        await axios.post(this.currentProject.url + "/projects", {
          project_name,
          project_key,
          user_email,
          user_password,
          db_host,
          db_port,
          db_user,
          db_password,
          db_name
        });

        this.$notify({
          title: this.$t("api_installed"),
          color: "green",
          iconMain: "check"
        });

        this.step = 2;
      } catch (error) {
        this.error = error;
      } finally {
        this.installing = false;
      }
    }
  }
};
</script>
