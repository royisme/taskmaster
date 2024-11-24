// app/(main)/settings/page.tsx
'use client';
export const dynamic = 'force-dynamic'; // 强制动态渲染,防止Vercel缓存

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User,   
  GraduationCap, 
  Calendar,
  Settings2,
  MoreHorizontal,
  ChevronRight 
} from "lucide-react";
import { SignOutButton } from "@/components/settings/sign-out-button"
import { useSession } from "next-auth/react";
import { User as NextAuthUser } from "next-auth";
interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  status: 'active' | 'coming';
  description?: string;
}

const SETTINGS_MENU: MenuItem[] = [
  {
    id: 'profile',
    label: 'Profile Information',
    href: '/settings/profile',
    icon: User,
    status: 'coming'
  },
  {
    id: 'school',
    label: 'School Information',
    href: '/settings/school',
    icon: GraduationCap,
    status: 'coming'
  },
  {
    id: 'sync-calendar',
    label: 'Sync Calendar',
    href: '/settings/sync-calendar',
    icon: Calendar,
    status: 'active'
  },
  {
    id: 'timetable',
    label: 'Calendar Settings',
    href: '/settings/timetable',
    icon: Settings2,
    status: 'coming'
  },
  {
    id: 'other',
    label: 'Other Settings',
    href: '/settings/other',
    icon: MoreHorizontal,
    status: 'coming'
  }
];
interface SettingsPageProps {
    initialUser: NextAuthUser;  // 来自 next-auth
  }
export default  function SettingsPage({ initialUser }: { initialUser: NextAuthUser }) {
  const { data: session } = useSession();
  const user = session?.user || initialUser;
    
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
          {user?.image ? (
            // eslint-disable-next-line
            <img 
              src={user.image} 
              alt={user.name || "User"} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.schoolId ? "University of Example" : "No school set"}</p>
          <p className="text-gray-500">{user?.programName || "No program set"}</p>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="space-y-3">
        {SETTINGS_MENU.map((item) => (
          item.status === 'active' ? (
            <Link key={item.id} href={item.href}>
              <Card className="flex items-center p-4 hover:bg-gray-50">
                <item.icon className="w-5 h-5 text-gray-500" />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.label}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Card>
            </Link>
          ) : (
            <Card 
              key={item.id}
              className="flex items-center p-4 bg-gray-50/50"
            >
              <item.icon className="w-5 h-5 text-gray-400" />
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-gray-500">{item.label}</h3>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </Card>
          )
        ))}
      </div>
      <div className="flex justify-end">
      {user ? (
        <SignOutButton />
        ) : (
          <Button >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}