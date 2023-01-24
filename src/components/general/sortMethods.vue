<template>
  <div class="input-group input-group-sm my-2">
    <span class="input-group-text">Sort By:</span>
    <select class="form-control" v-model="_sortMethod">
      <template v-for="option in headerRow.cells">
        <option :value="option.value" v-if="option?.sortMethodShow ?? false">
          {{ option.label }}
        </option>
      </template>
    </select>
  </div>
  <div class="input-group input-group-sm my-2">
    <span class="input-group-text">Sort Direction:</span>
    <select class="form-control" v-model="_sortDir">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
  <template v-for="input in inputs">
    <div class="input-group input-group-sm my-2">
      <span class="input-group-text">{{ input.input?.label }}</span>
      <input
        class="form-control"
        :placeholder="input.input?.placeholder"
        @keyup="handleChange(input, $event)"
      />
    </div>
  </template>
  <template v-for="list in lists">
    <div class="input-group input-group-sm my-1">
      <span class="input-group-text">{{
        list.input?.label || "List Label"
      }}</span>
      <select class="form-control" @change="handleChange(list, $event)">
        <option v-for="option in list.input?.options" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </template>
  <template v-for="button in buttons">
    <button :class="button.input?.classes" @click="buttonClick(button)">
      {{ button.input?.label || "Click Me" }}
    </button>
  </template>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

import { iHeaderCell, iTableHead, iHeaderRow } from "types/general";

export default defineComponent({
  name: "SortMethods",
  props: {
    headerRow: {
      type: Object as () => iHeaderRow,
      required: true,
    },
    header: {
      type: Object as () => iTableHead,
      required: true,
    },
  },
  computed: {
    buttons(): iHeaderCell[] {
      return this.headerRow.cells.reduce((acc: iHeaderCell[], cell) => {
        if (cell.input?.type === "button") {
          acc.push(cell);
        }
        return acc;
      }, []);
    },
    inputs(): iHeaderCell[] {
      return this.headerRow.cells.reduce((acc: iHeaderCell[], cell) => {
        if (cell.input?.type === "input") {
          acc.push(cell);
        }
        return acc;
      }, []);
    },
    lists(): iHeaderCell[] {
      return this.headerRow.cells.reduce((acc: iHeaderCell[], cell) => {
        if (cell.input?.type === "list") {
          acc.push(cell);
        }
        return acc;
      }, []);
    },
    images(): iHeaderCell[] {
      return this.headerRow.cells.reduce((acc: iHeaderCell[], cell) => {
        if (cell.input?.type === "image") {
          acc.push(cell);
        }
        return acc;
      }, []);
    },
  },
  data() {
    return {
      _sortMethod: this.header.sortMethod,
      _sortDir: this.header.sortDir,
    };
  },
  watch: {
    _sortMethod(newVal: string) {
      if (this.header.methodChange && !!newVal) {
        this.header.methodChange(newVal);
      }
    },
    _sortDir(newVal: "asc" | "desc") {
      if (this.header.directionChange && !!newVal) {
        this.header.directionChange(newVal);
      }
    },
  },
  methods: {
    buttonClick(header: iHeaderCell) {
      if (header.input?.click) {
        header.input.click();
      }
    },
    handleChange: _.debounce(function (
      this: any,
      cell: iHeaderCell,
      event: Event
    ) {
      if (cell.input?.change) {
        cell.input.change((event.target as HTMLInputElement).value);
      }
    },
    200),
  },
});
</script>
