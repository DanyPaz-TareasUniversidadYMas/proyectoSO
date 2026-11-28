import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_NAME: Joi.string().default('db'),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.required()
});
