import { SequelizeModuleOptions } from "@nestjs/sequelize";

export const databaseConfigs: {
  development: SequelizeModuleOptions;
  staging: SequelizeModuleOptions;
  production: SequelizeModuleOptions;
} = {
  development: {
    dialect: "postgres",
    host: "",
    port: 0,
    username: "",
    password: "",
    database: "",
    synchronize: false,
  },
  staging: {
    dialect: "postgres",
    host: "",
    port: 0,
    username: "",
    password: "",
    database: "",
    synchronize: false,
  },
  production: {
    dialect: "postgres",
    host: "",
    port: 48932257,
    username: "",
    password: "",
    database: "",
    synchronize: false,
  },
};
