import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Fan } from "./fan.model";
import { FanService } from "./fan.service";

@Module({
  imports: [SequelizeModule.forFeature([Fan])],
  providers: [FanService],
  exports: [FanService],
})
export class FanModule {}
