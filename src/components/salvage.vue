<template>
  <div>
    <div class="input-group input-group-sm">
      <span class="input-group-text label-count">Owned:</span>
      <!-- <span class="input-group-text owned-count" v-if="!editing">
        {{ owned }}
      </span> -->
      <input
        class="form-control owned-count"
        type="number"
        v-model.number="owned"
        min="0"
        max="1000"
        @keydown.enter="save"
        ref="saveButton"
        :disabled="!editing"
      />
      <template v-if="editing">
        <button type="button" class="btn btn-success" @click="save">
          <i class="fas fa-save"></i>
        </button>
        <button type="button" class="btn btn-warning" @click="editing = false">
          <i class="fas fa-cancel"></i>
        </button>
      </template>
      <button type="button" class="btn btn-primary" @click="edit" v-else>
        <i class="fas fa-edit"></i>
      </button>
    </div>
    <div class="input-group input-group-sm mt-2">
      <span class="input-group-text label-count">Needed:</span>
      <span class="input-group-text owned-count">{{ salvage.amount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { Gear } from "../api/interfaces";

export default defineComponent({
  name: "Salvage",
  props: {
    salvage: {
      type: Object as () => Gear,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
      owned: 0,
    };
  },
  computed: {
    ...mapGetters(["gearOwnedCount"]),
  },
  methods: {
    save() {
      this.editing = false;
      this.saveOwnedCount({ count: this.owned, base_id: this.salvage.base_id });
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    ...mapActions(["saveOwnedCount"]),
  },
  created() {
    this.owned = this.gearOwnedCount(this.salvage);
  },
});
</script>

<style lang="scss" scoped>
.owned-count {
  width: 100px;
  max-width: 100px;
  min-width: 100px;
}
.label-count {
  width: 75px;
}
</style>
