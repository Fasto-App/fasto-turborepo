import { HttpStatusMessage, HttpStatus, HttpStatusKeysType } from 'app-helpers';
import { GraphQLError } from 'graphql';
import { Bugsnag } from '../../bugsnag/bugsnag';

export const ApolloError = (httpStatus: HttpStatusKeysType, cause?: string, app: "business" | "client" = "business") => {
  const code = HttpStatus[httpStatus];

  Bugsnag.notify(new Error(`${httpStatus}: ${HttpStatusMessage[code]}`))

  throw new GraphQLError(HttpStatusMessage[code], {
    extensions: {
      code,
      cause,
      httpStatus,
      app
    },
  });
}