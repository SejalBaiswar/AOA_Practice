import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  /* ---------- CREATE USER ---------- */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      success: true,
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  /* ---------- GET ALL USERS ---------- */
  @Get()
  async findAll(
    @Query('practitionerType') practitionerType?: string,
    @Query('tenantId') tenantId?: string,
  ) {
    const users = await this.usersService.findAll(practitionerType, tenantId);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    };
  }

  /* ---------- GET SINGLE USER ---------- */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User fetched successfully',
      data: user,
    };
  }

  /* ---------- UPDATE USER ---------- */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  /* ---------- DELETE USER ---------- */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);

    return {
      success: true,
      status: HttpStatus.OK,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
