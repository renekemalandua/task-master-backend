import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { AppError } from 'src/shared/middleware/errors/appError';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const permissions = await this.prisma.permission.findMany();
    return permissions;
  }

  async find(id: number) {
    const permissions = await this.prisma.permission.findUnique({
      where: { id },
    });
    if (!permissions) {
      throw new AppError('Permission dont found');
    }
    return permissions;
  }

  async findByRole(roleId: number) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new AppError('role dont found');
    }
    const permissions = await this.prisma.permissionRole.findMany({
      where: { roleId },
      select: {
        Permission: true,
      },
    });

    return permissions;
  }
}
