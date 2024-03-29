import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','prod').required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
  EMAIL_TLS_CIPHERS: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_SYNC: Joi.string().required()
});