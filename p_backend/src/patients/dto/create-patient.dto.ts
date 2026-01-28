import {
  IsString,
  IsEmail,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(1, { message: 'First name cannot be empty' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters' })
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Middle name must not exceed 100 characters' })
  middleName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(1, { message: 'Last name cannot be empty' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters' })
  lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Contact number is required' })
  @Matches(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    {
      message: 'Please provide a valid contact number',
    },
  )
  @MaxLength(20, { message: 'Contact number must not exceed 20 characters' })
  contact: string;

  @IsDateString({}, { message: 'Please provide a valid date of birth' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  dob: string;

  @IsEnum(Gender, {
    message: 'Gender must be one of: Male, Female, Other',
  })
  @IsNotEmpty({ message: 'Gender is required' })
  gender: Gender;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty({ message: 'Address is required' })
  address: CreateAddressDto;
}
