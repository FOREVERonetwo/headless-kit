# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions below 1.0.0 may
include breaking changes in minor releases; each one is called out in the entry.

## [Unreleased]

### Added

- Nothing yet.

## [0.4.0] - 2026-02-18

### Added

- `Select` primitive with `aria-activedescendant` navigation, typeahead with native-style cycling,
  and option collection from the slot's vnode tree so the trigger label resolves before the list is
  ever mounted.
- `SelectItemText` and `SelectHiddenInput` parts for runtime labels and plain form submission.
- `CheckboxRoot` array mode for multi-select, driven by the shape of the value.
- `CheckboxIndicator` `forceMount` prop.

### Fixed

- Dismissal on an outside press ignored clicks inside the overlay content, so pressing a button
  inside a dialog closed it.
- `useControllableState` captured the value of `modelValue` at setup time instead of tracking it, so
  controlled primitives stopped reacting to prop updates.
- Nested overlays could both react to a single Escape press. Dismissal now runs through a shared
  layer stack and only the top-most layer responds.
- `usePresence` kept exiting nodes mounted forever when no `<Transition>` was present. It now
  releases the node once no CSS animation is running.
- `useTypeahead` did not cycle through options sharing the same first letter.
- Positioning ignored reactive `placement` and `offset` props.

## [0.3.0] - 2026-01-27

### Added

- `Dialog`, `Popover` and `Tooltip` primitives with dependency-free positioning (`computePosition`),
  flipping and viewport clamping.
- `*Portal` parts so overlay content can escape overflow contexts.
- `TooltipProvider` with a shared open delay so sibling tooltips open instantly.
- `useDismiss`, `useFocusTrap` and `useScrollLock` composables, exported publicly.

### Changed

- Scroll locking is reference counted, so closing one layer no longer unlocks the page while another
  is still open.

## [0.2.0] - 2026-01-12

### Added

- `Tabs` primitive with roving focus and automatic / manual activation modes.
- `Presence` and `VisuallyHidden` parts.
- Documentation site with live examples sourced from the same files used in tests.

## [0.1.0] - 2025-12-18

### Added

- Initial release: `Disclosure`, `Accordion`, `Switch`.
- `useControllableState`, `createContext`, `useId`, `mergeRefs`, `useEventListener`.

[Unreleased]: https://github.com/headless-kit/headless-kit/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/headless-kit/headless-kit/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/headless-kit/headless-kit/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/headless-kit/headless-kit/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/headless-kit/headless-kit/releases/tag/v0.1.0