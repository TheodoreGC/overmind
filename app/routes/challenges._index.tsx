import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getAllBlueprints } from "~/models/blueprint.server";
import { getUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const blueprints = await getAllBlueprints(userId);

  return json({ blueprints });
};

export default function ChallengesPage() {
  const { blueprints } = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <tbody>
            {blueprints.map(
              ({
                id,
                title,
                description,
                updatedAt,
                difficulty,
                challenges,
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
                  {challenges?.length ? (
                    <td>
                      <span
                        className={`
                      badge
                      uppercase
                      ${challenges[0]?.status === "pending" && "badge-warning"}
                      ${challenges[0]?.status === "submitted" && "badge-error"}
                      ${
                        challenges[0]?.status === "completed" && "badge-success"
                      }
                    `}
                      >
                        {challenges[0]?.status}
                      </span>
                    </td>
                  ) : (
                    <td></td>
                  )}
                  <th>
                    <Link
                      to={`/challenges/${id}`}
                      className="btn-primary btn-xs btn"
                    >
                      details
                    </Link>
                  </th>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
