/*
  Warnings:

  - A unique constraint covering the columns `[employee_id,company_id]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "company_id" INTEGER NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Balance_employee_id_company_id_key" ON "Balance"("employee_id", "company_id");

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
