import { Controller, Logger } from "@nestjs/common";
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from "@nestjs/microservices";

@Controller()
export class MqttController {
  logger = new Logger("MQTT Controller");
  @MessagePattern("home/lights/kitchen")
  getNotifications(@Payload() data: number[], @Ctx() context: MqttContext) {
    this.logger.debug(`Topic: ${context.getTopic()}`);
  }
}
