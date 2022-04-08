<template>
  <button class="btn btn-sm btn-primary" @click="addWidget">Add Widget</button>
  <div class="widget-grid">
    <WidgetItem
      v-for="(key, index) in keys"
      :key="key"
      :uniqueKey="key"
      ref="widgets"
      @delete="handleDelete(index, key)"
      @resized="handleResize"
    />
  </div>
</template>

<script>
import Muuri from "muuri";
import WidgetItem from "./WidgetItem";

export default {
  name: "GridComponent",
  components: {
    WidgetItem,
  },
  data() {
    return {
      grid: null,
      keys: [],
      showDebug: false,
      layout: JSON.parse(window.localStorage.getItem("layout") || "[]"),
    };
  },
  methods: {
    handleResize() {
      this.grid.refreshItems();
      this.grid.layout();
      this.saveLayout();
    },
    handleDelete(index, id) {
      this.keys.splice(index, 1);
      this.grid.remove(this.grid.getItems(index), { removeElements: true });
      this.saveLayout();
    },
    saveLayout() {
      const itemOrder = this.grid.getItems().map((item) => {
        return {
          id: item.getElement().getAttribute("id"),
          height: item.getHeight(),
          width: item.getWidth(),
        };
      });
      window.localStorage.setItem("layout", JSON.stringify(itemOrder));
    },
    loadLayout(gridLayout) {
      let currentItems = this.grid.getItems();
      let newItems = [];
      let itemId;
      let itemIndex;

      for (let i = 0; i < gridLayout.length; i++) {
        //Get the ID we are looking for, find the index of item, get the actual item
        itemId = gridLayout[i].id;
        itemIndex = currentItemIds.indexOf(itemId);
        if (itemIndex > -1) {
          let item = currentItems[itemIndex];
          // item._width = gridLayout[i].height;
          item.getElement().style.height = gridLayout[i].height + "px";
          item.getElement().style.width = gridLayout[i].width + "px";
          newItems.push(item);
        }
      }
      this.grid.sort(newItems, { layout: "instant" });
      this.grid.refreshItems();
      this.grid.layout();
    },
    addWidget() {
      const key = "item" + this.keys.length;
      this.keys.push(key);
      this.$nextTick(() => {
        const element = this.$refs.widgets[this.keys.length - 1].$el;
        this.grid.add(element);
        this.saveLayout();
      });
    },
  },
  mounted() {
    this.grid = new Muuri(".widget-grid", {
      dragEnabled: true,
      dragHandle: ".header",
    }).on("move", () => {
      console.log("moving");
      this.saveLayout();
    });
    let layout = JSON.parse(window.localStorage.getItem("layout") || "[]");
    if (layout.length > 0) {
      this.loadLayout(layout);
    } else {
      this.grid.layout(true);
      this.saveLayout();
    }
  },
  created() {
    this.keys = this.layout.map((x) => x.id);
  },
};
</script>

<style lang="scss" scoped>
.widget-grid {
  position: relative;
}
</style>
