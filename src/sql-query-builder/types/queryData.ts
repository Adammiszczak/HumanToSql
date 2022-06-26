export type QueryData = {
  database?: string;
  tableName?: string;
  columns?: string[];
  where?: string[];
  whereNot?: string[];
  whereOr?: string;
  whereAnd?: string;
  create?: string;
  insert?: string;
  distinct?: string;
  update?: string;
  delete?: string;
  truncate?: string;
  orderAsc?: string;
  orderDesc?: string;
  groupBy?: string;
};
