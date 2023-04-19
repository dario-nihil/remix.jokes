import { json } from "@remix-run/node";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { db } from "../utils/db.server";

const JokeRoute = () => {
  const { joke } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{joke.content}</p>
      <Link to=".">{joke.name} Permalink</Link>
    </div>
  );
};

export default JokeRoute;

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const { jokeId: id } = params;

  const joke = await db.joke.findUnique({ where: { id } });

  if (!joke) {
    throw new Error("Joke not found!");
  }

  return json({ joke });
};
