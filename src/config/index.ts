import * as Joi from 'joi';

export const ConfigOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validationSchema: Joi.object({
    PORT: Joi.number().required(),
    DATABASE_URL: Joi.string().min(1).required(),
    JWT_REFRESH_SECRET: Joi.string().min(1).required(),
    JWT_SECRET: Joi.string().min(1).required(),
  }),
};
