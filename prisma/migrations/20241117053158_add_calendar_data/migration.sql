-- CreateTable
CREATE TABLE "ICSFile" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ICSFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseEvent" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "icsFileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#808080',

    CONSTRAINT "CourseEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ICSFile_userId_idx" ON "ICSFile"("userId");

-- CreateIndex
CREATE INDEX "CourseEvent_userId_idx" ON "CourseEvent"("userId");

-- CreateIndex
CREATE INDEX "CourseEvent_icsFileId_idx" ON "CourseEvent"("icsFileId");

-- AddForeignKey
ALTER TABLE "ICSFile" ADD CONSTRAINT "ICSFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEvent" ADD CONSTRAINT "CourseEvent_icsFileId_fkey" FOREIGN KEY ("icsFileId") REFERENCES "ICSFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEvent" ADD CONSTRAINT "CourseEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
