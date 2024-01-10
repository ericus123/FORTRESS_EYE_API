import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Alarm } from "./alarm.model";
import { AlarmService } from "./alarm.service";

@Module({
  imports: [SequelizeModule.forFeature([Alarm])],
  providers: [AlarmService],
  exports: [AlarmService],
})
export class AlarmModule {}
