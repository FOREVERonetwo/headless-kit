<script setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from '@headless-kit/vue'
</script>

<template>
  <DialogRoot>
    <DialogTrigger v-slot="{ props: triggerProps }">
      <button v-bind="triggerProps" class="hk-btn">Sign up</button>
    </DialogTrigger>
    <DialogPortal>
      <DialogContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" class="hk-panel" style="max-width: 380px">
          <DialogTitle v-slot="{ props: titleProps }">
            <h2 v-bind="titleProps" style="margin: 0 0 6px; font-size: 17px">Create an account</h2>
          </DialogTitle>
          <DialogDescription v-slot="{ props: descProps }">
            <p v-bind="descProps" style="margin: 0 0 16px; font-size: 14px">
              Focus lands on the first field when the dialog opens.
            </p>
          </DialogDescription>

          <form style="display: grid; gap: 10px" @submit.prevent>
            <input
              class="hk-btn"
              data-hk-autofocus
              placeholder="you@example.com"
              aria-label="Email address"
            />
            <input class="hk-btn" placeholder="••••••••" aria-label="Password" type="password" />
            <div style="display: flex; justify-content: space-between; align-items: center">
              <span style="font-size: 13px; color: var(--hk-muted)">
                <VisuallyHidden>Form is a demo</VisuallyHidden>
                Nothing is submitted.
              </span>
              <DialogClose v-slot="{ props: closeProps }">
                <button v-bind="closeProps" class="hk-btn hk-btn-primary">Continue</button>
              </DialogClose>
            </div>
          </form>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
