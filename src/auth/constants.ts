import { ConfigService } from "@nestjs/config";

export const jwtConstants = () => {
  const s = new ConfigService();
  return {
    secret: s.get("JWT_SECRET"),
  };
};
