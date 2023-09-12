import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { GetUserInput } from "./user.types";

@Resolver("UsersResolver")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: "GetUser" })
  async getUser(@Args("input") input: GetUserInput): Promise<User> {
    return this.userService.getUser(input);
  }

  @Query(() => [User], { name: "GetUsers" })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
