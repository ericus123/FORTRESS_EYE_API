import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Area } from "./area.model";
import { AreaService } from "./area.service";
import { AreaInput } from "./area.types";

@Resolver("AreaResolver")
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Query(() => Area, { name: "GetArea" })
  async getArea(@Args("id") id: string): Promise<Area> {
    return this.areaService.getArea(id);
  }

  @Query(() => [Area], { name: "GetAreas" })
  async getAreas(): Promise<Area[]> {
    return this.areaService.getAreas();
  }

  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Area, { name: "AddArea" })
  async addArea(@Args("input") input: AreaInput): Promise<Area> {
    return this.areaService.addArea(input);
  }

  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Area, { name: "UpdateArea" })
  async updateArea(@Args("input") input: Area): Promise<Area> {
    return this.areaService.updateArea(input);
  }

  @UseGuards(AuthGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Area, { name: "DeleteArea" })
  async deleteArea(@Args("id") id: string): Promise<void> {
    return this.areaService.deleteArea(id);
  }
}
