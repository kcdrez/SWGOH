<template>
  <div class="item" :id="uniqueKey">
    <div class="header">
      {{ uniqueKey }}
      <i class="fa fa-times" @click="handleDelete"></i>
    </div>
    <div class="my-custom-content">
      Here's a cool table!
      <table
        class="table table-bordered table-dark table-sm table-striped mb-0 swgoh-table"
      >
        <thead>
          <tr>
            <th>Column A</th>
            <th>Column B</th>
            <th>Column C</th>
            <th>Column D</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A1</td>
            <td>A2</td>
            <td>A3</td>
            <td>A4</td>
          </tr>
          <tr>
            <td>B1</td>
            <td>B2</td>
            <td>B3</td>
            <td>B4</td>
          </tr>
        </tbody>
      </table>
    </div>
    <ResizeObserver @notify="handleResize"></ResizeObserver>
  </div>
</template>

<script>
import Modal from "./Modal.vue";

export default {
  name: "WidgetItem",
  components: {
    Modal,
  },
  props: ["uniqueKey"],
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    handleResize() {
      this.$emit("resized");
    },
    handleDelete() {
      this.$emit("delete", this.uniqueKey);
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  position: relative;
  top: 0;
  left: 0;
  background: red;
  width: 100%;
  height: 24px;
  line-height: 24px;
  cursor: move;
  color: black;
  z-index: 1;
  display: flex;
  justify-content: space-between;

  .fa-times {
    cursor: pointer;
    font-size: 24px;
  }
}
.item {
  display: block;
  position: absolute;
  width: auto;
  height: auto;
  margin: 5px;
  z-index: 1;
  background: black;
  color: white;
  overflow: auto;
  resize: both;
  min-width: 100px;
  min-height: 100px;
}
.item.muuri-item-dragging {
  z-index: 3;
}
.item.muuri-item-releasing {
  z-index: 2;
}
.item.muuri-item-hidden {
  z-index: 0;
}
.item-content {
  position: relative;
  /* width: 100%;
  height: 100%; */
  /* overflow: visible; */
}
</style>
