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
  if (!allCategories) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { categories: allCategories }
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
            <input name="file" type="file" required />
            <label htmlFor="categoryId">カテゴリー</label>
            <select name="categoryId">
              <option value="1">イベント</option>
              <option value="2">日常・生活</option>
              <option value="3">人物</option>
            </select>
          </div>

          <button type="submit">作成</button>
        </fieldset>
      </form>
    </div>
  );
}
