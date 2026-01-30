import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { ProductList } from './entities/product-list.entity';
import { ProductType } from './entities/product-type.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Order, ProductList, ProductType])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
