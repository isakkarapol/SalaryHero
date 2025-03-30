/*
  Warnings:

  - Added the required column `employee_code` to the `Balance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balance" ADD COLUMN     "employee_code" TEXT NOT NULL;
