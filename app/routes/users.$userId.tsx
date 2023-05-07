import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { getUserById } from "~/models/user.server";
import { useOptionalUser } from "~/utils";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.userId, "userId not found");

  const user = await getUserById(params.userId);

  if (!user) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ user });
};

export default function UserDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const currentUser = useOptionalUser();
  const { user } = data;
  const { email, challenges, profile } = user;
  const { firstname, lastname, pseudonym, rank } = profile;
  const pendingChallenges = challenges.filter(
    ({ status }) => status === "pending"
  );
  const submittedChallenges = challenges.filter(
    ({ status }) => status === "submitted"
  );
  const completedChallenges = challenges.filter(
    ({ status }) => status === "completed"
  );
  const placeholder = email[0].toLocaleUpperCase();
  const date = new Date().toLocaleString("default", {
    day: "2-digit",
    month: "short",
  });

  return (
    <>
      <div className="hero bg-base-200">
        <div className="hero-content w-full flex-col justify-normal gap-8 lg:flex-row">
          <div className="flex flex-col items-center">
            <div className="placeholder avatar">
              <div className="w-24 rounded-full bg-neutral-focus text-neutral-content shadow-2xl ring ring-primary ring-offset-2 ring-offset-base-100">
                <span className="text-3xl">{placeholder}</span>
              </div>
            </div>
          </div>
          <div className="max-w-lg">
            <div>
              <div className="text-3xl font-bold">
                {firstname} {lastname}
              </div>
              <div className="text-xl opacity-50">{`@${pseudonym}`}</div>
              <div className="rating rating-sm">
                <input
                  type={rank === "one" ? "radio" : undefined}
                  name="rating-1"
                  className="mask mask-star-2 bg-success"
                  checked={rank === "one"}
                  readOnly
                />
                <input
                  type={rank === "two" ? "radio" : undefined}
                  name="rating-1"
                  className="mask mask-star-2 bg-success"
                  checked={rank === "two"}
                  readOnly
                />
                <input
                  type={rank === "three" ? "radio" : undefined}
                  name="rating-1"
                  className="mask mask-star-2 bg-success"
                  checked={rank === "three"}
                  readOnly
                />
                <input
                  type={rank === "four" ? "radio" : undefined}
                  name="rating-1"
                  className="mask mask-star-2 bg-success"
                  checked={rank === "four"}
                  readOnly
                />
                <input
                  type={rank === "five" ? "radio" : undefined}
                  name="rating-1"
                  className="mask mask-star-2 bg-success"
                  checked={rank === "five"}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="stats stats-vertical my-6 shadow lg:stats-horizontal">
            <div className="stat">
              <div className="stat-figure text-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Pending challenges</div>
              <div className="stat-value text-warning">
                {pendingChallenges.length}
              </div>
              <div className="stat-desc">as of {date}</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </div>
              <div className="stat-title">Submitted challenges</div>
              <div className="stat-value text-error">
                {submittedChallenges.length}
              </div>
              <div className="stat-desc">as of {date}</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="inline-block h-8 w-8 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div className="stat-title">Completed challenges</div>
              <div className="stat-value text-success">
                {completedChallenges.length}
              </div>
              <div className="stat-desc">as of {date}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        {challenges.length ? (
          <table className="table w-full">
            <tbody>
              {challenges
                .map(({ status, blueprint }) => ({
                  status,
                  ...blueprint,
                }))
                .map(
                  ({
                    id,
                    title,
                    description,
                    difficulty,
                    status,
                    updatedAt,
                  }) => (
                    <tr key={id}>
                      <td>
                        <div className="font-bold">
                          {title}
                          <span
                            className={`
                          badge-outline
                          badge
                          badge-sm
                          ml-4
                          ${difficulty === "easy" && "badge-success"}
                          ${difficulty === "medium" && "badge-warning"}
                          ${difficulty === "hard" && "badge-error"}
                        `}
                          >
                            {difficulty}
                          </span>
                        </div>
                        <div className="text-sm opacity-50">
                          {new Date(updatedAt).toLocaleString("default", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td>
                        <p>{description.slice(0, 50) + "..."}</p>
                      </td>
                      <td>
                        <span
                          className={`
                        badge
                        uppercase
                        ${status === "pending" && "badge-warning"}
                        ${status === "submitted" && "badge-error"}
                        ${status === "completed" && "badge-success"}
                      `}
                        >
                          {status}
                        </span>
                      </td>
                      {currentUser?.email === user.email && (
                        <th>
                          <Link
                            to={`/challenges/${id}`}
                            className="btn-primary btn-xs btn"
                          >
                            details
                          </Link>
                        </th>
                      )}
                    </tr>
                  )
                )}
            </tbody>
          </table>
        ) : (
          <div className="mt-16 flex items-center justify-center">
            <p className="text-2xl">
              Sorry, there is no challenges under this section yet.
            </p>
          </div>
        )}
      </div>
    </>
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
    return <div>User not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
