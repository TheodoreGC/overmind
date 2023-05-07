import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <div
      className="hero h-full"
      style={{
        backgroundImage: `url("/images/stock/photo-1507358522600-9f71e620c44e.jpg")`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">
            Your Destination for Mind-Bending Challenges!
          </h1>
          <p className="mb-5">
            The ultimate platform for puzzle lovers everywhere! Whether you're a
            beginner or a seasoned puzzle-solving pro, we have a wide range of
            challenges to test your skills and keep you engaged. What are you
            waiting for? Start putting your problem-solving abilities to the
            test!
          </p>
          <Link className="btn-primary btn" to="/challenges">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
