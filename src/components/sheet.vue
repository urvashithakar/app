<template>
  <div class="sheet" v-bind="$attrs">
    <slot />
  </div>
</template>

<script>
export default {
  name: "VSheet",
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
.sheet {
  min-height: var(--input-height);
  padding: 8px;
  border: 2px solid var(--input-border-color);
  background-color: var(--input-background-color-alt);
  border-radius: var(--border-radius);
}
</style>
