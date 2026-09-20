import { buildJudgeQuestions, combineVerdict, type JudgeAnswers, type Verdict } from "./stages.js";

export type EvaluateFn = (args: {
  state: string;
  questions: ReturnType<typeof buildJudgeQuestions>;
}) => Promise<JudgeAnswers>;

/** Inject your Jev / AI SDK evaluate. Tests pass a mock. */
export async function runQuicksilver(
  diffText: string,
  evaluate: EvaluateFn,
): Promise<Verdict & { answers: JudgeAnswers }> {
  const questions = buildJudgeQuestions();
  const answers = await evaluate({ state: diffText, questions });
  const verdict = combineVerdict(answers);
  return { ...verdict, answers };
}
