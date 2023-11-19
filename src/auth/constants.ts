import { ConfigService } from "@nestjs/config";

export const jwtConstants = () => {
  const s = new ConfigService();
  return {
    secret: s.get("JWT_SECRET"),
  };
};

export enum AuthErrors {
  INVALID_TOKEN = "INVALID_TOKEN",
  INVALID_HEADERS = "INVALID_HEADERS",
  UNVERIFIED_ACCOUNT = "UNVERIFIED_ACCOUNT",
  UNKNOWN_USER = "UNKNOWN_USER",
  ALREADY_REGISTERED = "ALREADY_REGISTERED ",
  PASS_DOESNT_MATCH = "PASS_DOESNT_MATCH",
  SERVER_ERROR = "SERVER_ERROR",
}
