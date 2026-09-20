import { prefilter, judge, sketchRisks, SCORE_PROFILE } from './index.js';

console.log('=== Quicksilver Judge — Raven-shaped PR pre-filter ===\n');

const clean = {
  filesChanged: 3,
  linesAdded: 40,
  linesDeleted: 12,
  hasTestDiff: true,
};
console.log('Clean PR:', prefilter(clean, 0.88));

const spicy = {
  filesChanged: 28,
  linesAdded: 900,
  linesDeleted: 200,
  touchesAuth: true,
  touchesDeps: true,
  hasTestDiff: false,
  labels: ['credentials'],
};
console.log('Spicy PR:', prefilter(spicy, 0.75, SCORE_PROFILE));

const risks = sketchRisks(spicy);
console.log('Risk sketch:', risks);
console.log('Manual judge:', judge({ pr: spicy, risks, confidence: 0.4 }));
