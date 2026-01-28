import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  ArrayNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderPriority } from '../enums/order-priority.enum';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Patient UUID',
    format: 'uuid',
    example: '571eec53-459f-4cec-91d4-6ba03976d017',
  })
  @IsUUID()
  patient_id: string;

  @ApiProperty({
    description: 'Type of dental case',
    example: 'Crown',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  case_type: string;

  @ApiProperty({
    description: 'Shade code',
    example: 'A2',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  shade: string;

  @ApiProperty({
    description: 'Tooth numbers involved',
    example: [11, 12, 13],
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  tooth_numbers: number[];

  @ApiProperty({
    enum: OrderPriority,
    example: OrderPriority.HIGH,
  })
  @IsEnum(OrderPriority)
  priority: OrderPriority;

  @ApiPropertyOptional({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Order status. Defaults to PENDING if not provided',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'Order creation date (ISO)',
    example: '2026-01-25T10:00:00Z',
  })
  @IsDateString()
  order_date: string;

  @ApiProperty({
    description: 'Expected delivery date (ISO)',
    example: '2026-02-05T10:00:00Z',
  })
  @IsDateString()
  expected_delivery: string;

  @ApiPropertyOptional({
    description: 'Additional design notes',
  })
  @IsOptional()
  @IsString()
  design_notes?: string;
}
