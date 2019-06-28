import { ModelType } from 'typegoose';
import { Document, PaginateModel } from 'mongoose';

export type TMongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
