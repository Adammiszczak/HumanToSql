import { Injectable, Logger } from '@nestjs/common';
import { sqlQueryBuilderValidator } from './sql-query-builder-validator';
import { sqlQueryDataMerger } from './sql-query-data-merger';
import { QueryData } from './types/queryData';
import { SqlBuilderMethods } from './types/sqlBuilderMethods';

@Injectable()
export class SqlQueryBuilderService {
  private readonly logger = new Logger(SqlQueryBuilderService.name);

  private readonly methodsFunctions: SqlBuilderMethods = {
    from: { method: this.getTableName, argName: 'tableName' },
    getAll: { method: this.getAllColumns, argName: 'columns' },
    getSpecific: { method: this.getSpecific, argName: 'columns' },
    where: { method: this.prepareWhereClause, argName: 'where' },
    whereNot: { method: this.prepareWhereNotClause, argName: 'whereNot' },
    whereOr: { method: this.prepareWhereOrClause, argName: 'whereOr' },
    whereAnd: { method: this.prepareWhereAndClause, argName: 'whereAnd' },
    groupBy: { method: this.prepareGroupByClause, argName: 'groupBy' },
    orderAsc: { method: this.prepareOrderAscClause, argName: 'orderAsc' },
    orderDesc: { method: this.prepareOrderDescClause, argName: 'orderDesc' },
    insertRecord: { method: this.insertRecord, argName: 'insert' },
    unique: { method: this.prepareDisctintClause, argName: 'distinct' },
    updateRecord: { method: this.prepareUpdateClause, argName: 'update' },
    deleteRecord: { method: this.prepareDeleteClause, argName: 'delete' },
    clearTable: { method: this.prepareTruncateClause, argName: 'truncate' },
  };

  public prepareRawSqlQuery(query: string): string {
    try {
      const splittedQuery = this.splitHumanQuery(query);
      const queryMethodAndArguments =
        this.getMethodsAndArguments(splittedQuery);
      const checkIfMethodsAreValid =
        sqlQueryBuilderValidator.checkIfAllowedMethods(queryMethodAndArguments);
      sqlQueryBuilderValidator.assertAllowedMethods(checkIfMethodsAreValid);

      const queryData: QueryData = {};
      queryMethodAndArguments.forEach((el) => {
        const methodName = el[0];
        const methodArgs = el[1];
        const checkIfQueryIsValid =
          sqlQueryBuilderValidator.checkIfValidQueryMethods(
            methodName,
            queryMethodAndArguments,
          );
        sqlQueryBuilderValidator.assertValidQueryMethods(checkIfQueryIsValid);
        const args = this.methodsFunctions[methodName]['method'](methodArgs);
        const queryArgName = this.methodsFunctions[methodName]['argName'];

        queryData[queryArgName] = args;
      });
      const rawSqlQuery = sqlQueryDataMerger.joinQueryData(queryData);
      this.logger.log(rawSqlQuery);
      return rawSqlQuery;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  private splitHumanQuery(query: string): string[] {
    return query.split('.');
  }

  private getMethodsAndArguments(splittedQuery: string[]): string[][] {
    const methodsAndValues = [];
    splittedQuery.forEach((el) => {
      const regex = /([a-z]+)\((.*)\)/i;
      const [, method, arg = ''] = el.match(regex);
      methodsAndValues.push([method, arg]);
    });
    return methodsAndValues;
  }

  private getTableName(tableName: string): string {
    return JSON.parse(tableName);
  }

  private getAllColumns(): string[] {
    return ['*'];
  }

  private getSpecific(columns: string): string[] {
    return JSON.parse(columns);
  }

  private prepareWhereClause(condition: string): string {
    return `WHERE ${JSON.parse(condition)}`;
  }

  private prepareWhereNotClause(condition: string): string {
    const notConditions = JSON.parse(condition);
    return `WHERE NOT ${notConditions.join(' OR ')}`;
  }

  private prepareWhereOrClause(conditions: string): string {
    const orConditions = JSON.parse(conditions);
    return `WHERE ${orConditions.join(' OR ')}`;
  }

  private prepareWhereAndClause(conditions: string) {
    const orConditions = JSON.parse(conditions);
    return [`WHERE ${orConditions.join(' AND ')}`];
  }

  private prepareOrderAscClause(column: string): string {
    return `ORDER BY ${JSON.parse(column)} ASC`;
  }

  private prepareOrderDescClause(column: string): string {
    return `ORDER BY ${JSON.parse(column)} DESC`;
  }

  private prepareGroupByClause(columns: string): string {
    const groupByColumns = JSON.parse(columns);
    return `GROUP BY ${groupByColumns.join(',')}`;
  }

  private prepareUpdateClause(condition: string): string {
    const [tableName, column, value] = JSON.parse(condition);
    return `UPDATE ${tableName} SET ${column}=${value}`;
  }

  private prepareDeleteClause(condition: string): string {
    const [tableName, column, value] = JSON.parse(condition);
    return `DELETE FROM ${tableName} WHERE ${column}=${value}`;
  }

  private prepareTruncateClause(tableName: string): string {
    return `TRUNCATE TABLE ${JSON.parse(tableName)}`;
  }

  private prepareDisctintClause(column: string): string {
    return `DISTINCT(${JSON.parse(column)})`;
  }

  private insertRecord(record: string): string {
    const [tableName, ...recordData] = JSON.parse(record);
    const quotedRecordData = recordData.map((el) => `'${el}'`);
    return `INSERT INTO ${tableName} VALUES(NULL, ${quotedRecordData.join(
      ', ',
    )})`;
  }
}
