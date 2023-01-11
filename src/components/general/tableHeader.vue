<template>
  <thead :class="header.classes">
    <tr v-if="$slots.firstRow">
      <slot name="firstRow" />
    </tr>
    <tr class="sort-methods" v-if="showSortMethods">
      <th class="show-on-mobile">
        <SortMethods :header="header" />
      </th>
    </tr>
    <ColumnHeaders
      v-if="showHeaders"
      class="text-center align-middle"
      :headers="header.headers"
      @searchChange="handleSearchChange($event)"
    />
  </thead>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { iTableHead, iHeader } from "types/general";

export default defineComponent({
  name: "TableHeader",
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
        return !!header.sortMethodShow;
      });
    },
    showHeaders(): boolean {
      return this.header.headers.some((header) => {
        return !!header.show;
      });
    },
  },
  watch: {
    searchText: _.debounce(function (this: any, newVal: String) {
      this.$emit("searchChange", newVal);
    }, 500),
  },
  methods: {
    handleClick(header: iHeader, checkClickable?: boolean) {
      if (header.click) {
        if (checkClickable) {
          header.click();
        }
      }
    },
    handleInputClick(header: iHeader, data?: any) {
      if (header.input?.click) {
        header.input.click(data);
      }
    },
    handleSearchChange: _.debounce(function (this: any, newVal: String) {
      if (this.header.searchChange && !!newVal) {
        this.header.searchChange(newVal);
      }
    }, 500),
  },
});
</script>
