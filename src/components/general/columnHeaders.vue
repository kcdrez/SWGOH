<template>
  <tr>
    <template v-for="header in headers">
      <th
        v-if="header.show"
        :max-width="header?.maxWidth ?? 'auto'"
        :class="[
          header.click && !header.input ? 'c-pointer' : '',
          header.classes,
        ]"
        :title="header.title"
        @click="handleClick(header, !header.input)"
      >
        <div :class="header.containerClass">
          <template v-if="header.input?.type === 'input'">
            <div
              :class="header.input?.click ? 'c-pointer' : ''"
              @click="handleInputClick(header)"
            >
              {{ header.label }}
              <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
            </div>
            <input
              type="text"
              class="form-control form-control-sm"
              :class="header.input.classes"
              :placeholder="header.input.placeholder"
              @keyup="handleChange(header, $event)"
          /></template>
          <template v-else-if="header.input?.type === 'button'">
            <div
              :class="header.input?.click ? 'c-pointer' : ''"
              @click="handleClick(header, true)"
            >
              {{ header.label }}
              <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
            </div>
            <button
              :class="header.input.classes"
              @click="handleInputClick(header)"
            >
              {{ header.input.placeholder }}
            </button>
          </template>
          <template v-else-if="header.input?.type === 'multiselect'">
            <div
              :class="header.click ? 'c-pointer' : ''"
              @click="handleClick(header, true)"
            >
              {{ header.label }}
              <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
            </div>
            <MultiSelect
              :class="header.input.classes"
              :label="header.input.placeholder"
              :options="header.input.options"
              :storageKey="header.input.storageKey"
              @checked="handleInputClick(header, $event)"
            />
          </template>
          <template v-else-if="header.input?.type === 'checkbox'">
            <div
              :class="header.click ? 'c-pointer' : ''"
              @click="handleClick(header, true)"
            >
              {{ header.label }}
              <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
            </div>
            <div class="d-flex mt-2">
              <input
                id="toggle"
                type="checkbox"
                v-model="header.input.value"
                @change="handleInputClick(header, header.input?.value)"
              />
              <label for="toggle" class="ms-2 text-small">{{
                header.input.placeholder || "Click Me"
              }}</label>
            </div>
          </template>
          <template v-else-if="header.input?.type === 'image'">
            <div
              :class="header.click ? 'c-pointer' : ''"
              @click="handleClick(header, true)"
            >
              <img :src="header.label" />
              <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
            </div>
          </template>
          <template v-else>
            {{ header.label }}
            <i class="fas mx-1" :class="header.icon" v-if="header.icon"></i>
          </template>
        </div>
      </th>
    </template>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";
import { iHeader } from "types/general";

export default defineComponent({
  name: "ColumnHeaders",
  props: {
    headers: {
      type: Array as () => iHeader[],
      required: true,
    },
  },
  emits: ["searchChange"],
  data() {
    return {
      value: null,
    };
  },
  watch: {
    searchText: _.debounce(function (this: any, newVal: string) {
      if (!!newVal) {
        this.$emit("searchChange", newVal);
      }
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
    handleChange: _.debounce(function (
      this: any,
      header: iHeader,
      event: KeyboardEvent
    ) {
      if (header.input?.change && event) {
        header.input.change((event.target as HTMLInputElement).value);
      }
    },
    500),
  },
});
</script>
