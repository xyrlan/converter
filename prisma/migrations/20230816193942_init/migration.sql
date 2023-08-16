-- DropForeignKey
ALTER TABLE "Conversion" DROP CONSTRAINT "Conversion_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Conversion" DROP CONSTRAINT "Conversion_userId_fkey";

-- AlterTable
ALTER TABLE "Conversion" ALTER COLUMN "id" SET DEFAULT concat('cnv_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "tenantId" DROP NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ALTER COLUMN "id" SET DEFAULT concat('tnt_', replace(cast(gen_random_uuid() as text), '-', '')),
ALTER COLUMN "inviteKey" SET DEFAULT replace(cast(gen_random_uuid() as text), '-', '');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT concat('usr_', replace(cast(gen_random_uuid() as text), '-', ''));

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversion" ADD CONSTRAINT "Conversion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
