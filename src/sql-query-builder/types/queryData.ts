export type QueryData = {
  database?: string | undefined;
  tableName?: string | undefined;
  columns?: string[] | undefined;
  where?: string[] | undefined;
  whereNot?: string[] | undefined;
  whereOr?: string | undefined;
  whereAnd?: string | undefined;
  create?: string | undefined;
  insert?: string | undefined;
  distinct?: string | undefined;
  update?: string | undefined;
  delete?: string | undefined;
  truncate?: string | undefined;
  orderAsc?: string | undefined;
  orderDesc?: string | undefined;
  groupBy?: string | undefined;
};
