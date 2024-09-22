import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/databases/connection/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService, PrismaService],
})
export class UserModule {}
