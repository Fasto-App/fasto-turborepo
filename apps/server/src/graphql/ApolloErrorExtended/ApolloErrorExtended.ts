import { HttpStatusMessage, HttpStatus, HttpStatusKeysType } from 'app-helpers';
import { GraphQLError } from 'graphql';
import { Bugsnag } from '../../bugsnag/bugsnag';


export const ApolloError = (error: Error, httpStatus: HttpStatusKeysType, app?: "business" | "customer") => {
  const code = HttpStatus[httpStatus];

  Bugsnag.notify(error)

  throw new GraphQLError(error.message, {
    extensions: {
      code,
      httpStatus,
      cause: `${httpStatus}: ${HttpStatusMessage[code]}`,
      app
    },
  });
}
