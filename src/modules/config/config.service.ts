import { parse, DotenvParseOutput } from 'dotenv';
import { readFileSync } from 'fs';
import * as Joi from 'joi';
import { ConnectionOptions } from 'typeorm';

export class ConfigService {
  private readonly envConfig: DotenvParseOutput;

  constructor(filePath: string) {
    const parsedConfig = parse(readFileSync(filePath));
    this.envConfig = this.validateInput(parsedConfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(parsedConfig: DotenvParseOutput) {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      DATABASE_TYPE: Joi.string()
        .valid([
          'cockroachdb',
          'cordova',
          'mariadb',
          'mongodb',
          'mssql',
          'mysql',
          'nativescript',
          'oracle',
          'postgres',
          'react-native',
          'sqlite',
          'sqljs',
        ])
        .required(),
      PORT: Joi.number(),
      FCM_ACCESS_KEY: Joi.string(),
      SMTP_HOST: Joi.string(),
      SMTP_PASS: Joi.string(),
      SMTP_USER: Joi.string(),
      SMTP_EMAIL : Joi.string(),
      AWS_ACCESS: Joi.string(),
      AWS_SECRET: Joi.string(),
      AWS_BUCKET: Joi.string(),
      // API_AUTH_ENABLED: Joi.boolean()
      //   .required()
      //   .default(true),
      // add more validation rules ...
    });

    const validationOptions: Joi.ValidationOptions = { allowUnknown: true };

    const { error, value: validatedEnvConfig } = Joi.validate(
      parsedConfig,
      envVarsSchema,
      validationOptions,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Generic getter
   */
  get(key: string) {
    return this.envConfig[key];
  }

  /**
   * Getters for each environment variable
   */
  public get isDev() {
    return this.envConfig.NODE_ENV === 'development';
  }

  public get isProd() {
    return this.envConfig.NODE_ENV === 'production';
  }

  public get isTest() {
    return this.envConfig.NODE_ENV === 'test';
  }

  public get databaseType() {
    return this.envConfig.DATABASE_TYPE;
  }

  public get databaseHost() {
    return this.envConfig.DATABASE_HOST;
  }

  public get databasePort() {
    return Number(this.envConfig.DATABASE_PORT);
  }

  public get databaseUsername() {
    return this.envConfig.DATABASE_USERNAME;
  }

  public get databasePassword() {
    return this.envConfig.DATABASE_PASSWORD;
  }

  public get databaseName() {
    return this.envConfig.DATABASE_NAME;
  }

  public get jwtSecret() {
    return this.envConfig.JWT_SECRET;
  }

  public get googleauthClientId() {
    return this.envConfig.GOOGLEAUTH_CLIENT_ID;
  }

  public get googleauthClientSecret() {
    return this.envConfig.GOOGLEAUTH_CLIENT_SECRET;
  }

  public get googleauthRedirectUri() {
    return this.envConfig.GOOGLEAUTH_REDIRECT_URI;
  }

  public get FCMACCESSKEY() {
    return this.envConfig.FCM_ACCESS_KEY;
  }

  public get SMTPHOST() {
    return this.envConfig.SMTP_HOST;
  }

  public get SMTPPASS() {
    return this.envConfig.SMTP_PASS;
  }

  public get SMTPUSER() {
    return this.envConfig.SMTP_USER;
  }

  public get SMTPEMAIL(){
    return this.envConfig.SMTP_EMAIL
  }

  
  public get AWSACCESS() {
    return this.envConfig.AWS_ACCESS;
  }

  public get AWSSECRET() {
    return this.envConfig.AWS_SECRET;
  }

  public get AWSBUCKET() {
    return this.envConfig.AWS_BUCKET;
  }
}
