import { QueryData } from './types/queryData';

export class sqlQueryDataMerger {
  public static joinQueryData(queryData: QueryData) {
    let mainClause;

    if (queryData.columns) {
      mainClause = `SELECT ${queryData.columns.join(', ')} FROM ${
        queryData.tableName
      }`;
    }

    if (queryData.update) {
      return queryData.update;
    }

    if (queryData.delete) {
      return queryData.delete;
    }

    if (queryData.insert) {
      return queryData.insert;
    }

    if (queryData.truncate) {
      return queryData.truncate;
    }

    if (queryData.distinct) {
      mainClause = mainClause.replace(' FROM', `${queryData.distinct} FROM`);
    }

    if (queryData.where) {
      mainClause = `${mainClause} ${queryData.where}`;
    }

    if (queryData.whereNot) {
      mainClause = `${mainClause} ${queryData.whereNot}`;
    }

    if (queryData.whereOr) {
      mainClause = `${mainClause} ${queryData.whereOr}`;
    }

    if (queryData.whereAnd) {
      mainClause = `${mainClause} ${queryData.whereAnd}`;
    }

    if (queryData.groupBy) {
      mainClause = `${mainClause} ${queryData.groupBy}`;
    }

    if (queryData.orderAsc) {
      mainClause = `${mainClause} ${queryData.orderAsc}`;
    }

    if (queryData.orderDesc) {
      mainClause = `${mainClause} ${queryData.orderDesc}`;
    }

    return mainClause;
  }
}
