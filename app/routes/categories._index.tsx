import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect } from '@remix-run/cloudflare';
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

type NewCategory = InferModel<typeof categories, 'insert'>;
export async function action({request, context}: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const newCategory: NewCategory = {
    name: name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const db = createClient(context.DB as D1Database);
  await db.insert(categories).values(newCategory).run();
  return redirect(`/categories`);
}

export const loader = async ({ context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const allCategories = await db.select().from(categories).all()
  if (!allCategories) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { categories: allCategories }
}

export default function Categries() {
  const data = useLoaderData<typeof loader>();
  console.log(data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Synca1 Admin</h1>
      <form method="post">
        <fieldset>
          <legend>カテゴリーの作成</legend>
          <div>
            <label htmlFor="name">カテゴリー名</label>
            <input name="name" type="text" required />
          </div>

          <button type="submit">作成</button>
        </fieldset>
      </form>
      {data.categories.length ? (
         <ul>
           {data.categories.map((c) => (
             <li key={c.id}>
               <a href={`/categories/${c.id}`}>{c.name}</a>
             </li>
           ))}
         </ul>
       ) : (
         <p>カテゴリーはまだ作成されていません</p>
       )}
    </div>
  );
}