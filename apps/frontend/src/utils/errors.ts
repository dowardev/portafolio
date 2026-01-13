type TypeError = "graphQLError" | "defaultError" | "authError";

export function errorBuilder(params: {
  typeError?: TypeError;
  message: string;
}): Error {
  const { typeError = "defaultError", message } = params;

  if (typeError == "graphQLError") return new GraphQLError(message);
  if (typeError == "authError") return new AuthError(message);
  else return new DefaultError(message);
}

class GraphQLError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "GraphQLError";
  }
}

class AuthError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "AuthError";
  }
}

class DefaultError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "Unknown Error";
  }
}
