import { plainToClass } from "class-transformer";
import { IsInt, IsString, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsInt({ message: "Invalid PORT" })
  PORT: number;
  @IsString({ message: "Invalid REDIS URL" })
  REDIS_CONNECTION_URI: string;
  @IsString({ message: "Invalid NODE ENV" })
  NODE_ENV: string;
  @IsString({ message: "Invalid DEV DB URI" })
  DEV_DB_URI: string;
  @IsString({ message: "Invalid STG DB URI" })
  STAG_DB_URI: string;
  @IsString({ message: "Invalid PROD DB URI" })
  PROD_DB_URI: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors?.toString());
  }
  return validatedConfig;
};
