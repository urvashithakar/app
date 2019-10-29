<template functional>
  <ul>
    <li v-for="provider in props.providers" :key="provider.name">
      <img :src="provider.icon" :alt="provider.name" />
    </li>
  </ul>
</template>

<script>
export default {
  name: "Sso",
  props: {
    providers: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
img {
  width: 20px;
}
</style>
