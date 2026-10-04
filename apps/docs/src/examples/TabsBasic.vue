<script setup>
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@headless-kit/vue'

const tabs = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
  { value: 'usage', label: 'Usage' },
]
</script>

<template>
  <TabsRoot default-value="preview" class="hk-tabs-demo">
    <TabsList v-slot="{ props: listProps }">
      <div v-bind="listProps" class="hk-tablist">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          v-slot="{ props: triggerProps }"
          :value="tab.value"
        >
          <button v-bind="triggerProps" class="hk-tab">{{ tab.label }}</button>
        </TabsTrigger>
      </div>
    </TabsList>

    <TabsContent v-slot="{ props: contentProps }" value="preview">
      <div v-bind="contentProps" class="hk-accordion-content">
        Arrow keys move between tabs and select them as focus lands, matching the WAI-ARIA authoring
        practices.
      </div>
    </TabsContent>
    <TabsContent v-slot="{ props: contentProps }" value="code">
      <div v-bind="contentProps" class="hk-accordion-content">
        Set <code>activation-mode="manual"</code> when you would rather move focus first and
        activate with <span class="hk-kbd">Enter</span>.
      </div>
    </TabsContent>
    <TabsContent v-slot="{ props: contentProps }" value="usage">
      <div v-bind="contentProps" class="hk-accordion-content">
        Panels unmount when inactive so lazy content stays cheap.
      </div>
    </TabsContent>
  </TabsRoot>
</template>
