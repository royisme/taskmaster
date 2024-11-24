/*
  Warnings:

  - You are about to drop the `Assignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('ASSIGNMENT', 'QUIZ', 'EXAM', 'PAPER', 'PROJECT', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TaskSource" AS ENUM ('CALENDAR_IMPORT', 'MANUAL_CREATE');

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_userId_fkey";

-- DropTable
DROP TABLE "Assignment";

-- CreateTable
CREATE TABLE "AcademicTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "taskType" "TaskType" NOT NULL,
    "source" "TaskSource" NOT NULL,
    "sourceEventId" TEXT,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AcademicTask_courseId_idx" ON "AcademicTask"("courseId");

-- CreateIndex
CREATE INDEX "AcademicTask_userId_idx" ON "AcademicTask"("userId");

-- CreateIndex
CREATE INDEX "AcademicTask_sourceEventId_idx" ON "AcademicTask"("sourceEventId");

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_sourceEventId_fkey" FOREIGN KEY ("sourceEventId") REFERENCES "CourseEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
