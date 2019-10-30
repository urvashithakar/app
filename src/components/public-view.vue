<template>
  <div class="public">
    <div class="container">
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
  project_color: "blue-grey-700",
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
    }
  },
  computed: {
    ...mapGetters(["currentProject"]),
    artStyles() {
      if (this.project_image) {
        return { backgroundImage: `url(${this.project_image.full_url})` };
      } else {
        return { backgroundColor: `var(--${this.project_color})` };
      }
    },
    project_color() {
      return this.currentProject.project_color || defaults.project_color;
    },
    project_image() {
      return this.currentProject.project_image || defaults.project_image;
    },
    project_logo() {
      return this.currentProject.project_logo || defaults.project_logo;
    },
    project_name() {
      return this.currentProject.project_name || defaults.project_name;
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
}

.container {
  background-color: var(--white);
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

  .title {
    margin-bottom: 32px;

    @media (min-height: 700px) {
      margin-bottom: 60px;
    }
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
