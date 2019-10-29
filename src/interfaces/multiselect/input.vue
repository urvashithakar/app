<template>
  <select
    :id="name"
    :disabled="readonly"
    class="select"
    multiple
    @change="updateValue($event.target.options)"
  >
    <option v-if="options.placeholder" value="" :disabled="required">
      {{ options.placeholder }}
    </option>
    <option
      v-for="(display, val) in choices"
      :key="val"
      :value="val"
      :selected="value && value.includes(val)"
    >
      {{ display }}
    </option>
  </select>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  computed: {
    choices() {
      let choices = this.options.choices;

      if (!choices) return {};

      if (typeof this.options.choices === "string") {
        choices = JSON.parse(this.options.choices);
      }

      return choices;
    }
  },
  methods: {
    updateValue(options) {
      let value = Array.from(options)
        .filter(input => input.selected && Boolean(input.value))
        .map(input => input.value)
        .join();

      if (value && this.options.wrapWithDelimiter) {
        value = `,${value},`;
      }

      value = value.split(",");
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.select {
  transition: all var(--fast) var(--transition);
  border: var(--input-border-width) solid var(--input-border-color);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: var(--width-large);
  font-family: "Roboto", sans-serif;
  height: 130px;

  &:hover {
    transition: none;
    border-color: var(--blue-grey-300);
  }
  &:focus {
    border-color: var(--blue-grey-800);
    option {
      color: var(--blue-grey-600);
    }
  }
  option {
    transition: color var(--fast) var(--transition);
    padding: 5px 10px;
    color: var(--blue-grey-400);
    &:hover {
      transition: none;
      color: var(--blue-grey-800);
    }
    &:checked {
      background: var(--blue-grey-900)
        linear-gradient(0deg, var(--blue-grey-900) 0%, var(--blue-grey-900) 100%);
      position: relative;
      color: var(--white);
      -webkit-text-fill-color: var(--white);

      &::after {
        content: "check";
        font-family: "Material Icons";
        font-size: 24px;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-54%);
      }
    }
  }
}
</style>
