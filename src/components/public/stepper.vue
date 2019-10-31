<template>
  <div class="public-stepper">
    <div
      class="progress-line"
      :style="{
        transform: `scaleX(${(1 / (steps - 1)) * (currentStep - 1)})`
      }"
    ></div>
    <span
      v-for="step in steps"
      :key="step"
      :class="{
        current: step === currentStep,
        done: currentStep > step
      }"
      class="step"
    >
      <v-icon v-if="currentStep > step" color="white" size="16" name="check" />
    </span>
  </div>
</template>

<script>
export default {
  name: "PublicStepper",
  props: {
    currentStep: {
      type: Number,
      default: 1
    },
    steps: {
      type: Number,
      default: 1
    }
  }
};
</script>

<style lang="scss" scoped>
.public-stepper {
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;

  &::before,
  .progress-line {
    // line
    content: "";
    position: absolute;
    display: block;
    height: 2px;
    width: 100%;
    left: 0;
    top: calc(50% - 1px);
    background-color: var(--blue-grey-300);
    z-index: 1;
  }

  .progress-line {
    background-color: var(--blue-grey-800);
    transform-origin: left;
  }

  .step {
    display: inline-block;
    width: 8px;
    height: 8px;
    box-shadow: 0 0 0 4px var(--white), 0 0 0 6px var(--blue-grey-300);
    background-color: var(--white);
    border-radius: 50%;
    position: relative;
    z-index: 2;

    &.current {
      box-shadow: 0 0 0 4px var(--white), 0 0 0 6px var(--blue-grey-800);
      background-color: var(--blue-grey-800);
    }

    &.done {
      width: 20px;
      height: 20px;
      box-shadow: none;
      background-color: var(--blue-grey-800);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
