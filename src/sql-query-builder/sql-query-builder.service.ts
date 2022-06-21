import { Injectable, Logger } from '@nestjs/common';

type QueryData = {
  database?: string | undefined;
  tableName?: string | undefined;
  columns?: string[] | undefined;
  where?: string[] | undefined;
};

@Injectable()
export class SqlQueryBuilderService {
  private readonly logger = new Logger(SqlQueryBuilderService.name);
  // scalić z methodsFunctions
  // private readonly allowedMethods = [
  //   'create',
  //   'insert',
  //   'select',
  //   'from',
  //   'where',
  //   'distinct',
  //   'update',
  //   'delete',
  //   'truncate',
  //   'orderBy',
  //   'and',
  //   'or',
  //   'not',
  //   'groupBy',
  // ];

  public queryData: QueryData = {
    database: '',
    tableName: '',
    columns: [''],
    where: [],
  };
  // dodać orderNum?
  private readonly methodsFunctions = {
    from: { method: this.getTableName, argName: 'tableName' },
    getAll: { method: this.getAllColumns, argName: 'columns' },
    getSpecific: { method: this.getSpecific, argName: 'columns' },
    where: { method: this.prepareWhereClause, argName: 'where' },
  };

  public prepareRawSqlQuery(query: string): string {
    const splittedQuery = this.splitHumanQuery(query);
    const methodsAndValues = this.matchMethodsAndValues(splittedQuery);
    const assertValidMethods = this.assertAllowedClauses(methodsAndValues);
    if (!assertValidMethods) {
      throw new Error("Invalid Request - some methods aren't exist.");
    }

    methodsAndValues.forEach((el, index) => {
      console.log({ index }, el[1]);
      const args = this.methodsFunctions[el[0]]['method'](el[1]);
      const queryArgName = this.methodsFunctions[el[0]]['argName'];
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
  // [["getAll", "id"],["from", "pieski"],,]

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

  // private prepareFromClause(tableName: string, columns: string[]) {
  //   const rawFromClause = `SELECT ${columns.join(', ')} FROM ${tableName}`;
  //   return rawFromClause;
  // }

  private getTableName(tableName: string) {
    return JSON.parse(tableName);
  }

  // private prepareGetAllClause(tableName: string) {
  //   const rawGetAllClause = `FROM ${tableName}`;
  //   return rawGetAllClause;
  // }

  private getAllColumns() {
    return ['*'];
  }
  //from("users_docker").getSpecific("["id","age"]").where("age > 20")
  private getSpecific(columns: string) {
    console.log({ columns });
    return JSON.parse(columns);
    //throw
  }

  private prepareWhereClause(condition: string) {
    return [`WHERE ${JSON.parse(condition)}`];
  }

  private joinQueryData() {
    const selectClause = `SELECT ${this.queryData.columns.join(', ')} FROM ${
      this.queryData.tableName
    }`;
    const whereClause = this.queryData.where.join(' AND ');

    if (whereClause) {
      return `${selectClause} ${whereClause}`;
    }
    return selectClause;
  }

  // private checkHumanQueryOrder() {}

  // praivate prepareCreateClause() {}
  // praivate prepareInsertClause() {}
  // praivate prepareDistinctClause() {}
  // praivate prepareUpdateClause() {}
  // praivate prepareDeleteClause() {}
  // praivate prepareTruncateClause() {}
  // praivate prepareOrderByClause() {}
  // praivate prepareAndClause() {}
  // praivate prepareOrClause() {}
  // praivate prepareNotClause() {}
  // praivate prepareGroupByClause() {}
}
