import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { AreaModule } from "../area/area.module";
import { AuthService } from "../auth/auth.service";
import { CacheModule } from "../cache/cache.module";
import { databaseConfigs } from "../config/database.config";
import { CryptoModule } from "../crypto/crypto.module";
import { JwtModule } from "../jwt/jwt.module";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ConfigModule,
    CryptoModule,
    CacheModule,
    AreaModule,
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
        models: [User, Area],

        autoLoadModels: true,
        // synchronize: true,
        sync: {
          // alter: true,
          force: false,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([User]),
    JwtModule,
  ],
  providers: [UserService, AuthService, MqttService, MailService],
  controllers: [],
})
export class DatabaseModule {}
