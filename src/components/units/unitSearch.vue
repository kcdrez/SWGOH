<template>
  <SearchInput
    :list="fullList"
    @update:modelValue="$emit('select', $event)"
    @enterPress="$emit('enterPress', $event)"
    :searchBy="['name', 'id', 'aliases']"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

import { Unit } from "types/unit";

export default defineComponent({
  name: "UnitSearch",
  props: {
    list: {
      type: Array as () => Unit[],
      default: () => {
        return null;
      },
    },
  },
  computed: {
    ...mapState("unit", ["unitList"]),
    fullList() {
      return this.list ?? this.unitList;
    },
  },
});
</script>
