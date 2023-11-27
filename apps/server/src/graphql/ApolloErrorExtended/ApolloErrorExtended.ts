import { HttpStatusMessage, HttpStatus, HttpStatusKeysType } from 'app-helpers';
import { GraphQLError } from 'graphql';
import { Bugsnag } from '../../bugsnag/bugsnag';

// have a function that will return the appropriate error message
const errorMessage = (httpStatus: HttpStatusKeysType,) => {
  const code = HttpStatus[httpStatus];

  return `${httpStatus}: ${HttpStatusMessage[code]}`
}

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

// this new way of calling the Error Function will pass the error from where it ocurred
// the error needs to be called with the 
export const ApolloErrorTest = (error: Error, httpStatus: HttpStatusKeysType) => {
  const code = HttpStatus[httpStatus];

  Bugsnag.notify(error)

  console.log(error.message)

  throw new GraphQLError(HttpStatusMessage[code], {
    extensions: {
      code,
      cause: httpStatus,
      httpStatus,
    },
  });
}