-- DropForeignKey
ALTER TABLE "AcademicTask" DROP CONSTRAINT "AcademicTask_courseId_fkey";

-- DropIndex
DROP INDEX "AcademicTask_courseId_idx";

-- DropIndex
DROP INDEX "AcademicTask_sourceEventId_idx";

-- DropIndex
DROP INDEX "AcademicTask_userId_idx";

-- AlterTable
ALTER TABLE "AcademicTask" ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AcademicTask" ADD CONSTRAINT "AcademicTask_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
