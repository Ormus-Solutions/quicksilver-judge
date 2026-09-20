# quicksilver-judge

> Fast as mercury, sharp as a raven's eye — stage the risk before you burn a full Judge pass.

**@ormus/quicksilver-judge** is a **staged PR / code pre-filter**: sketch a Noul-style risk matrix, run Choice or Score profiles, emit confidence-gated `PASS` / `HOLD` / `FAIL`. Ormus maps this to the **Raven Judge** shape — cheap first look, expensive review only when the alloy looks impure.

Themes track the public **TypeSafe / Vercel Jev** playbooks and the open **master-Jev** teaching lane (Daniel Ch et al.): structured scores beat vibes; hold when confidence softens.

## Install

```bash
npm i @ormus/quicksilver-judge
```

## Quick pour

```ts
import { prefilter, SCORE_PROFILE } from '@ormus/quicksilver-judge';

prefilter(
  { filesChanged: 12, linesAdded: 400, linesDeleted: 80, touchesAuth: true, hasTestDiff: false },
  0.78,
  SCORE_PROFILE,
);
```

## Liquid Gold siblings

| Repo | Role |
|------|------|
| [aurum-gate](https://github.com/Ormus-Solutions/aurum-gate) | Pattern 2 confidence gates |
| [quicksilver-judge](https://github.com/Ormus-Solutions/quicksilver-judge) | **You are here** — Raven pre-filter |
| [gold-assay](https://github.com/Ormus-Solutions/gold-assay) | Vibium UI proof scorer |
| [molten-cascade](https://github.com/Ormus-Solutions/molten-cascade) | Pattern 4 cascade |
| [karat-filter](https://github.com/Ormus-Solutions/karat-filter) | Pattern 5 + fan-out |
| [liquid-gold](https://github.com/Ormus-Solutions/liquid-gold) | Index |

## Scripts

```bash
npm test
npm run build
```

## License

MIT © 2026 Ormus Solutions
