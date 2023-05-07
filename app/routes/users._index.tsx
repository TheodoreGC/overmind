import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { getAllUsers } from "~/models/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  return json({ users: await getAllUsers() });
};

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="flex">
      <div className="w-full overflow-x-auto">
        <table className="table w-full">
          <tbody>
            {users
              .map((user) => ({
                id: user.id,
                email: user.email,
                ...user.profile,
                totalChallengeCompleted: user.challenges.length,
              }))
              .map(
                (
                  {
                    id,
                    email,
                    firstname,
                    lastname,
                    pseudonym,
                    country,
                    rank,
                    totalChallengeCompleted,
                  },
                  index
                ) => (
                  <tr key={id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="placeholder btn-ghost btn-circle avatar btn">
                          <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                            <span>{email[0].toLocaleUpperCase()}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {firstname} {lastname}
                          </div>
                          <div className="text-sm opacity-50">{email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link to={`/users/${id}`} className="link-info link">
                        @{pseudonym}
                      </Link>
                    </td>
                    <td>{country}</td>
                    <td>{totalChallengeCompleted} challenges completed</td>
                    <td>
                      <div className="rating rating-sm">
                        <input
                          type={rank === "one" ? "radio" : undefined}
                          name={`rating-${index}`}
                          className="mask mask-star-2 bg-success"
                          checked={rank === "one"}
                          readOnly
                        />
                        <input
                          type={rank === "two" ? "radio" : undefined}
                          name={`rating-${index}`}
                          className="mask mask-star-2 bg-success"
                          checked={rank === "two"}
                          readOnly
                        />
                        <input
                          type={rank === "three" ? "radio" : undefined}
                          name={`rating-${index}`}
                          className="mask mask-star-2 bg-success"
                          checked={rank === "three"}
                          readOnly
                        />
                        <input
                          type={rank === "four" ? "radio" : undefined}
                          name={`rating-${index}`}
                          className="mask mask-star-2 bg-success"
                          checked={rank === "four"}
                          readOnly
                        />
                        <input
                          type={rank === "five" ? "radio" : undefined}
                          name={`rating-${index}`}
                          className="mask mask-star-2 bg-success"
                          checked={rank === "five"}
                          readOnly
                        />
                      </div>
                    </td>
                    <th>
                      <Link
                        to={`/users/${id}`}
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
