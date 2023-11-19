import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import EncryptionService from "../crypto/encryption.service";
import HashingService from "../crypto/hashing.service";
import { User } from "../user/user.model";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: jwtConstants().secret,
        signOptions: { expiresIn: "5m" },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, HashingService, EncryptionService],
  exports: [AuthService],
})
export class AuthModule {}
