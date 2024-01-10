import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Light } from "./light.model";
import { LightService } from "./light.service";

@Module({
  imports: [SequelizeModule.forFeature([Light])],
  providers: [LightService],
  exports: [LightService],
})
export class LightModule {}
