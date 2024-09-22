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
import { UserService } from './user.service';
import { Status, UserDTO } from './user.dto';
import { Response } from 'express';
import { CustomError } from 'src/shared/middleware/errors/customError';
import { UserSchema } from 'src/shared/schemas/user-schema';
import { AuthMiddleware } from 'src/shared/middleware/auth/auth-middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(new AuthMiddleware('create user'))
  async create(@Body() data: UserDTO, @Res() response: Response) {
    try {
      const bodydata = UserSchema.safeParse(data);
      if (bodydata.error) {
        throw new CustomError(
          'Erro de Validação',
          400,
          bodydata.error.errors.map(
            (error) => `${error.path[0]}: ${error.message}`,
          ),
        );
      }
      const user = await this.userService.create({
        name: bodydata.data.name,
        email: bodydata.data.email,
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
  @UseGuards(new AuthMiddleware('read user'))
  async list(@Res() response: Response) {
    try {
      const users = await this.userService.list();
      return response.status(200).json({
        status: true,
        data: users,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'Error listing user',
        data: error,
      });
    }
  }

  @Get(':id')
  @UseGuards(new AuthMiddleware('read user'))
  async find(@Param('id') id: number, @Res() response: Response) {
    try {
      const user = await this.userService.find(Number(id));
      return response.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error searching user',
        data: error,
      });
    }
  }

  @Put(':id')
  @UseGuards(new AuthMiddleware('update user'))
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Res() response: Response,
  ) {
    try {
      await this.userService.update(Number(id), name);
      return response.status(200).json({
        status: true,
        message: 'user updated successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error updating user',
        data: error,
      });
    }
  }

  @Put('update-password/:id')
  @UseGuards(new AuthMiddleware('update user'))
  async updatePassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    try {
      await this.userService.updatePassword(Number(id), password);
      return response.status(200).json({
        status: true,
        message: 'password updated successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error updating password',
        data: error,
      });
    }
  }

  @Put('/reset-password/:id')
  @UseGuards(new AuthMiddleware('update user'))
  async resetPassword(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.userService.resetPassword(Number(id));
      return response.status(200).json({
        status: true,
        message: 'password reseted successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error reseting password',
        data: error,
      });
    }
  }

  @Put('/update-email/:id')
  @UseGuards(new AuthMiddleware('update user'))
  async updateEmail(
    @Param('id') id: number,
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    try {
      await this.userService.updateEmail(Number(id), email);
      return response.status(200).json({
        status: true,
        message: 'email updated successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error updating email',
        data: error,
      });
    }
  }

  @Put('/update-rating/:id')
  @UseGuards(new AuthMiddleware('update user'))
  async updateRating(
    @Param('id') id: number,
    @Body('rating') rating: number,
    @Res() response: Response,
  ) {
    try {
      await this.userService.updateRating(Number(id), rating);
      return response.status(200).json({
        status: true,
        message: 'rating updated successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error updating rating',
        data: error,
      });
    }
  }

  @Put('/set-status/:id')
  @UseGuards(new AuthMiddleware('update user'))
  async active(
    @Param('id') id: number,
    @Body('status') status: Status,
    @Res() response: Response,
  ) {
    try {
      await this.userService.setStatus(Number(id), status);
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

  @Delete(':id')
  @UseGuards(new AuthMiddleware('delete user'))
  async delete(@Param('id') id: number, @Res() response: Response) {
    try {
      await this.userService.delete(Number(id));
      return response.status(200).json({
        status: true,
        message: 'user delete successfuly',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error deleting user',
        data: error,
      });
    }
  }

  @Post('add-role')
  @UseGuards(new AuthMiddleware('create user'))
  async addPermission(
    @Body() data: { roleId: number; userId: number },
    @Res() response: Response,
  ) {
    try {
      await this.userService.addRole(data.userId, data.roleId);
      return response.status(200).json({
        status: true,
        message: 'role added to user successfully',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error adding role user',
        data: error,
      });
    }
  }

  @Delete('rem-role/:userId/:roleId')
  @UseGuards(new AuthMiddleware('create user'))
  async remRole(
    @Param('roleId') roleId: string,
    @Param('userId') userId: string,
    @Res() response: Response,
  ) {
    try {
      await this.userService.remRole(Number(roleId), Number(userId));
      return response.status(200).json({
        status: true,
        message: 'role removed to user successfully',
      });
    } catch (error) {
      return response.status(404).json({
        status: false,
        message: 'Error removing role from user',
        data: error,
      });
    }
  }
}
