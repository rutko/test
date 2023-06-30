CREATE TABLE `categories` (
	`id` integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);

CREATE TABLE `images` (
	`id` integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name` text,
	`category_id` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);

CREATE TABLE `images_to_tags` (
	`image_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`image_id`, `tag_id`),
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `tags` (
	`id` integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` text
);
