// app/api/timetable/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { startOfWeek, endOfWeek } from "date-fns";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get date parameter from URL
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const date = dateStr ? new Date(dateStr) : new Date();
    
    // Calculate week boundaries
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    const events = await prisma.courseEvent.findMany({
      where: {
        userId: user.id,
        AND: [
          {
            startTime: {
              gte: weekStart,
            },
          },
          {
            endTime: {
              lte: weekEnd,
            },
          },
        ],
      },
      select: {
        id: true,
        summary: true,
        startTime: true,
        endTime: true,
        location: true,
        color: true,
        dayOfWeek: true
      }
    });

    // Transform events to match WeekEvent interface
    const transformedEvents = events.map(event => ({
      id: event.id,
      summary: event.summary,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location || "No Room",
      color: event.color,
      dayOfWeek: event.dayOfWeek, // Convert 0-6 to 1-7
    }));

    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error("[EVENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}