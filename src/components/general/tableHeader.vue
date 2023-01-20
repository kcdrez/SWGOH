<template>
  <thead
    :class="header.classes"
    :data-bs-toggle="header.collapseTarget ? 'collapse' : ''"
    :href="`#${header.collapseTarget ?? ''}`"
    :title="header.title"
  >
    <template v-for="h in header.headers">
      <tr class="sort-methods" v-if="showSortMethods">
        <th colspan="100%">
          <SortMethods :headerRow="h" :header="header" />
        </th>
      </tr>
      <tr class="sort-methods" v-if="header.multiOptions">
        <th class="show-on-moblie">
          <MultiSelect
            class="filter-mats"
            label="Filter Relic Mats"
            :options="header.multiOptions"
            :storageKey="header.storageKey"
            @checked="handleSelect($event)"
          />
        </th>
      </tr>
      <ColumnHeaders
        v-if="showHeaders"
        class="text-center align-middle"
        :header="h"
        @searchChange="handleSearchChange($event)"
      />
    </template>
  </thead>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

import { iTableHead } from "types/general";
import ColumnHeaders from "./columnHeaders.vue";
import SortMethods from "./sortMethods.vue";

export default defineComponent({
  name: "TableHeader",
  components: { ColumnHeaders, SortMethods },
  props: {
    header: {
      type: Object as () => iTableHead,
      required: true,
    },
  },
  emits: ["searchChange"],
  data() {
    return {
      searchText: "",
      value: null,
    };
  },
  computed: {
    showSortMethods(): boolean {
      return this.header.headers.some((header) => {
        return header.cells.some((cell) => !!cell.sortMethodShow);
      });
    },
    showHeaders(): boolean {
      return this.header.headers.some((header) => {
        return header.cells.some((cell) => !!cell.show);
      });
    },
  },
  watch: {
    searchText: _.debounce(function (this: any, newVal: String) {
      this.$emit("searchChange", newVal);
    }, 500),
  },
  methods: {
    handleSearchChange: _.debounce(function (this: any, newVal: String) {
      if (this.header.searchChange && !!newVal) {
        this.header.searchChange(newVal);
      }
    }, 500),
    handleSelect: _.debounce(function (this: any, newVal: String) {
      if (this.header.select && !!newVal) {
        this.header.select(newVal);
      }
    }, 500),
  },
});
</script>
