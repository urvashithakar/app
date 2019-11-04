<template>
  <PublicView wide :heading="$t('create_project')">
    <form @submit.prevent="onSubmit">
      <public-stepper class="stepper" :steps="3" :current-step="step" />

      <fieldset v-show="step === 1" class="step-1">
        <legend class="type-title">Project Info</legend>
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

        <div class="buttons">
          <router-link to="/login" class="secondary">Cancel</router-link>
          <button type="button" @click="step++">Next</button>
        </div>
      </fieldset>

      <fieldset v-show="step === 2" class="step-2">
        <legend class="type-title">Database Credentials</legend>
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
            <label class="type-label" for="db_user">Database User</label>
            <input id="db_user" v-model="db_user" name="db_user" type="text" />
          </div>
          <div class="field">
            <label class="type-label" for="db_password">Database Password</label>
            <input id="db_password" v-model="db_password" name="db_password" type="password" />
          </div>
          <div class="field">
            <label class="type-label" for="db_name">Database Name</label>
            <input id="db_name" v-model="db_name" name="db_name" type="text" />
          </div>
        </div>

        <div class="buttons">
          <span class="secondary" @click="step--">Back</span>
          <button type="submit">Install</button>
        </div>
      </fieldset>
    </form>

    <div v-show="step === 3" class="step-3">
      <h2 class="type-title">Doing things...</h2>
      <v-progress />
      <p>
        Busy busy busy busy busy busy busy busy busy
      </p>
    </div>

    <div v-show="step === 4" class="step-4">
      <h2 class="type-title">All Set</h2>
      <div class="progress-bar"></div>
      <p>
        The project has successfully been created. You can now sign in to the App with the admin
        credentials you entered.
      </p>
      <router-link to="/login" class="button">{{ $t("sign_in") }}</router-link>
    </div>

    <public-notice
      v-if="notice.text"
      slot="notice"
      :loading="false"
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
import axios from "axios";
import { mapState } from "vuex";
import PublicStepper from "@/components/public/stepper";

export default {
  name: "Login",
  components: {
    PublicView,
    PublicNotice,
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
      notice: {
        text: "Project Not Configured",
        color: "blue-grey-100",
        icon: "outlined_flag"
      },
      db_port: 3306,
      db_user: "",
      db_password: "",
      db_name: "",
      error: null
    };
  },
  computed: {
    ...mapState(["apiRootPath"])
  },
  methods: {
    async onSubmit() {
      // When you hit enter on the first page, we don't want to submit the install data, instead
      // we go to the second page
      if (this.step === 1) {
        this.step = 2;
        return;
      }

      this.step = 3;

      // We want the install to at least take 3 seconds before being done, to make the user feel like
      // the installer is actually doing things. This will make sure 3 seconds have passed before we
      // go to the confirmation of done.
      const next = () => {
        this.$notify({
          title: this.$t("api_installed"),
          color: "green",
          iconMain: "check"
        });

        this.step = 4;
      };

      let installReady = false;
      let timeReady = false;

      setTimeout(() => {
        timeReady = true;

        if (installReady && timeReady) next();
      }, 4000);

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
        await axios.post(this.apiRootPath + "projects", {
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

        installReady = true;

        if (installReady && timeReady) {
          next();
        }
      } catch (error) {
        this.error = error;

        this.$events.emit("error", {
          notify: error.response.data.error.message,
          error
        });

        this.step = 2;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// NOTE: These button and input styles are copied from login.vue and should be extracted to a base component

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

input {
  position: relative;
  width: 100%;
  margin-bottom: 24px;
  border: 0;
  font-size: 16px;
  border: 2px solid var(--blue-grey-100);
  width: 100%;
  padding: 20px 10px;
  color: var(--darker-gray);
  transition: border-color var(--fast) var(--transition);
  border-radius: var(--border-radius);
  font-family: var(--family-monospace);

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

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  .secondary {
    text-decoration: none;
    color: var(--input-placeholder-color);
    cursor: pointer;
    &:hover {
      color: var(--page-text-color);
    }
  }
}

p {
  font-size: 16px;
  line-height: 26px;
  margin-top: 32px;
  margin-bottom: 32px;
  color: var(--blue-grey-300);
}

form {
  margin-top: 4px;

  @media (min-height: 800px) {
    margin-top: 20px;
  }
}

legend {
  margin-bottom: 20px;
}

.stepper {
  margin-bottom: 80px;
  max-width: 320px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px 32px;
}

label {
  margin-bottom: 8px;
}
</style>
