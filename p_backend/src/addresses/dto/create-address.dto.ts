import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'House number must not exceed 20 characters' })
  house_no?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Street must not exceed 100 characters' })
  street?: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  @MinLength(1, { message: 'City cannot be empty' })
  @MaxLength(50, { message: 'City must not exceed 50 characters' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  @MinLength(1, { message: 'State cannot be empty' })
  @MaxLength(50, { message: 'State must not exceed 50 characters' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  @MinLength(1, { message: 'Country cannot be empty' })
  @MaxLength(50, { message: 'Country must not exceed 50 characters' })
  country: string;

  @IsString()
  @IsNotEmpty({ message: 'Zip code is required' })
  @Matches(/^[0-9A-Za-z\s-]{3,15}$/, {
    message: 'Please provide a valid zip code',
  })
  @MaxLength(15, { message: 'Zip code must not exceed 15 characters' })
  zipCode: string;

  @IsString()
  @IsOptional()
  @MaxLength(15, { message: 'Address type must not exceed 15 characters' })
  address_type?: string;
}
