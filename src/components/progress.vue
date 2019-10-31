<template>
  <div class="progress" :class="{ indeterminate: value === null }">
    <span
      class="progress-inner"
      :style="{
        width: value ? `${(value / max) * 100}%` : null
      }"
    ></span>
  </div>
</template>

<script>
export default {
  name: "VProgress",
  props: {
    max: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      required: false,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.progress {
  width: 100%;
  background-color: var(--blue-grey-200);
  position: relative;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;

  .progress-inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: auto;
    height: inherit;
    background-color: var(--blue-grey-900);
    will-change: left, right;
    border-radius: inherit;
    transition: width var(--fast) var(--transition);
  }

  &.indeterminate .progress-inner {
    animation: indeterminate 2.2s infinite;
    transition: none;
  }
}

@keyframes indeterminate {
  0%,
  60% {
    left: -90%;
    right: 100%;
  }

  100% {
    left: 100%;
    right: -35%;
  }
}
</style>
