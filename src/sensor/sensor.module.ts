import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sensor } from "./sensor.model";
import { SensorService } from "./sensor.service";

@Module({
  imports: [SequelizeModule.forFeature([Sensor])],
  providers: [SensorService],
  exports: [SensorService],
})
export class SensorModule {}
