import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { AuthResponse, CompleteProfileInput, GetUserInput } from "./user.types";
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
  @Query(() => [User], { name: "GetUsers" })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Mutation(() => AuthResponse, { name: "VerifyUser" })
  async VerifyUser(@Args("token") token: string): Promise<AuthResponse> {
    return this.userService.verifyUser({ token });
  }
  @Mutation(() => Boolean, { name: "RequestPasswordReset" })
  async requestPasswordReset(@Args("email") email: string): Promise<boolean> {
    return this.userService.requestPasswordReset({ email });
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

  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async InviteUser(@Args("email") email: string): Promise<boolean> {
    return this.userService.sendInvitation({ email });
  }

  @Mutation(() => Boolean)
  async SendVerification(@Args("email") email: string): Promise<void> {
    return this.userService.sendVerificationEmail(email);
  }
}
