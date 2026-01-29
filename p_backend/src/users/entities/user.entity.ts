import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

export enum PractitionerType {
  ADMIN = 'Admin',
  TEAM_MEMBER = 'Team Member',
  PRACTICE = 'Practice',
}

export enum Specialization {
  ORTHODONTICS = 'Orthodontics',
  ENDODONTICS = 'Endodontics',
  PERIODONTICS = 'Periodontics',
  PROSTHODONTICS = 'Prosthodontics',
  PEDIATRIC_DENTISTRY = 'Pediatric Dentistry',
  ORAL_MAXILLOFACIAL_SURGERY = 'Oral & Maxillofacial Surgery',
  RADIOLOGY = 'Radiology',
  PATHOLOGY = 'Pathology',
  PUBLIC_HEALTH = 'Public Health',
  ANESTHESIOLOGY = 'Anesthesiology',
}

@Entity('users', { synchronize: false })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middleName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 20 })
  gender: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  specialization: Specialization;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  practitionerType: PractitionerType;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;
}
