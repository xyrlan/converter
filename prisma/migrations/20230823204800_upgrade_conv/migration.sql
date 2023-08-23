/*
  Warnings:

  - Added the required column `name` to the `Conversion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversion" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT concat('cnv_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "id" SET DEFAULT concat('tnt_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "inviteKey" SET DEFAULT replace(cast(gen_random_uuid() as text), '-', '');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));
