import { describe, it, expect } from 'vitest';
import { judge, prefilter, sketchRisks, CHOICE_PROFILE, SCORE_PROFILE } from './index.js';

describe('quicksilver-judge', () => {
  it('PASSes low-risk PRs with enough confidence', () => {
    const r = prefilter(
      { filesChanged: 2, linesAdded: 20, linesDeleted: 5, hasTestDiff: true },
      0.9,
      CHOICE_PROFILE,
    );
    expect(r.verdict).toBe('PASS');
  });

  it('HOLDs when confidence is low', () => {
    const r = prefilter(
      { filesChanged: 2, linesAdded: 10, linesDeleted: 0, hasTestDiff: true },
      0.4,
    );
    expect(r.verdict).toBe('HOLD');
  });

  it('FAILs on secrets/credentials axis', () => {
    const risks = sketchRisks({
      filesChanged: 1,
      linesAdded: 5,
      linesDeleted: 0,
      labels: ['credentials'],
    });
    const r = judge({
      pr: { filesChanged: 1, linesAdded: 5, linesDeleted: 0 },
      risks,
      confidence: 0.95,
      profile: CHOICE_PROFILE,
    });
    expect(r.verdict).toBe('FAIL');
    expect(r.triggeredAxes).toContain('secrets');
  });

  it('SCORE profile is slightly more permissive on aggregate', () => {
    expect(SCORE_PROFILE.holdAbove).toBeGreaterThan(CHOICE_PROFILE.holdAbove);
  });

  it('sketchRisks flags auth touches', () => {
    const risks = sketchRisks({
      filesChanged: 4,
      linesAdded: 50,
      linesDeleted: 10,
      touchesAuth: true,
    });
    const sec = risks.find((x) => x.axis === 'security');
    expect(sec?.score).toBeGreaterThan(0.5);
  });
});
