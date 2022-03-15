<template>
  <input
    class="form-control form-control-sm"
    type="number"
    v-model.number="owned"
    min="0"
    max="330"
    @keydown.enter="save"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

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
      owned: unvue(this.unit.ownedShards),
    };
  },
  watch: {
    owned(newVal) {
      if (newVal !== this.unit.ownedShards) {
        this.save();
      }
    },
  },
  methods: {
    save: _.debounce(function (this: any) {
      this.unit.ownedShards = this.owned;
    }, 1000),
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
