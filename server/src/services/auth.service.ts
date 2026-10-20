import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { UsersRepo, AuditLogsRepo } from '../models/repositories.js';
import { IUser } from '../models/types.js';
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';

export class AuthService {
  static generateToken(userId: string): string {
    const rawExpires = env.JWT_EXPIRES_IN;
    const expiresIn = (typeof rawExpires === 'string' && rawExpires.trim().length > 0)
      ? rawExpires.trim()
      : '7d';

    return jwt.sign({ userId }, env.JWT_SECRET || 'learning_companion_jwt_secret_academic_2026_super_key', {
      expiresIn: expiresIn as any,
    });
  }

  static async register(data: { name: string; email: string; password: string }) {
    const existing = UsersRepo.findOne(u => u.email === data.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Rule: Never allow registration to assign Admin role! Always 'student'
    const newUser: IUser = UsersRepo.insertOne({
      _id: 'user_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      isActive: true,
      dailyStudyGoalMinutes: 60,
      studyStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: newUser._id,
      userEmail: newUser.email,
      action: 'USER_REGISTER',
      resourceType: 'user',
      resourceId: newUser._id,
      timestamp: new Date().toISOString(),
    });

    const token = this.generateToken(newUser._id);
    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  static async login(data: { email: string; password: string }) {
    const user = UsersRepo.findOne(u => u.email === data.email.toLowerCase().trim());
    if (!user) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.');
    }

    // Update streak and last active date
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.studyStreak || 1;
    if (user.lastActiveDate && user.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (user.lastActiveDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    UsersRepo.updateById(user._id, {
      lastActiveDate: today,
      studyStreak: newStreak,
    });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: user._id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      resourceType: 'user',
      resourceId: user._id,
      timestamp: new Date().toISOString(),
    });

    const updatedUser = UsersRepo.findById(user._id)!;
    const token = this.generateToken(user._id);
    const { passwordHash: _, ...safeUser } = updatedUser;
    return { user: safeUser, token };
  }

  static async getMe(userId: string) {
    const user = UsersRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found.');
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(userId: string, data: { name?: string; dailyStudyGoalMinutes?: number; avatar?: string }) {
    const updated = UsersRepo.updateById(userId, data);
    if (!updated) throw new NotFoundError('User not found.');
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  static async changePassword(userId: string, currentPass: string, newPass: string) {
    const user = UsersRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found.');

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    UsersRepo.updateById(userId, { passwordHash });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: user._id,
      userEmail: user.email,
      action: 'CHANGE_PASSWORD',
      resourceType: 'user',
      resourceId: user._id,
      timestamp: new Date().toISOString(),
    });

    return { message: 'Password updated successfully.' };
  }

  static async forgotPassword(email: string) {
    const user = UsersRepo.findOne(u => u.email === email.toLowerCase().trim());
    if (!user) {
      // Security best practice: Do not reveal if email exists
      return { message: 'If an account matches that email, a password reset token has been generated.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    UsersRepo.updateById(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: expires,
    });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: user._id,
      userEmail: user.email,
      action: 'REQUEST_PASSWORD_RESET',
      resourceType: 'user',
      resourceId: user._id,
      timestamp: new Date().toISOString(),
    });

    return {
      message: 'Password reset token generated successfully.',
      resetToken, // In production, this would be emailed; returned here so student can use Reset Password form
    };
  }

  static async resetPassword(token: string, newPass: string) {
    const now = new Date().toISOString();
    const user = UsersRepo.findOne(u => u.resetPasswordToken === token && (u.resetPasswordExpires ? u.resetPasswordExpires > now : false));

    if (!user) {
      throw new ValidationError('Invalid or expired password reset token.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPass, salt);

    UsersRepo.updateById(user._id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: user._id,
      userEmail: user.email,
      action: 'RESET_PASSWORD_COMPLETED',
      resourceType: 'user',
      resourceId: user._id,
      timestamp: new Date().toISOString(),
    });

    return { message: 'Password has been reset successfully. You can now log in.' };
  }
}
