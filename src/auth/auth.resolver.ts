import { UsePipes } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "../user/user.model";
import { SigninInput, SigninResponse, SignupInput } from "../user/user.types";
import { ValidationPipe } from "../validations/validation.pipe";
import { AuthService } from "./auth.service";

@Resolver("AuthResolver")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SigninResponse, { name: "Signin" })
  @UsePipes(new ValidationPipe())
  async signin(@Args("input") input: SigninInput): Promise<SigninResponse> {
    return this.authService.signin(input);
  }

  @Mutation(() => User, { name: "SignupUser" })
  @UsePipes(new ValidationPipe())
  async signup(@Args("user") input: SignupInput): Promise<User> {
    return this.authService.signup(input);
  }
}
