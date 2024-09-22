/*
  Warnings:

  - A unique constraint covering the columns `[permission]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_key" ON "permissions"("permission");
