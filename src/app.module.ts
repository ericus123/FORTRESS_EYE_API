import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AreaModule } from "./area/area.module";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database/database.module";
import { validate } from "./env/environment.validation";
import { GraphqlModule } from "./graphql/graphql.module";
import { JwtModule } from "./jwt/jwt.module";
import { MailModule } from "./mail/mail.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    AreaModule,
    DatabaseModule,
    CacheModule,
    UserModule,
    AuthModule,
    GraphqlModule,
    MailModule,
    MqttModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
