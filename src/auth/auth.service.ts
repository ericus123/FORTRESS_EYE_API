import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { CacheService } from "../cache/cache.service";
import HashingService from "../crypto/hashing.service";
import { JwtService } from "../jwt/jwt.service";
import { RoleName } from "../role/role.model";
import { User } from "../user/user.model";
import { UserService } from "../user/user.service";
import { AuthResponse, SigninInput, SignupInput } from "../user/user.types";
import { AuthErrors } from "./constants";

export type TokenData = {
  sub: string;
  email: string;
  isVerified: boolean;
  role?: RoleName;
  permissions?: PermissionName[];
};
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly hashingService: HashingService,
    private readonly cacheService: CacheService,
    private jwtService: JwtService,
  ) {}

  async signin({ email, password }: SigninInput): Promise<AuthResponse> {
    try {
      // const user = await this.userModel.findOne({
      //   where: {
      //     email,
      //   },
      // });

      const user = await this.userService.getUser({
        type: "EMAIL",
        value: email,
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
        role: user.role.roleName,
      };

      const { accessToken, refreshToken } =
        await this.jwtService.generateAuthTokens(payload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
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
    const user = await this.userService.getUser({
      type: "EMAIL",
      value: res.email,
    });
    try {
      const { email, isVerified, role, id } = user;
      const { accessToken, refreshToken } =
        await this.jwtService.generateAuthTokens({
          email,
          sub: id,
          role: role.roleName,
          isVerified,
        });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
    }
  }

  async signout({ email, token }: { email: string; token: string }) {
    try {
      this.cacheService.set(
        `blacklist-${email}`,
        token,
        Number(process.env.SIGNOUT_EXP),
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  async isTokenBlacklisted({ email, token }: { email: string; token: string }) {
    try {
      const _blacklist = await this.cacheService.get(`blacklist-${email}`);

      if (_blacklist != undefined && _blacklist === token) {
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
}
