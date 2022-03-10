<template>
  <input
    class="form-control form-control-sm"
    type="number"
    v-model.number="owned"
    min="0"
    @keydown="save"
    @change="save"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

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
      owned: unvue(this.salvage.owned),
    };
  },
  methods: {
    save: _.debounce(function (this: any) {
      this.salvage.owned = this.owned;
    }, 1000),
  },
});
</script>

<style lang="scss" scoped></style>
