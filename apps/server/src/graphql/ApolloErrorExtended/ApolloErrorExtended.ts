import { HttpStatusMessage, HttpStatus } from 'app-helpers';
import { GraphQLError } from 'graphql';
import { Bugsnag } from '../../bugsnag/bugsnag';

type HttpStatusCode = keyof typeof HttpStatusMessage;
type HttpStatusMessage = typeof HttpStatusMessage[keyof typeof HttpStatusMessage];

type HttpStatusKeys = keyof typeof HttpStatus;
// export class ApolloExtendedError extends GraphQLError {
//   constructor(httpStatus: HttpStatusKeys, cause?: string) {
//     const code = HttpStatus[httpStatus];
//     super(HttpStatusMessage[code], `Fasto BE Error: ${code}`);

//     Object.defineProperty(this, `${httpStatus}`, { value: code });
//     Bugsnag.notify(new Error(`Fasto BE Message: ${HttpStatusMessage[code]}`))
//   }

// }

export const ApolloError = (httpStatus: HttpStatusKeys, cause?: string) => {
  const code = HttpStatus[httpStatus];

  Bugsnag.notify(new Error(`${httpStatus}: ${HttpStatusMessage[code]}`))

  throw new GraphQLError(HttpStatusMessage[code], {
    extensions: {
      code,
      cause,
      httpStatus,
    },
  });
}