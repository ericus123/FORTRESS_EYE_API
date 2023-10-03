import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { MercuriusDriver, MercuriusDriverConfig } from "@nestjs/mercurius";
import { AuthModule } from "../auth/auth.module";
import { AuthResolver } from "../auth/auth.resolver";
import { UserModule } from "../user/user.module";
import { UserResolver } from "../user/user.resolver";

@Module({
  imports: [
    UserModule,
    AuthModule,
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: "schema.gql",
      ide: false,
      graphiql: true,
      routes: true,
      sortSchema: true,
      cache: true,
      errorFormatter: (execution) => {
        return {
          statusCode: 500,
          response: execution,
          errors: execution.errors,
        };
      },
    }),
  ],
  providers: [UserResolver, AuthResolver],
})
export class GraphqlModule {}
