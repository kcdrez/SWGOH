<template>
  <div>
    <SearchInput :list="unitList" @select="selected = $event" />
    <div v-if="selected" class="text-center">
      <img class="d-block mx-auto my-1" :src="selected?.image" />
      <router-link
        as="button"
        class="btn btn-primary"
        :to="{ name: 'UnitPage', params: { unitId: selected.id } }"
        >View Details</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";

export default defineComponent({
  name: "Player",
  computed: {
    ...mapState("unit", ["unitList"]),
  },
  data() {
    return {
      selected: null,
    };
  },
});
</script>
