import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect } from '@remix-run/cloudflare';
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import type { InferModel } from 'drizzle-orm';
import { createClient } from "~/db/client.server"
import { categories, tags } from '~/db/schema';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// type NewCategries = InferModel<typeof categories, 'insert'>;
// export async function action({request, context}: ActionArgs) {
//   const formData = await request.formData();
//   const name = formData.get('name') as string;
//   const newCategries: NewCategries = {
//     name: name,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   }
//   const db = createClient(context.DB as D1Database);
//   await db.insert(categories).values(newCategries).run();
//   return redirect(`/`);
// }

export const loader = async ({ context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const allCategories = await db.select().from(categories).all()
  const allTags = await db.select().from(tags).all()
  if (!allCategories && !allTags) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { categories: allCategories, tags: allTags }
}

export type Categries = InferModel<typeof categories>;
export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Synca1 Admin</h1>
      <ul>
        <li>
          <a href="/categories">カテゴリー</a>
        </li>
        <li>
          <a href="/tags">タグ</a>
        </li>
      </ul>
      <form method="post" action="/?index" encType="multipart/form-data">
        <fieldset>
          <legend>画像のアップロード</legend>
          <div>
            <label htmlFor="name">画像のタイトル</label>
            <input name="name" type="text" />
          </div>
          <div>
            <input name="file" type="file" required />
          </div>
          <div>
            <label htmlFor="categoryId">カテゴリー選択（必須）</label>
            <select name="categoryId">
              {data.categories.map((c)=> (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tagId">タグ選択（複数可）</label>
            <select multiple name="tags">
              {data.tags.map((t)=> (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <button type="submit">作成</button>
        </fieldset>
      </form>
    </div>
  );
}
