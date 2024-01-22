import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Door } from "./door.model";
import { DoorService } from "./door.service";

@Module({
  imports: [SequelizeModule.forFeature([Door])],
  providers: [DoorService],
  exports: [DoorService],
})
export class DoorModule {}
