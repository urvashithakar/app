<template>
  <transition name="error">
    <div class="v-error">
      <v-icon
        class="icon"
        :style="{ borderColor: 'var(--' + color + ')' }"
        :name="icon"
        size="48"
        :color="color"
      />
      <h2 class="type-heading" :style="{ color: 'var(--' + color + ')' }">{{ title }}</h2>
      <p>{{ body }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "VError",
  props: {
    color: {
      type: String,
      default: "blue-grey-800",
      validator(val) {
        return ["blue-grey-800", "accent", "success", "warning", "danger"].includes(val);
      }
    },
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.v-error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 100px 0;

  .icon {
    border: 2px solid var(--blue-grey-50);
    border-radius: 50%;
    padding: 20px;
  }

  h2 {
    margin-top: 12px;
    margin-bottom: 8px;
  }

  p {
    line-height: 1.4;
    color: var(--blue-grey-200);
    max-width: 200px;
    text-align: center;
  }
}

.error-enter-active {
  transition: var(--slow) var(--transition-in);

  > * {
    transition: var(--slow) var(--transition-in);

    &:nth-child(2) {
      transition-delay: 50ms;
    }

    &:nth-child(3) {
      transition-delay: 100ms;
    }
  }
}

.error-enter {
  > * {
    opacity: 0;
    transform: translateY(15px);
  }
}
</style>
