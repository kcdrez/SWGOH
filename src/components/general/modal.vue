<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header" v-if="$slots.header" />
        </div>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer" v-if="$slots.footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "Modal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      modal: null,
    };
  },
  watch: {
    isOpen() {
      this.toggleModal();
    },
  },
  methods: {
    toggleModal() {
      if (this.isOpen) {
        (this.modal as any).show();
      } else {
        (this.modal as any).hide();
      }
    },
    hide() {
      (this.modal as any).hide();
    },
  },
  created() {
    this.$nextTick(() => {
      this.modal = new Modal(this.$refs.modal);
      this.toggleModal();
    });
  },
});
</script>
