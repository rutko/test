import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect } from '@remix-run/cloudflare';
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import type { InferModel } from 'drizzle-orm';
import { createClient } from "~/db/client.server"
import { categories } from '~/db/schema';
import { eq } from "drizzle-orm";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type NewTags = InferModel<typeof categories, 'insert'>;
export async function action({ params, request, context }: ActionArgs) {
  const categoryId = params.slug
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const createdAt = formData.get('createdAt') as unknown;
  const newCategory: NewTags = {
    name: name,
    createdAt: createdAt,
    updatedAt: new Date(),
  }
  const db = createClient(context.DB as D1Database);
  await db.update(categories).set(newCategory).where(eq(categories.id, categoryId)).run();
  return redirect(`/categories/${categoryId}`);
}

export const loader = async ({ params, context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const categoryId = params.slug
  const category = await db.select().from(categories).where(eq(categories.id, categoryId)).all()
  if (!category) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { category: category }
}

export default function CategorySlug() {
  const data = useLoaderData<typeof loader>();
  const categoryName = data.category[0].name
  console.log(data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
    <h1>{ categoryName }</h1>
    <form method="post">
      <fieldset>
        <legend>{ categoryName }の編集</legend>
        <div>
          <label htmlFor="name">カテゴリー名</label>
          <input name="name" type="text" required />
          <input name="createdAt" type="time" value={data.category[0].createdAt} readOnly />
        </div>

        <button type="submit">更新</button>
      </fieldset>
    </form>
  </div>
  );
}
