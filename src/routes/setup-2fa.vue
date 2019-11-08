<template>
  <PublicView :heading="$t('setup_2fa')">
    <template v-if="finished === false && !fetchingData">
      <v-spinner v-if="!tfa_secret" />
      <qr-code
        v-else
        class="qr"
        :value="'otpauth://totp/Directus?secret=' + tfa_secret"
        :options="{ width: 150 }"
      />
      <otp-input @input="save2faSecret" />
    </template>
    <template v-if="finished === true && !fetchingData">
      <p>You've successfully setup 2-factor authentication. Click the button below to log in.</p>
      <button type="button" @click="enterApp">Continue to app</button>
    </template>
    <v-progress v-if="saving || fetchingData" />
    <public-notice v-if="error" slot="notice" color="danger">
      {{ $t(`errors.${error.code}`) }}
    </public-notice>
  </PublicView>
</template>

<script>
import PublicView from "@/components/public-view";
import PublicNotice from "@/components/public/notice";
import QrCode from "@chenfengyuan/vue-qrcode";
import { mapState } from "vuex";
import OtpInput from "@/components/public/otp-input";
import hydrateStore from "@/hydrate";

// NOTE: We'll have to use tfa instead of 2fa in JavaScript. Variables can't start with a number

export default {
  name: "Setup2FA",
  components: {
    PublicView,
    PublicNotice,
    QrCode,
    OtpInput
  },
  data() {
    return {
      tfa_secret: null,
      error: null,
      finished: false,
      saving: false,
      fetchingData: false
    };
  },
  computed: {
    ...mapState(["apiRootPath", "currentProjectKey"])
  },
  created() {
    this.fetch2faSecret();
  },
  methods: {
    async fetch2faSecret() {
      const response = await this.$api.api.get("/utils/2fa_secret");
      this.tfa_secret = response.data["2fa_secret"];
    },
    async save2faSecret(otp) {
      this.saving = true;
      const body = {
        ["2fa_secret"]: this.tfa_secret,
        otp: otp
      };

      try {
        await this.$api.api.post("/users/me/activate_2fa", body);
        this.finished = true;
      } catch (error) {
        this.error = error;
        console.error(error);
      } finally {
        this.saving = false;
      }
    },
    async enterApp() {
      this.fetchingData = true;

      // This will fetch all the needed information about the project in order to run Directus
      await hydrateStore();

      // Default to /collections as homepage
      let route = `/${this.currentProjectKey}/collections`;

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
    }
  }
};
</script>
