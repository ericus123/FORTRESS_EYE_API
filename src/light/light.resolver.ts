import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Light } from "./light.model";
import { LightService } from "./light.service";

@UseGuards(AuthGuard)
@Injectable()
export class LightResolver {
  constructor(private readonly lightService: LightService) {}
  @Query(() => Light, { name: "GetLight" })
  async getLight(@Args("id") id: string): Promise<Light> {
    return this.lightService.getLight(id);
  }

  @Query(() => [Light], { name: "GetLights" })
  async getLights(): Promise<Light[]> {
    return this.lightService.getLights();
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Light)
  async addLight(@Args("input") input: Light): Promise<Light> {
    return this.lightService.addLight(input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Light)
  async updateLight(
    @Args("id") id: string,
    @Args("input") input: Light,
  ): Promise<Light> {
    return this.lightService.updateLight(id, input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async deleteLight(@Args("id") id: string): Promise<boolean> {
    return this.lightService.deleteLight(id);
  }
}
