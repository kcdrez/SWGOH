<template>
  <div tabindex="0" @focusout="handleFocusOut">
    <div
      class="dropdown-multi"
      @click="showDropdown"
      :class="{ 'dropdown-open': show }"
    >
      <div class="overselect"></div>
      <select class="form-control form-control-sm">
        <option value="">{{ label }}</option>
      </select>
      <i
        v-if="showWarning"
        class="fas fa-exclamation-circle text-warning missing-column-warning"
        title="Some columns are currently hidden"
      ></i>
    </div>
    <div class="multiselect" v-if="show">
      <ul>
        <li>
          <input type="checkbox" id="select-all" v-model="selectAll" />
          <label for="select-all"
            >{{ selectAll ? "Deselect" : "Select" }} All</label
          >
        </li>
        <li v-for="(option, index) in options" :key="index">
          <template v-if="option.value">
            <input
              type="checkbox"
              :id="index.toString()"
              :value="option.value"
              v-model="selected"
            />
            <label :for="index.toString()">{{ option.label }}</label>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MultiSelect",
  props: {
    options: {
      type: Array as () => { label: string; value: any }[],
      required: true,
    },
    label: {
      type: String,
      default: "Show/Hide Columns",
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      selected: [],
      selectAll: null,
    } as any;
  },
  computed: {
    showWarning(): boolean {
      return !this.options.every((option: { label: string; value: any }) => {
        return this.selected.some((select: string) => option.value === select);
      });
    },
  },
  watch: {
    selected(val): void {
      this.$emit("checked", val);
      window.localStorage.setItem(this.storageKey, JSON.stringify(val));
    },
    selectAll(newVal): void {
      this.selected = newVal ? this.options.map((x: any) => x.value) : [];
    },
  },
  methods: {
    showDropdown() {
      this.show = !this.show;
    },
    handleFocusOut(e: FocusEvent) {
      if (!e.relatedTarget) {
        this.show = false;
      }
    },
  },
  created() {
    const fullList = this.options.map((x: any) => x.value);
    this.selected = JSON.parse(
      window.localStorage.getItem(this.storageKey) || JSON.stringify(fullList)
    );
    if (this.selected.length === this.options.length) {
      this.selectAll = true;
    }
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.dropdown-multi {
  position: relative;
  cursor: pointer;

  &.dropdown-open {
    select {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.multiselect {
  position: relative;
  z-index: 50;
  text-align: left;

  ul {
    background-color: $light;
    color: $dark;
    border: 1px solid $light;
    border-top: 0;
    border-radius: 0 0 3px 3px;
    padding: 0.25rem 0.5rem;
    position: absolute;
    width: 100%;
    list-style: none;
    max-height: 200px;
    overflow: auto;
  }
  label {
    margin-left: 0.5rem;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
  }
}

.overselect {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.missing-column-warning {
  position: absolute;
  right: 10px;
  top: 25%;
}
</style>
