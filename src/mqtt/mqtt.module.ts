import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MqttController } from "./mqtt.controler";
import { MqttService } from "./mqtt.service";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "MQTT_SERVICE",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: `mqtt://${configService.get<string>(
              "MQTT_IP",
            )}:${configService.get<string>("MQTT_PORT")}`,
            username: configService.get<string>("MQTT_USER"),
            password: configService.get<string>("MQTT_PASS"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [MqttController],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
