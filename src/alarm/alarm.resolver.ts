import { Injectable, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { Roles } from "../auth/auth.decorators";
import { AuthGuard } from "../auth/auth.guard";
import { RoleName } from "../role/role.model";
import { Alarm } from "./alarm.model";
import { AlarmService } from "./alarm.service";

@UseGuards(AuthGuard)
@Injectable()
export class AlarmResolver {
  constructor(private readonly alarmService: AlarmService) {}
  @Query(() => Alarm, { name: "GetAlarm" })
  async getAlarm(@Args("id") id: string): Promise<Alarm> {
    return this.alarmService.getAlarm(id);
  }

  @Query(() => [Alarm], { name: "GetAlarms" })
  async getAlarms(): Promise<Alarm[]> {
    return this.alarmService.getAlarms();
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Alarm)
  async addAlarm(@Args("input") input: Alarm): Promise<Alarm> {
    return this.alarmService.addAlarm(input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Alarm)
  async updateAlarm(
    @Args("id") id: string,
    @Args("input") input: Alarm,
  ): Promise<Alarm> {
    return this.alarmService.updateAlarm(id, input);
  }

  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @Mutation(() => Boolean)
  async deleteAlarm(@Args("id") id: string): Promise<boolean> {
    return this.alarmService.deleteAlarm(id);
  }
}
