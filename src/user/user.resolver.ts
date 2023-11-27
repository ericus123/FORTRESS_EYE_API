import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { User } from "./user.model";
import { UserService } from "./user.service";
import {
  CompleteProfileInput,
  GetUserInput,
  UserVerification,
} from "./user.types";
@Resolver("UsersResolver")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Query(() => User, { name: "GetUser" })
  async getUser(@Args("input") input: GetUserInput): Promise<User> {
    return this.userService.getUser(input);
  }
  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
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

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async completeProfile(
    @Args("email") email: string,
    @Args("input") input: CompleteProfileInput,
    @Context("req") req,
  ) {
    return this.userService.completeProfile({ input, email: req.userEmail });
  }
}
