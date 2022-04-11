<template>
  <div class="item" :id="uniqueKey">
    <div class="header">
      {{ uniqueKey }}
      <i class="fa fa-times" @click="handleDelete"></i>
    </div>
    <div class="my-custom-content">
      <!-- {{ payload.name }} -->
      <UnitData v-if="type === 'unitData' && payload" :unit="payload" />
    </div>
    <ResizeObserver @notify="handleResize"></ResizeObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Modal from "./Modal.vue";
import UnitData from "../units/unitData.vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "WidgetItem",
  components: {
    Modal,
    UnitData,
  },
  props: {
    uniqueKey: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "unitData",
    },
    componentData: {
      type: String,
      default: null,
      // default: () => {
      //   return {};
      // },
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapGetters("player", ["unitData"]),
    payload() {
      if (this.type === "unitData") {
        return this.unitData(this.componentData);
      }
    },
  },
  methods: {
    handleResize() {
      this.$emit("resized");
    },
    handleDelete() {
      this.$emit("delete", this.uniqueKey);
    },
  },
});
</script>

<style scoped lang="scss">
.header {
  position: relative;
  top: 0;
  left: 0;
  background: red;
  width: 100%;
  height: 24px;
  line-height: 24px;
  cursor: move;
  color: black;
  z-index: 1;
  display: flex;
  justify-content: space-between;

  .fa-times {
    cursor: pointer;
    font-size: 24px;
  }
}
.item {
  display: block;
  position: absolute;
  width: auto;
  height: auto;
  margin: 5px;
  z-index: 1;
  background: black;
  color: white;
  overflow: auto;
  resize: both;
  min-width: 100px;
  min-height: 100px;
}
.item.muuri-item-dragging {
  z-index: 3;
}
.item.muuri-item-releasing {
  z-index: 2;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item-content {
  position: relative;
  /* width: 100%;
  height: 100%; */
  /* overflow: visible; */
}
</style>
