// src/database/database.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { databaseConfigs } from "../config/database.config";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService?: ConfigService) => ({
        dialect: "postgres",
        uri:
          configService.get<string>("NODE_ENV") === "development"
            ? databaseConfigs.development(configService).uri
            : configService.get<string>("NODE_ENV") === "staging"
            ? databaseConfigs.staging(configService).uri
            : databaseConfigs.production(configService).uri,
        models: [User],

        autoLoadModels: true,
        synchronize: true,
        sync: {
          alter: true,
          force: false,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [],
})
export class DatabaseModule {}
