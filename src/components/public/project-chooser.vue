<template>
  <div v-if="projects.length > 1" class="project-chooser">
    <span class="preview">{{ currentProject.project_name }}</span>
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
  border: 2px solid var(--blue-grey-100);
  width: 100%;
  padding: 20px 10px;
  margin-bottom: 32px;
  color: var(--blue-grey-400);
  transition: border-color var(--fast) var(--transition);
  border-radius: var(--border-radius);
  position: relative;

  &:hover {
    border-color: var(--blue-grey-400);
  }

  .preview {
    position: relative;
    transition: color var(--fast) var(--transition);
    color: var(--blue-gray-800);
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
