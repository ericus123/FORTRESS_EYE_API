import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AlarmModule } from "../alarm/alarm.module";
import { AlarmResolver } from "../alarm/alarm.resolver";
import { AreaModule } from "../area/area.module";
import { AreaResolver } from "../area/area.resolver";
import { AuthModule } from "../auth/auth.module";
import { AuthResolver } from "../auth/auth.resolver";
import { DoorModule } from "../door/door.module";
import { DoorResolver } from "../door/door.resolver";
import { FanModule } from "../fan/fan.module";
import { FanResolver } from "../fan/fan.resolver";
import { JwtModule } from "../jwt/jwt.module";
import { LightModule } from "../light/light.module";
import { LightResolver } from "../light/light.resolver";
import { PermissionModule } from "../permission/permission.module";
import { PermissionResolver } from "../permission/permission.resolver";
import { RoleModule } from "../role/role.module";
import { RoleResolver } from "../role/role.resolver";
import { SensorModule } from "../sensor/sensor.module";
import { SensorResolver } from "../sensor/sensor.resolver";
import { UserModule } from "../user/user.module";
import { UserResolver } from "../user/user.resolver";

@Module({
  imports: [
    UserModule,
    AuthModule,
    LightModule,
    AlarmModule,
    AreaModule,
    JwtModule,
    SensorModule,
    RoleModule,
    DoorModule,
    PermissionModule,
    FanModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/graphql/schema.gql",
      sortSchema: true,
    }),
  ],
  providers: [
    UserResolver,
    AuthResolver,
    AreaResolver,
    RoleResolver,
    SensorResolver,
    PermissionResolver,
    LightResolver,
    AlarmResolver,
    FanResolver,
    DoorResolver,
  ],
})
export class GraphqlModule {}
