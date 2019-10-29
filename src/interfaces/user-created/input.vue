<template>
  <div v-if="userInfo" class="user-created">
    <v-avatar
      v-if="options.display !== 'name'"
      v-tooltip="options.display === 'avatar' ? displayValue : null"
      class="display-user"
      :size="32"
      :src="src"
      :alt="displayValue"
    ></v-avatar>
    <span v-if="options.display !== 'avatar'" class="label gray">
      {{ displayValue }}
    </span>
  </div>
  <div v-else-if="newItem" class="gray">
    {{ $t("interfaces-user-created-you") }}
  </div>
  <div v-else class="gray">
    {{ $t("interfaces-user-created-unknown") }}
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  computed: {
    userInfo() {
      if (!this.value) return null;
      if (typeof this.value === "object") {
        if (this.value.first_name) {
          return this.value;
        } else {
          return this.$store.state.users[this.value.id];
        }
      }
      return this.$store.state.users[this.value];
    },
    displayValue() {
      return this.$helpers.micromustache.render(this.options.template, this.userInfo);
    },
    src() {
      if (!this.userInfo.avatar) return null;
      return this.userInfo.avatar.data.thumbnails[0].url;
    }
  }
};
</script>

<style lang="scss" scoped>
.user-created {
  border: var(--input-border-width) solid var(--input-border-color);
  border-radius: var(--border-radius);
  height: 44px;
  padding: 4px;
  display: flex;
  align-items: center;
  background-color: var(--input-background-disabled);
}
.display-user {
  width: max-content;
  display: inline-block;
}
.label {
  display: inline-block;
  margin-left: 12px;
}
.gray {
  color: var(--blue-grey-600);
}
</style>
