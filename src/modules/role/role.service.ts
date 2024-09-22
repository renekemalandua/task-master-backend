import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { AppError } from 'src/shared/middleware/errors/appError';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(role: string) {
    const role_exist = await this.prisma.role.findUnique({ where: { role } });
    if (role_exist) {
      throw new AppError('this role already exist');
    }
    return await this.prisma.role.create({ data: { role } });
  }

  async list() {
    return await this.prisma.role.findMany({
      include: {
        PermissionRole: {
          select: {
            Permission: true,
          },
        },
      },
    });
  }

  async find(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new AppError('role dont found');
    }
    return role;
  }

  async findByUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      throw new AppError('user dont found');
    }
    return await this.prisma.userRole.findMany({
      where: { userId },
      select: {
        Role: true,
      },
    });
  }

  async update(id: number, role: string) {
    const role_exist = await this.prisma.role.findUnique({ where: { id } });
    if (!role_exist) {
      throw new AppError('role dont found');
    }
    return await this.prisma.role.update({ where: { id }, data: { role } });
  }

  async delete(id: number) {
    const role_exist = await this.prisma.role.findUnique({ where: { id } });
    if (!role_exist) {
      throw new AppError('role dont found');
    }
    return await this.prisma.role.delete({ where: { id } });
  }

  // Manage role permissions

  async addPermission(roleId: number, permissionId: number) {
    const permissionRole = await this.prisma.permissionRole.findFirst({
      where: { roleId, permissionId },
    });

    if (permissionRole) {
      throw new AppError('This role already has this permission');
    }

    return await this.prisma.permissionRole.create({
      data: { permissionId, roleId },
    });
  }

  async remPermission(roleId: number, permissionId: number) {
    const permissionRole = await this.prisma.permissionRole.findFirst({
      where: { roleId, permissionId },
    });

    if (!permissionRole) {
      throw new AppError('This role has not this permission');
    }

    return await this.prisma.permissionRole.delete({
      where: { id: permissionRole.id },
    });
  }
}
