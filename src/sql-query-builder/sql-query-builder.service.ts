import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SqlQueryBuilderService {
  private readonly logger = new Logger(SqlQueryBuilderService.name);
  private readonly allowedMethods = [
    'create',
    'insert',
    'select',
    'from',
    'where',
    'distinct',
    'update',
    'delete',
    'truncate',
    'orderBy',
    'and',
    'or',
    'not',
    'groupBy',
  ];

  //   testCasesNegative = [
  //     { method: "setDiscount", value: -100 },
  //     { method: "setDiscount", value: 0 },
  //     { method: "setDiscount", value: 7.2 },
  //     { method: "setDiscount", value: 120 },
  //     { method: "removeItem", value: cartItem1 },
  //     { method: "removeItem", value: cartItem2 },
  // ];

  // dodać orderNum?
  private readonly methodsFunctions = {
    select: { method: this.prepareSelectClause }, //this.clausesFunctions['select']['method'](someArgs)
    from: { method: this.prepareFromClause }, //this.clausesFunctions['select']['method'](someArgs)
    where: { method: this.prepareWhereClause }, //this.clausesFunctions['select']['method'](someArgs)
  };

  public prepareRawSqlQuery(query: string): string {
    const splittedQuery = this.splitHumanQuery(query);
    const methodsAndValues = this.matchMethodsAndValues(splittedQuery);
    const assertValidMethods = this.assertAllowedClauses(methodsAndValues);
    if (!assertValidMethods) {
      throw new Error("Invalid Request - some methods aren't exist.");
    }

    const rawSqlQuery = [];
    methodsAndValues.forEach((el) => {
      const queryPart = this.methodsFunctions[el[0]]['method']([el[1]]);
      rawSqlQuery.push(queryPart);
    });
    this.logger.log(rawSqlQuery.join(' '));
    return rawSqlQuery.join(' ');
  }

  private splitHumanQuery(query: string): string[] {
    return query.split('.');
  }
  // [["select", "id"],["from", "pieski"],,]
  private matchMethodsAndValues(splittedQuery: string[]): string[][] {
    const methodsAndValues = [];
    splittedQuery.forEach((el) => {
      const regex = /([a-z]+)\(\"([a-z*_-]+)\"\)/i;
      const [, method, arg] = el.match(regex);
      methodsAndValues.push([method, arg]);
    });
    return methodsAndValues;
  }
  // public validateHumanQuery() {
  // assertValidMethods + validSymbols * validOrder
  // }

  private assertAllowedClauses(array: string[][]) {
    return array.every((el) => this.allowedMethods.includes(el[0]));
  }

  private prepareSelectClause(columns: string[]) {
    const rawSelectClause = `SELECT ${columns.join(', ')}`;
    return rawSelectClause;
  }
  private prepareFromClause(tableName: string) {
    const rawFromClause = `FROM ${tableName}`;
    return rawFromClause;
  }
  private prepareWhereClause(fieldName: string, fieldValue: string) {
    const rawWhereClause = `WHERE ${fieldName}='${fieldValue}'`;
    return rawWhereClause;
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
