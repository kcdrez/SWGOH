<template>
  <div class="input-group input-group-sm">
    <span class="input-group-text label-count">Priority:</span>
    <input
      class="form-control owned-count"
      type="number"
      v-model.number="priority"
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
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";

import { unvue } from "../../utils";
import { Unit } from "../../types/unit";

export default defineComponent({
  name: "ShardPriority",
  props: {
    unit: {
      required: true,
      type: Object as PropType<Unit>,
    },
  },
  data() {
    return {
      editing: false,
      priority: 0,
    };
  },
  computed: {
    ...mapState("shards", ["ownedShards"]),
  },
  methods: {
    ...mapActions("shards", ["saveShardsCount"]),
    save() {
      this.editing = false;
      const payload: any = { id: this.unit.id };
      if (this.priority > 0) {
        payload.tracking = true;
        payload.priority = this.priority;
      }
      this.saveShardsCount(payload);
    },
    edit() {
      this.editing = true;
      this.$nextTick(() => {
        (this.$refs?.saveButton as any).focus();
      });
    },
    cancel() {
      this.editing = false;
      if (this.ownedShards[this.unit.id]?.priority) {
        this.priority = unvue(this.ownedShards[this.unit.id]?.priority);
      } else if (this.ownedShards[this.unit.id]?.tracking) {
        this.priority = 1;
      }
    },
  },
  created() {
    this.cancel();
  },
});
</script>
