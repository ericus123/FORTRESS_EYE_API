import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { RoleName } from "../role/role.model";
import { Door } from "./door.model";
import { DoorService } from "./door.service";

// @UseGuards(AuthGuard)
@Injectable()
export class DoorResolver {
  constructor(private readonly doorService: DoorService) {}
  @Query(() => Door, { name: "GetDoor" })
  async getDoor(@Args("id") id: string): Promise<Door> {
    return this.doorService.getDoor(id);
  }

  @Query(() => [Door], { name: "GetDoors" })
  async getDoors(): Promise<Door[]> {
    return this.doorService.getDoors();
  }

  // @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Door)
  async addDoor(@Args("input") input: Door): Promise<Door> {
    return this.doorService.addDoor(input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Door)
  async updateDoor(
    @Args("id") id: string,
    @Args("input") input: Door,
  ): Promise<Door> {
    return this.doorService.updateDoor(id, input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async deleteDoor(@Args("id") id: string): Promise<boolean> {
    return this.doorService.deleteDoor(id);
  }
}
