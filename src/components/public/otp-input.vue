<template>
  <the-mask
    type="text"
    :value="value"
    mask="###-###"
    placeholder="xxx-xxx"
    :masked="false"
    @input="onInput"
  />
</template>

<script>
export default {
  name: "OTPInput",
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  methods: {
    onInput(value) {
      if (value.length === 0 || value.length === 6) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style lang="scss"></style>
