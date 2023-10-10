import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database/database.module";
import { validate } from "./env/environment.validation";
import { GraphqlModule } from "./graphql/graphql.module";
import { MailModule } from "./mail/mail.module";
import { MqttModule } from "./mqtt/mqtt.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
    CacheModule,
    UserModule,
    AuthModule,
    GraphqlModule,
    MailModule,
    MqttModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
