<template>
  <!-- <button class="btn btn-sm btn-primary" @click="addWidget">Add Widget</button> -->
  <div class="input-group input-group-sm">
    <UnitSearch
      @select="searchUnit = $event"
      placeholder="Find Unit"
      :list="player.units"
    />
    <button
      class="btn btn-primary"
      type="button"
      @click="addWidget(searchUnit.id, 'unitData', searchUnit.id)"
    >
      Search
    </button>
  </div>
  <div class="widget-grid">
    <WidgetItem
      v-for="(key, index) in keys"
      :key="key.id"
      :uniqueKey="key.id"
      :type="key.type"
      :componentData="key.data"
      ref="widgets"
      @delete="handleDelete(index, key)"
      @resized="handleResize"
    />
  </div>
</template>

<script lang="ts">
import Muuri from "muuri";
import { defineComponent } from "vue";
import { mapState } from "vuex";

import WidgetItem from "./WidgetItem.vue";
import UnitSearch from "../units/unitSearch.vue";
import { Unit } from "../../types/unit";

interface dataModel {
  grid: null | Muuri;
  keys: { id: string; type: string; data: any }[];
  showDebug: boolean;
  layout: any[];
  searchUnit: null | Unit;
}

export default defineComponent({
  name: "GridComponent",
  components: {
    WidgetItem,
    UnitSearch,
  },
  data() {
    return {
      grid: null,
      keys: [],
      showDebug: false,
      layout: JSON.parse(window.localStorage.getItem("layout") || "[]"),
      searchUnit: null,
    } as dataModel;
  },
  computed: {
    ...mapState("player", ["player"]),
  },
  methods: {
    handleResize(): void {
      if (this.grid) {
        this.grid.refreshItems();
        this.grid.layout();
        this.saveLayout();
      }
    },
    handleDelete(index: number, id: string): void {
      this.keys.splice(index, 1);
      this.grid?.remove(this.grid.getItems(index), { removeElements: true });
      this.saveLayout();
    },
    saveLayout(): void {
      const itemOrder = this.grid?.getItems().map((item: any) => {
        const id = item.getElement().getAttribute("id");
        const key = this.keys.find((x) => x.id === id);
        return {
          id,
          height: item.getHeight(),
          width: item.getWidth(),
          data: key?.data ?? null,
          type: key?.type ?? "unitData",
        };
      });
      window.localStorage.setItem("layout", JSON.stringify(itemOrder));
    },
    loadLayout(gridLayout: any) {
      let currentItems = this.grid?.getItems();
      let newItems: any[] = [];
      let itemId;
      let itemIndex;

      // for (let i = 0; i < gridLayout.length; i++) {
      //   //Get the ID we are looking for, find the index of item, get the actual item
      //   itemId = gridLayout[i].id;
      //   itemIndex = currentItemIds.indexOf(itemId);
      //   if (itemIndex > -1) {
      //     let item = currentItems[itemIndex];
      //     // item._width = gridLayout[i].height;
      //     item.getElement().style.height = gridLayout[i].height + "px";
      //     item.getElement().style.width = gridLayout[i].width + "px";
      //     newItems.push(item);
      //   }
      // }
      this.grid?.sort(newItems, { layout: "instant" });
      this.grid?.refreshItems();
      this.grid?.layout();
    },
    addWidget(id: string, type: string, data: any) {
      this.keys.push({ id, type, data });
      this.$nextTick(() => {
        const element = (this.$refs.widgets as any)[this.keys.length - 1].$el;
        this.grid?.add(element);
        this.saveLayout();
      });
    },
  },
  mounted() {
    this.grid = new Muuri(".widget-grid", {
      dragEnabled: true,
      dragHandle: ".header",
    }).on("move", () => {
      this.saveLayout();
    });
    if (this.layout.length > 0) {
      this.loadLayout(this.layout);
    } else {
      this.grid.layout(true);
      this.saveLayout();
    }
  },
  created() {
    this.keys = this.layout.map((x) => {
      return { id: x.id, type: x.type, data: x.data };
    });
  },
});
</script>

<style lang="scss" scoped>
.widget-grid {
  position: relative;
}
</style>
