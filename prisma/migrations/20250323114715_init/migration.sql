-- CreateEnum
CREATE TYPE "WeeklyOffType" AS ENUM ('company', 'employee');

-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('sick', 'personal', 'vacation', 'no_show', 'other');

-- CreateEnum
CREATE TYPE "SalaryType" AS ENUM ('monthly', 'daily');

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "weekly_off_type" "WeeklyOffType" NOT NULL DEFAULT 'company',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaySchedule" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "pay_day" INTEGER NOT NULL,
    "check_holiday" BOOLEAN NOT NULL DEFAULT true,
    "pay_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "employee_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "salary_type" "SalaryType" NOT NULL,
    "salary_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyWeeklyOff" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyWeeklyOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeWeeklyOff" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "employee_code" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmployeeWeeklyOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "holiday_date" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Absence" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "employee_code" TEXT NOT NULL,
    "absent_date" TIMESTAMP(3) NOT NULL,
    "absence_type" "AbsenceType" NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Absence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_company_id_employee_code_key" ON "Employee"("company_id", "employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyWeeklyOff_company_id_day_of_week_key" ON "CompanyWeeklyOff"("company_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeWeeklyOff_company_id_employee_code_day_of_week_key" ON "EmployeeWeeklyOff"("company_id", "employee_code", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_company_id_holiday_date_key" ON "Holiday"("company_id", "holiday_date");

-- CreateIndex
CREATE UNIQUE INDEX "Absence_company_id_employee_code_absent_date_key" ON "Absence"("company_id", "employee_code", "absent_date");

-- AddForeignKey
ALTER TABLE "PaySchedule" ADD CONSTRAINT "PaySchedule_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyWeeklyOff" ADD CONSTRAINT "CompanyWeeklyOff_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeWeeklyOff" ADD CONSTRAINT "EmployeeWeeklyOff_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeWeeklyOff" ADD CONSTRAINT "EmployeeWeeklyOff_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
