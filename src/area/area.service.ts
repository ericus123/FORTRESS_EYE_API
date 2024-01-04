import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Alarm } from "../alarm/alarm.model";
import { Light } from "../light/light.model";
import { Sensor } from "../sensor/sensor.model";
import { Area } from "./area.model";
import { AreaInput } from "./area.types";

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area)
    private readonly areaModel: typeof Area,
  ) {}

  async addArea(input: AreaInput): Promise<Area> {
    try {
      return await this.areaModel.create(input);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAreas(): Promise<Area[]> {
    try {
      return await this.areaModel.findAll({
        include: [
          {
            model: Light,
            attributes: ["id", "isOn", "areaID", "createdAt"],
          },
          {
            model: Sensor,
            attributes: ["id", "name", "type", "value", "areaID", "createdAt"],
          },
          {
            model: Alarm,
            attributes: ["id", "name", "isOn", "areaID", "createdAt"],
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getArea(id: string): Promise<Area> {
    try {
      const area = await this.areaModel.findByPk(id);
      if (!area) {
        throw new NotFoundException("Area not found");
      }
      return area;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateArea(input: Area): Promise<Area> {
    try {
      const area = await this.getArea(input.id);
      return await area.update(input);
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteArea(id: string): Promise<void> {
    try {
      const area = await this.getArea(id);
      return area.destroy();
    } catch (error) {
      throw new Error(error);
    }
  }
}
