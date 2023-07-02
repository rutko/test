import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const categories = sqliteTable('categories', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
	images: many(images),
}));

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull(),
  name: text('name'),
  categoryId: integer('category_id'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});

export const imagesRelations = relations(images, ({ one, many }) => ({
	author: one(categories, {
		fields: [images.categoryId],
		references: [categories.id],
	}),
  imagesToTags: many(imagesToTags),
}));

export const imagesToTags = sqliteTable('images_to_tags', {
  imageId: integer('image_id').notNull().references(() => images.id),
  tagId: integer('tag_id').notNull().references(() => tags.id),
}, (table) => ({
    compositePk: primaryKey(table.imageId, table.tagId),
  }),
);

export const imagesToTagsRelations = relations(imagesToTags, ({ one }) => ({
	tag: one(tags, {
		fields: [imagesToTags.tagId],
		references: [tags.id],
	}),
	image: one(images, {
		fields: [imagesToTags.imageId],
		references: [images.id],
	}),
}));


export const tags = sqliteTable('tags', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
});



export const tagsRelations = relations(tags, ({ many }) => ({
	imagesToTags: many(imagesToTags),
}));
