import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  address_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  house_no: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address_type: string | null;

  // 🔥 MUST BE NOT NULL (DB RULE)
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 50, name: 'entity_type', nullable: true })
  entityType: string | null;

  // ⚠️ KEEP RELATION BUT DO NOT CREATE FK
  @ManyToOne(() => Patient, (patient) => patient.addresses, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  patient: Patient;

  @ManyToOne(() => User, (user) => user.addresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
