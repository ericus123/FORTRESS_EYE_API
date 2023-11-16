import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Area } from "./area.model";
import { AreaService } from "./area.service";

@Module({
  imports: [SequelizeModule.forFeature([Area])],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
