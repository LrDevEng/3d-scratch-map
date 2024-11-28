import type { Sql } from 'postgres';

export async function up(sql: Sql) {
  await sql`
    ALTER TABLE comments
    DROP CONSTRAINT comments_diary_id_fkey;
  `;

  await sql`
    ALTER TABLE comments
    ADD CONSTRAINT comments_diary_id_fkey FOREIGN key (diary_id) REFERENCES diaries (id) ON DELETE cascade;
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE comments`;
}
