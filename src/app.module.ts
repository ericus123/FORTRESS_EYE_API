import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./database/database.module";
import { validate } from "./env/environment.validation";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
