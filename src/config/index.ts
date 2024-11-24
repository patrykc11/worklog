import * as Joi from 'joi';

export const ConfigOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    DATABASE_URL: Joi.string().min(1).required(),
    ACCESS_TOKEN_SECRET: Joi.string().min(1).required(),
    REFRESH_TOKEN_SECRET: Joi.string().min(1).required(),
    ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().min(1).required(),
    REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().min(1).required(),
    TOKEN_ISSUER: Joi.string().min(1).required(),
  }),
};
