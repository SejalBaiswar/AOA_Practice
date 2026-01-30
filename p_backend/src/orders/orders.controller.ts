import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PatientOrdersQueryDto } from './dto/patient-orders-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(createOrderDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    };
  }

  /* ✅ PRODUCT LIST */
  @Get('product-list')
  async getProductList() {
    return {
      statusCode: HttpStatus.OK,
      data: await this.ordersService.getProductList(),
    };
  }

  /* ✅ PRODUCT TYPE (DEPENDENT) */
  @Get('product-type')
  async getProductType(@Query('listName') listName: string) {
    if (!listName) {
      return {
        statusCode: 400,
        message: 'listName is required',
        data: [],
      };
    }

    return {
      statusCode: 200,
      data: await this.ordersService.getProductTypesByListName(listName),
    };
  }

  @Get('patient/:patientId')
  async getOrdersByPatientId(
    @Param('patientId', new ParseUUIDPipe()) patientId: string,
    @Query() query: PatientOrdersQueryDto,
  ) {
    const result = await this.ordersService.getOrdersByPatientId(
      patientId,
      query.page,
      query.limit,
    );

    return {
      statusCode: HttpStatus.OK,
      ...result,
    };
  }

  /* ❗ KEEP LAST */
  @Get(':orderId')
  async getOrderById(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    const order = await this.ordersService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      statusCode: HttpStatus.OK,
      data: order,
    };
  }
}
