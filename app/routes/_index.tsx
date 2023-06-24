import type { V2_MetaFunction } from "@remix-run/cloudflare";
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import type { InferModel } from 'drizzle-orm';
import { createClient } from "~/db/client.server"
import { categories } from '~/db/schema';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type NewCategries = InferModel<typeof categories, 'insert'>;
export async function action({request, context}: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const newCategries: NewCategries = {
    name: name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const db = createClient(context.DB as D1Database);
  const ret = await db.insert(categories).values(newCategries).returning().get();
  return {
    id: ret.id
  }
}

export const loader = async ({ context }: LoaderArgs) => {
  // const hoge = await context.DB
  // const db = createClient(context.DB as D1Database);
  // const allCategories = await db.select().from(categories).all()
  // if (!allCategories) {
  //   throw new Response("Not Found", {
  //     status: 404,
  //   });
  // }
  return { categories: 'hoge' }
}

export type Categries = InferModel<typeof categories>;
export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
