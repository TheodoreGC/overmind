import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import {
  getChallengeById,
  updateChallengeById,
} from "~/models/challenge.server";
import { stringifyJSON, timeout } from "~/utils";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.challengeId, "challengeId not found");

  const challenge = await getChallengeById(Number(params.challengeId));
  const solution = stringifyJSON(challenge?.solution);
  const userInput = (await request.formData()).get("user-input");

  await updateChallengeById({
    id: challenge?.id,
    status: userInput === solution ? "completed" : "submitted",
    input: userInput,
    output: userInput === solution ? "correct" : "error",
  });

  await timeout(300);

  return redirect(`/challenges/${challenge?.blueprint.id}`);
};
