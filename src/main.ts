import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const logger = new Logger("Bootstrap Service");
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  logger.log("Starting all microservices");
  const config = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT, "0.0.0.0");
  logger.debug(`Server is running on port ${await app.getUrl()}`);
}
bootstrap();
