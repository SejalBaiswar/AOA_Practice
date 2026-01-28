import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { OrderPriority } from '../enums/order-priority.enum';
import { OrderStatus } from '../enums/order-status.enum';

@Entity({ name: 'orders' })
@Index('idx_orders_patient_id', ['patient_id'])
@Index('idx_orders_status', ['status'])
@Index('idx_orders_order_date', ['order_date'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  order_id: string;

  @Column({ type: 'uuid' })
  patient_id: string;

  @Column({ type: 'varchar', length: 100 })
  case_type: string;

  @Column({ type: 'varchar', length: 10 })
  shade: string;

  @Column({ type: 'int', array: true })
  tooth_numbers: number[];

  @Column({
    type: 'enum',
    enum: OrderPriority,
  })
  priority: OrderPriority;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ type: 'timestamptz' })
  order_date: Date;

  @Column({ type: 'timestamptz' })
  expected_delivery: Date;

  @Column({ type: 'text', nullable: true })
  design_notes?: string;

  @Column({ type: 'bytea', nullable: true })
  image?: Buffer;

  @Column({ type: 'varchar', nullable: true })
  image_mime_type?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
