<template>
  <div class="interfaces">
    <v-header :breadcrumb="links" :icon-link="`/${currentProjectID}/settings`" :settings="true" />
    <v-table :columns="columns" :items="items" link="__link" primary-key-field="id" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  metaInfo() {
    return {
      title: "Interfaces"
    };
  },
  computed: {
    ...mapGetters(["currentProjectID"]),
    links() {
      return [
        {
          name: this.$t("settings"),
          path: `/${this.currentProjectID}/settings`
        },
        {
          name: this.$t("interfaces"),
          path: `/${this.currentProjectID}/settings/interfaces`
        }
      ];
    },
    items() {
      return Object.keys(this.$store.state.extensions.interfaces).map(id => ({
        ...this.$store.state.extensions.interfaces[id],
        __link: `/${this.currentProjectID}/settings/interfaces/${id}`
      }));
    },
    columns() {
      return [
        {
          field: "name",
          name: "Name"
        },
        {
          field: "id",
          name: "ID"
        },
        {
          field: "version",
          name: "Version"
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.interfaces {
  padding: 0 32px var(--page-padding-bottom);
}
</style>
