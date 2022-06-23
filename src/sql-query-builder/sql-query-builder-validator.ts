export class sqlQueryBuilderValidator {
  public static readonly methodsFunctions = {
    from: {
      notValidOtherMethods: [
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    getAll: {
      notValidOtherMethods: [
        'getSpecific',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    getSpecific: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    where: {
      // odtąd trzeba dać poprawne wartości
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    whereNot: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    whereOr: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    whereAnd: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    groupBy: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    orderAsc: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    orderDesc: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    insertRecord: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    unique: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    updateRecord: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    deleteRecord: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
    clearTable: {
      notValidOtherMethods: [
        'getAll',
        'insertRecord',
        'updateRecord',
        'deleteRecord',
        'clearTable',
      ],
    },
  };

  public static checkIfAllowedMethods(queryMethods: string[][]) {
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
  ) {
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
