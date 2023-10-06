// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import EncryptionService from "../crypto/encryption.service";
import HashingService from "../crypto/hashing.service";
import { MailModule } from "../mail/mail.module";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([User]), MailModule],
  providers: [
    UserService,
    HashingService,
    EncryptionService,
    MqttService,
    MailService,
  ],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
