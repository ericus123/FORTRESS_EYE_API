import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import HashingService from "../crypto/hashing.service";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { SigninInput, SigninResponse, SignupInput } from "../user/user.types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signin({ email, password }: SigninInput): Promise<SigninResponse> {
    try {
      const user = await this.userModel.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new Error("Unknown user");
      }

      const isMatch = await this.hashingService.isMatch({
        hash: user.password,
        value: password,
      });
      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, email: user.email };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async signup(input: SignupInput): Promise<User> {
    try {
      const exist = await this.userService.getUser({
        type: "EMAIL",
        value: input?.email,
      });

      if (exist) {
        throw new Error("User already registered, please signin");
      }

      const res = await this.userService.addUser(input);

      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async signout() {
    try {
    } catch (error) {}
  }
}
