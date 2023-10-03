import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import HashingService from "../crypto/hashing.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "./user.model";
import { GetUserInput, SignupInput } from "./user.types";
@Injectable()
export class UserService {
  logger = new Logger("User Service");
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly hashingService: HashingService,
    private readonly mqttService: MqttService,
  ) {
    this.mqttService.subscribe("home/lights/kitchen");
    this.mqttService.onMessage((topic, message) => {
      this.logger.debug(JSON.parse(message));
    });
  }

  async addUser(input: SignupInput): Promise<User> {
    try {
      input.password = await this.hashingService.hash(input.password);
      return this.userModel.create(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser({ type, value }: GetUserInput): Promise<User> {
    try {
      if (type === "EMAIL") {
        const user = await this.userModel.findOne({
          where: {
            email: value,
          },
        });
        return user;
      }

      if (type === "ID") {
        const user = await this.userModel.findByPk(value);
        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll();

      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async completeProfile({ input }: { input: any }) {
    try {
      const user = this.getUser({
        type: "EMAIL",
        value: input,
      });
      if (!user) {
        throw new Error("Unknown user");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
