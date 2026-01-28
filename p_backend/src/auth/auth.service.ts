import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PractitionerType } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(email: string, password: string) {
    // Fetch user including plain password
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.practitionerType !== PractitionerType.PRACTICE) {
      throw new UnauthorizedException('Access denied: practice only');
    }

    return {
      accessToken: 'dummy-token',
      practitionerType: user.practitionerType,
      userId: user.id,
    };
  }
}
