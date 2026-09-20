/**
 * @ormus/quicksilver-judge — staged PR/code pre-filter (Raven Judge shape).
 * Cheap Choice/Score Noul pass before expensive full review.
 */

export type JudgeVerdict = 'PASS' | 'HOLD' | 'FAIL';

export type RiskAxis = 'security' | 'correctness' | 'style' | 'breaking' | 'secrets';

export interface RiskScore {
  axis: RiskAxis;
  score: number;
  note?: string;
}

export interface PrSlice {
  filesChanged: number;
  linesAdded: number;
  linesDeleted: number;
  touchesAuth?: boolean;
  touchesDeps?: boolean;
  hasTestDiff?: boolean;
  labels?: string[];
}

export interface JudgeProfile {
  name: 'choice' | 'score';
  holdAbove: number;
  failAxisAbove: number;
  minConfidence: number;
  axes: RiskAxis[];
}

export interface JudgeInput {
  pr: PrSlice;
  risks: RiskScore[];
  confidence: number;
  profile?: JudgeProfile;
}

export interface JudgeResult {
  verdict: JudgeVerdict;
  aggregateRisk: number;
  confidence: number;
  profile: string;
  triggeredAxes: RiskAxis[];
  reason: string;
}

export const CHOICE_PROFILE: JudgeProfile = {
  name: 'choice',
  holdAbove: 0.45,
  failAxisAbove: 0.85,
  minConfidence: 0.7,
  axes: ['security', 'secrets', 'breaking', 'correctness'],
};

export const SCORE_PROFILE: JudgeProfile = {
  name: 'score',
  holdAbove: 0.55,
  failAxisAbove: 0.9,
  minConfidence: 0.65,
  axes: ['security', 'correctness', 'style', 'breaking', 'secrets'],
};

export function sketchRisks(pr: PrSlice): RiskScore[] {
  const risks: RiskScore[] = [];
  const churn = pr.linesAdded + pr.linesDeleted;
  risks.push({
    axis: 'correctness',
    score: Math.min(1, churn / 800 + (pr.hasTestDiff ? 0 : 0.15)),
    note: pr.hasTestDiff ? 'tests touched' : 'no test diff',
  });
  risks.push({
    axis: 'breaking',
    score: pr.touchesDeps ? 0.55 : Math.min(0.4, pr.filesChanged / 40),
  });
  risks.push({
    axis: 'security',
    score: pr.touchesAuth ? 0.7 : 0.15,
  });
  risks.push({
    axis: 'secrets',
    score: pr.labels?.includes('credentials') ? 0.9 : 0.05,
  });
  risks.push({
    axis: 'style',
    score: Math.min(0.5, pr.filesChanged / 60),
  });
  return risks;
}

export function judge(input: JudgeInput): JudgeResult {
  const profile = input.profile ?? CHOICE_PROFILE;
  const relevant = input.risks.filter((r) => profile.axes.includes(r.axis));
  const aggregateRisk =
    relevant.length === 0
      ? 0
      : relevant.reduce((s, r) => s + r.score, 0) / relevant.length;

  const hot = relevant.filter((r) => r.score >= profile.failAxisAbove).map((r) => r.axis);

  if (hot.length > 0) {
    return {
      verdict: 'FAIL',
      aggregateRisk,
      confidence: input.confidence,
      profile: profile.name,
      triggeredAxes: hot,
      reason: `Hard axis breach: ${hot.join(', ')}`,
    };
  }

  if (input.confidence < profile.minConfidence) {
    return {
      verdict: 'HOLD',
      aggregateRisk,
      confidence: input.confidence,
      profile: profile.name,
      triggeredAxes: relevant.filter((r) => r.score >= profile.holdAbove).map((r) => r.axis),
      reason: `Confidence ${input.confidence.toFixed(3)} < ${profile.minConfidence}`,
    };
  }

  if (aggregateRisk >= profile.holdAbove) {
    return {
      verdict: 'HOLD',
      aggregateRisk,
      confidence: input.confidence,
      profile: profile.name,
      triggeredAxes: relevant.filter((r) => r.score >= 0.4).map((r) => r.axis),
      reason: `Aggregate risk ${aggregateRisk.toFixed(3)} >= hold ${profile.holdAbove}`,
    };
  }

  return {
    verdict: 'PASS',
    aggregateRisk,
    confidence: input.confidence,
    profile: profile.name,
    triggeredAxes: [],
    reason: 'Within Choice/Score risk envelope',
  };
}

export function prefilter(pr: PrSlice, confidence: number, profile?: JudgeProfile): JudgeResult {
  return judge({ pr, risks: sketchRisks(pr), confidence, profile });
}
