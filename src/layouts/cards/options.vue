<template>
  <form @submit.prevent>
    <label for="src" class="type-label">{{ $t("layouts-cards-src") }}</label>
    <v-select
      id="src"
      :value="viewOptions.src || '__none__'"
      :options="fileOptions"
      icon="image"
      @input="setOption('src', $event === '__none__' ? null : $event)"
    ></v-select>

    <label for="title" class="type-label">{{ $t("layouts-cards-title") }}</label>
    <v-select
      id="title"
      :value="viewOptions.title || this.primaryKeyField"
      :options="titleFieldOptions"
      icon="title"
      @input="setOption('title', $event === '__none__' ? null : $event)"
    ></v-select>

    <label for="subtitle" class="type-label">
      {{ $t("layouts-cards-subtitle") }}
    </label>
    <v-select
      id="subtitle"
      :value="viewOptions.subtitle || '__none__'"
      :options="fieldOptions"
      icon="title"
      @input="setOption('subtitle', $event === '__none__' ? null : $event)"
    ></v-select>

    <label for="content" class="type-label">
      {{ $t("layouts-cards-content") }}
    </label>
    <v-select
      id="content"
      :value="viewOptions.content || '__none__'"
      :options="fieldOptions"
      icon="title"
      @input="setOption('content', $event === '__none__' ? null : $event)"
    ></v-select>

    <label for="icon" class="type-label">Fallback Icon</label>
    <v-input
      :value="viewOptions.icon || 'photo'"
      icon-left="broken_image"
      @input="setOption('icon', $event)"
    ></v-input>
  </form>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/layout";

export default {
  mixins: [mixin],
  computed: {
    titleFieldOptions() {
      return {
        ..._.mapValues(this.fields, info => info.name)
      };
    },
    fieldOptions() {
      return {
        __none__: `(${this.$t("dont_show")})`,
        ..._.mapValues(this.fields, info => info.name)
      };
    },
    fileOptions() {
      const fileTypeFields = _.filter(this.fields, info => info.type.toLowerCase() === "file");
      const fields = _.keyBy(fileTypeFields, "field");
      const options = {
        __none__: `(${this.$t("dont_show")})`,
        ..._.mapValues(fields, info => info.name)
      };

      // Check if one of the fields is `data`. If that's the case, make sure that this
      //   field is for the directus_files collection and it's an ALIAS type
      //
      // This is a hardcoded addition to make sure that directus_files can be used in the cards view preview
      if ("data" in this.fields) {
        const field = this.fields.data;

        if (field.type.toLowerCase() === "alias" && field.collection === "directus_files") {
          options.data = this.$t("file");
        }
      }

      return options;
    }
  },
  methods: {
    setOption(field, value) {
      this.$emit("options", {
        ...this.viewOptions,
        [field]: value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.type-label {
  margin-top: var(--input-vertical-spacing-sidebar);
  margin-bottom: var(--input-label-margin);
  &:first-of-type {
    margin-top: 0;
  }
}
</style>
