<template>
  <div class="position-relative search-input">
    <input
      class="form-control form-control-sm search-text"
      type="text"
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchInput",
  props: {
    list: {
      type: Array,
      required: true,
    },
    searchBy: {
      type: String,
      default: "name",
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
        if (this.searchBy) {
          return item[this.searchBy]
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
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
      this.searchText = item[this.searchBy];
      this.showList = false;
      this.$emit("select", item);
    },
    blur() {
      setTimeout(() => {
        this.showList = false;
      }, 300);
    },
    submit(val: any, clearSelection: boolean) {
      const match = this.list.find((x: any) => {
        return x[this.searchBy] === val;
      });
      if (match) {
        this.$emit("select", match);
      } else if (clearSelection) {
        this.$emit("select", null);
      }
    },
    enterPress() {
      if (this.filteredList.length > 0) {
        const selected = this.filteredList[0];
        this.showList = false;
        this.$emit("select", selected);
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
      this.submit(newVal, true);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.list-container {
  background: white;
  color: black;
  list-style: none;
  max-height: 200px;
  overflow: auto;
  position: absolute;
  width: 100%;
  z-index: 100;

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
}
</style>
