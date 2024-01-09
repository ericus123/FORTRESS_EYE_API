import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Light } from "./light.model";

@Injectable()
export class LightService {
  constructor(
    @InjectModel(Light)
    private readonly lightModel: typeof Light,
  ) {}

  async getLight(id: string): Promise<Light> {
    try {
      const light = await this.lightModel.findByPk(id);

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
      return await this.lightModel.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteLight(id: string): Promise<void> {
    try {
      const light = await this.getLight(id);
      await light.destroy();
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateLight(id: string, input: Light): Promise<Light> {
    try {
      const light = await this.getLight(id);
      return await light.update(input);
    } catch (error) {
      throw new Error(error);
    }
  }
}
