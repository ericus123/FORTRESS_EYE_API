import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { AreaModule } from "../area/area.module";
import { AreaResolver } from "../area/area.resolver";
import { AuthModule } from "../auth/auth.module";
import { AuthResolver } from "../auth/auth.resolver";
import { JwtModule } from "../jwt/jwt.module";
import { PermissionModule } from "../permission/permission.module";
import { PermissionResolver } from "../permission/permission.resolver";
import { RoleModule } from "../role/role.module";
import { RoleResolver } from "../role/role.resolver";
import { UserModule } from "../user/user.module";
import { UserResolver } from "../user/user.resolver";

@Module({
  imports: [
    UserModule,
    AuthModule,
    AreaModule,
    JwtModule,
    RoleModule,
    PermissionModule,
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
    PermissionResolver,
  ],
})
export class GraphqlModule {}
