import { Injectable, Logger } from '@nestjs/common';

type QueryData = {
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

@Injectable()
export class SqlQueryBuilderService {
  private readonly logger = new Logger(SqlQueryBuilderService.name);

  public queryData: QueryData = {
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

  // dodać allowed lub disallowed methods np. na getAll -> getSpecific
  private readonly methodsFunctions = {
    from: {
      method: this.getTableName,
      argName: 'tableName',
      notValidOtherMethods: [
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    getAll: {
      method: this.getAllColumns,
      argName: 'columns',
      notValidOtherMethods: [
        'getSpecific',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    getSpecific: {
      method: this.getSpecific,
      argName: 'columns',
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
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
    const splittedQuery = this.splitHumanQuery(query);
    const methodsAndValues = this.matchMethodsAndValues(splittedQuery);
    const checkIfMethodsAreValid = this.checkIfAllowedMethods(methodsAndValues);
    this.assertAllowedMethods(checkIfMethodsAreValid);

    methodsAndValues.forEach((el) => {
      const methodName = el[0];
      const methodArgs = el[1];
      const checkIfQueryIsValid = this.checkIfValidQueryMethods(
        methodName,
        methodsAndValues,
      );
      this.assertValidQueryMethods(checkIfQueryIsValid);
      const args = this.methodsFunctions[methodName]['method'](methodArgs);
      const queryArgName = this.methodsFunctions[methodName]['argName'];
      this.queryData[queryArgName] = args;
    });
    // console.log(this.queryData);

    const rawSqlQuery = this.joinQueryData();
    this.logger.log(rawSqlQuery);
    this.queryData = {};
    return rawSqlQuery;
  }

  private splitHumanQuery(query: string): string[] {
    return query.split('.');
  }

  private matchMethodsAndValues(splittedQuery: string[]): string[][] {
    const methodsAndValues = [];
    splittedQuery.forEach((el) => {
      const regex = /([a-z]+)\((.*)\)/i;
      // console.log('regex', el.match(regex));
      const [, method, arg = ''] = el.match(regex);
      methodsAndValues.push([method, arg]);
    });
    return methodsAndValues;
  }

  // public validateHumanQuery() {
  // assertValidMethods + validSymbols * validOrder
  // }

  private getAllowedMethods(): string[] {
    return Object.keys(this.methodsFunctions);
  }

  private checkIfAllowedMethods(queryMethods: string[][]) {
    const allowedMethods = this.getAllowedMethods();
    return queryMethods.every((el) => allowedMethods.includes(el[0]));
  }

  private assertAllowedMethods(IfAllowedMethods: boolean): void | never {
    if (!IfAllowedMethods) {
      throw new Error("Invalid Request - some methods don't exist.");
    }
  }

  // from("users_docker").getAll().getSpecific(["id","age"])
  private checkIfValidQueryMethods(
    methodName: string,
    queryMethods: string[][],
  ) {
    const notValidQueryngMethods =
      this.methodsFunctions[methodName].notValidOtherMethods;
    return !queryMethods.some((method) =>
      notValidQueryngMethods.includes(method[0]),
    );
  }

  // from("users_docker").getAll().getSpecific(["id","age"])
  private assertValidQueryMethods(IfValidQueryMethods: boolean): void | never {
    if (!IfValidQueryMethods) {
      throw new Error('Used methods excludes each other');
    }
  }

  private getTableName(tableName: string) {
    return JSON.parse(tableName);
  }

  //from("users_docker").getAll()
  private getAllColumns() {
    return ['*'];
  }

  //from("users_docker").getSpecific(["id","age"]).where("age > 20")
  private getSpecific(columns: string) {
    return JSON.parse(columns);
    //throw
  }

  //from("users_docker").getSpecific(["id","age"]).where("age > 20")
  private prepareWhereClause(condition: string) {
    return [`WHERE ${JSON.parse(condition)}`];
  }

  //from("users_docker").getSpecific(["id","age"]).whereNot("age > 50")
  private prepareWhereNotClause(condition: string) {
    const notConditions = JSON.parse(condition);
    return [`WHERE NOT ${notConditions.join(' OR ')}`];
  }

  //from("users_docker").getSpecific(["id","age"]).whereOr(["age = 1212","age = 13","age = 23"])
  private prepareWhereOrClause(conditions: string) {
    const orConditions = JSON.parse(conditions);
    return [`WHERE ${orConditions.join(' OR ')}`];
  }

  //from("users_docker").getAll().whereAnd(["age = 121","firstName = 'Dżejssson'"])
  private prepareWhereAndClause(conditions: string) {
    const orConditions = JSON.parse(conditions);
    return [`WHERE ${orConditions.join(' AND ')}`];
  }

  // from("users_docker").getSpecific(["id","age"]).where("age > 10").orderAsc("age")
  private prepareOrderAscClause(column: string) {
    return [`ORDER BY ${JSON.parse(column)} ASC`];
  }

  // from("users_docker").getSpecific(["id","age"]).where("age > 10").orderAsc("age")
  private prepareOrderDescClause(column: string) {
    return [`ORDER BY ${JSON.parse(column)} DESC`];
  }

  // from("users_docker").getSpecific(["age"]).where("age > 15").groupBy(["age"]).orderDesc("age")
  private prepareGroupByClause(columns: string) {
    const groupByColumns = JSON.parse(columns);
    console.log({ groupByColumns });
    return [`GROUP BY ${groupByColumns.join(',')}`];
  }

  // updateRecord(["users_docker","age","121"]).where("id = 1")
  private prepareUpdateClause(condition: string) {
    const [tableName, column, value] = JSON.parse(condition);
    return `UPDATE ${tableName} SET ${column}=${value}`;
  }

  // deleteRecord(["users_docker","age","121"])
  private prepareDeleteClause(condition: string) {
    const [tableName, column, value] = JSON.parse(condition);
    return `DELETE FROM ${tableName} WHERE ${column}=${value}`;
  }

  // clearTable("users_docker2")
  private prepareTruncateClause(tableName: string) {
    return `TRUNCATE TABLE ${JSON.parse(tableName)}`;
  }

  //from("users_docker").unique("age")
  private prepareDisctintClause(column: string) {
    return `DISTINCT(${JSON.parse(column)})`;
  }

  // insertRecord(["users_docker","Mariano","Marianowicz","121"])
  // insertRecord(["users_docker","Dżejson","Myszokkkk","121"])
  private insertRecord(record: string) {
    const [tableName, ...recordData] = JSON.parse(record);
    const quotedRecordData = recordData.map((el) => `'${el}'`);
    return `INSERT INTO ${tableName} VALUES(NULL, ${quotedRecordData.join(
      ', ',
    )})`;
  }

  private joinQueryData() {
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

    return mainClause;
  }
}
