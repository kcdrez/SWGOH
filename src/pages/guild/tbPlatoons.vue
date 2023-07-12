<template>
  <div class="container swgoh-page">
    <div class="row">
      <div class="col">
        <Loading
          :state="loading"
          message="Loading Guild Data"
          size="lg"
          displayText="Please wait...This may take a few minutes."
        >
        </Loading>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from "lodash";
import { defineComponent } from "vue";
import { mapActions, mapState } from "vuex";

import { loadingState } from "types/loading";
import { apiClient } from "../../api/api-client";
import { maxRelicLevel } from "types/relic";
import { iHeaderCell, iTableBody, iTableHead } from "types/general";

interface dataModel {
  loading: loadingState;
}

const storageKey = "TBPlatoons";

export default defineComponent({
  name: "TBPlatoons",
  data() {
    return {
      loading: loadingState.initial,
    } as dataModel;
  },
  computed: {
    ...mapState("guild", ["guildId"]),
    fetchGuildId() {
      return this.guildId || this.$route.params.guildId;
    },
    header(): iTableHead {
      return {
        headers: [],
      };
    },
    body(): iTableBody {
      return {
        rows: [],
      };
    },
  },
  methods: {
    ...mapActions("guild", ["fetchGuildUnitData"]),
  },
  async created() {},
});
</script>

<style lang="scss" scoped>
::v-deep(tr) {
  td:first-child {
    vertical-align: top;
    .sticky-name {
      position: sticky;
      top: 65px;
    }
  }
}
</style>
