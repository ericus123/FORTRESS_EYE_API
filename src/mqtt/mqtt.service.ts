import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mqtt from "mqtt";

@Injectable()
export class MqttService {
  private mqttClient: mqtt.MqttClient;

  constructor(private readonly configService: ConfigService) {
    this.mqttClient = mqtt.connect(
      `mqtt://${this.configService.get<string>(
        "MQTT_IP",
      )}:${this.configService.get<string>("MQTT_PORT")}`,
      {
        username: this.configService.get<string>("MQTT_USER"),
        password: this.configService.get<string>("MQTT_PASS"),
      },
    );
  }

  publish(topic: string, message: string) {
    this.mqttClient.publish(topic, message);
  }

  subscribe(topic: string) {
    this.mqttClient.subscribe(topic);
  }

  onMessage(callback: (topic: string, message: string) => void) {
    this.mqttClient.on("message", (topic, message) => {
      callback(topic, message.toString());
    });
  }
}
