<script setup>
import {
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from '@headless-kit/vue'
</script>

<template>
  <PopoverRoot placement="bottom">
    <PopoverTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps" class="hk-btn">Deployment</button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" class="hk-panel" style="max-width: 280px; padding: 12px 14px">
          <strong style="font-size: 13px">production · main</strong>
          <p style="margin: 4px 0 0; font-size: 13px">
            Deployed 4 minutes ago by the release workflow.
          </p>
          <PopoverArrow v-slot="{ props: arrowProps }">
            <span v-bind="arrowProps" class="hk-popover-arrow" />
          </PopoverArrow>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
