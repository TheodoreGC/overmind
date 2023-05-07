import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import { useOptionalUser } from "./utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderArgs) => {
  return json({ user: await getUser(request) });
};

export default function App() {
  const user = useOptionalUser();

  return (
    <html lang="en" className="h-full" data-theme="overmind">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col">
        <nav className="navbar bg-neutral text-neutral-content">
          <div className="navbar-start">
            <Link
              className="btn-ghost btn text-xl normal-case"
              to={{
                pathname: "/",
              }}
            >
              OVERMIND
            </Link>
          </div>
          <div className="navbar-end">
            <div className="dropdown-end dropdown">
              <button className="btn-ghost btn-square btn mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  ></path>
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link to="/challenges">Challenges</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
              </ul>
            </div>
            {user ? (
              <div className="dropdown-end dropdown">
                <div
                  tabIndex={0}
                  className="placeholder btn-ghost btn-circle avatar btn"
                >
                  <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
                    <span>{user.email[0].toLocaleUpperCase()}</span>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
                >
                  <li>
                    <Link to={`/users/${user.id}`}>Profile</Link>
                  </li>
                  <li>
                    <Form action="/logout" method="post">
                      <button type="submit">Logout</button>
                    </Form>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="btn-primary btn">
                  Log In
                </Link>
                <Link to="/join" className="btn-secondary btn">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </nav>
        <main className="h-full">
          <Outlet />
        </main>
        <footer className="footer items-center bg-neutral p-4 text-neutral-content">
          <div className="grid-flow-col items-center">
            <p>Copyright © 2023 - All right reserved</p>
          </div>
          <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="https://www.linkedin.com/in/theodoregarsoncorbeaux">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
                className="fill-current"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path>
              </svg>
            </a>
          </div>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
