import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getBlueprintById } from "~/models/blueprint.server";
import { createChallenge } from "~/models/challenge.server";
import { getUserId } from "~/session.server";
import { parseJSON } from "~/utils";

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.blueprintId, "blueprintId not found");

  const userId = await getUserId(request);

  if (!userId) return redirect("/login");

  const blueprint = await getBlueprintById(params.blueprintId);

  if (!blueprint) return json({});

  // eslint-disable-next-line no-new-func
  const inputGenerator = new Function(
    "return " + parseJSON(blueprint.inputGenerator)
  )();

  // eslint-disable-next-line no-new-func
  const solutionGenerator = new Function(
    "return " + parseJSON(blueprint.solutionGenerator)
  )();

  const input = {
    value: inputGenerator(),
  };
  const solution = {
    value: solutionGenerator(input.value),
  };

  const challenge = await createChallenge({
    input,
    solution,
    status: "pending",
    userId,
    blueprintId: params.blueprintId,
  });

  return json(challenge);
};
