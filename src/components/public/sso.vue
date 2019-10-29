<template>
  <ul>
    <li v-for="provider in providers" :key="provider.name">
      <a :href="`${apiUrl}/auth/sso/${provider.name}`">
        <img :src="provider.icon" :alt="provider.name" />
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Sso",
  props: {
    providers: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(["currentProject"]),
    apiUrl() {
      const { url, project } = this.currentProject;
      return `${url}/${project}`;
    }
  }
};
</script>

<style scoped>
img {
  width: 20px;
}
</style>
