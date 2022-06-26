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

  //from("users_docker").getAll()
  private getAllColumns(): string[] {
    return ['*'];
  }

  //from("users_docker").getSpecific(["id","age"]).where("age > 20")
  private getSpecific(columns: string): string[] {
    return JSON.parse(columns);
  }

  //from("users_docker").getSpecific(["id","age"]).where("age > 20")
  private prepareWhereClause(condition: string): string {
    return `WHERE ${JSON.parse(condition)}`;
  }

  //from("users_docker").getSpecific(["id","age"]).whereNot("age > 50")
  private prepareWhereNotClause(condition: string): string {
    const notConditions = JSON.parse(condition);
    return `WHERE NOT ${notConditions.join(' OR ')}`;
  }

  //from("users_docker").getSpecific(["id","age"]).whereOr(["age = 1212","age = 13","age = 23"])
  private prepareWhereOrClause(conditions: string): string {
    const orConditions = JSON.parse(conditions);
    return `WHERE ${orConditions.join(' OR ')}`;
  }

  //from("users_docker").getAll().whereAnd(["age = 121","firstName = 'Dżejssson'"])
  private prepareWhereAndClause(conditions: string) {
    const orConditions = JSON.parse(conditions);
    return [`WHERE ${orConditions.join(' AND ')}`];
  }

  // from("users_docker").getSpecific(["id","age"]).where("age > 10").orderAsc("age")
  private prepareOrderAscClause(column: string): string {
    return `ORDER BY ${JSON.parse(column)} ASC`;
  }

  // from("users_docker").getSpecific(["id","age"]).where("age > 10").orderDesc("age")
  private prepareOrderDescClause(column: string): string {
    return `ORDER BY ${JSON.parse(column)} DESC`;
  }

  // from("users_docker").getSpecific(["age"]).where("age > 15").groupBy(["age"]).orderDesc("age")
  private prepareGroupByClause(columns: string): string {
    const groupByColumns = JSON.parse(columns);
    return `GROUP BY ${groupByColumns.join(',')}`;
  }

  // updateRecord(["users_docker","age","121"]).where("id = 1")
  private prepareUpdateClause(condition: string): string {
    const [tableName, column, value] = JSON.parse(condition);
    return `UPDATE ${tableName} SET ${column}=${value}`;
  }

  // deleteRecord(["users_docker","age","121"])
  private prepareDeleteClause(condition: string): string {
    const [tableName, column, value] = JSON.parse(condition);
    return `DELETE FROM ${tableName} WHERE ${column}=${value}`;
  }

  // clearTable("users_docker2")
  private prepareTruncateClause(tableName: string): string {
    return `TRUNCATE TABLE ${JSON.parse(tableName)}`;
  }

  //from("users_docker").unique("age")
  private prepareDisctintClause(column: string): string {
    return `DISTINCT(${JSON.parse(column)})`;
  }

  // insertRecord(["users_docker","Mariano","Marianowicz","121"])
  // insertRecord(["users_docker","Dżejson","Myszokkkk","121"])
  private insertRecord(record: string): string {
    const [tableName, ...recordData] = JSON.parse(record);
    const quotedRecordData = recordData.map((el) => `'${el}'`);
    return `INSERT INTO ${tableName} VALUES(NULL, ${quotedRecordData.join(
      ', ',
    )})`;
  }
}
