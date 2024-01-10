import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Sensor } from "./sensor.model";
import { SensorService } from "./sensor.service";

@UseGuards(AuthGuard)
@Injectable()
export class SensorResolver {
  constructor(private readonly sensorService: SensorService) {}
  @Query(() => Sensor, { name: "GetSensor" })
  async getSensor(@Args("id") id: string): Promise<Sensor> {
    return this.sensorService.getSensor(id);
  }

  @Query(() => [Sensor], { name: "GetSensors" })
  async getSensors(): Promise<Sensor[]> {
    return this.sensorService.getSensors();
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Sensor)
  async addSensor(@Args("input") input: Sensor): Promise<Sensor> {
    return this.sensorService.addSensor(input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Sensor)
  async updateSensor(
    @Args("id") id: string,
    @Args("input") input: Sensor,
  ): Promise<Sensor> {
    return this.sensorService.updateSensor(id, input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async deleteSensor(@Args("id") id: string): Promise<boolean> {
    return this.sensorService.deleteSensor(id);
  }
}
