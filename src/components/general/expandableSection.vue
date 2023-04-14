<template>
  <div>
    <div class="collapse-header section-header" :class="containerClass">
      <div class="align-items-center d-flex justify-content-center">
        <input
          v-if="options?.input"
          type="text"
          v-model="_inputValue"
          @keypress.enter="onEnter($event)"
          class="form-control form-control-sm"
        />
      </div>
      <h3
        data-bs-toggle="collapse"
        :href="`#${idRef}`"
        :ref="idRef"
        v-if="!options?.input"
      >
        <i
          class="fa fa-chevron-up me-3"
          :class="showing ? 'up' : 'down'"
          aria-hidden="true"
        ></i>
        <div class="d-inline">{{ title }}</div>
      </h3>
      <template v-if="options?.buttons">
        <i
          v-for="button in options.buttons"
          :class="button.classes"
          :title="button.title"
          @click="button.click()"
        ></i>
      </template>
      <div class="toggles-container" v-if="showOptionsContainer">
        <div class="simple-view-container" v-if="options?.toggle">
          <Toggle
            v-model="_toggleValue"
            :onLabel="options?.toggle?.onLabel ?? 'Enabled'"
            :offLabel="options?.toggle?.offLabel ?? 'Disabled'"
          />
        </div>
        <MultiSelect
          v-if="options?.multiSelect"
          class="select-columns"
          :options="options?.multiSelect?.options ?? []"
          :storageKey="idRef + 'Columns'"
          @checked="_selected = $event"
        />
      </div>
    </div>
    <div :id="idRef" :ref="idRef" class="collapse">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { setupEvents } from "utils";
import { iExpandOptions } from "types/general";

export default defineComponent({
  name: "ExpandableSection",
  props: {
    title: {
      type: String,
      required: true,
    },
    idRef: {
      type: String,
      required: true,
    },
    defaultExpand: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object as () => iExpandOptions,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      showing: false,
      _toggleValue: this.options?.toggle?.value ?? false,
      _selected: this.options?.multiSelect?.value ?? [],
      _inputValue: this.options?.input?.value ?? "",
    };
  },
  computed: {
    showOptionsContainer(): boolean {
      return !!this.options?.toggle || !!this.options?.multiSelect;
    },
    containerClass(): string {
      if (this.options?.toggle && this.options?.multiSelect) {
        return "extended-2";
      } else if (this.options?.multiSelect) {
        return "extended-1";
      } else if (this.options?.buttons) {
        return "align-items-center d-flex justify-content-center";
      } else {
        return "";
      }
    },
  },
  watch: {
    _toggleValue(newVal) {
      this.options?.toggle?.change(newVal);
    },
    _selected(newVal) {
      this.options?.multiSelect?.change(newVal);
    },
    _inputValue(newVal) {
      this.options?.input?.change(newVal);
    },
    options(newVal) {
      if (newVal?.input) {
        this._inputValue = newVal?.input.value;
      }
    },
  },
  methods: {
    onEnter(val: any) {
      if (this.options?.input?.onEnter) {
        this.options?.input?.onEnter(val);
      }
    },
  },
  mounted() {
    const el = this.$refs[this.idRef] as HTMLElement;
    if (el) {
      setupEvents(
        el,
        this.idRef,
        this.defaultExpand,
        () => {
          this.showing = true;

          if (this.options?.onShow) {
            this.options.onShow();
          }
        },
        () => {
          this.showing = false;

          if (this.options?.onHide) {
            this.options.onHide();
          }
        }
      );
    } else {
      console.warn("Ref doesnt exist", this.idRef);
    }
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  text-align: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid $light;
  position: sticky;
  top: 56px;
  height: 50px;
  z-index: 10;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    cursor: pointer;
    margin: 0;
  }
  .simple-view-container {
    top: 12.5px;
    right: 280px;
  }
}

.up {
  transition: transform 0.3s;
}
.down {
  transition: transform 0.3s;
  transform: rotate(-180deg);
}
</style>
