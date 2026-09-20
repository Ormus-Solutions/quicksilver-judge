import { describe, expect, it } from "vitest";
import { combineVerdict, type JudgeAnswers } from "./stages.js";
import { runQuicksilver } from "./run.js";

const clean: JudgeAnswers = {
  secrets_leak: { probability: 0.05 },
  destructive: { probability: 0.02 },
  tests_missing: { probability: 0.2 },
  scope_creep: { probability: 0.1 },
  clarity: { score: 2.4 },
  risk: { score: 0.8 },
  verdict: { choice: "pass", confidence: 0.9 },
};

describe("combineVerdict", () => {
  it("passes clean", () => {
    expect(combineVerdict(clean).verdict).toBe("pass");
  });

  it("forces escalate on secrets", () => {
    const v = combineVerdict({
      ...clean,
      secrets_leak: { probability: 0.95 },
      verdict: { choice: "pass" },
    });
    expect(v.verdict).toBe("escalate");
    expect(v.forced).toBe(true);
  });
});

describe("runQuicksilver", () => {
  it("uses injected evaluate", async () => {
    const out = await runQuicksilver("diff --git a/x", async () => clean);
    expect(out.verdict).toBe("pass");
  });
});
