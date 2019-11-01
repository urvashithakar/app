<template>
  <div class="settings-global">
    <v-header :breadcrumb="links" :icon-link="`/${currentProjectID}/settings`" settings>
      <template slot="buttons">
        <v-header-button
          :disabled="!editing"
          :loading="saving"
          :label="$t('save')"
          icon="check"
          background-color="button-primary-background-color"
          icon-color="button-primary-text-color"
          @click="save('leave')"
        />
      </template>
    </v-header>

    <v-form
      :fields="fields"
      :values="values"
      collection="directus_settings"
      @stage-value="stageValue"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "SettingsGlobal",
  metaInfo() {
    return {
      title: `${this.$t("settings")} | ${this.$t("settings_global")}`
    };
  },
  data() {
    return {
      saving: false,
      edits: {}
    };
  },
  computed: {
    ...mapState({
      settings: state => state.settings.values,
      fields: state => state.collections.directus_settings.fields
    }),
    ...mapGetters(["currentProjectID"]),
    values() {
      return {
        ...this.settings,
        ...this.edits
      };
    },
    links() {
      return [
        {
          name: this.$t("settings"),
          path: `/${this.currentProjectID}/settings`
        },
        {
          name: this.$t("settings_global"),
          path: `/${this.currentProjectID}/settings/global`
        }
      ];
    },
    editing() {
      return Object.keys(this.edits).length > 0;
    }
  },
  methods: {
    stageValue({ field, value }) {
      if (this.settings[field] == value) {
        return this.$delete(this.edits, field);
      }

      return this.$set(this.edits, field, value);
    },
    save() {
      this.saving = true;

      this.$store
        .dispatch("setSettings", this.edits)
        .then(() => {
          this.saving = false;
          this.edits = {};
          this.$router.push(`/${this.currentProjectID}/settings`);
          this.$notify({
            title: this.$t("settings_saved"),
            color: "green",
            iconMain: "check"
          });
        })
        .catch(error => {
          this.saving = false;
          this.$events.emit("error", {
            notify: error.message || this.$t("something_went_wrong_body"),
            error
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-global {
  padding: var(--page-padding);
}
</style>
