<template>
  <div>
    <img :src="item.image" />
    <div>{{ item.name }}</div>
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
  },
});
</script>

<style lang="scss" scoped>
img {
  max-width: 40px;
}
</style>
