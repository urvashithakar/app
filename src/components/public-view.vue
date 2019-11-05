<template>
  <div class="public">
    <div class="container" :class="{ wide }">
      <a href="https://directus.io" target="_blank" class="logo">
        <img
          v-tooltip.right="{ classes: ['inverted'], content: version }"
          alt="Directus Logo"
          src="../assets/logo-dark.svg"
        />
      </a>
      <div class="content">
        <h1 class="title type-heading-large">{{ heading }}</h1>
        <slot />
      </div>
      <div class="notice"><slot name="notice" /></div>
    </div>
    <div class="art" :style="artStyles">
      <img
        v-if="project_logo.full_url"
        class="logo"
        :src="project_logo.full_url"
        :alt="project_name"
      />
    </div>
  </div>
</template>

<script>
import { version } from "../../package.json";
import { mapGetters } from "vuex";

const defaults = {
  project_color: "project-background-color",
  project_image: { full_url: null },
  project_logo: { full_url: null },
  project_name: "Directus"
};

export default {
  name: "PublicView",
  props: {
    heading: {
      type: String,
      required: true
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["currentProject"]),
    artStyles() {
      if (this.currentProject.status !== "successful") return;
      if (this.project_image.full_url) {
        return { backgroundImage: `url(${this.project_image.full_url})` };
      } else {
        return { backgroundColor: `var(--${this.project_color})` };
      }
    },
    project_color() {
      if (this.currentProject.status !== "successful") return defaults.project_color;
      return this.currentProject.data.project_color || defaults.project_color;
    },
    project_image() {
      if (this.currentProject.status !== "successful") return defaults.project_image;
      return this.currentProject.data.project_image || defaults.project_image;
    },
    project_logo() {
      if (this.currentProject.status !== "successful") return defaults.project_logo;
      return this.currentProject.data.project_logo || defaults.project_logo;
    },
    project_name() {
      if (this.currentProject.status !== "successful") return defaults.project_name;
      return this.currentProject.data.project_name || defaults.project_name;
    },
    version() {
      return `Directus v${version}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.public {
  display: flex;
  height: 100%;
}

.container {
  background-color: var(--public-background-color);
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.25);
  max-width: 500px;
  width: 100%;
  height: 100%;
  min-height: 700px;
  overflow-y: auto;
  position: relative;
  padding: 40px 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  &.wide {
    max-width: 872px;
  }

  .logo {
    position: absolute;
    top: 40px;
    left: 80px;
    height: 40px;
    user-select: none;
    cursor: help;
  }

  .content {
    width: 100%;
  }

  .notice {
    position: absolute;
    bottom: 40px;
    left: 80px;
    user-select: none;
    pointer-events: none;
  }
}

.art {
  transition: all var(--fast) var(--transition);
  flex-grow: 1;
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;

  .logo {
    width: 100%;
    max-width: 200px;
    height: auto;
  }
}
</style>
