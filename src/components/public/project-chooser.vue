<template>
  <div className="project-chooser">
    <span className="preview"></span>
    <select v-model="currentProjectIndex">
      <option v-for="(project, index) in projects" :key="index" :value="index">
        {{ project.project_name }}
      </option>
    </select>
  </div>
</template>

<script>
import { SET_CURRENT_PROJECT } from "@/store/mutation-types";
import { mapState } from "vuex";

export default {
  name: "ProjectChooser",
  computed: {
    currentProjectIndex: {
      get() {
        return this.$store.state.currentProjectIndex;
      },
      set(value) {
        this.$store.commit(SET_CURRENT_PROJECT, value);
      }
    },
    ...mapState(["projects"])
  }
};
</script>

<style lang="scss" scoped></style>
