import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AlarmModule } from "./alarm/alarm.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AreaModule } from "./area/area.module";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database/database.module";
import { validate } from "./env/environment.validation";
import { GraphqlModule } from "./graphql/graphql.module";
import { JwtModule } from "./jwt/jwt.module";
import { LightModule } from "./light/light.module";
import { MailModule } from "./mail/mail.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { SensorModule } from "./sensor/sensor.module";
import { UserModule } from "./user/user.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    AreaModule,
    DatabaseModule,
    CacheModule,
    UserModule,
    AuthModule,
    GraphqlModule,
    MailModule,
    MqttModule,
    JwtModule,
    LightModule,
    AlarmModule,
    SensorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
