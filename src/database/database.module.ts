import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthService } from "../auth/auth.service";
import { databaseConfigs } from "../config/database.config";
import { CryptoModule } from "../crypto/crypto.module";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ConfigModule,
    CryptoModule,
    JwtModule,
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
        // synchronize: true,
        sync: {
          // alter: true,
          force: true,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
  ],
  providers: [UserService, AuthService, MqttService],
  controllers: [],
})
export class DatabaseModule {}
