export interface SearchQuery {
  searchTerm?: string;
  offset?: number;
  page?: number;
  limit: number;
  orderBy?: string;
  direction?: string;
}
