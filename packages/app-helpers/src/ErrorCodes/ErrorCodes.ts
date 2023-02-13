export const HttpStatus = {
  OK: 200,
  Created: 201,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  BadGateway: 502,
} as const;

export const HttpStatusMessage = {
  200: 'The request was successful.',
  201: 'The request was successful, and a new resource was created.',
  204: 'The request was successful, but there is no response body to return.',
  400: 'The request was invalid or malformed.',
  401: 'The request requires authentication, and the user is not authorized to access the resource.',
  403: 'The request is valid, but the user does not have permission to access the resource.',
  404: 'The requested resource was not found.',
  500: 'The server encountered an unexpected error while processing the request.',
  502: 'The server acting as a gateway or proxy received an invalid response from an upstream server.',
} as const;




