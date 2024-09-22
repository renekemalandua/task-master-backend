import { Controller, Get, Param, Res } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Response } from 'express';


@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async list(@Res() response: Response) {
    try {
      const role = await this.permissionService.list();
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error listing permission',
        data: error,
      });
    }
  }

  @Get(':id')
  async find(@Param('id') id: string, @Res() response: Response) {
    try {
      const role = await this.permissionService.find(Number(id));
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error searching permission',
        data: error,
      });
    }
  }

  @Get('/find-by-role/:roleId')
  async findByRole(@Param('roleId') roleId: string, @Res() response: Response) {
    try {
      const role = await this.permissionService.findByRole(Number(roleId));
      return response.status(200).json({
        status: true,
        data: role,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error searching permission',
        data: error,
      });
    }
  }
}
