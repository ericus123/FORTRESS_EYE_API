import { Args, Query, Resolver } from "@nestjs/graphql"; // Import Args
import { User } from "./user.model";
import { UserService } from "./user.service";

@Resolver("User")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User, { name: "User" })
  async getUser(@Args("id") id: string): Promise<User> {
    // Define argument name
    return this.userService.getUser(id);
  }

  @Query((returns) => [User], { name: "Users" })
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
