import {
  IsString,
  IsEmail,
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
import { PractitionerType, Specialization } from '../entities/user.entity';

export class CreateUserDto {
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
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    {
      message: 'Please provide a valid phone number',
    },
  )
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Gender is required' })
  @MaxLength(20, { message: 'Gender must not exceed 20 characters' })
  gender: string;

  @IsEnum(Specialization, {
    message: 'Please select a valid specialization',
  })
  @IsOptional()
  specialization?: Specialization;

  @IsEnum(PractitionerType, {
    message: 'Practitioner type must be either admin or team member',
  })
  @IsNotEmpty({ message: 'Practitioner type is required' })
  practitionerType: PractitionerType;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty({ message: 'Address is required' })
  address: CreateAddressDto;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password?: string;
}
