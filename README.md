# quicksilver-judge

**Liquid gold for TypeSafe Jev** — staged PR / diff pre-filter.

Ormus use: sit *in front of* a prose Judge (Raven Gold Crew Judge, or a frontier model). Jev runs a speculative fan-out of Nouls + Scores + one Choice (`pass` | `hold` | `escalate`). Code combines; the LLM only writes when you need sentences.

Sibling kits: [aurum-gate](https://github.com/Ormus-Solutions/aurum-gate) · [gold-assay](https://github.com/Ormus-Solutions/gold-assay) · [molten-cascade](https://github.com/Ormus-Solutions/molten-cascade) · [karat-filter](https://github.com/Ormus-Solutions/karat-filter)

## Shape

```
diff text  →  one Jev call (all questions)  →  { verdict, risks[], scores }
```

Mocked by default in tests — no live API in CI.

## License

MIT (c) Ormus Solutions
