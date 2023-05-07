import { Country } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createUser, getUserByEmail } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const firstname = formData.get("firstname");
  const lastname = formData.get("lastname");
  const pseudonym = formData.get("pseudonym");
  const country = formData.get("country");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      {
        errors: {
          email: "Email is invalid",
          password: null,
          firstname: null,
          lastname: null,
          pseudonym: null,
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is required",
          firstname: null,
          lastname: null,
          pseudonym: null,
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          email: null,
          password: "Password is too short",
          firstname: null,
          lastname: null,
          pseudonym: null,
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof firstname !== "string" || firstname.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          firstname: "Firstname is required",
          lastname: null,
          pseudonym: null,
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof lastname !== "string" || lastname.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          firstname: null,
          lastname: "Lastname is required",
          pseudonym: null,
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof pseudonym !== "string" || pseudonym.length === 0) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          firstname: null,
          lastname: null,
          pseudonym: "Pseudonym is required",
          country: null,
        },
      },
      { status: 400 }
    );
  }

  if (typeof country !== "string" || !(country in Country)) {
    return json(
      {
        errors: {
          email: null,
          password: null,
          firstname: null,
          lastname: null,
          pseudonym: null,
          country: "Country is required",
        },
      },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(
    email,
    password,
    firstname,
    lastname,
    pseudonym,
    country
  );

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstnameRef = useRef<HTMLInputElement>(null);
  const lastnameRef = useRef<HTMLInputElement>(null);
  const pseudonymRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.firstname) {
      firstnameRef.current?.focus();
    } else if (actionData?.errors?.lastname) {
      lastnameRef.current?.focus();
    } else if (actionData?.errors?.pseudonym) {
      pseudonymRef.current?.focus();
    } else if (actionData?.errors?.country) {
      countryRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="label">
              <span className="label-text">Email address</span>
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="input-bordered input w-full"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-error" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="input-bordered input w-full"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-error" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="firstname" className="label">
              <span className="label-text">Firstname</span>
            </label>
            <div className="mt-1">
              <input
                id="firstname"
                ref={firstnameRef}
                name="firstname"
                type="text"
                autoComplete="new-firstname"
                aria-invalid={actionData?.errors?.firstname ? true : undefined}
                aria-describedby="firstname-error"
                className="input-bordered input w-full"
              />
              {actionData?.errors?.firstname ? (
                <div className="pt-1 text-error" id="firstname-error">
                  {actionData.errors.firstname}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="lastname" className="label">
              <span className="label-text">Lastname</span>
            </label>
            <div className="mt-1">
              <input
                id="lastname"
                ref={lastnameRef}
                name="lastname"
                type="text"
                autoComplete="new-lastname"
                aria-invalid={actionData?.errors?.lastname ? true : undefined}
                aria-describedby="lastname-error"
                className="input-bordered input w-full"
              />
              {actionData?.errors?.lastname ? (
                <div className="pt-1 text-error" id="lastname-error">
                  {actionData.errors.lastname}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="pseudonym" className="label">
              <span className="label-text">Pseudonym</span>
            </label>
            <div className="mt-1">
              <input
                id="pseudonym"
                ref={pseudonymRef}
                name="pseudonym"
                type="text"
                autoComplete="new-pseudonym"
                aria-invalid={actionData?.errors?.pseudonym ? true : undefined}
                aria-describedby="pseudonym-error"
                className="input-bordered input w-full"
              />
              {actionData?.errors?.pseudonym ? (
                <div className="pt-1 text-error" id="pseudonym-error">
                  {actionData.errors.pseudonym}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="label">
              <span className="label-text">Country</span>
            </label>
            <div className="mt-1">
              <select
                id="country"
                ref={countryRef}
                name="country"
                aria-invalid={actionData?.errors?.country ? true : undefined}
                aria-describedby="country-error"
                className="select-bordered select w-full"
              >
                <option disabled>Select your country</option>
                {Object.values(Country).map((country, index) => (
                  <option key={index}>{country}</option>
                ))}
              </select>
              {actionData?.errors?.country ? (
                <div className="pt-1 text-error" id="country-error">
                  {actionData.errors.country}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button type="submit" className="btn-primary btn w-full">
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              <span className="label-text">Already have an account? </span>
              <Link
                className="link-primary link"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
