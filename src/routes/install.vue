<template>
  <PublicView wide :heading="$t('create_project')">
    <form @submit.prevent="onSubmit">
      <public-stepper class="stepper" :steps="3" :current-step="step" />

      <fieldset v-show="step === 1" class="step-1">
        <legend class="type-heading-small">Project Info</legend>
        <div class="field-grid">
          <div class="field">
            <label class="type-label" for="project_name">Project Name</label>
            <input id="project_name" v-model="project_name" name="project_name" type="text" />
          </div>
          <div class="field">
            <label class="type-label" for="project_key">Project Key</label>
            <input id="project_key" v-model="project_key" name="project_key" type="text" />
          </div>
          <div class="field">
            <label class="type-label" for="user_email">Admin Email</label>
            <input id="user_email" v-model="user_email" name="user_email" type="email" />
          </div>
          <div class="field">
            <label class="type-label" for="user_password">Admin Password</label>
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

      <fieldset v-show="step === 2" class="step-2">
        <legend class="type-heading-small">Database Credentials</legend>
        <div class="field-grid">
          <div class="field">
            <label class="type-label" for="db_host">Host</label>
            <input id="db_host" v-model="db_host" name="db_host" type="text" />
          </div>
          <div class="field">
            <label class="type-label" for="db_port">Port</label>
            <input id="db_port" v-model="db_port" name="db_port" type="number" />
          </div>
          <div class="field">
            <label class="type-label" for="db_user">User</label>
            <input id="db_user" v-model="db_user" name="db_user" type="text" />
          </div>
          <div class="field">
            <label class="type-label" for="db_password">Password</label>
            <input id="db_password" v-model="db_password" name="db_password" type="password" />
          </div>
          <div class="field">
            <label class="type-label" for="db_name">Name</label>
            <input id="db_name" v-model="db_name" name="db_name" type="text" />
          </div>
        </div>

        <button type="button" @click="step--">Back</button>
        <button type="submit">Install</button>
      </fieldset>
    </form>

    <div v-show="step === 3" class="step-3">
      <h2>All Set</h2>
      <router-link to="/login">Login</router-link>
    </div>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import axios from "axios";
import { mapGetters } from "vuex";
import PublicStepper from "@/components/public/stepper";

export default {
  name: "Login",
  components: {
    PublicView,
    PublicStepper
  },
  data() {
    return {
      step: 1,
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

        this.step = 3;
      } catch (error) {
        this.error = error;
      } finally {
        this.installing = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// NOTE: These button and input styles are copied from login.vue and should be extracted to a base component

button {
  position: relative;
  background-color: var(--darkest-gray);
  border: 2px solid var(--darkest-gray);
  border-radius: var(--border-radius);
  color: var(--white);
  width: 100%;
  height: 60px;
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

///////////////////////////////////

.stepper {
  max-width: 320px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px 24px;
}

label {
  margin-bottom: 8px;
}
</style>
