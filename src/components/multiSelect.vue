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
    </div>
    <div class="multiselect" v-if="show">
      <ul>
        <li v-for="(option, index) in options" :key="index">
          <input
            type="checkbox"
            :id="index"
            :value="option.value"
            v-model="selected"
          />
          <label :for="index">{{ option.text }}</label>
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
      type: Array,
      validator: (arr: any[]) => {
        return arr.every((x) => {
          return !!x.text && !!x.value;
        });
      },
      required: true,
    },
    label: {
      type: String,
      default: "Select Options",
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
    };
  },
  created() {
    const fullList = this.options.map((x: any) => x.value);
    this.selected = JSON.parse(
      window.localStorage.getItem(this.storageKey) || JSON.stringify(fullList)
    );
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
  watch: {
    selected(val): void {
      this.$emit("checked", val);
      window.localStorage.setItem(this.storageKey, JSON.stringify(val));
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

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
  z-index: 100;

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
  }
}

.overselect {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
