import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../connection/prisma.service';

const prisma = new PrismaService();

interface IPermission {
  permission: string;
}

// Caminhos para os arquivos
const permissionFilePath = path.join(
  __dirname,
  '../json/PERMISSION_DEFAULT.json',
);

// Função para ler JSON
const readJson = <T>(filePath: string): T => {
  console.log('Trying to read file:', filePath); // Adiciona log
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as T;
};

// Ler os arquivos
const permissions: IPermission[] = readJson<IPermission[]>(permissionFilePath);

export async function SeedPermissions() {
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { permission: permission.permission },
      update: {
        permission: permission.permission,
      },
      create: {
        permission: permission.permission,
      },
    });
  }
  console.log('permissions seeded');
}
