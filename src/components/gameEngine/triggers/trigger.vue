<template>
  <div class="trigger-container">
    <div class="trigger-header">
      <div :title="trigger.srcAbility?.gameText" class="c-help">
        {{ trigger.srcAbility?.name }}
      </div>
      <div
        title="The type of event that will cause this to happen"
        class="c-help"
      >
        {{ trigger.triggerType }}
      </div>
    </div>
    <hr class="bg-dark w-100 mt-0 mb-1" />
    <div
      class="trigger-effect"
      v-for="action in trigger.actions"
      :key="action.id"
    >
      <div>
        <Target :targetData="action.targets" classes="fw-bold" />
      </div>
      <Effect
        v-for="(effect, index) in action.effects"
        :key="index"
        :effect="effect"
      />
    </div>
    <div v-if="trigger.triggerData">
      Limited to
      {{ trigger.triggerData.limit }} per
      {{ trigger.triggerData.frequency }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// import { iTrigger } from "types/gameEngine/gameEngine";
import Effect from "./effect.vue";
import Target from "./target.vue";

export default defineComponent({
  name: "Trigger",
  components: { Effect, Target },
  props: {
    trigger: {
      type: Object as () => any,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss">
@import "styles/variables.scss";

.trigger-container {
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: $light;
  color: $dark;
  border: 1px solid $dark;
  margin-bottom: 0.25rem;
}

.trigger-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.health {
  color: $success-dark-1 !important;
  text-shadow: none !important;
}

// ::v-deep(.target) {
//   color: $primary-dark-1;
// }
</style>
