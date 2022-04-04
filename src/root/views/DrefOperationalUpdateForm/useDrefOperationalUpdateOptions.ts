import {
  ObjectSchema,
  PartialForm,
} from '@togglecorp/toggle-form';
import { DrefOperationalUpdateFields } from './common';

export type FormSchema = ObjectSchema<PartialForm<DrefOperationalUpdateFields>>;
export type FormSchemaFields = ReturnType<FormSchema['fields']>;

export const schema: FormSchema = {
  fields: (value): FormSchemaFields => ({

  })
};
