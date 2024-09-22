import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';
import { PrismaService } from 'src/databases/connection/prisma.service';
interface DecodedToken {
  userId: number;
}

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(private permissions?: string) {}

  prisma = new PrismaService();
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new UnauthorizedException('secret key not provided');
    }

    const decodedToken = verify(token, JWT_SECRET) as DecodedToken;
    request.user = { id: decodedToken.userId };

    const _user = await this.prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!_user) {
      throw new UnauthorizedException('User dont found');
    }

    if (_user.is_super_admin) {
      return true;
    }

    if (this.permissions) {
      const user = await this.prisma.user.findUnique({
        where: { id: decodedToken.userId },
        select: {
          UserRole: {
            select: {
              Role: {
                select: {
                  PermissionRole: {
                    select: {
                      Permission: {
                        select: {
                          permission: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const userPermissions =
        user.UserRole.flatMap((userRole) =>
          userRole.Role.PermissionRole.map(
            (rolesPermission) => rolesPermission.Permission.permission,
          ),
        ) ?? [];

      if (!userPermissions.includes(this.permissions)) {
        throw new ForbiddenException('Permission denied');
      }
    }

    return true;
  }
}
