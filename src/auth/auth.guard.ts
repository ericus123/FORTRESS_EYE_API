import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "../jwt/jwt.service";
import { AuthErrors } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { headers, res } = ctx.getContext().req;

    const accessToken = this.extractTokenFromHeader(headers);
    const refreshToken = headers["x-refresh-token"];

    if (!refreshToken) {
      throw new UnauthorizedException(AuthErrors.INVALID_HEADERS);
    }

    const isValidRefreshToken = await this.jwtService.verifyToken(refreshToken);
    const payload: any = await this.jwtService.verifyToken(accessToken);

    if (!isValidRefreshToken) {
      throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
    }

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException(AuthErrors.INVALID_HEADERS);
    }

    if (!payload || payload?.data?.isVerified !== true) {
      throw new UnauthorizedException(AuthErrors.UNVERIFIED_ACCOUNT);
    }

    if (
      payload.exp - Date.now() <
      Number(process.env.JWT_EXPIRATION_THRESHOLD)
    ) {
      const token = await this.jwtService.refreshAccessToken(payload.data.sub);
      if (!token) {
        throw new UnauthorizedException(AuthErrors.INVALID_TOKEN);
      }
      res.setHeader("Authorization", `Bearer ${token}`);
    }

    return true;
  }

  private extractTokenFromHeader(headers: any): string | undefined {
    const token = headers["authorization"].split(" ");
    if (token.length === 2 && token[0].toLowerCase() === "bearer") {
      return token[1];
    }
    return undefined;
  }
}
