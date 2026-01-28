import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

class AddressDto {
  @IsOptional()
  @IsString()
  addressType?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  house_no?: string;
}

export class CreatePracticeDto {
  @IsString()
  @MinLength(3, { message: "First name must be at least 3 characters" })
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @MinLength(3, { message: "Last name must be at least 3 characters" })
  lastName: string;

  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsString()
  @MinLength(10, { message: "Phone number must be at least 10 digits" })
  phoneNumber: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  practitionerType?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
