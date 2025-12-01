export interface SearchQuery {
  searchTerm?: string;
  offset?: number;
  limit: number;
  orderBy?: string;
  direction?: string;
}
