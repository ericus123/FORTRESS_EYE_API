// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { altairExpress } from "altair-express-middleware";
import * as csurf from "csurf";
import { AppModule } from "./app.module";

import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const logger = new Logger("Bootstrap Service");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.use("/altair", altairExpress({ endpointURL: "/graphql" }));

  logger.log("Starting all microservices");
  const config = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: `mqtt://${config.get<string>("MQTT_IP")}:${config.get<string>(
        "MQTT_PORT",
      )}`,
      username: config.get<string>("MQTT_USER"),
      password: config.get<string>("MQTT_PASS"),
    },
  });
  app.enableCors();
  app.use(csurf({}));
  await app.startAllMicroservices();
  await app.listen(process.env.PORT, "0.0.0.0");
  logger.debug(`Server is running at ${await app.getUrl()}`);
}

bootstrap();
