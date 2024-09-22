import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDTO } from './user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() data: AuthUserDTO, @Res() response: Response) {
    try {
      const userLogin = await this.authService.login(data);
      return response.status(200).json({
        status: true,
        message: 'User logged successfully',
        data: userLogin,
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: 'User login fail',
        data: error,
      });
    }
  }
}
