<template>
  <div :title="item.name">
    <img :src="item.image" v-if="!simpleView" />
    <!-- <div>{{ item.name }}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RelicIcon",
  props: {
    item: {
      type: Object,
      required: true,
    },
    simpleView: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 35px;
}
</style>
