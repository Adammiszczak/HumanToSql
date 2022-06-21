import { Injectable, Logger } from '@nestjs/common';

type QueryData = {
  database?: string | undefined;
  tableName?: string | undefined;
  columns?: string[] | undefined;
  where?: string[] | undefined;
  create?: string | undefined;
  insert?: string | undefined;
  distinct?: string | undefined;
  update?: string | undefined;
};

@Injectable()
export class SqlQueryBuilderService {
  private readonly logger = new Logger(SqlQueryBuilderService.name);

  public queryData: QueryData = {
    database: '',
    tableName: '',
    columns: [''],
    where: [],
    create: '',
    insert: '',
    distinct: '',
    update: '',
  };
  // dodać orderNum?
  // dodać allowed lub disallowed methods np. na getAll -> getSpecific
  private readonly methodsFunctions = {
    from: { method: this.getTableName, argName: 'tableName' },
    getAll: { method: this.getAllColumns, argName: 'columns' },
    getSpecific: { method: this.getSpecific, argName: 'columns' },
    where: { method: this.prepareWhereClause, argName: 'where' },
    // create: { method: this.createTable, argName: 'create' },
    insertRecord: { method: this.insertRecord, argName: 'insert' },
    unique: { method: this.prepareDisctintClause, argName: 'distinct' },
    updateRecord: { method: this.prepareUpdateClause, argName: 'update' },
  };

  public prepareRawSqlQuery(query: string): string {
    const splittedQuery = this.splitHumanQuery(query);
    const methodsAndValues = this.matchMethodsAndValues(splittedQuery);
    const assertValidMethods = this.assertAllowedClauses(methodsAndValues);
    if (!assertValidMethods) {
      throw new Error("Invalid Request - some methods aren't exist.");
    }

    methodsAndValues.forEach((el, index) => {
      const methodName = el[0];
      const methodArgs = el[1];
      console.log({ index }, methodArgs);
      const args = this.methodsFunctions[methodName]['method'](methodArgs);
      const queryArgName = this.methodsFunctions[methodName]['argName'];
      // walidacja, żeby zrobić push, merge, rest
      this.queryData[queryArgName] = args;
    });
    console.log(this.queryData);

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
      console.log('regex', el.match(regex));
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

  private assertAllowedClauses(array: string[][]) {
    const allowedMethods = this.getAllowedMethods();
    return array.every((el) => allowedMethods.includes(el[0]));
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
    console.log({ columns });
    return JSON.parse(columns);
    //throw
  }

  //from("users_docker").getSpecific(["id","age"]).where("age > 20")
  private prepareWhereClause(condition: string) {
    return [`WHERE ${JSON.parse(condition)}`];
  }

  // updateRecord(["users_docker","age","121"]).where("id = 1")
  private prepareUpdateClause(condition: string) {
    const [tableName, column, value] = JSON.parse(condition);
    return `UPDATE ${tableName} SET ${column} =${value}`;
  }

  //from("users_docker").unique("age")
  private prepareDisctintClause(column: string) {
    return `DISTINCT(${JSON.parse(column)})`;
  }

  // private createTable() {}

  // insertRecord(["users_docker","Dżejson","Myszokkkk","25"])
  private insertRecord(record: string) {
    const [tableName, ...recordData] = JSON.parse(record);
    const quotedRecordData = recordData.map((el) => `'${el}'`);
    return `INSERT INTO ${tableName} VALUES(NULL,${quotedRecordData.join(
      ', ',
    )})`;
  }

  private joinQueryData() {
    let mainClause = `SELECT ${this.queryData.columns.join(', ')} FROM ${
      this.queryData.tableName
    }`;

    if (this.queryData.update) {
      mainClause = this.queryData.update;
    }

    if (this.queryData.insert) {
      console.log(this.queryData.insert);
      return this.queryData.insert;
    }

    if (this.queryData.distinct) {
      mainClause = mainClause.replace(
        ' FROM',
        `${this.queryData.distinct} FROM`,
      );
    }

    const whereClause = this.queryData.where.join(' AND ');
    if (whereClause) {
      mainClause = `${mainClause} ${whereClause}`;
    }
    return mainClause;
  }
}
