import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/sequelize";
import * as jwt from "jsonwebtoken";
import HashingService from "../crypto/hashing.service";
import { InvalidTokenException, JwtService } from "../jwt/jwt.service";
import { MailService } from "../mail/mail.service";
import { MqttService } from "../mqtt/mqtt.service";
import { Permission } from "../permission/permission.model";
import { Role, RoleName } from "../role/role.model";
import { RoleService } from "../role/role.service";
import { User } from "./user.model";
import {
  CompleteProfileInput,
  GetUserInput,
  SignupInput,
  TokenType,
} from "./user.types";

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
    private readonly roleService: RoleService,
    private readonly mailService: MailService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async addUser(input: SignupInput): Promise<User> {
    try {
      input.password = await this.hashingService.hash(input.password);
      const user = await this.userModel.create(input);
      const defaultRole = await this.roleService.getRole({
        type: "roleName",
        value: RoleName.DEFAULT,
      });

      user.roleId = defaultRole.id;
      await user.save();
      const { firstName, email } = user;
      await this.sendMail({ firstName, email, type: TokenType.Verification });
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
          include: [
            {
              model: Role,
              attributes: ["roleName", "description"],
            },
          ],
        });

        return user;
      }

      if (type === "ID") {
        const user = await this.userModel.findByPk(value, {
          include: [
            {
              model: Role,
              attributes: ["roleName", "description"],
              include: [
                {
                  model: Permission,
                  attributes: ["permissionName", "description"],
                },
              ],
            },
          ],
        });
        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll({
        include: [
          {
            model: Role,
            attributes: ["roleName", "description"],
            include: [
              {
                model: Permission,
                attributes: ["permissionName", "description"],
              },
            ],
          },
        ],
      });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  async completeProfile({
    input,
    email,
  }: {
    input: CompleteProfileInput;
    email: string;
  }): Promise<User> {
    try {
      const user = await this.getUser({
        type: "EMAIL",
        value: email,
      });
      if (!user) {
        throw new Error("Unknown user");
      }

      if (user.isComplete) {
        throw new BadRequestException("Your profile is already complete");
      }

      return await user.update(input);
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
      const token = await this.jwtService.generateToken(
        {
          email,
          type,
        },
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

  async verifyUser({
    token,
  }: {
    token: string;
  }): Promise<{ verified: boolean }> {
    await this.jwtService.verifyToken(token);
    const _token: any = jwt.decode(token);

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
      this.sendMail({ firstName, email, type: TokenType.Reset });
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
    await this.jwtService.verifyToken(token);
    const _token: any = jwt.decode(token);
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

  async assignRole({ email, roleName }: { email: string; roleName: RoleName }) {
    try {
      const user = await this.getUser({ type: "EMAIL", value: email });
      const role = await this.roleService.getRole({
        type: "roleName",
        value: roleName,
      });
      user.roleId = role.id;
      await user.save();

      this.logger.debug("new role assigned to ", email);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }
}
