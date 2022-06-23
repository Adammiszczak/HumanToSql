import { QueryData } from './types/queryData';

export class sqlQueryDataMerger {
  public static queryData: QueryData = {
    database: '',
    tableName: '',
    columns: [''],
    where: [],
    whereNot: [],
    whereOr: '',
    whereAnd: '',
    create: '',
    insert: '',
    distinct: '',
    update: '',
    delete: '',
    truncate: '',
    groupBy: '',
    orderAsc: '',
    orderDesc: '',
  };

  public static joinQueryData() {
    let mainClause;

    if (this.queryData.columns) {
      console.log('done');
      mainClause = `SELECT ${this.queryData.columns.join(', ')} FROM ${
        this.queryData.tableName
      }`;
    }

    if (this.queryData.update) {
      return this.queryData.update;
    }

    if (this.queryData.delete) {
      return this.queryData.delete;
    }

    if (this.queryData.insert) {
      return this.queryData.insert;
    }

    if (this.queryData.truncate) {
      return this.queryData.truncate;
    }

    if (this.queryData.distinct) {
      mainClause = mainClause.replace(
        ' FROM',
        `${this.queryData.distinct} FROM`,
      );
    }

    if (this.queryData.where) {
      mainClause = `${mainClause} ${this.queryData.where}`;
    }

    if (this.queryData.whereNot) {
      mainClause = `${mainClause} ${this.queryData.whereNot}`;
    }

    if (this.queryData.whereOr) {
      mainClause = `${mainClause} ${this.queryData.whereOr}`;
    }

    if (this.queryData.whereAnd) {
      mainClause = `${mainClause} ${this.queryData.whereAnd}`;
    }

    if (this.queryData.groupBy) {
      mainClause = `${mainClause} ${this.queryData.groupBy}`;
    }

    if (this.queryData.orderAsc) {
      mainClause = `${mainClause} ${this.queryData.orderAsc}`;
    }

    if (this.queryData.orderDesc) {
      mainClause = `${mainClause} ${this.queryData.orderDesc}`;
    }

    this.cleanQueryData();
    return mainClause;
  }

  private static cleanQueryData() {
    this.queryData = {};
  }
}
