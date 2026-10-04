import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/getting-started',
    name: 'getting-started',
    component: () => import('./pages/GettingStartedPage.vue'),
  },
  {
    path: '/primitives/disclosure',
    name: 'disclosure',
    component: () => import('./pages/primitives/DisclosurePage.vue'),
  },
  {
    path: '/primitives/accordion',
    name: 'accordion',
    component: () => import('./pages/primitives/AccordionPage.vue'),
  },
  {
    path: '/primitives/tabs',
    name: 'tabs',
    component: () => import('./pages/primitives/TabsPage.vue'),
  },
  {
    path: '/primitives/dialog',
    name: 'dialog',
    component: () => import('./pages/primitives/DialogPage.vue'),
  },
  {
    path: '/primitives/popover',
    name: 'popover',
    component: () => import('./pages/primitives/PopoverPage.vue'),
  },
  {
    path: '/primitives/select',
    name: 'select',
    component: () => import('./pages/primitives/SelectPage.vue'),
  },
  {
    path: '/primitives/tooltip',
    name: 'tooltip',
    component: () => import('./pages/primitives/TooltipPage.vue'),
  },
  {
    path: '/primitives/switch',
    name: 'switch',
    component: () => import('./pages/primitives/SwitchPage.vue'),
  },
  {
    path: '/primitives/checkbox',
    name: 'checkbox',
    component: () => import('./pages/primitives/CheckboxPage.vue'),
  },
  {
    path: '/utility/composition',
    name: 'composition',
    component: () => import('./pages/utility/CompositionPage.vue'),
  },
  {
    path: '/utility/primitives',
    name: 'utility-primitives',
    component: () => import('./pages/utility/UtilityPrimitivesPage.vue'),
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const navigation = [
  {
    title: 'Introduction',
    links: [
      { to: '/', label: 'Overview' },
      { to: '/getting-started', label: 'Getting started' },
    ],
  },
  {
    title: 'Primitives',
    links: [
      { to: '/primitives/disclosure', label: 'Disclosure' },
      { to: '/primitives/accordion', label: 'Accordion' },
      { to: '/primitives/tabs', label: 'Tabs' },
      { to: '/primitives/dialog', label: 'Dialog' },
      { to: '/primitives/popover', label: 'Popover' },
      { to: '/primitives/select', label: 'Select' },
      { to: '/primitives/tooltip', label: 'Tooltip' },
      { to: '/primitives/switch', label: 'Switch' },
      { to: '/primitives/checkbox', label: 'Checkbox' },
    ],
  },
  {
    title: 'Utilities',
    links: [
      { to: '/utility/composition', label: 'Composables' },
      { to: '/utility/primitives', label: 'Presence & Portal' },
    ],
  },
]

export const flatRoutes = routes
  .filter((route) => route.name)
  .map((route) => ({ path: route.path, name: String(route.name) }))

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
