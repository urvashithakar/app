<template>
  <v-sheet ref="interfaceRoot" class="repeater-row">
    <div class="header">
      <div class="drag-handle">
        <v-icon name="drag_handle" />
      </div>
      <div class="content" :class="{ 'two-up': inline && fields.length === 2 }">
        <template v-if="inline">
          <v-ext-input
            v-for="field in fields"
            :id="field.interface || 'text-input'"
            :key="field.field"
            :name="field.field"
            :required="field.required"
            :readonly="field.readonly"
            :options="field.options"
            :type="field.type"
            :datatype="field.datatype"
            :value="row[field.field]"
            :fields="fields"
            :values="row"
            :length="field.length"
            @input="
              $emit('input', {
                field: field.field,
                value: $event
              })
            "
          />
        </template>
        <template v-else>
          <button type="button" class="preview" @click="$emit('open')">{{ displayValue }}</button>
        </template>
      </div>
      <button type="button" @click="$emit('remove')">
        <v-icon name="delete_outline" class="remove" />
      </button>
    </div>
    <div v-if="inline === false" v-show="open" class="body">
      <v-form full-width :fields="fields" :values="row" @stage-value="$emit('input', $event)" />
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: "RepeaterRow",
  props: {
    row: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    },
    inline: {
      type: Boolean,
      default: false
    },
    template: {
      type: String,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    displayValue() {
      if (!this.template) {
        return null;
        // return $t("new_item");
      }

      let preview = this.$helpers.micromustache.render(this.template, this.row);
      // return preview.length > 0 ? preview : $t("new_item");

      return preview;
    }
  }
};
</script>

<style lang="scss" scoped>
.repeater-row {
  margin-bottom: 8px;
  padding: 0;
}

.header {
  --form-vertical-gap: 24px;
  --form-horizontal-gap: 12px;
  --type-label-size: 15px;
  --input-height: 44px;
  --input-font-size: 14px;
  --input-label-margin: 4px;
  --input-background-color-alt: var(--input-background-color);

  display: flex;
  align-items: center;
  min-height: var(--input-height);
  padding: var(--input-padding);

  .content {
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 8px;
    padding: 0 8px;

    &.two-up {
      grid-template-columns: repeat(2, 1fr);
    }

    .preview {
      text-align: left;
      min-height: 32px;
    }
  }
  .remove {
    transition: color var(--fast) var(--transition);
    &:hover {
      color: var(--danger);
    }
  }
}

.body {
  --form-vertical-gap: 24px;
  --form-horizontal-gap: 12px;
  --type-label-size: 15px;
  --input-height: 44px;
  --input-font-size: 14px;
  --input-label-margin: 4px;
  --input-background-color-alt: var(--input-background-color);
  padding: 4px;
}
</style>
