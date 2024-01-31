// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { altairExpress } from "altair-express-middleware";
import { AppModule } from "./app.module";

import { NestExpressApplication } from "@nestjs/platform-express";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const logger = new Logger("Bootstrap Service");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use("/altair", altairExpress({ endpointURL: "/graphql" }));

  logger.log("Starting all microservices");
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.MQTT,
  //   options: {
  //     url: `mqtt://${process.env.MQTT_IP}:${process.env.MQTT_PORT}`,
  //     username: process.env.MQTT_USER,
  //     password: process.env.MQTT_PASS,
  //   },
  // });
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PORT, "0.0.0.0");
  logger.debug(`Server is running at ${await app.getUrl()}`);
}

bootstrap();
