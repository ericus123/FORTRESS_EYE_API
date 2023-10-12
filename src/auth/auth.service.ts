import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import HashingService from "../crypto/hashing.service";
import { JwtService } from "../jwt/jwt.service";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { AuthResponse, SigninInput, SignupInput } from "../user/user.types";
import { AuthErrors } from "./constants";

export type TokenData = {
  sub: string;
  email: string;
  isVerified: boolean;
};
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async signin({ email, password }: SigninInput): Promise<AuthResponse> {
    try {
      const user = await this.userModel.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new UnauthorizedException(AuthErrors.UNKNOWN_USER);
      }

      const isMatch = await this.hashingService.isMatch({
        hash: user.password,
        value: password,
      });
      if (!isMatch) {
        throw new UnauthorizedException(AuthErrors.PASS_DOESNT_MATCH);
      }

      const payload: TokenData = {
        sub: user.id,
        email: user.email,
        isVerified: user.isVerified,
      };

      const { accessToken, refreshToken } =
        await this.jwtService.generateAuthTokens(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ServiceUnavailableException(AuthErrors.SERVER_ERROR);
    }
  }

  async signup(input: SignupInput): Promise<AuthResponse> {
    const exist = await this.userService.getUser({
      type: "EMAIL",
      value: input?.email,
    });

    if (exist) {
      throw new UnauthorizedException(AuthErrors.ALREADY_REGISTERED);
    }

    const res = await this.userService.addUser(input);
    try {
      const { accessToken, refreshToken } =
        await this.jwtService.generateAuthTokens({
          email: res.email,
          sub: res.id,
        });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ServiceUnavailableException(AuthErrors.SERVER_ERROR);
    }
  }

  async signout() {
    try {
    } catch (error) {}
  }
}
