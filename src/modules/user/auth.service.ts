import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { AppError } from 'src/shared/middleware/errors/appError';
import { AuthUserDTO } from './user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(data: AuthUserDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('this email is not registed');
    }

    const matchPassword = await compare(data.password, user.password);

    if (!matchPassword) {
      throw new AppError('invalid password');
    }

    if (user.status === 'Inactive') {
      throw new AppError('Your account is inactive');
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new AppError('Chave secreta não fornecida!');
    }

    const token = sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '2d',
      },
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
      rating: user.rating,
      last_login: user.last_login,
      created_at: user.created_at,
      token,
    };
  }
}
