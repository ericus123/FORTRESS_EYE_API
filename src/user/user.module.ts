// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import EncryptionService from "../crypto/encryption.service";
import HashingService from "../crypto/hashing.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  imports: [ConfigModule, SequelizeModule.forFeature([User])],
  providers: [UserService, HashingService, EncryptionService, MqttService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
