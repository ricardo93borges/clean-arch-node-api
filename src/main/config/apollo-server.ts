import { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirectiveTransformer } from "@/main/graphql/directives";
import typeDefs from "@/main/graphql/type-defs";
import resolvers from "@/main/graphql/resolvers";
import { GraphQLError } from "graphql";

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error) => {
    response.data = undefined;
    if (checkError(error, "AuthenticationError")) {
      response.http.status = 401;
    } else if (checkError(error, "UserInputError")) {
      response.http.status = 400;
    } else if (checkError(error, "ForbiddenError")) {
      response.http.status = 403;
    } else {
      response.http.status = 500;
    }
  });
};

const checkError = (error: GraphQLError, errorName: string) => {
  return error.name === errorName || error.originalError.name === errorName;
};

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) =>
            handleErrors(response, errors),
        }),
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });
};
