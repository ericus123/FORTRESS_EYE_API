import { UseGuards, UsePipes } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthResponse, SigninInput, SignupInput } from "../user/user.types";
import { ValidationPipe } from "../validations/validation.pipe";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

export type FastifyContext = {
  reply: FastifyReply;
  request: FastifyRequest;
};

@Resolver("AuthResolver")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: "Signin" })
  @UsePipes(new ValidationPipe())
  async signin(@Args("input") input: SigninInput): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signin(input);
    return { accessToken, refreshToken };
  }

  @Mutation(() => AuthResponse, { name: "SignupUser" })
  @UsePipes(new ValidationPipe())
  async signup(@Args("user") input: SignupInput): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signup(input);
    return { accessToken, refreshToken };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: "SignoutUser" })
  async signout(@Args("email") email: string, @Args("token") token: string) {
    return this.authService.signout({ email, token });
  }
}
