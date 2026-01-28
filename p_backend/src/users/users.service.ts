import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { PractitionerType, User } from './entities/user.entity';
import { Address } from '../addresses/entities/address.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // ✅ CREATE USER WITH PLAIN PASSWORD
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 🔹 Check if email already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          `User with email ${createUserDto.email} already exists`,
        );
      }

      // 🔹 Extract address, ignore password from frontend
      const { address, password, ...userData } = createUserDto;

      // 🔹 Generate plain password
      const plainPassword = `${createUserDto.firstName}@2026`;

      // 🔹 Create user (store plain password)
      const user = this.userRepository.create({
        ...userData,
        password: plainPassword,
      });

      const savedUser = await this.userRepository.save(user);

      // 🔹 Create & save address
      if (address) {
        const addressEntity = this.addressRepository.create({
          ...address,
          userId: savedUser.id,
          entityType: 'user',
          street: address.street || null,
          house_no: address.house_no || null,
          address_type: address.address_type || null,
        });

        await this.addressRepository.save(addressEntity);
      }

      // 🔹 Return user with addresses (password hidden due to select:false)
      return await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['addresses'],
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create user. Please try again.',
      );
    }
  }

  // ✅ FIND ALL USERS (optionally filtered by practitionerType)
  async findAll(practitionerType?: string): Promise<User[]> {
    try {
      const allowedTypes = [
        PractitionerType.ADMIN,
        PractitionerType.TEAM_MEMBER,
        PractitionerType.PRACTICE,
      ];

      let where: FindOptionsWhere<User> | FindOptionsWhere<User>[];

      if (practitionerType) {
        // Accept only exact, case-sensitive matches for the three allowed types
        if (!allowedTypes.includes(practitionerType as PractitionerType)) {
          // If an unsupported type is requested, return an empty list
          return [];
        }
        where = { practitionerType: practitionerType as PractitionerType };
      } else {
        // No filter passed: return only users whose practitionerType
        // is one of Admin, Team Member, Practice
        where = { practitionerType: In(allowedTypes) };
      }

      return await this.userRepository.find({
        where,
        relations: ['addresses'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      // Temporary log so we can see the real DB error in the terminal
      // when "Failed to fetch users" is returned.
      // This does not change the HTTP response shape.
      // eslint-disable-next-line no-console
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException(
        'Failed to fetch users. Please try again.',
      );
    }
  }

  // ✅ FIND SINGLE USER
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['addresses'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch user. Please try again.',
      );
    }
  }

  // ✅ UPDATE USER
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException(
            `User with email ${updateUserDto.email} already exists`,
          );
        }
      }

      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update user. Please try again.',
      );
    }
  }

  // ✅ DELETE USER
  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete user. Please try again.',
      );
    }
  }

  // ✅ LOGIN / FETCH PASSWORD (PLAIN)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // explicitly include password
      .where('user.email = :email', { email })
      .getOne();
  }
}
