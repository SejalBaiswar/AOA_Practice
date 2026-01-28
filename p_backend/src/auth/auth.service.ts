import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PractitionerType } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) { }

  async login(email: string, password: string) {
    // Fetch user including plain password
    const user = await this.usersService.findByEmailWithPassword(email);

    // 🔍 DEBUG: Log user lookup result
    console.log('🔍 Login attempt for email:', email);
    console.log('🔍 User found:', !!user);

    if (!user) {
      console.log('❌ User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔍 DEBUG: Log password comparison
    console.log('🔍 Password from request:', password);
    console.log('🔍 Password from database:', user.password);
    console.log('🔍 Passwords match:', user.password === password);
    console.log('🔍 User practitionerType:', user.practitionerType);

    if (user.password !== password) {
      console.log('❌ Password mismatch');
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.practitionerType !== PractitionerType.PRACTICE) {
      console.log('❌ Not a PRACTICE user, type is:', user.practitionerType);
      throw new UnauthorizedException('Access denied: practice only');
    }

    console.log('✅ Login successful');
    return {
      accessToken: 'dummy-token',
      practitionerType: user.practitionerType,
      userId: user.id,
    };
  }
}
