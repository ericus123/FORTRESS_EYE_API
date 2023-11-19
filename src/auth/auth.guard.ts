import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { JwtService } from "@nestjs/jwt";
import { TokenData } from "./auth.service";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { headers } = ctx.getContext().req;

    const accessToken = this.extractTokenFromHeader(headers);
    const refreshToken = headers["x-refresh-token"];

    if (!accessToken) {
      throw new UnauthorizedException("You are not signed in");
    }

    const payload: TokenData = await this.jwtService.verifyAsync(accessToken, {
      secret: jwtConstants().secret,
    });

    if (!payload.isVerified || payload.isVerified !== true) {
      throw new UnauthorizedException("Account is not verified");
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
