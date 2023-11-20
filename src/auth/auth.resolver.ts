import { UsePipes } from "@nestjs/common";
import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthResponse, SigninInput, SignupInput } from "../user/user.types";
import { ValidationPipe } from "../validations/validation.pipe";
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
  async signin(
    @Args("input") input: SigninInput,
    @Context() context: FastifyContext,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signin(input);
    return { accessToken, refreshToken };
  }

  @Mutation(() => AuthResponse, { name: "SignupUser" })
  @UsePipes(new ValidationPipe())
  async signup(
    @Args("user") input: SignupInput,
    @Context()
    context: FastifyContext,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signup(input);
    return { accessToken, refreshToken };
  }
}
