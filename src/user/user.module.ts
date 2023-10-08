import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { CacheModule } from "../cache/cache.module";
import EncryptionService from "../crypto/encryption.service";
import HashingService from "../crypto/hashing.service";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([User]),
    MailModule,
    CacheModule,
  ],
  providers: [
    UserService,
    HashingService,
    EncryptionService,
    MqttService,
    MailService,
    JwtService,
  ],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
