// src/user/user.module.ts

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserService } from "./user.service";

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: configService.get<string>("DEV_DB_HOST"),
        port: configService.get<number>("DEV_DB_PORT"),
        models: [User],
        username: configService.get<string>("DEV_DB_USER"),
        password: configService.get<string>("DEV_DB_PASS"),
        database: configService.get<string>("DEV_DB_NAME"),
        // autoLoadModels: true,
        // synchronize: true,
        sync: {
          force: true,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
