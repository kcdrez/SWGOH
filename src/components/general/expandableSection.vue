<template>
  <div>
    <div
      class="collapse-header section-header"
      :class="containerClass"
      :style="{ zIndex: options?.zIndex ?? 10 }"
    >
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
        :class="options.header?.classes"
        v-if="!options?.input"
      >
        <i
          class="fa fa-chevron-up mx-2"
          :class="showing ? 'up' : 'down'"
          aria-hidden="true"
        ></i>
        <div class="d-inline me-2">{{ title }}</div>
      </h3>
      <div v-if="options?.buttons">
        <i
          v-for="button in options.buttons"
          :class="button.classes"
          :title="button.title"
          @click="button.click()"
        ></i>
      </div>
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

.section-header,
.col-header {
  position: relative;
  .select-columns {
    position: absolute;
    top: 0;
    right: 1rem;
    width: 250px;
    margin-top: 0.5rem;
    text-align: left;
  }
  h3 {
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-word;
  }
  @media only screen and (max-width: 1100px) {
    & {
      padding-bottom: 0;

      .select-columns {
        position: unset;
        width: 100%;
        padding: 0 0.25rem;
        margin: 0.5rem 0 0;
      }
      &.extended-1,
      &.extended-2 {
        flex-direction: column;

        .toggles-container {
          display: flex;
          align-items: center;
          padding: 0.25rem 0.5rem 0 0.5rem;
          width: 100%;
        }
        .simple-view-container {
          position: unset;
        }
        .select-columns {
          padding: 0;
          margin: 0 0 0 0.5rem;
        }
      }
    }
  }
  @media only screen and (max-width: 600px) {
    &.extended-1 {
      // height: 83px;
    }
    &.extended-2 {
      // height: 112px;

      .toggles-container {
        display: block;
      }
      .simple-view-container {
        position: unset;
      }
      .select-columns {
        padding: 0;
        margin: 0.25rem 0 0 0;
      }
    }
  }
}

.section-header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  text-align: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid $light;
  position: sticky;
  min-height: 50px;

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
