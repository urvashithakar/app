<template>
  <PublicView wide :heading="$t('create_project')">
    <form @submit.prevent="step = 2">
      <public-stepper class="stepper" :steps="3" :current-step="step" />

      <fieldset v-show="step === 1" class="step-1">
        <legend class="type-title">{{ $t("project_info") }}</legend>
        <div class="field-grid">
          <div class="field">
            <label class="type-label" for="project_name">{{ $t("project_name") }}</label>
            <input
              id="project_name"
              v-model="project_name"
              name="project_name"
              type="text"
              required
              @input="syncKey"
            />
          </div>
          <div class="field">
            <label class="type-label" for="project_key">{{ $t("project_key") }}</label>
            <input
              id="project_key"
              :value="project_key"
              name="project_key"
              type="text"
              required
              @input="setProjectKey"
            />
          </div>
          <div class="field">
            <label class="type-label" for="user_email">{{ $t("admin_email") }}</label>
            <input id="user_email" v-model="user_email" name="user_email" type="email" required />
          </div>
          <div class="field">
            <label class="type-label" for="user_password">{{ $t("admin_password") }}</label>
            <input
              id="user_password"
              v-model="user_password"
              class="password"
              name="user_password"
              type="text"
              required
            />
          </div>
        </div>

        <div class="buttons">
          <router-link to="/login" class="secondary">{{ $t("cancel") }}</router-link>
          <button type="submit">{{ $t("next") }}</button>
        </div>
      </fieldset>
    </form>

    <form @submit.prevent="onSubmit">
      <fieldset v-show="step === 2" class="step-2">
        <legend class="type-title">{{ $t("database_connection") }}</legend>
        <div class="field-grid">
          <div class="field">
            <label class="type-label" for="db_host">{{ $t("db_host") }}</label>
            <input id="db_host" v-model="db_host" name="db_host" type="text" required />
          </div>
          <div class="field">
            <label class="type-label" for="db_port">{{ $t("db_post") }}</label>
            <input id="db_port" v-model="db_port" name="db_port" type="number" required />
          </div>
          <div class="field">
            <label class="type-label" for="db_user">{{ $t("db_user") }}</label>
            <input id="db_user" v-model="db_user" name="db_user" type="text" required />
          </div>
          <div class="field">
            <label class="type-label" for="db_password">{{ $t("db_password") }}</label>
            <input
              id="db_password"
              v-model="db_password"
              class="password"
              name="db_password"
              type="password"
              required
            />
          </div>
          <div class="field">
            <label class="type-label" for="db_name">{{ $t("db_name") }}</label>
            <input id="db_name" v-model="db_name" name="db_name" type="text" required />
          </div>
          <div class="field">
            <label class="type-label" for="db_type">{{ $t("db_type") }}</label>
            <div class="select">
              <input id="db_type" name="db_type" type="text" value="MySQL" disabled />
            </div>
          </div>
        </div>

        <div class="buttons">
          <span class="secondary" @click="step--">{{ $t("back") }}</span>
          <button type="submit">{{ $t("install") }}</button>
        </div>
      </fieldset>
    </form>

    <div v-show="step === 3" class="step-3">
      <h2 class="type-title">{{ $t("wrapping_up") }}</h2>
      <v-progress />
      <p>
        {{ $t("install_busy_copy") }}
      </p>
    </div>

    <div v-show="step === 4" class="step-4">
      <h2 class="type-title">{{ $t("all_set") }}</h2>
      <div class="progress-bar"></div>
      <p>{{ $t("install_all_set_copy") }}</p>
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
import slug from "slug";

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
      installing: false,
      error: null,
      manualKey: false
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
    },
    syncKey() {
      if (this.manualKey === false) {
        this.project_key = slug(this.project_name);
      }
    },
    setProjectKey(event) {
      if (this.manualKey === false) this.manualKey = true;
      const value = slug(event.target.value);
      this.project_key = value;
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

.select {
  position: relative;
  &:after {
    content: "arrow_drop_down";
    font-family: var(--family-icon);
    position: absolute;
    right: 12px;
    top: 8px;
    color: var(--input-icon-color);
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
  height: 64px;
  padding: 20px 10px;
  background-color: var(--input-background-color);
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
    background-color: var(--input-background-color-disabled);
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

// There is no way to currently disable the browser from offering to save the password. We do not want the user to be
// bothered by the browser asking to save the database password. This is the only way to hack around it. By using text
// instead of password for type, we can trick the browser into thinking this is in fact not a password 🤦
.password {
  -moz-text-security: disc;
  -webkit-text-security: disc;
  text-security: disc;
}
</style>
