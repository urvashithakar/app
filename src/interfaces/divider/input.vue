<template>
  <div :class="`${options.style}-style`">
    <h2 v-if="options.title">{{ options.title }}</h2>
    <hr v-if="options.hr" />
    <p v-if="options.description">{{ options.description }}</p>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.small-style {
  position: relative;
  margin-top: 60px;
  padding-top: 8px;
  h2 {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);

    color: var(--heading-text-color);
    font-size: 16px;
    line-height: 18px;
    background-color: var(--page-background-color);
    padding: 0 12px;
  }
  p {
    position: absolute;
    top: 28px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--note-text-color);
    max-width: 460px;
  }
  hr {
    border: 0;
    background: none;
    border-bottom: 2px solid var(--input-border-color);
  }
}

.medium-style {
  margin-top: 60px;
  padding-top: 6px;
  h2 {
    color: var(--heading-text-color);
    font-size: 22px;
    line-height: 28px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  p {
    color: var(--note-text-color);
    max-width: 460px;
    margin-top: 6px;
  }
  hr {
    border: 0;
    background: none;
    border-bottom: 2px solid var(--input-border-color);
  }
}

.large-style {
  margin-top: 60px;
  padding-top: 6px;
  h2 {
    color: var(--heading-text-color);
    font-size: 28px;
    line-height: 32px;
    font-weight: 300;
    margin-bottom: 10px;
  }
  p {
    color: var(--note-text-color);
    max-width: 460px;
    margin-top: 14px;
  }
  hr {
    border: 0;
    background: none;
    border-bottom: 2px solid var(--input-border-color);
  }
}
</style>
