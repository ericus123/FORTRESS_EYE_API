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
import { GetUserInput, SignupInput, TokenType } from "./user.types";

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
class UserNotVerifiedException extends BadRequestException {
  constructor() {
    super("User is not verified");
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
  ) {}

  async addUser(input: SignupInput): Promise<User> {
    try {
      input.password = await this.hashingService.hash(input.password);
      const user = await this.userModel.create(input);
      const { firstName, email } = user;
      await this.sendMail({ firstName, email, type: "Verification" });
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

  async sendMail({
    firstName,
    email,
    type,
  }: {
    firstName: string;
    email: string;
    type: TokenType;
  }) {
    try {
      const token = jwt.sign(
        {
          email,
          type,
        },
        this.configService.get<string>("JWT_SECRET"),
        { expiresIn: "5m" },
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
    token,
  }: {
    token: string;
  }): Promise<{ verified: boolean }> {
    await this.verifyToken(token);
    const _token: any = this.jwtService.decode(token);

    if (!_token?.email || !_token?.type || _token?.type != "Verification") {
      throw new InvalidTokenException();
    }

    const user = await this.getUser({ type: "EMAIL", value: _token?.email });

    if (!user) {
      throw new UnknownUserException();
    }

    if (user.isVerified) {
      throw new UserAlreadyVerifiedException();
    }

    try {
      user.isVerified = true;
      await user.save();
      return { verified: user.isVerified };
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async requestPasswordReset({
    firstName,
    email,
  }: {
    firstName: string;
    email: string;
  }) {
    try {
      this.sendMail({ firstName, email, type: "Reset" });
      return true;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }

  async resetPassword({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) {
    await this.verifyToken(token);
    const _token: any = this.jwtService.decode(token);
    const user = await this.getUser({ type: "EMAIL", value: _token?.email });
    if (!_token?.email || !_token?.type || _token?.type != "Reset") {
      throw new InvalidTokenException();
    }

    if (!user) {
      throw new UnknownUserException();
    }

    if (!user.isVerified) {
      throw new UserNotVerifiedException();
    }

    const passMatch = await this.hashingService.isMatch({
      hash: user.password,
      value: password,
    });

    if (passMatch) {
      throw new BadRequestException(
        "Old password and new password can't be the same",
      );
    }
    try {
      const newPass = await this.hashingService.hash(password);
      user.password = newPass;
      await user.save();
      return true;
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }
}
