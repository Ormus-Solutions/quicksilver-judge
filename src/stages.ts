/** Question defs for one speculative Jev call over a diff. */
export function buildJudgeQuestions() {
  return {
    secrets_leak: {
      type: "boolean" as const,
      instructions: "The diff introduces secrets, tokens, or private keys in plaintext",
    },
    destructive: {
      type: "boolean" as const,
      instructions: "The diff performs destructive ops (drop table, force-push docs, mass delete)",
    },
    tests_missing: {
      type: "boolean" as const,
      instructions: "Behavior changed without corresponding test changes",
    },
    scope_creep: {
      type: "boolean" as const,
      instructions: "The diff mixes unrelated concerns beyond the stated intent",
    },
    clarity: {
      type: "score" as const,
      instructions: "How clear is the change intent from the diff alone",
      criteria: ["Opaque", "Guessable", "Clear", "Crystal"],
    },
    risk: {
      type: "score" as const,
      instructions: "Operational risk if this ships as-is",
      criteria: ["Cosmetic", "Contained", "User-facing breakage", "Data or security risk"],
    },
    verdict: {
      type: "choice" as const,
      instructions: "Machine verdict for a downstream prose Judge",
      criteria: {
        pass: "Safe to auto-advance to light review",
        hold: "Needs human or deeper LLM review before merge",
        escalate: "Stop — secrets, destructive, or high risk",
      },
    },
  };
}

export type JudgeAnswers = {
  secrets_leak: { probability: number };
  destructive: { probability: number };
  tests_missing: { probability: number };
  scope_creep: { probability: number };
  clarity: { score: number };
  risk: { score: number };
  verdict: { choice: "pass" | "hold" | "escalate"; confidence?: number };
};

export type Verdict = {
  verdict: "pass" | "hold" | "escalate";
  forced: boolean;
  flags: string[];
};

/** Code owns overrides — Jev Choice is advisory when hard flags fire. */
export function combineVerdict(a: JudgeAnswers, escalateAt = 0.7): Verdict {
  const flags: string[] = [];
  if (a.secrets_leak.probability >= escalateAt) flags.push("secrets_leak");
  if (a.destructive.probability >= escalateAt) flags.push("destructive");
  if (a.risk.score >= 2.5) flags.push("high_risk_score");

  if (flags.length) {
    return { verdict: "escalate", forced: true, flags };
  }
  return { verdict: a.verdict.choice, forced: false, flags };
}
