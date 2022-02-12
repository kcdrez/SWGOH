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
      <span
        class="input-group-text label-count c-help"
        title="The remaining shards needed to get this character to 7 stars"
        >Remaining:</span
      >
      <span class="input-group-text remaining-count">{{ remaining }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { Unit } from "../../types/unit";
import { unvue } from "../../utils";

export default defineComponent({
  name: "ShardsOwned",
  props: {
    unit: {
      type: Object as () => Unit,
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
    ...mapState("shards", ["ownedShards"]),
    ...mapGetters("shards", ["remainingShards"]),
    remaining(): number {
      return (
        this.remainingShards(this.unit) -
        (this.ownedShards[this.unit.id]?.owned || 0)
      );
    },
  },
  methods: {
    ...mapActions("shards", ["saveShardsCount"]),
    save() {
      this.editing = false;
      this.saveShardsCount({ count: this.owned, id: this.unit.id });
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    cancel() {
      this.editing = false;
      this.owned = unvue(this.ownedShards[this.unit.id]?.owned) || 0;
    },
  },
  created() {
    this.cancel();
  },
});
</script>

<style lang="scss" scoped>
.remaining-count {
  flex: 1 1 auto;
}
.label-count {
  width: 90px;
}
</style>
