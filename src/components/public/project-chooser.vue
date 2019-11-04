<template>
  <div v-if="projects.length > 1" class="project-chooser">
    <span v-tooltip.right="{ classes: ['inverted'], content: 'API URL' }" class="preview">
      <v-icon class="icon signal" color="input-text-color" name="signal_wifi_4_bar" />
      {{ currentProject.project_name }}
      <v-icon class="icon dropdown" color="input-text-color" name="arrow_drop_down" />
    </span>
    <select v-model="currentProjectIndex">
      <option v-for="(project, index) in projects" :key="index" :value="index">
        {{ project.project_name }}
      </option>
    </select>
  </div>
</template>

<script>
import { SET_CURRENT_PROJECT } from "@/store/mutation-types";
import { mapState, mapGetters } from "vuex";

export default {
  name: "ProjectChooser",
  computed: {
    ...mapGetters(["currentProject"]),
    ...mapState(["projects"]),
    currentProjectIndex: {
      get() {
        return this.$store.state.currentProjectIndex;
      },
      set(value) {
        this.$store.commit(SET_CURRENT_PROJECT, value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.project-chooser {
  border: 2px solid var(--input-border-color);
  width: 100%;
  padding: 20px 10px;
  margin-bottom: 32px;
  color: var(--input-text-color);
  transition: border-color var(--fast) var(--transition);
  border-radius: var(--border-radius);
  position: relative;

  &:hover {
    border-color: var(--input-border-color-hover);
  }

  &:focus {
    border-color: var(--input-border-color-focus);
  }

  .preview {
    display: inline-block;
    position: relative;
    font-size: 16px;
    transition: color var(--fast) var(--transition);
    color: var(--input-text-color);
    width: 100%;
    padding: 0 36px;

    .signal {
      position: absolute;
      left: 0;
      top: calc(50% - 13px);
      user-select: none;
      pointer-events: none;
    }

    .dropdown {
      position: absolute;
      right: 0;
      top: calc(50% - 13px);
      user-select: none;
      pointer-events: none;
    }
  }

  select {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: +1;
    top: 0;
    left: 0;
    font-size: 16px;
    cursor: pointer;
    appearance: none;
  }

  select:hover + div,
  select:focus + div {
    transition: none;
    cursor: pointer;
  }
}
</style>
