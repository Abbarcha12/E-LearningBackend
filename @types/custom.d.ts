import { Request } from 'express';
import { IUser } from '../models/user.model';

// Augment the Request type to include the 'user' property with IUser type
declare module 'express' {
  interface Request {
    user?: IUser;
  }
}
