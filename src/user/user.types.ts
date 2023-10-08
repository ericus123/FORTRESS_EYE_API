import { Field, InputType, ObjectType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";
import { Column, DataType } from "sequelize-typescript";

export type UserFindType = "EMAIL" | "ID";
@InputType()
@ObjectType()
export class GetUserInput {
  @Field({ nullable: false })
  type: UserFindType;
  @Field({ nullable: false })
  value: string;
}

@ObjectType()
export class SigninResponse {
  @Field({ nullable: false })
  accessToken: string;
}

@ObjectType()
export class UserVerification {
  @Field({ nullable: false })
  verified: boolean;
}
@InputType()
@ObjectType()
export class SigninInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsEmail()
  @Column({ type: DataType.STRING })
  email: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @MinLength(6)
  @Column({ type: DataType.STRING })
  password: string;
}

@InputType()
@ObjectType()
export class SignupInput {
  @Field({ nullable: false })
  @MinLength(2)
  @MaxLength(16)
  @Column({ type: DataType.STRING })
  firstName: string;

  @Field({ nullable: false })
  @MinLength(2)
  @MaxLength(16)
  @Column({ type: DataType.STRING })
  lastName: string;

  @Field({ nullable: false })
  @IsEmail()
  @Column({ type: DataType.STRING })
  email: string;

  @Field({ nullable: false })
  @MinLength(6)
  @IsStrongPassword()
  @Column({ type: DataType.STRING })
  password: string;
}
