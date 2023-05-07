import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getBlueprint } from "~/models/blueprint.server";
import { getUserId } from "~/session.server";
import { useOptionalUser, stringifyJSON } from "~/utils";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.blueprintId, "blueprintId not found");

  const userId = await getUserId(request);
  const blueprint = await getBlueprint({ id: params.blueprintId, userId });

  if (!blueprint) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ blueprint });
};

export default function ChallengeDetailsPage() {
  const { blueprint } = useLoaderData<typeof loader>();
  const user = useOptionalUser();

  const createChallenge = useFetcher();
  const submitSolution = useFetcher();

  const [challenge] = blueprint?.challenges || [];
  const [latestLog] = challenge?.logs || [];

  return (
    <div className="mx-7 my-3 flex h-full flex-col">
      <div className="breadcrumbs mb-5 text-sm">
        <ul>
          <li>
            <Link to="/challenges">Challenges</Link>
          </li>
          <li>{blueprint.title}</li>
        </ul>
      </div>
      <div className="mb-5">
        <div className="flex items-center gap-4">
          <h1 className="mb-3 flex-1 text-5xl">{blueprint.title}</h1>
          {challenge?.status && (
            <span
              className={`
              badge
              flex-none
              uppercase
              ${challenge.status === "pending" ? "badge-warning" : null}
              ${challenge.status === "submitted" ? "badge-error" : null}
              ${challenge.status === "completed" ? "badge-success" : null}
            `}
            >
              {challenge.status}
            </span>
          )}
        </div>
        <span
          className={`
          badge-outline
          badge
          ${blueprint.difficulty === "easy" ? "badge-success" : null}
          ${blueprint.difficulty === "medium" ? "badge-warning" : null}
          ${blueprint.difficulty === "hard" ? "badge-error" : null}
        `}
        >
          {blueprint.difficulty}
        </span>
      </div>
      <div className="mb-5 text-xl">
        <p>{blueprint.description}</p>
      </div>
      <div>
        {!user ? (
          <Link className="btn-primary btn" to="/login">
            Login to start the challenge
          </Link>
        ) : challenge ? (
          <submitSolution.Form
            action={`/challenges/${challenge.id}/submit`}
            method="post"
          >
            <div className="mockup-code">
              <pre data-prefix=">" className="text-info">
                <code>Input: {stringifyJSON(challenge.input)}</code>
              </pre>
              {submitSolution.state === "submitting" ? (
                <pre data-prefix=">" className="text-warning">
                  <code>Checking...</code>
                </pre>
              ) : (
                latestLog && (
                  <>
                    <pre data-prefix="$">
                      <code>{latestLog.input}</code>
                    </pre>
                    {latestLog.output === "correct" ? (
                      <pre data-prefix=">" className="text-success">
                        <code>Your answer is correct!</code>
                      </pre>
                    ) : (
                      <pre data-prefix=">" className="text-error">
                        <code>Error!</code>
                      </pre>
                    )}
                  </>
                )
              )}
              {challenge.status !== "completed" && (
                <pre data-prefix="$">
                  <code>
                    <input
                      type="text"
                      name="user-input"
                      placeholder="Type your answer directly here"
                      className="input-ghost input w-full max-w-xs bg-neutral p-0 focus:outline-none"
                    />
                    <button className="btn-square btn" type="submit">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </code>
                </pre>
              )}
            </div>
          </submitSolution.Form>
        ) : (
          <createChallenge.Form
            action={`/challenges/${blueprint.id}/new`}
            method="post"
          >
            {createChallenge.state === "submitting" ? (
              <button className="loading btn-primary btn">Starting...</button>
            ) : (
              <button className="btn-primary btn" type="submit">
                Start challenge
              </button>
            )}
          </createChallenge.Form>
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Challenge not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
