import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Fan } from "./fan.model";
import { FanService } from "./fan.service";

@UseGuards(AuthGuard)
@Injectable()
export class FanResolver {
  constructor(private readonly fanService: FanService) {}
  @Query(() => Fan, { name: "GetFan" })
  async getFan(@Args("id") id: string): Promise<Fan> {
    return this.fanService.getFan(id);
  }

  @Query(() => [Fan], { name: "GetFans" })
  async getFans(): Promise<Fan[]> {
    return this.fanService.getFans();
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Fan)
  async addFan(@Args("input") input: Fan): Promise<Fan> {
    return this.fanService.addFan(input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Fan)
  async updateFan(
    @Args("id") id: string,
    @Args("input") input: Fan,
  ): Promise<Fan> {
    return this.fanService.updateFan(id, input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async deleteFan(@Args("id") id: string): Promise<boolean> {
    return this.fanService.deleteFan(id);
  }
}
