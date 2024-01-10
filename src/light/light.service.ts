import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Area } from "../area/area.model";
import { assignUUID } from "../helpers";
import { Light } from "./light.model";

@Injectable()
export class LightService {
  constructor(
    @InjectModel(Light)
    private readonly lightModel: typeof Light,
  ) {}

  async getLight(id: string): Promise<Light> {
    try {
      const light = await this.lightModel.findByPk(id, {
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!light) {
        throw new NotFoundException("Light not found");
      }

      return light;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getLights(): Promise<Light[]> {
    try {
      const lights = await this.lightModel.findAll({
        include: [
          {
            model: Area,
            attributes: ["id", "name"],
          },
        ],
      });
      return lights;
    } catch (error) {
      throw new Error(error);
    }
  }

  async addLight(input: Light): Promise<Light> {
    try {
      return await this.lightModel.create(assignUUID(input), {
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

  async deleteLight(id: string): Promise<boolean> {
    try {
      const light = await this.getLight(id);
      await light.destroy();
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateLight(id: string, input: Light): Promise<Light> {
    try {
      const light = await this.getLight(id);
      await light.update(input);

      return light;
    } catch (error) {
      throw new Error(error);
    }
  }
}
