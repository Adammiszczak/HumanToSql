export type SqlBuilderMethods = {
  [key: string]: {
    method: (key: string) => string | string[];
    argName: string;
  };
};
