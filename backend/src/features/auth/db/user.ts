import db from "@/common/db.js";

export async function getUserById(id: number) {
  const res = await db.query(
    "Select * from public.user where id = $1 limit 1",
    [id]
  );

  return res.rows?.[0];
}

export async function getUserByUsername(username: string) {
  const res = await db.query(
    `Select * from public.user where username = $1 limit 1`,
    [username]
  );

  return res.rows?.[0];
}

export async function addUser(
  username: string,
  password: string,
  role: string
) {
  const res = await db.query(
    `Insert into public.user (username, password, role) values ( $1, $2, $3) RETURNING *`,
    [username, password, role]
  );

  return res;
}
