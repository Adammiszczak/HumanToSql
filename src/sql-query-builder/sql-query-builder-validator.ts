import { SqlValidatorMethods } from './types/sqlValidatorMethods';

export class sqlQueryBuilderValidator {
  private static standaloneMethods = [
    'insertRecord',
    'updateRecord',
    'deleteRecord',
    'clearTable',
  ];

  public static readonly methodsFunctions: SqlValidatorMethods = {
    from: {
      notValidOtherMethods: [...this.standaloneMethods],
    },
    getAll: {
      notValidOtherMethods: ['getSpecific', ...this.standaloneMethods],
    },
    getSpecific: {
      notValidOtherMethods: ['getAll', ...this.standaloneMethods],
    },
    unique: {
      notValidOtherMethods: ['groupBy', ...this.standaloneMethods],
    },
    where: {
      notValidOtherMethods: [
        ...this.standaloneMethods,
        'whereNot',
        'whereOr',
        'whereAnd',
      ],
    },
    whereNot: {
      notValidOtherMethods: [
        ...this.standaloneMethods,
        'where',
        'whereOr',
        'whereAnd',
      ],
    },
    whereOr: {
      notValidOtherMethods: [
        ...this.standaloneMethods,
        'whereNot',
        'where',
        'whereAnd',
      ],
    },
    whereAnd: {
      notValidOtherMethods: [
        ...this.standaloneMethods,
        'whereNot',
        'whereOr',
        'where',
      ],
    },
    groupBy: {
      notValidOtherMethods: ['unique', ...this.standaloneMethods],
    },
    orderAsc: {
      notValidOtherMethods: ['orderDesc', ...this.standaloneMethods],
    },
    orderDesc: {
      notValidOtherMethods: ['orderAsc', ...this.standaloneMethods],
    },
    insertRecord: {
      notValidOtherMethods: ['updateRecord', 'deleteRecord', 'clearTable'],
    },
    updateRecord: {
      notValidOtherMethods: ['insertRecord', 'deleteRecord', 'clearTable'],
    },
    deleteRecord: {
      notValidOtherMethods: ['insertRecord', 'updateRecord', 'clearTable'],
    },
    clearTable: {
      notValidOtherMethods: ['insertRecord', 'updateRecord', 'deleteRecord'],
    },
  };

  public static checkIfAllowedMethods(queryMethods: string[][]): boolean {
    const allowedMethods = this.getAllowedMethods();
    return queryMethods.every((el) => allowedMethods.includes(el[0]));
  }

  public static assertAllowedMethods(IfAllowedMethods: boolean): void | never {
    if (!IfAllowedMethods) {
      throw new Error("Invalid Request - some methods don't exist.");
    }
  }

  // from("users_docker").getAll().getSpecific(["id","age"])
  public static checkIfValidQueryMethods(
    methodName: string,
    queryMethods: string[][],
  ): boolean {
    const notValidQueryngMethods =
      this.methodsFunctions[methodName].notValidOtherMethods;
    return !queryMethods.some((method) =>
      notValidQueryngMethods.includes(method[0]),
    );
  }

  // from("users_docker").getAll().getSpecific(["id","age"])
  public static assertValidQueryMethods(
    IfValidQueryMethods: boolean,
  ): void | never {
    if (!IfValidQueryMethods) {
      throw new Error('Used methods excludes each other');
    }
  }
  private static getAllowedMethods(): string[] {
    return Object.keys(this.methodsFunctions);
  }
}
