// src/database/database.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { databaseConfigs } from "../config/database.config";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfigs[process.env.NODE_ENV || "development"],
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([]),
  ],
  providers: [],
  controllers: [],
})
export class DatabaseModule {}
