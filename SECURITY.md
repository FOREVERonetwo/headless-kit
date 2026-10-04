# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 0.4.x   | ✅        |
| < 0.4   | ❌        |

The package is pre-1.0, so fixes land on the latest minor only. Anything older should be upgraded
rather than patched.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Use GitHub's private reporting so the details stay confidential until a fix is released:

1. Go to **Security** → **Advisories** → **Report a vulnerability** on
   <https://github.com/headless-kit/headless-kit/security/advisories/new>.
2. Describe the issue, the affected version, and a reproduction if you have one.
3. You will get an acknowledgement within 72 hours and a status update at least every seven days
   until the report is resolved.

## What counts as a vulnerability in this package

`@headless-kit/vue` renders no markup of its own and ships no stylesheet, so the attack surface is
narrow. The issues we treat as vulnerabilities:

- **XSS through slot props.** A part emitting an attribute or value that allows markup injection into
  a consumer's DOM — for example unescaped HTML passed through a `props` object.
- **Focus-trap escape in a way that breaks user isolation.** A focus trap that fails under a
  specific nesting or timing, allowing focus to escape a modal dialog when it should not.
- **Prototype pollution** through any public API accepting an options object.
- **ReDoS** in any regular expression reachable from public input.
- **Dependency compromise** affecting the published artifact.

The following are **not** vulnerabilities here, and should be reported as ordinary issues:

- Accessibility gaps — report them as bugs; they are treated as high priority but not as security
  issues.
- Missing or unexpected styling.
- Screen-reader output differences between vendors.

## Disclosure timeline

| Stage                | Target                       |
| -------------------- | ---------------------------- |
| Acknowledgement      | 72 hours                     |
| Triage and severity  | 7 days                       |
| Fix and release      | 30 days, or sooner if severe |
| Public advisory      | On release                   |

If a report is declined we will explain why, and we welcome a follow-up if we have misunderstood the
issue.

## What we will not do

- We will not ask you to keep a vulnerability undisclosed beyond the timeline above.
- We will not require a signed NDA for a good-faith report.
- We will not publish your name without permission.