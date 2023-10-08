import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import * as jwt from "jsonwebtoken";
import { CacheService } from "../cache/cache.service";
import HashingService from "../crypto/hashing.service";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { User } from "./user.model";
import { GetUserInput, SignupInput } from "./user.types";

class InvalidTokenException extends Error {
  constructor() {
    super("Invalid token");
  }
}

class UnknownUserException extends NotFoundException {
  constructor() {
    super("Unknown User");
  }
}

class UserAlreadyVerifiedException extends BadRequestException {
  constructor() {
    super("User already verified");
  }
}

@Injectable()
export class UserService {
  logger = new Logger("User Service");
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly hashingService: HashingService,
    private readonly mqttService: MqttService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    this.mqttService.subscribe("home/lights/kitchen");
    this.mqttService.onMessage((topic, message) => {
      this.logger.debug(JSON.parse(message));
    });
  }

  async addUser(input: SignupInput): Promise<User> {
    try {
      input.password = await this.hashingService.hash(input.password);
      const user = await this.userModel.create(input);
      const { firstName, email } = user;
      await this.sendVeificationMail({ firstName, email });
      return user;
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
      this.mqttService.publish("home/lights/kitchen", JSON.stringify(users));
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

  async sendVeificationMail({
    firstName,
    email,
  }: {
    firstName: string;
    email: string;
  }) {
    try {
      const token = jwt.sign(
        {
          email,
        },
        this.configService.get<string>("JWT_SECRET"),
        { expiresIn: "1m" },
      );

      const template = this.mailService.getVerificationTemplate({
        firstName,
        token,
      });
      await this.mailService.sendEmail({
        to: email,
        subject: "Verification email",
        text: template,
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async verifyToken(token: string) {
    try {
      const isValid = this.jwtService.verify(token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      if (!isValid) {
        throw new InvalidTokenException();
      }
    } catch (error) {
      throw new InvalidTokenException();
    }
  }

  async verifyUser({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<{ verified: boolean }> {
    await this.verifyToken(token);

    const user = await this.getUser({ type: "EMAIL", value: email });

    if (!user) {
      throw new UnknownUserException();
    }

    if (user.verified) {
      throw new UserAlreadyVerifiedException();
    }

    try {
      user.verified = true;
      await user.save();
      return { verified: user.verified };
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
}
