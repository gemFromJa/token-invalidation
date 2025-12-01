import db from "@/common/db.js";
import type { SearchQuery } from "../types.js";

export async function getData({
  searchTerm,
  offset,
  limit = 10,
  orderBy,
  direction = "DESC",
}: SearchQuery) {
  let paramCount = 1;
  const params = [];
  let generateQuery = "Select * from public.sales_team";

  if (searchTerm) {
    generateQuery += ` where first_name ilike $${paramCount} or last_name ilike $${paramCount} or email ilike $${paramCount}`;
    paramCount++;
    params.push(`%${searchTerm}%`);
  }

  if (
    orderBy &&
    ["first_name", "last_name", "email", "calls", "average_ratings"].includes(
      orderBy
    )
  ) {
    generateQuery += ` order by ${orderBy} ${direction}`;
  }

  if (offset) {
    generateQuery += ` offset ${offset}`;
  }

  if (limit) {
    generateQuery += ` limit ${limit}`;
  }

  console.log(generateQuery);
  // return [];

  const res = await db.query(generateQuery.toString(), params);

  return res.rows;
}
