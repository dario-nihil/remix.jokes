import { Outlet, Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import styles from "../styles/jokes.css";

const JokesRoute = () => {
  return (
    <div>
      <h1>J😄KES</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default JokesRoute;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};
