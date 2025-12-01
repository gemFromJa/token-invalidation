import db from "@/common/db.js";
import type { SearchQuery } from "../types.js";

export async function getData({
  searchTerm,
  offset,
  limit = 10,
  page,
  orderBy,
  direction = "DESC",
}: SearchQuery) {
  let paramCount = 1;
  const params = [];
  let generateQuery = "Select * from public.sales_team";
  let countQuery = "Select count(id) from public.sales_team";

  if (searchTerm) {
    const whereClause = ` where first_name ilike $${paramCount} or last_name ilike $${paramCount} or email ilike $${paramCount}`;
    generateQuery += whereClause;
    countQuery += whereClause;
    paramCount++;
    params.push(`%${searchTerm}%`);
  }

  //  run a count query
  let totalCountQuery = db.query(countQuery.toString(), params);

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

  if (!offset && page) {
    const calcOffset = (page - 1) * limit;
    generateQuery += ` offset ${calcOffset}`;
  }

  if (limit) {
    generateQuery += ` limit ${limit}`;
  }

  const [res] = await Promise.all([
    db.query(generateQuery.toString(), params),
    totalCountQuery,
  ]);

  const result = (await totalCountQuery).rows[0].count;

  const total_pages = Math.ceil(result / limit);
  const current_page = offset ? Math.ceil(offset / limit) : 1;

  return {
    total_records: result,
    current_page,
    total_pages,
    data: res.rows,
  };
}
