import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';

import { ProductList } from './entities/product-list.entity';
import { ProductType } from './entities/product-type.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(ProductList)
    private readonly productListRepository: Repository<ProductList>,

    @InjectRepository(ProductType)
    private readonly productTypeRepository: Repository<ProductType>,
  ) {}

  /* ---------- OLD FUNCTIONALITY (UNCHANGED) ---------- */
  async createOrder(
    createOrderDto: CreateOrderDto,
    // keep for backward compatibility
  ): Promise<Order> {
    /* 🔹 1. Find product type image */
    const productType = await this.productTypeRepository.findOne({
      where: { product_name: createOrderDto.product_type },
    });

    if (!productType || !productType.product_image) {
      throw new Error(
        `Image not found for product type: ${createOrderDto.product_type}`,
      );
    }

    /* 🔹 2. Create order with copied image */
    const order = this.orderRepository.create({
      patient_id: createOrderDto.patient_id,
      product_list: createOrderDto.product_list,
      product_type: createOrderDto.product_type,
      shade: createOrderDto.shade,
      tooth_numbers: createOrderDto.tooth_numbers,
      priority: createOrderDto.priority,
      status: createOrderDto.status || OrderStatus.PENDING,
      order_date: new Date(createOrderDto.order_date),
      expected_delivery: new Date(createOrderDto.expected_delivery),
      design_notes: createOrderDto.design_notes ?? null,

      // ✅ COPY IMAGE FROM PRODUCT TYPE
      image: productType.product_image,
      image_mime_type: 'image/png', // optional, can improve later
    });

    return this.orderRepository.save(order);
  }

  async getOrdersByPatientId(patientId: string, page = 1, limit = 10) {
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { patient_id: patientId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: orders.map((o) => ({
        ...o,
        image: o.image ? o.image.toString('base64') : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId },
    });

    return order
      ? { ...order, image: order.image?.toString('base64') ?? null }
      : null;
  }

  /* ---------- NEW (SAFE ADDITIONS) ---------- */
  async getProductList() {
    return this.productListRepository.find({
      select: ['list_id', 'list_name'],
      order: { list_name: 'ASC' },
    });
  }

  async getProductTypesByListName(listName: string) {
    return this.productTypeRepository
      .createQueryBuilder('pt')
      .innerJoin('product_list', 'pl', 'pl.list_id = pt.list_id')
      .where('pl.list_name = :listName', { listName })
      .select(['pt.product_id', 'pt.product_name'])
      .orderBy('pt.product_name', 'ASC')
      .getRawMany()
      .then((rows) =>
        rows.map((r) => ({
          product_id: r.pt_product_id,
          product_name: r.pt_product_name,
        })),
      );
  }
}
