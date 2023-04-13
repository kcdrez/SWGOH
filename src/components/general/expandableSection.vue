<template>
  <div>
    <div class="collapse-header section-header mt-3">
      <h3
        class="w-100"
        data-bs-toggle="collapse"
        :href="`#${idRef}`"
        :ref="idRef"
      >
        <i
          class="fa fa-chevron-up me-3"
          :class="showing ? 'up' : 'down'"
          aria-hidden="true"
        ></i>
        <div class="d-inline">{{ title }}</div>
      </h3>
    </div>
    <div :id="idRef" :ref="idRef" class="collapse">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { setupEvents } from "utils";

export default defineComponent({
  name: "ExpandableSection",
  props: {
    title: {
      type: String,
      required: true,
    },
    idRef: {
      type: String,
      required: true,
    },
    defaultExpand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showing: false,
    };
  },
  mounted() {
    const el = this.$refs[this.idRef] as HTMLElement;
    if (el) {
      setupEvents(
        el,
        this.idRef,
        this.defaultExpand,
        () => {
          this.showing = true;
        },
        () => {
          this.showing = false;
        }
      );
    } else {
      console.warn("Ref doesnt exist", this.idRef);
    }
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.section-header {
  display: flex;
  align-items: center;
  background-color: black;
  text-align: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid $light;
  position: sticky;
  top: 56px;
  height: 50px;
  z-index: 10;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    cursor: pointer;
    margin: 0;
  }
  .simple-view-container {
    top: 12.5px;
    right: 280px;
  }
}

.up {
  transition: transform 0.3s;
}
.down {
  transition: transform 0.3s;
  transform: rotate(-180deg);
}
</style>
