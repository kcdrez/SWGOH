<template>
  <div class="input-group input-group-sm my-2">
    <span class="input-group-text">Sort By:</span>
    <select class="form-control" v-model="_sortMethod">
      <template v-for="option in sortByOptions">
        <option :value="option.value" v-if="option?.show ? option.show : true">
          {{ option.label }}
        </option>
      </template>
    </select>
  </div>
  <div class="input-group input-group-sm my-2">
    <span class="input-group-text">Sort Direction:</span>
    <select class="form-control" v-model="sortDir">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
  <slot name="inputs" />
  <div class="input-group input-group-sm my-2" v-if="showSearch">
    <span class="input-group-text">Search:</span>
    <input
      class="form-control"
      v-model="_searchText"
      placeholder="Search by name"
    />
  </div>
  <button
    v-if="showButton"
    class="btn btn-sm btn-primary w-50 mx-auto d-block"
    @click="buttonClick()"
  >
    Reset
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SortMethods",
  props: {
    sortByOptions: {
      type: Array as () => { value: any; label: any; show?: boolean }[],
      required: true,
    },
    sortMethod: {
      type: String,
      required: true,
    },
    sortDir: {
      type: String,
      required: true,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
    buttonText: {
      type: String,
      default: "",
    },
  },
  emits: ["methodChange", "directionChange", "searchChange", "buttonClick"],
  data() {
    return {
      _sortMethod: this.sortMethod,
      _sortDir: this.sortDir,
      _searchText: "",
    };
  },
  watch: {
    _sortMethod(newVal) {
      this.$emit("methodChange", newVal);
    },
    _sortDir(newVal) {
      this.$emit("directionChange", newVal);
    },
    _searchText(newVal) {
      this.$emit("searchChange", newVal);
    },
  },
  methods: {
    buttonClick() {
      this.$emit("buttonClick");
    },
  },
});
</script>
