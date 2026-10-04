## What this changes

<!-- One or two sentences. Link the issue it closes: Closes #123 -->

## Why

<!-- The problem this solves. If it fixes a bug, say what was broken and how you reproduced it. -->

## How

<!-- The approach, and any trade-offs you are accepting. -->

## Type of change

- [ ] Bug fix
- [ ] New primitive or part
- [ ] Behaviour change to an existing primitive
- [ ] Accessibility improvement
- [ ] Documentation
- [ ] Refactor with no behaviour change
- [ ] Build, tooling or dependency change

## Checklist

- [ ] `npm run check` passes locally (lint, formatting, tests, builds)
- [ ] Added or updated tests that fail without this change
- [ ] New behaviour is covered by assertions on roles, `aria-*` wiring, keyboard handling or focus movement
- [ ] Updated the docs page for the primitive I touched, including the props table
- [ ] Added an entry to `CHANGELOG.md` under *Unreleased*
- [ ] No stylesheet added or imported by the package
- [ ] No markup rendered by a primitive beyond its default slot
- [ ] PR title follows Conventional Commits (`feat(tabs): …`)

## Accessibility

<!--
If this change touches roles, keyboard handling or focus, describe what you verified:
screen reader output, keyboard walkthrough, or the specific tests added.
-->