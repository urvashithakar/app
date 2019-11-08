<template>
  <PublicView :heading="$t('reset_password')">
    <project-chooser />
    <form @submit.prevent="onSubmit">
      <input v-model="email" type="email" :placeholder="$t('email')" />
      <div class="buttons">
        <button type="submit">{{ $t("reset") }}</button>
        <router-link to="/login" class="secondary">{{ $t("sign_in") }}</router-link>
      </div>
    </form>
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
        text: this.$t("not_authenticated"),
        color: "blue-grey-100",
        icon: "lock_outline"
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
        await axios.post(apiUrl + "/auth/password/request", {
          email: this.email
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.project-chooser {
  margin-top: 32px;

  @media (min-height: 800px) {
    margin-top: 52px;
  }
}

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
  margin-top: 8px;
  .secondary {
    text-decoration: none;
    cursor: pointer;
    color: var(--input-placeholder-color);
  }
}
</style>
