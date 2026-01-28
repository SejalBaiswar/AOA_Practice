import { Controller,
  Post,
  Body,
  Get,
  Query,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  NotFoundException,
  UseInterceptors,
  UploadedFile, } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { PatientOrdersQueryDto } from './dto/patient-orders-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const order = await this.ordersService.createOrder(
      createOrderDto,
      image,
    );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data: order,
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
    statusCode:HttpStatus.OK,
    success: true,
    message: 'Patient orders fetched successfully',
    ...result,
  };
}

@Get(':orderId')
async getOrderById(
  @Param('orderId', new ParseUUIDPipe()) orderId: string,
) {
  const order = await this.ordersService.getOrderById(orderId);
 
  if (!order) {
    throw new NotFoundException('Order not found');
  }
 
  return {
    statusCode: HttpStatus.OK,
    message: 'Order fetched successfully',
    data: order,
  };
}


 
}
 
 