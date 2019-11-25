<template>
  <div class="hex">
    <div class="color">
      <v-popover trigger="click" placement="bottom-start" :boundaries-element="body">
        <button class="trigger" :style="previewStyles" :disabled="readonly"></button>
        <chooser slot="popover" :value="value" @input="$emit('input', $event)" />
      </v-popover>
    </div>
    <v-input
      class="input"
      type="text"
      :maxlength="7"
      placeholder="#3498db"
      pattern="[#0-9a-fA-F]"
      :value="value"
      :disabled="readonly"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import chooser from "./chooser";

export default {
  components: {
    chooser
  },
  props: {
    value: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    previewStyles() {
      return {
        backgroundColor: this.value
      };
    },
    body() {
      return document.body;
    }
  }
};
</script>

<style lang="scss" scoped>
.hex {
  position: relative;
  min-height: var(--input-height);
}

.color {
  position: relative;
  top: 8px;
  left: 8px;
  z-index: 2;
  width: calc(var(--input-height) - 16px);
  height: calc(var(--input-height) - 16px);

  .trigger {
    display: block;
    border-radius: var(--border-radius);
    width: calc(var(--input-height) - 16px);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    height: calc(var(--input-height) - 16px);
  }
}

.input {
  z-index: 1;
  width: 100%;
  max-width: var(--form-column-width);
  position: absolute;
  top: 0;
  left: 0;
}

// Once we have base components with proper slots, this can be discarded
.input ::v-deep input {
  padding-left: calc(var(--input-height) - 4px);
}
</style>
