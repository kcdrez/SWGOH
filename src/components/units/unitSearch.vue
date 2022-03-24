<template>
  <SearchInput
    :list="fullList"
    @select="$emit('select', $event)"
    @enterPress="$emit('enterPress', $event)"
    :searchBy="['name', 'id', 'aliases']"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "UnitSearch",
  props: {
    list: {
      type: Array,
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
