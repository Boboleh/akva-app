import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

const defaultOptions = {
  _id: false,
  minimize: false,
};

export function MongoNestedObject(definition: SchemaDefinition, options: SchemaOptions = {}) {
  const type = new Schema(definition, { ...defaultOptions, ...options });
  return {
    type,
    default: {},
    validate: {
      validator(value: any): boolean {
        return isObject(value);
      },
      message: 'Incorrect value',
    },
  };
}

export function isObject(object: any): boolean {
  return typeof object === 'object' && !Array.isArray(object) && object !== null;
}
