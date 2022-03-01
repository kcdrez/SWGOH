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
        <button type="button" class="btn btn-warning" @click="cancel">
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

import { unvue } from "../../utils";
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
      owned: unvue(this.salvage.owned),
    };
  },
  methods: {
    save() {
      this.editing = false;
      this.salvage.owned = this.owned;
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    cancel() {
      this.editing = false;
      this.owned = unvue(this.salvage.owned);
    },
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

@media only screen and (max-width: 600px) {
  .owned-count,
  .needed-count {
    text-align: center;
    display: block;
  }
}
</style>
