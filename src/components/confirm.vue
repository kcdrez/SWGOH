<template>
  <div class="modal fade" tabindex="-1" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header" v-if="title">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ text }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('cancel')"
          >
            {{ cancelButtonText }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('confirm')"
          >
            {{ confirmButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal } from "bootstrap";

export default defineComponent({
  name: "ConfirmModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "Are you sure?",
    },
    cancelButtonText: {
      type: String,
      default: "No",
    },
    confirmButtonText: {
      type: String,
      default: "Yes",
    },
  },
  data() {
    return {
      modal: null,
    };
  },
  watch: {
    isOpen(newVal) {
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
  },
  created() {
    this.$nextTick(() => {
      this.modal = new Modal(this.$refs.modal);
      this.toggleModal();
    });
  },
});
</script>