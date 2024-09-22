import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Status, TaskDTO } from './task.dto';
import { Response } from 'express';
import { CustomError } from 'src/shared/middleware/errors/customError';
import { TaskSchema } from 'src/shared/schemas/task-schema';
import { AuthMiddleware } from 'src/shared/middleware/auth/auth-middleware';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(new AuthMiddleware('create task'))
  async create(@Body() data: TaskDTO, @Res() response: Response) {
    try {
      const bodydata = TaskSchema.safeParse(data);
      if (bodydata.error) {
        throw new CustomError(
          'Erro de Validação',
          400,
          bodydata.error.errors.map(
            (error) => `${error.path[0]}: ${error.message}`,
          ),
        );
      }
      const user = await this.taskService.create({
        title: bodydata.data.title,
        delivery: bodydata.data.delivery,
        description: bodydata.data.description,
      });
      return response.status(201).json({
        status: true,
        message: 'user created successfuly',
        data: user,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error creating user',
        data: error,
      });
    }
  }

  @Get()
  @UseGuards(new AuthMiddleware('read task'))
  async list(@Res() response: Response) {
    try {
      const tasks = await this.taskService.list();
      return response.status(200).json({
        status: true,
        data: tasks,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error listing tasks',
        data: error,
      });
    }
  }

  @Get(':id')
  @UseGuards(new AuthMiddleware('read task'))
  async find(@Param('id') id: string, @Res() response: Response) {
    try {
      const task = await this.taskService.find(Number(id));
      return response.status(200).json({
        status: true,
        data: task,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error searching tasks',
        data: error,
      });
    }
  }

  @Put(':id')
  @UseGuards(new AuthMiddleware('update task'))
  async update(
    @Param('id') id: string,
    @Body() data: TaskDTO,
    @Res() response: Response,
  ) {
    try {
      await this.taskService.update(Number(id), data);
      return response.status(200).json({
        status: true,
        message: 'task updated successfuly',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error updating tasks',
        data: error,
      });
    }
  }

  @Put('/set-status/:id')
  @UseGuards(new AuthMiddleware('update task'))
  async setStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @Res() response: Response,
  ) {
    try {
      await this.taskService.setStatus(Number(id), status);
      return response.status(200).json({
        status: true,
        message: 'status updated successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error updating status',
        data: error,
      });
    }
  }

  @Put('/assign/:id')
  @UseGuards(new AuthMiddleware('update task'))
  async assign(
    @Param('id') id: string,
    @Body('userId') userId: number,
    @Res() response: Response,
  ) {
    try {
      await this.taskService.assign(Number(id), userId);
      return response.status(200).json({
        status: true,
        message: 'user assigned to task successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error assigning user to task',
        data: error,
      });
    }
  }

  @Delete(':id')
  @UseGuards(new AuthMiddleware('delete task'))
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.taskService.delete(Number(id));
      return response.status(200).json({
        status: true,
        message: 'task delete successfully',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error deleting task',
        data: error,
      });
    }
  }
}
