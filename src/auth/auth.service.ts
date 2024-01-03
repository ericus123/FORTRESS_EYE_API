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

  async signup(input: SignupInput, token: string): Promise<AuthResponse> {
    const email = await this.userService.verifyInvitationToken({ token });

    const exist = await this.userService.getUser({
      type: "EMAIL",
      value: email,
    });

    if (exist) {
      throw new UnauthorizedException(AuthErrors.ALREADY_REGISTERED);
    }

    if (email != input.email) {
      throw new UnauthorizedException(AuthErrors.UNAUTHORIZED_REQUEST);
    }

    const res = await this.userService.addUser({ ...input, email });
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

      await this.cacheService.set(`blacklist-${email}`, token, 30000);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(error);
    }
  }

  async signout({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<boolean> {
    try {
      const tok = await this.cacheService.set(
        `blacklist-${email}`,
        token,
        Number(process.env.SIGNOUT_EXP),
      );
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async isTokenBlacklisted({ email, token }: { email: string; token: string }) {
    try {
      const _blacklist = await this.cacheService.get(`blacklist-${email}`);
      return _blacklist === token;
    } catch (error) {
      throw new Error(error);
    }
  }
}
