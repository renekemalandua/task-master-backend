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
import { RoleService } from './role.service';
import { Response } from 'express';
import { AuthMiddleware } from 'src/shared/middleware/auth/auth-middleware';

@Controller('role')

export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(new AuthMiddleware('create role'))
  async create(@Body('role') role: string, @Res() response: Response) {
    try {
      const _role = await this.roleService.create(role);
      return response.status(201).json({
        status: true,
        message: 'role created successfuly',
        data: _role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error creating role',
        data: error,
      });
    }
  }

  @Get()
  @UseGuards(new AuthMiddleware('read role'))
  async list(@Res() response: Response) {
    try {
      const role = await this.roleService.list();
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error listing roles',
        data: error,
      });
    }
  }

  @Get(':id')
  @UseGuards(new AuthMiddleware('read role'))
  async find(@Param('id') id: string, @Res() response: Response) {
    try {
      const role = await this.roleService.find(Number(id));
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error searching roles',
        data: error,
      });
    }
  }

  @Get('/find-by-user/:userId')
  @UseGuards(new AuthMiddleware('read role'))
  async findByUser(@Param('userId') userId: string, @Res() response: Response) {
    try {
      const role = await this.roleService.findByUser(Number(userId));
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error searching roles',
        data: error,
      });
    }
  }

  @Put(':id')
  @UseGuards(new AuthMiddleware('update role'))
  async update(
    @Param('id') id: string,
    @Body('role') role: string,
    @Res() response: Response,
  ) {
    try {
      await this.roleService.update(Number(id), role);
      return response.status(200).json({
        status: true,
        message: 'role updated succesfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error updating roles',
        data: error,
      });
    }
  }

  @Delete(':id')
  @UseGuards(new AuthMiddleware('delete role'))
  async delete(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.roleService.delete(Number(id));
      return response.status(200).json({
        status: true,
        message: 'role deleted succesfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error deleting roles',
        data: error,
      });
    }
  }

  @Post('add-permission')
  @UseGuards(new AuthMiddleware('create role'))
  async addPermission(
    @Body() data: { roleId: number; permissionId: number },
    @Res() response: Response,
  ) {
    try {
      await this.roleService.addPermission(data.roleId, data.permissionId);
      return response.status(200).json({
        status: true,
        message: 'permission added to role',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error adding permision to roles',
        data: error,
      });
    }
  }

  @Delete('rem-permission/:roleId/:permissionId')
  @UseGuards(new AuthMiddleware('create role'))
  async remPermission(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissonId: string,
    @Res() response: Response,
  ) {
    try {
      await this.roleService.remPermission(Number(roleId), Number(permissonId));
      return response.status(200).json({
        status: true,
        message: 'permission removed from role',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error removing permision to roles',
        data: error,
      });
    }
  }
}
