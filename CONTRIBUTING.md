# Contributing to headless-kit

Thanks for taking the time. This document covers the mechanics of contributing; the design intent is
described in [README.md](./README.md) and per-primitive docs.

## Getting set up

Requires Node 18.18+ (20 recommended) and npm 9+.

```bash
git clone https://github.com/FOREVERonetwo/headless-kit.git
cd headless-kit
npm install
npm run check
```

`npm run check` runs lint, formatting, tests and both builds. It is exactly what CI runs, so a green
local run means a green pull request.

To work on the docs site:

```bash
npm run dev
```

## Where things live

| Path                    | Contents                                                       |
| ----------------------- | -------------------------------------------------------------- |
| `packages/headless/src/primitives/<name>/index.js` | One file per primitive family: context, parts, exports |
| `packages/headless/src/utils/`  | Composable building blocks shared by primitives      |
| `packages/headless/src/internal/`| Pure helpers: positioning math, vnode collection     |
| `packages/headless/test/`| Vitest suites, one file per group of primitives   |
| `apps/docs/src/`        | Documentation site, one page per primitive            |

## Commit convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(tabs): support manual activation mode
fix(select): keep active descendant in sync with the registry
docs(dialog): document initialFocus
refactor(utils): extract useDismiss layer stack
test(accordion): cover arrow key navigation
chore(deps): bump vite to 6.0.7
```

Allowed scopes are the primitive names, `utils`, `docs`, `ci`, `deps` and `release`. A PR title
becomes the squash-merge commit message, so please use the convention there too.

## Pull requests

1. Open an issue first for anything beyond a bug fix, so the approach can be agreed on before you
   spend time on it.
2. Branch from `main`.
3. Keep the diff focused. Unrelated refactors in a feature PR make review harder, not easier.
4. Add or update tests for any behaviour change.
5. Update the docs page for the primitive you touched, including the props table.
6. Add a line to `CHANGELOG.md` under the *Unreleased* heading.

### What a review will look for

- **Tests.** New behaviour needs a test that fails without the fix. Bug fixes should come with a
  regression test.
- **No markup.** A part must render only its default slot. If you find yourself adding an `h('div')`
  to a primitive, it probably belongs in the docs example instead.
- **No styles.** The package must not import or inject any stylesheet, and must not read a
  stylesheet at runtime except to detect running animations for `Presence`.
- **Accessibility.** Roles and aria wiring belong in the primitive, not in the consumer. If you add a
  new part, add a test that asserts the attributes it is responsible for.
- **Composition.** Prefer building on the existing composables over adding new one-off logic. If a
  behaviour is needed twice, it belongs in `src/utils/`.

## Testing

```bash
npm run test                # once
npm run test:watch          # watch mode
npm run coverage            # with v8 coverage report in packages/headless/coverage
```

Tests run in jsdom. Focus, keyboard and pointer behaviour is asserted against real DOM events —
there are no shallow stubs. Note that `Presence` releases nodes after two animation frames, so tests
that assert on unmounting need to await frames:

```js
for (let i = 0; i < 3; i += 1) {
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await nextTick()
}
```

### Reproducing an accessibility issue

If you are reporting a screen reader or keyboard problem, please include:

- the primitive and part,
- the exact markup (a docs example or a minimal reproduction is ideal),
- what you expected and what happened instead,
- the browser, screen reader and version.

A failing test in a PR is the fastest possible route to a fix.

## Reporting bugs

Use the **Bug report** issue template. The most useful bug reports include a reproduction — a
CodeSandbox or a small local branch both work.

## Code of conduct

Participation is governed by [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

By contributing you agree that your contributions are licensed under the
[MIT license](./LICENSE).