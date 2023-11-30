import { UseGuards, UsePipes } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthResponse, SigninInput, SignupInput } from "../user/user.types";
import { ValidationPipe } from "../validations/validation.pipe";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

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
  async signup(
    @Args("user") input: SignupInput,
    @Args("token") token: string,
  ): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.authService.signup(
      input,
      token,
    );
    return { accessToken, refreshToken };
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: "SignoutUser" })
  async signout(@Args("email") email: string, @Args("token") token: string) {
    return this.authService.signout({ email, token });
  }
}
