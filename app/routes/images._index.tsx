import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData , json } from '@remix-run/cloudflare';
import type { LoaderArgs, ActionArgs } from '@remix-run/cloudflare';
import { useLoaderData, useActionData } from "@remix-run/react";
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

type NewImage = InferModel<typeof images, 'insert'>;
type NewImagesToTags = InferModel<typeof imagesToTags, 'insert'>;
export async function action({request, context}: ActionArgs) {

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 1024 * 1024 * 10,
  });

  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = form.get('file') as Blob;
  invariant(file, 'File is required');

  const fileName = `${uuid()}.${file.type.split('/')[1]}`;

  const bucket = (context.MY_BUCKET as R2Bucket);
  // R2バケットにアップロードする
  const response = await bucket.put(fileName, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
    },
  });


  const formData = new URLSearchParams(await request.text());
  const name = formData.get('name') as string;
  const category = formData.get('category');
  const categoryId = Number(category)
  const newImage: NewImage = {
    key: response.key,
    name: name,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: 1,
  }
  const db = createClient(context.DB as D1Database);
  const imageResponse = await db.insert(images).values(newImage).returning().get();

  // const tags = formData.getAll('tagId');
  // const imageId = imageResponse.id


  // const tagNums = tags.map(Number)

  // for (let i=0; i > tagNums.length; i++) {
  //   const newImagesToTags: NewImagesToTags = {
  //     imageId: imageId,
  //     tagId: i,
  //   }

  // await db.insert(imagesToTags).values(newImagesToTags).run();  
  // }
  return json({object: response});
}

export const loader = async ({ context }: LoaderArgs) => {
  const db = createClient(context.DB as D1Database);
  const allCategories = await db.select().from(categories).all()
  const allTags = await db.select().from(tags).all()
  const allImages = await db.select().from(images).all()
  if (!allCategories && !allTags && !allImages) {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  return { categories: allCategories, tags: allTags, images: allImages }
}

export default function Images() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<{ catregory: Number, message: string; object: R2Object }>();
  console.log(data)
  console.log(actionData)
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
      <form method="post" action="/images" encType="multipart/form-data">
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
            <label htmlFor="category">カテゴリー選択（必須）</label>
            <select name="category">
              {data.categories.map((c)=> (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tagId">タグ選択（複数可）</label>
            <select multiple name="tagId">
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


// type newImages = InferModel<typeof images, 'insert'>;
// type newImagesToTags = InferModel<typeof imagesToTags, 'insert'>;
// export async function action({request, context}: ActionArgs) {

//   const uploadHandler = unstable_createMemoryUploadHandler({
//     maxPartSize: 1024 * 1024 * 10,
//   });

//   const form = await unstable_parseMultipartFormData(request, uploadHandler);

//   const file = form.get('file') as Blob;
//   invariant(file, 'File is required');

//   const fileName = `${uuid()}.${file.type.split('/')[1]}`;

//   const bucket = (context.MY_BUCKET as R2Bucket);
//   // R2バケットにアップロードする
//   const response = await bucket.put(fileName, await file.arrayBuffer(), {
//     httpMetadata: {
//       contentType: file.type,
//     },
//   });

//   const formData = await request.formData();
//   const name = formData.get('name') as string;
//   const categoryId = formData.get('categoryId');
//   const newImage: newImages = {
//     key: response.key,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     name: name,
//     categoryId: categoryId,
//   }

//   const db = createClient(context.DB as D1Database);
//   const imageResponse = await db.insert(images).values(newImage).run();
//   const tags = formData.get('tagId');
//   const imageId = imageResponse.id


//   const newimagesToTags: newImagesToTags = {
//     imageId: imageId,
//     tagId: tags,
//   }

//   await db.insert(imagesToTags).values(newimagesToTags).run();  


//   return redirect(`/images`);
// }
