import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { Status, TaskDTO } from './task.dto';
import { AppError } from 'src/shared/middleware/errors/appError';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(request: TaskDTO) {
    return await this.prisma.task.create({
      data: {
        title: request.title,
        description: request.description,
        delivery: new Date(request.delivery),
      },
    });
  }

  async list() {
    return await this.prisma.task.findMany({
      include: {
        User: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async find(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task dont found');
    }
    return task;
  }

  async update(id: number, request: TaskDTO) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task dont found');
    }
    return await this.prisma.task.update({
      where: { id },
      data: request,
    });
  }

  async setStatus(id: number, status: Status) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task dont found');
    }
    return await this.prisma.task.update({
      where: { id },
      data: { status },
    });
  }

  async assign(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task dont found');
    }
    return await this.prisma.task.update({
      where: { id },
      data: { userId },
    });
  }

  async delete(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError('Task dont found');
    }
    return await this.prisma.task.delete({ where: { id } });
  }
}
