<template>
  <div class="item" :id="uniqueKey">
    <div class="header">
      <div>{{ header }}</div>
      <i class="fa fa-times mx-1" @click="$emit('delete', this.uniqueKey)"></i>
    </div>
    <div class="my-custom-content">
      <UnitData v-if="type === 'unitData' && payload" :unit="payload" />
    </div>
    <ResizeObserver @notify="$emit('resized')"></ResizeObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

import Modal from "./Modal.vue";
import UnitData from "../units/unitData.vue";
import { Unit } from "../../types/unit";

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
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  computed: {
    ...mapGetters("player", ["unitData"]),
    payload(): Unit | null {
      if (this.type === "unitData") {
        return this.unitData(this.componentData);
      } else {
        return null;
      }
    },
    header(): string {
      if (this.type === "unitData") {
        return this.payload?.name ?? this.uniqueKey;
      } else {
        return this.uniqueKey;
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "../../styles/variables.scss";

.header {
  background: $gray-4;
  cursor: move;
  color: $dark;
  display: flex;
  justify-content: center;

  .fa-times {
    cursor: pointer;
    font-size: 20px;
    position: absolute;
    right: 5px;
    top: 2px;
  }
}
.item {
  position: absolute;
  background: $gray-2;
  border: $dark 1px solid;
  overflow: auto;
  resize: both;
  min-width: 100px;
  min-height: 100px;
  margin: 0 0.25rem;
}
// .item.muuri-item-dragging {
//   z-index: 3;
// }
// .item.muuri-item-releasing {
//   z-index: 2;
// }
// .item.muuri-item-hidden {
//   z-index: 0;
// }
// .item-content {
//   position: relative;
//   /* width: 100%;
//   height: 100%; */
//   /* overflow: visible; */
// }
</style>
