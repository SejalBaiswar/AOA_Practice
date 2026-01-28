import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
} from "class-validator";
import { UserStatus } from "./create-practice.dto";

export class CreatePartnerDto {
  @IsString()
  @MinLength(3, { message: "Partner name must be at least 3 characters" })
  name: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsString()
  @MinLength(10, { message: "Phone number must be at least 10 digits" })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  practitionerType?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  country?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  house_no?: string;
}
