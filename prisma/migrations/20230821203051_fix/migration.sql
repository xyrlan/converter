/*
  Warnings:

  - The values [PROCESSION] on the enum `ConversionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConversionStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'ERROR');
ALTER TABLE "Conversion" ALTER COLUMN "status" TYPE "ConversionStatus_new" USING ("status"::text::"ConversionStatus_new");
ALTER TYPE "ConversionStatus" RENAME TO "ConversionStatus_old";
ALTER TYPE "ConversionStatus_new" RENAME TO "ConversionStatus";
DROP TYPE "ConversionStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Conversion" ALTER COLUMN "id" SET DEFAULT concat('cnv_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "id" SET DEFAULT concat('tnt_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "inviteKey" SET DEFAULT replace(cast(gen_random_uuid() as text), '-', '');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));
