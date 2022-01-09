<template>
  <div>
    <img :src="gear.image" />
    <span>{{ gear.name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Gear } from "../../api/interfaces";

export default defineComponent({
  name: "Gear",
  props: {
    gear: {
      type: Object as () => Gear,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>
