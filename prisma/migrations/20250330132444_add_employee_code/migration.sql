/*
  Warnings:

  - A unique constraint covering the columns `[company_id,employee_code]` on the table `Balance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Balance_employee_id_company_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Balance_company_id_employee_code_key" ON "Balance"("company_id", "employee_code");
