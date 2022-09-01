<template>
  <div class="input-group input-group-sm">
    <span class="input-group-text row-label">Amount Owned:</span>
    <input
      class="form-control form-control-sm"
      type="number"
      v-model.number="owned"
      min="0"
      @keydown="save"
      @change="save"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import _ from "lodash";

import { unvue } from "utils";
import { Relic } from "types/relic";

export default defineComponent({
  name: "RelicOwned",
  props: {
    item: {
      type: Object as () => Relic,
      required: true,
    },
  },
  data() {
    return {
      owned: unvue(this.item.owned),
    };
  },
  methods: {
    save: _.debounce(function (this: any) {
      this.item.owned = this.owned;
    }, 1000),
  },
});
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 769px) {
  input {
    border-radius: 0.2rem !important;
  }
}
</style>
