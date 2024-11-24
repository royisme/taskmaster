import SchedulePage from "@/components/schedule/schedule-page";
import { getCurrentUser } from "@/lib/utils/auth.helper";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin');
  }
  return <SchedulePage />;
}