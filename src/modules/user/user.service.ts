import { Injectable } from '@nestjs/common';
import { Status, UserDTO } from './user.dto';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { hash } from 'bcrypt';
import { AppError } from 'src/shared/middleware/errors/appError';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(request: UserDTO) {
    const user_exist = await this.prisma.user.findUnique({
      where: { email: request.email },
    });

    if (user_exist) {
      throw new AppError('This email is already registed');
    }

    const defaultPassword = '1234';
    const hashedPassword = await hash(defaultPassword, 10);

    const user = await this.prisma.user.create({
      data: {
        name: request.name,
        email: request.email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async list() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async find(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError('User dont found');
    }

    return user;
  }

  async update(id: number, name: string) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: { name },
    });

    return user;
  }

  async updatePassword(id: number, password: string) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }

  async resetPassword(id: number) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { password: '1234' },
    });
  }

  async updateEmail(id: number, email: string) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { email },
    });
  }

  async updateRating(id: number, rating: number) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { rating },
    });
  }

  async setStatus(id: number, status: Status) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: number) {
    const user_exist = await this.prisma.user.findUnique({ where: { id } });

    if (!user_exist) {
      throw new AppError('User dont found');
    }

    return await this.prisma.user.delete({ where: { id } });
  }

  // Manage user roles

  async addRole(userId: number, roleId: number) {
    const userRole = await this.prisma.userRole.findFirst({
      where: { userId, roleId },
    });

    if (userRole) {
      throw new AppError('This user already has this role');
    }

    return await this.prisma.userRole.create({ data: { userId, roleId } });
  }

  async remRole(userId: number, roleId: number) {
    const userRole = await this.prisma.userRole.findFirst({
      where: { userId, roleId },
    });

    if (!userRole) {
      throw new AppError('This user has not this role');
    }

    return await this.prisma.userRole.delete({ where: { id: userRole.id } });
  }
}
