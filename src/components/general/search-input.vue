<template>
  <div class="position-relative search-input">
    <input
      class="form-control form-control-sm search-text border border-dark"
      type="text"
      :placeholder="placeholder"
      v-model="searchText"
      @focus="showList = true"
      @blur="blur"
      @keypress.enter="enterPress"
    />
    <i class="fas fa-search magnifying-glass"></i>
    <ul class="list-container" v-if="showList">
      <li v-if="filteredList.length === 0" class="no-selection">
        No available selections
      </li>
      <li v-for="item in filteredList" :key="item[id]">
        <div @click="selectItem(item)">{{ item[displayBy] }}</div>
      </li>
    </ul>
    <i class="fas fa-times clear-contents" @click="clear"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SearchInput",
  props: {
    list: {
      type: Array,
      required: true,
    },
    searchBy: {
      type: Array as PropType<string[]>,
      default: (n: any) => {
        return ["name"];
      },
    },
    sortBy: {
      type: String,
      default: "name",
    },
    id: {
      type: String,
      default: "id",
    },
    displayBy: {
      type: String,
      default: "name",
    },
    placeholder: {
      type: String,
      default: "",
    },
    modelValue: {
      // required: true,
    },
  },
  data() {
    return {
      searchText: "",
      showList: false,
    };
  },
  computed: {
    filteredList(): any[] {
      const results = this.list.filter((item: any) => {
        if (this.searchBy.length) {
          return this.searchBy.some((key) => {
            const type = typeof item[key];
            if (type === "string") {
              return item[key]
                .toLowerCase()
                .includes(this.searchText.toLowerCase());
            } else if (Array.isArray(item[key])) {
              return item[key].some((val: string) => {
                return val
                  .toLowerCase()
                  .includes(this.searchText.toLowerCase());
              });
            }
          });
        } else {
          return item.toLowerCase().includes(this.searchText.toLowerCase());
        }
      });

      if (this.sortBy) {
        return results.sort((a: any, b: any) => {
          return a[this.sortBy].toLowerCase() > b[this.sortBy].toLowerCase()
            ? 1
            : -1;
        });
      } else {
        return results;
      }
    },
  },
  methods: {
    selectItem(item: any) {
      this.searchText = item[this.displayBy];
      this.showList = false;
      this.$emit("update:modelValue", item);
    },
    blur() {
      setTimeout(() => {
        this.showList = false;
      }, 300);
    },
    submit(val: any) {
      const match = this.list.find((x: any) => {
        return x[this.displayBy] === val;
      });
      if (match) {
        this.$emit("update:modelValue", match);
      }
    },
    enterPress() {
      if (this.filteredList.length > 0) {
        const selected = this.filteredList[0];
        this.showList = false;
        this.$emit("update:modelValue", selected);
        this.$emit("enterPress", selected);
        this.searchText = "";
      }
    },
    clear() {
      this.showList = false;
      this.searchText = "";
    },
  },
  watch: {
    searchText(newVal) {
      this.submit(newVal);
    },
  },
  created() {
    if (this.modelValue) {
      this.searchText = (this.modelValue as any)[this.displayBy];
    }
  },
});
</script>

<style lang="scss" scoped>
@import "styles/variables.scss";

.list-container {
  background: white;
  color: black;
  list-style: none;
  max-height: 200px;
  overflow: auto;
  position: absolute;
  width: 100%;
  z-index: 100;
  margin: 0;
  padding: 0;

  li {
    padding: 3px 10px;

    &:not(.no-selection):hover {
      background-color: $gray-7;
    }
  }
}

.magnifying-glass,
.clear-contents {
  position: absolute;
  color: $dark;
  top: 7px;
}

.magnifying-glass {
  left: 10px;
}

.clear-contents {
  right: 10px;
  cursor: pointer;

  &:hover {
    transform: scale(1.25);
  }
}

input {
  padding-left: 40px !important;
  padding-right: 40px !important;
}

.search-input {
  flex: 1 1 auto;
}
</style>
