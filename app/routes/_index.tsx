import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData } from '@remix-run/cloudflare';
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from "@remix-run/react";
import type { InferModel } from 'drizzle-orm';
import { createClient } from "~/db/client.server"
import { categories, tags, images, imagesToTags } from '~/db/schema';
import invariant from 'tiny-invariant';
import { uuid } from '@cfworker/uuid';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export type Categries = InferModel<typeof categories>;
export default function Index() {
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
        <li>
          <a href="/images">画像投稿</a>
        </li>
      </ul>
    </div>
  );
}
