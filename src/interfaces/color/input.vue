<template>
  <div class="interface-color">
    <hex :readonly="readonly || options.paletteOnly" :value="formattedValue" @input="emitValue" />
    <palette
      v-if="options.palette.length > 0 && !readonly"
      :palette="options.palette"
      @input="emitValue"
    />
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import Color from "color";
import Hex from "./components/hex";
import Palette from "./components/palette";

export default {
  name: "InterfaceColor",
  components: {
    Hex,
    Palette
  },
  mixins: [mixin],
  computed: {
    formattedValue() {
      if (!this.value) return null;

      if (this.options.format !== "hex") {
        return Color[this.options.format](this.value.split(",").map(n => +n)).hex();
      } else {
        return this.value;
      }
    }
  },
  methods: {
    emitValue(value) {
      if (this.options.format !== "hex") {
        this.$emit(
          "input",
          new Color(value)
            [this.options.format]()
            .round()
            .array()
            .join(",")
        );
      } else {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.interface-color {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  > * {
    flex-basis: var(--form-column-width);
  }
}
</style>
