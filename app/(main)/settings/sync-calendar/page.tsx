// app/(main)/settings/sync-calendar/page.tsx
export const dynamic = 'force-dynamic';

import { FileUploader } from "@/components/settings/calendar/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/utils/auth.helper";
import { formatDate } from "date-fns";

export default async function SyncCalendarPage() {
  const session = await getSession();
  
  // Get last sync info if available
  const lastSync = session?.user?.id ? await prisma.iCSFile.findFirst({
    where: { userId: session.user.id },
    orderBy: { lastSync: 'desc' },
    include: {
      _count: {
        select: { events: true }
      }
    }
  }) : null;


    // 获取最近的同步记录和课程数据
    const recentSync = session?.user?.id ? await prisma.iCSFile.findFirst({
        where: { userId: session.user.id },
        include: {
          events: {
            take: 5,  // 只获取最近5个课程作为预览
            orderBy: { startTime: 'asc' }
          },
          _count: {
            select: { events: true }
          }
        },
        orderBy: { lastSync: 'desc' }
      }) : null;
    
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/settings">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Settings
          </Button>
        </Link>
      </div>

      <Card className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Sync Calendar</h1>
        <p className="text-gray-500 mb-6">
          Upload your .ics file to sync your class schedule
        </p>
        
        <FileUploader />
      </Card>
      
      {lastSync && (
        <div className="mt-6">
          <Card className="max-w-xl mx-auto p-6">
            <h2 className="text-xl font-semibold mb-4">Last Sync Information</h2>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-600">
                Last synced: {lastSync.lastSync.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Courses imported: {lastSync._count.events}
              </p>
              <p className="text-sm text-gray-600">
                File: {lastSync.fileName}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
        {recentSync && (
      <Card className="max-w-xl mx-auto p-6 mt-6">
    <h2 className="text-xl font-semibold mb-4">Recent Import Summary</h2>
    <CardContent className="space-y-4">
      <div className="text-sm text-gray-600">
        <p>Last synced: {formatDate(recentSync.lastSync, 'Pp')}</p>
        <p>Events imported: {recentSync._count.events}</p>
        <p>Academic tasks created: {recentSync.events.filter(
          e => ['ASSIGNMENT', 'QUIZ', 'EXAM', 'PROJECT', 'PAPER'].includes(e.summary)
        ).length}</p>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
}
