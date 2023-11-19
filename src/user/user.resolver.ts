import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { GetUserInput, UserVerification } from "./user.types";

@Resolver("UsersResolver")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: "GetUser" })
  async getUser(@Args("input") input: GetUserInput): Promise<User> {
    return this.userService.getUser(input);
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: "GetUsers" })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Mutation(() => UserVerification, { name: "VerifyUser" })
  async verifyUser(
    @Args("token") token: string,
  ): Promise<{ verified: boolean }> {
    return this.userService.verifyUser({ token });
  }

  @Query(() => Boolean, { name: "RequestPasswordReset" })
  async requestPasswordReset(
    @Args("firstName") firstName: string,
    @Args("email") email: string,
  ): Promise<boolean> {
    return this.userService.requestPasswordReset({ firstName, email });
  }

  @Mutation(() => Boolean, { name: "ResetPassword" })
  async resetPassword(
    @Args("password") password: string,
    @Args("token") token: string,
  ): Promise<boolean> {
    return this.userService.resetPassword({ password, token });
  }
}
