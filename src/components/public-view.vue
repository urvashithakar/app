<template>
  <div className="public">
    <div className="container">
      <a href="https://directus.io" target="_blank">
        <img
          v-tooltip.right="{ classes: ['inverted'], content: version }"
          class="logo"
          alt=""
          src="../assets/logo-dark.svg"
        />
      </a>
      <slot />
    </div>
    <div className="art"></div>
  </div>
</template>

<script>
import { version } from "../../package.json";

export default {
  name: "PublicView",
  computed: {
    version() {
      return `Directus v${version}`;
    }
  }
};
</script>

<style lang="scss" scoped></style>
