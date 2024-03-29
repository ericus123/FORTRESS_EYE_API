import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { Alarm } from "../alarm/alarm.model";
import { Area } from "../area/area.model";
import { AreaModule } from "../area/area.module";
import { AuthService } from "../auth/auth.service";
import { CacheModule } from "../cache/cache.module";
import { Camera } from "../camera/camera.model";
import { databaseConfigs } from "../config/database.config";
import { CryptoModule } from "../crypto/crypto.module";
import { Door } from "../door/door.model";
import { Event } from "../event/event.model";
import { Fan } from "../fan/fan.model";
import { Image } from "../image/image.model";
import { JwtModule } from "../jwt/jwt.module";
import { Light } from "../light/light.model";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { Permission, PermissionRole } from "../permission/permission.model";
import { PermissionModule } from "../permission/permission.module";
import { Role } from "../role/role.model";
import { RoleModule } from "../role/role.module";
import { Sensor } from "../sensor/sensor.model";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";

@Module({
  imports: [
    ConfigModule,
    CryptoModule,
    CacheModule,
    AreaModule,
    RoleModule,
    PermissionModule,
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
        models: [
          User,
          Area,
          Role,
          Permission,
          PermissionRole,
          Light,
          Alarm,
          Image,
          Event,
          Camera,
          Sensor,
          Fan,
          Door,
        ],
        autoLoadModels: true,
        synchronize: process.env.ALTER_TABLES == "true" ? true : false,
        sync: {
          alter: true,
          force: false,
        },
      }),
      inject: [ConfigService],
    }),
    SequelizeModule.forFeature([
      User,
      Role,
      Permission,
      Area,
      PermissionRole,
      Light,
      Alarm,
      Image,
      Event,
      Camera,
      Sensor,
      Fan,
      Door,
    ]),
    JwtModule,
  ],
  providers: [UserService, AuthService, MqttService, MailService],
  controllers: [],
})
export class DatabaseModule {}
