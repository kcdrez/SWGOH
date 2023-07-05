<template>
  <tr v-if="header.show ?? true" :class="header.classes">
    <template v-for="(cell, index) in header.cells">
      <th
        :key="index"
        v-if="cell.show"
        :max-width="cell?.maxWidth ?? 'auto'"
        :class="[cell.click && !cell.input ? 'c-pointer' : '', cell.classes]"
        :title="cell.title"
        @click="handleClick(cell, !cell.input)"
        :colspan="cell.colspan"
        :rowspan="cell.rowspan"
      >
        <div
          :class="[
            cell.containerClass,
            cell.input?.type === 'multiselect' ? 'd-flex ' : '',
          ]"
        >
          <template v-if="cell.input?.type === 'input'">
            <div
              :class="cell.input?.click ? 'c-pointer' : ''"
              @click="handleInputClick(cell)"
            >
              {{ cell.label }}
              <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
            </div>
            <input
              type="text"
              class="form-control form-control-sm"
              :class="cell.input.classes"
              :placeholder="cell.input.placeholder"
              @keyup="handleChange(cell, $event)"
          /></template>
          <template v-else-if="cell.input?.type === 'button'">
            <div
              :class="cell.input?.click ? 'c-pointer' : ''"
              @click="handleClick(cell, true)"
            >
              {{ cell.label }}
              <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
            </div>
            <button :class="cell.input.classes" @click="handleInputClick(cell)">
              {{ cell.input?.label ?? "Click Me" }}
            </button>
          </template>
          <template v-else-if="cell.input?.type === 'multiselect'">
            <div
              :class="cell.click ? 'c-pointer' : ''"
              class="w-100 align-self-center"
              @click="handleClick(cell, true)"
            >
              {{ cell.label }}
              <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
            </div>
            <MultiSelect
              :class="cell.input.classes"
              class="multi-select-container"
              :label="cell.input.placeholder"
              :options="cell.input.options"
              :storageKey="cell.input.storageKey"
              @checked="handleInputClick(cell, $event)"
            />
          </template>
          <template v-else-if="cell.input?.type === 'checkbox'">
            <div
              :class="cell.click ? 'c-pointer' : ''"
              @click="handleClick(cell, true)"
            >
              {{ cell.label }}
              <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
            </div>
            <div class="d-flex mt-2">
              <input
                id="toggle"
                type="checkbox"
                v-model="cell.input.value"
                @change="handleInputClick(cell, cell.input?.value)"
              />
              <label for="toggle" class="ms-2 text-small">{{
                cell.input.placeholder || "Click Me"
              }}</label>
            </div>
          </template>
          <template v-else-if="cell.input?.type === 'image'">
            <div
              :class="cell.click ? 'c-pointer' : ''"
              @click="handleClick(cell, true)"
            >
              <img :src="cell.input?.src" :alt="cell.input?.label" />
              <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
            </div>
          </template>
          <template v-else-if="cell.input?.type === 'gear'">
            <GearIcon :gear="cell.data.gear" :showName="cell.data.showName" />
          </template>
          <template v-else-if="cell.input?.type === 'relic'">
            <RelicIcon :item="cell.data.relic" />
          </template>
          <template v-else-if="cell.input?.type === 'link'">
            <router-link :to="cell.data">{{ cell.label }}</router-link>
          </template>
          <template v-else>
            {{ cell.label }}
            <i class="fas mx-1" :class="cell.icon" v-if="cell.icon"></i>
          </template>
          <div v-if="cell?.buttons" class="d-flex align-items-center">
            <template v-for="(button, index) in cell.buttons">
              <template v-if="button.menu">
                <div :key="index" class="dropdown">
                  <div data-bs-toggle="dropdown" data-bs-auto-close="outside">
                    <i :class="button.classes" :title="button.title"></i>
                  </div>
                  <ul class="dropdown-menu">
                    <li
                      v-for="(item, index) in button.menu.menuItems"
                      :key="index"
                    >
                      <hr
                        class="dropdown-divider"
                        v-if="item.label === '-divider-'"
                      />
                      <a
                        class="dropdown-item c-pointer"
                        :class="item.containerClass"
                        @click="item.click()"
                        v-else
                      >
                        <i :class="item.icon.classes" v-if="item.icon"></i>
                        <div>{{ item.label }}</div>
                      </a>
                    </li>
                  </ul>
                </div>
              </template>
              <i
                v-else
                :key="index"
                :class="button.classes"
                :title="button.title"
                @click="button.click()"
              ></i>
            </template>
          </div>
        </div>
      </th>
    </template>
  </tr>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

import { iHeaderRow, iHeaderCell } from "types/general";
import GearIcon from "components/gear/gearIcon.vue";
import RelicIcon from "components/relic/relicIcon.vue";

export default defineComponent({
  name: "ColumnHeaders",
  components: { GearIcon, RelicIcon },
  props: {
    header: {
      type: Object as () => iHeaderRow,
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
    handleClick(cell: iHeaderCell, checkClickable?: boolean) {
      if (cell.click) {
        if (checkClickable) {
          cell.click();
        }
      }
    },
    handleInputClick(cell: iHeaderCell, data?: any) {
      if (cell.input?.click) {
        cell.input.click(data);
      }
    },
    handleChange: _.debounce(function (
      this: any,
      cell: iHeaderCell,
      event: KeyboardEvent
    ) {
      if (cell.input?.change && event) {
        cell.input.change((event.target as HTMLInputElement).value);
      }
    },
    500),
  },
});
</script>

<style scoped lang="scss">
.multi-select-container {
  width: 305px;
  margin-left: auto;
  margin-right: 12px;
}

.dropdown-menu {
  padding: 0;
  max-height: 300px;
  overflow: auto;
}
</style>
