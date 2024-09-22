import { SeedPermissions } from './permission.seed';

(async () => {
  console.log('Rodando as seeds...');
  await SeedPermissions();
})();
