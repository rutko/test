import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect } from '@remix-run/cloudflare';
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import type { InferModel } from 'drizzle-orm';
import { createClient } from "~/db/client.server"
import { tags } from '~/db/schema';
import { eq } from "drizzle-orm";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

// type NewTags = InferModel<typeof tags, 'insert'>;
// export async function action({ request, context }: ActionArgs) {
//   const formData = await request.formData();
//   const name = formData.get('name') as string;
//   const newTags: NewTags = {
//     name: name,
//   }
//   const db = createClient(context.DB as D1Database);
//   await db.insert(tags).values(newTags).run();
//   return redirect(`/tags`);
// }

export const loader = async ({ params, context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const tagId = params.slug
  const tag = await db.select().from(tags).where(eq(tags.id, 1)).all()
  if (!tag) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { tag: tag }
}

export type Categries = InferModel<typeof tags>;
export default function TagSlug() {
  const data = useLoaderData<typeof loader>();
  console.log(data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>タグ詳細</h1>
    </div>
  );
}
