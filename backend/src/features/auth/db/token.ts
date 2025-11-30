import pool from "@/common/db.js";

export async function invalidateRefreshToken(token: string) {
  await pool.query("Update public.tokens set status = $1 where token = $2", [
    "invalid",
    token,
  ]);
}

export async function invalidateAllUserTokens(id: string) {
  await pool.query(
    `Update public.tokens set status = 'invalid' where user_id = $1`,
    [id]
  );
}

export async function saveRefreshToken(
  token: string,
  expires: Date,
  id: string,
  status = "valid"
) {
  await pool.query(
    "Insert into public.tokens ( token, expires, user_id, status ) values ( $1, $2, $3, $4 )",
    [token, expires, id, status]
  );
}

// Get token from the db
export async function getRefreshToken(token: string) {
  // get
  let res = await pool.query("Select * from public.tokens where token = $1", [
    token,
  ]);

  return res.rows[0];
}

// Get token from cache or from db
export async function getCacheRefreshToken(token: string) {
  // Check cache
  let _token;

  _token = await getRefreshToken(token);

  //   Update token in cache

  return _token;
}

export async function clearToken(token: string, id: string) {
  const res = await pool.query(
    "Delete * from public.tokens where token = $1 and user_id = $2",
    [token, id]
  );

  return res?.rows?.[0];
}
