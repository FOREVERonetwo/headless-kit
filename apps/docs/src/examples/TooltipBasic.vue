<script setup>
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from '@headless-kit/vue'
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <TooltipRoot v-for="item in ['Build', 'Deploy', 'Rollback']" :key="item">
      <TooltipTrigger v-slot="{ props: triggerProps }">
        <button v-bind="triggerProps" class="hk-btn">{{ item }}</button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent v-slot="{ props: contentProps }">
          <div v-bind="contentProps" class="hk-tooltip">
            Runs the {{ item.toLowerCase() }} job on the selected branch.
            <TooltipArrow v-slot="{ props: arrowProps }">
              <span v-bind="arrowProps" class="hk-tooltip-arrow" />
            </TooltipArrow>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
