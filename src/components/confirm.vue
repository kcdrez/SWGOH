<template>
  <ModalComponent :isOpen="isOpen" ref="modal">
    <template v-slot:header v-if="title">
      <h5 class="modal-title">{{ title }}</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </template>
    <template v-slot:body>
      <p>{{ text }}</p>
    </template>
    <template v-slot:footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="$emit('cancel')"
      >
        {{ cancelButtonText }}
      </button>
      <button type="button" class="btn btn-primary" @click="confirm">
        {{ confirmButtonText }}
      </button>
    </template>
  </ModalComponent>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ModalComponent from "./modal.vue";

export default defineComponent({
  name: "ConfirmModal",
  components: { ModalComponent },
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
  methods: {
    confirm() {
      (this.$refs as any).modal.hide();
      this.$emit("confirm");
    },
  },
});
</script>
