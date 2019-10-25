<template functional>
  <span class="public-notice" :style="{ color: `var(--${props.color})` }">
    <v-icon :name="props.icon" :color="props.color" />
    <slot />
  </span>
</template>

<script>
export default {
  name: "PublicNotice",
  props: {
    color: {
      type: String,
      default: "blue-grey"
    },
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.public-notice {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
