<template>
  <div>
    <v-blocker v-show="active" :z-index="9" class="blocker-info" @click="disableSidebar" />
    <aside v-if="active" class="info-sidebar" :class="{ wide }">
      <div class="system"><slot name="system" /></div>
      <slot />
      <router-link
        v-if="canReadActivity"
        :to="`/${currentProjectKey}/activity`"
        class="notifications"
      >
        <div class="preview">
          <v-icon name="notifications" color="sidebar-text-color" />
          <span>{{ $t("notifications") }}</span>
        </div>
      </router-link>
    </aside>
  </div>
</template>

<script>
import VBlocker from "../blocker.vue";
import { TOGGLE_INFO } from "../../store/mutation-types";
import { mapState } from "vuex";

export default {
  name: "InfoSidebar",
  components: {
    VBlocker
  },
  props: {
    wide: {
      type: Boolean,
      default: false
    },
    itemDetail: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["currentProjectKey"]),
    active() {
      return this.$store.state.sidebars.info;
    },
    canReadActivity() {
      return this.permissions.directus_activity.read !== "none";
    },
    permissions() {
      return this.$store.state.permissions;
    }
  },
  created() {
    if (this.itemDetail && window.innerWidth > 1235) {
      this.$store.commit(TOGGLE_INFO, true);
    }
  },
  methods: {
    disableSidebar() {
      this.$store.commit(TOGGLE_INFO, false);
    }
  }
};
</script>

<style lang="scss" scoped>
.info-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  z-index: 30;
  transition: var(--slow) var(--transition-out);
  width: 90%;
  background-color: var(--sidebar-background-color);
  padding: 20px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  & .system:not(:empty) {
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  @media (min-width: 800px) {
    max-width: var(--info-sidebar-width);
  }
}

.info-enter-active {
  transition: var(--slow) var(--transition-in);
}

.info-leave-active {
  transition: var(--medium) var(--transition-out);
}

.info-enter,
.info-leave-to {
  transform: translateX(100%);
}

.blocker-info {
  @media (min-width: 1235px) {
    display: none;
  }
}

.notifications {
  position: fixed;
  width: var(--info-sidebar-width);
  bottom: 0;
  right: 0;
  text-decoration: none;
  padding: 20px;
  margin: 0;
  background-color: var(--sidebar-background-color-alt);
  color: var(--sidebar-text-color);
  display: block;

  .preview {
    display: flex;
    align-items: center;

    span {
      flex-grow: 1;
      margin-left: 10px;
    }
  }
}
</style>
