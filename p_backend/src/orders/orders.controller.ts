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

  /* ---------- CREATE ORDER ---------- */
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.createOrder(createOrderDto);

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
    };
  }

  /* ---------- PRODUCT LIST ---------- */
  @Get('product-list')
  async getProductList() {
    const products = await this.ordersService.getProductList();

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Product list fetched successfully',
      data: products,
    };
  }

  /* ---------- PRODUCT TYPE (DEPENDENT) ---------- */
  @Get('product-type')
  async getProductType(@Query('listName') listName: string) {
    if (!listName) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'listName is required',
        data: [],
      };
    }

    const productTypes =
      await this.ordersService.getProductTypesByListName(listName);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Product types fetched successfully',
      data: productTypes,
    };
  }

  /* ---------- ORDERS BY PATIENT ---------- */
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
      success: true,
      status: HttpStatus.OK,
      message: 'Orders fetched successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  /* ---------- ORDER BY ID (KEEP LAST) ---------- */
  @Get(':orderId')
  async getOrderById(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ) {
    const order = await this.ordersService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Order fetched successfully',
      data: order,
    };
  }
}
