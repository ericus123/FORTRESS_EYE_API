import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { CacheModule } from "../cache/cache.module";
import { CryptoModule } from "../crypto/crypto.module";
import { JwtModule } from "../jwt/jwt.module";
import { MailModule } from "../mail/mail.module";
import { MqttModule } from "../mqtt/mqtt.module";
import { RoleModule } from "../role/role.module";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  imports: [
    ConfigModule,
    CryptoModule,
    MqttModule,
    MailModule,
    CacheModule,
    JwtModule,
    RoleModule,
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService, JwtService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
