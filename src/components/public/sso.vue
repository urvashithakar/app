<template>
  <ul v-if="providers.length > 0" class="sso">
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

<style lang="scss" scoped>
.sso {
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid var(--blue-grey-100);
  margin-top: 20px;

  img {
    width: 24px;
    margin: 0 10px;
  }
}
</style>
