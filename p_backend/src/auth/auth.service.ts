import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PractitionerType } from '../users/entities/user.entity'
import * as crypto from 'crypto'

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

    // Allow both PRACTICE and TEAM_MEMBER to login
    if (user.practitionerType !== PractitionerType.PRACTICE &&
      user.practitionerType !== PractitionerType.TEAM_MEMBER) {
      console.log('❌ Not a PRACTICE or TEAM_MEMBER user, type is:', user.practitionerType);
      throw new UnauthorizedException('Access denied: practice or team member only');
    }

    // 🔹 Determine tenantId for tenant isolation:
    // - For PRACTICE users: tenantId = their own userId (they ARE the tenant)
    // - For TEAM_MEMBER users: tenantId = their tenantId field (inherited from practice)
    let tenantId: string;
    if (user.practitionerType === PractitionerType.PRACTICE) {
      tenantId = user.id;
    } else {
      tenantId = user.tenantId || user.id; // fallback to userId if no tenantId
    }

    console.log('✅ Login successful, tenantId:', tenantId);
    return {
      accessToken: 'dummy-token',
      practitionerType: user.practitionerType,
      userId: user.id,
      tenantId: tenantId,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return { message: 'If user exists, reset link sent' };
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await this.usersService.update(user.id, user);
    console.log('RESET TOKEN (DEV ONLY):', token);
    return { message: 'Reset token generated', token };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Token invalid or expired');
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersService.update(user.id, user);

    return { message: 'Password reset successful' };
  }
}
