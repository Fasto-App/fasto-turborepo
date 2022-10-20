import { NotNumberTypeError } from '@typegoose/typegoose/lib/internal/errors';
import { ApolloError } from 'apollo-server-errors';
import { Bugsnag } from '../../bugsnag/bugsnag';

export class ApolloExtendedError extends ApolloError {
  constructor(message: string, errorCode?: number) {
    super(message, `OpenTab Message: ${errorCode}`);

    Object.defineProperty(this, 'name', { value: errorCode });
    Bugsnag.notify(new Error(`OpenTab Message: ${message}`))
  }

}