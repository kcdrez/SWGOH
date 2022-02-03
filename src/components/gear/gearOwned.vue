<template>
  <div>
    <div class="input-group input-group-sm">
      <span class="input-group-text label-count">Owned:</span>
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
          <i class="fas fa-ban"></i>
        </button>
      </template>
      <button type="button" class="btn btn-primary" @click="edit" v-else>
        <i class="fas fa-edit"></i>
      </button>
    </div>
    <div class="input-group input-group-sm mt-2">
      <span class="input-group-text label-count">Needed:</span>
      <span class="input-group-text needed-count">{{ salvage.amount }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import { Gear } from "../../types/gear";

export default defineComponent({
  name: "GearOwned",
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
    ...mapGetters("gear", ["gearOwnedCount"]),
  },
  methods: {
    ...mapActions("gear", ["saveOwnedCount"]),
    save() {
      this.editing = false;
      this.saveOwnedCount({ count: this.owned, id: this.salvage.id });
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
  },
  created() {
    this.owned = this.gearOwnedCount(this.salvage);
  },
});
</script>

<style lang="scss" scoped>
.needed-count {
  flex: 1 1 auto;
}
.label-count {
  width: 75px;
}
</style>
