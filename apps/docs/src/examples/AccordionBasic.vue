<script setup>
import { AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger } from '@headless-kit/vue'

const faqs = [
  {
    value: 'tokens',
    question: 'Does headless-kit ship CSS?',
    answer:
      'No. Primitives render no markup of their own and import no stylesheet. You own every class.',
  },
  {
    value: 'a11y',
    question: 'Who owns accessibility?',
    answer:
      'Primitives own roles, states and keyboard interaction. You own the semantics of your product.',
  },
  {
    value: 'ssr',
    question: 'Can I use it with SSR?',
    answer:
      'Yes. Portal targets resolve on mount, so server rendering produces the inlined markup.',
  },
]
</script>

<template>
  <AccordionRoot type="single" collapsible class="hk-accordion">
    <AccordionItem v-for="faq in faqs" :key="faq.value" :value="faq.value">
      <AccordionTrigger v-slot="{ props: triggerProps }">
        <button v-bind="triggerProps" class="hk-accordion-trigger" :data-hk-accordion>
          {{ faq.question }}
        </button>
      </AccordionTrigger>
      <AccordionContent v-slot="{ props: contentProps }">
        <div v-bind="contentProps" class="hk-accordion-content">{{ faq.answer }}</div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
