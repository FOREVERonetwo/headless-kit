<script setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@headless-kit/vue'
</script>

<template>
  <DialogRoot>
    <DialogTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps" class="hk-btn hk-btn-primary">Delete project</button>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay v-slot="{ props: overlayProps }">
        <div v-bind="overlayProps" class="hk-overlay" />
      </DialogOverlay>
      <DialogContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" class="hk-panel" style="max-width: 380px">
          <DialogTitle v-slot="{ props: titleProps }">
            <h2 v-bind="titleProps" style="margin: 0 0 6px; font-size: 17px">Delete project?</h2>
          </DialogTitle>
          <DialogDescription v-slot="{ props: descProps }">
            <p v-bind="descProps" style="margin: 0 0 18px; font-size: 14px">
              This removes every environment and cannot be undone.
            </p>
          </DialogDescription>
          <div style="display: flex; gap: 8px; justify-content: flex-end">
            <DialogClose v-slot="{ props: closeProps }">
              <button v-bind="closeProps" class="hk-btn">Cancel</button>
            </DialogClose>
            <DialogClose v-slot="{ props: closeProps }">
              <button v-bind="closeProps" class="hk-btn hk-btn-primary">Delete</button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
