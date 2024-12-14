import type { Sql } from 'postgres';
import { z } from 'zod';
import type { Follower } from './00005-createTableFollowers';

export const userSchemaRegister = z.object({
  email: z.string().min(3).max(100),
  password: z.string().min(8),
  givenName: z.string().min(1),
  familyName: z.string().min(1),
});

export const userSchemaUpdate = z.object({
  email: z.string().min(3).max(100),
  givenName: z.string().min(1),
  familyName: z.string().min(1),
});

export const userSchemaProfilePicture = z.object({
  imageUrl: z.string(),
});

export const userSchemaSearch = z.object({
  searchTerm: z.string().min(3).max(100),
});

export const userSchemaLogIn = z.object({
  email: z.string().min(3).max(100),
  password: z.string().min(8),
});

export type User = {
  id: number;
  email: string;
  givenName: string;
  familyName: string;
  imageUrl: string | null;
};

export type FollowingUser = {
  id: User['id'];
  email: User['email'];
  givenName: User['givenName'];
  imageUrl: User['imageUrl'];
  status: Follower['status'];
};

export type FollowerUser = {
  id: User['id'];
  email: User['email'];
  givenName: User['givenName'];
  imageUrl: User['imageUrl'];
  status: Follower['status'];
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      email varchar(80) NOT NULL UNIQUE,
      given_name varchar NOT NULL,
      family_name varchar NOT NULL,
      image_url varchar,
      password_hash varchar(255) NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
