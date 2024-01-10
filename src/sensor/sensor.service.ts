import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { assignUUID } from "../helpers";
import { Sensor } from "./sensor.model";

@Injectable()
export class SensorService {
  constructor(
    @InjectModel(Sensor)
    private readonly sensorModel: typeof Sensor,
  ) {}

  async getSensor(id: string): Promise<Sensor> {
    try {
      const sensor = await this.sensorModel.findByPk(id, {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!sensor) {
        throw new NotFoundException("Sensor not found");
      }

      return sensor;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSensors(): Promise<Sensor[]> {
    try {
      return await this.sensorModel.findAll({
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async addSensor(input: Sensor): Promise<Sensor> {
    try {
      return await this.sensorModel.create(assignUUID(input), {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSensor(id: string): Promise<boolean> {
    try {
      const sensor = await this.getSensor(id);
      await sensor.destroy();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSensor(id: string, input: Sensor): Promise<Sensor> {
    try {
      const sensor = await this.getSensor(id);
      await sensor.update(input);
      return sensor;
    } catch (error) {
      throw new Error(error);
    }
  }
}
