<template>
  <div class="position-relative">
    <input
      class="form-control form-control-sm"
      type="text"
      v-model="searchText"
      @focus="showList = true"
      @blur="blur"
    />
    <i class="fas fa-search magnifying-glass"></i>
    <ul class="list-container" v-if="showList">
      <li v-for="item in filteredList" :key="item[id]">
        <div @click="selectItem(item)">{{ item[displayBy] }}</div>
      </li>
    </ul>
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
  },
});
</script>

<style lang="scss">
@import "../styles/variables.scss";

.list-container {
  background: white;
  color: black;
  list-style: none;
  max-height: 200px;
  overflow: auto;
  position: absolute;
  width: 100%;

  li {
    padding: 3px 10px;

    &:hover {
      background-color: $gray-7;
    }
  }
}

.magnifying-glass {
  position: absolute;
  color: $dark;
  left: 10px;
  top: 7px;
}

input {
  padding-left: 40px;
}
</style>
