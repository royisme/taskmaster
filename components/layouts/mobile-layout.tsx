"use client"
import { Calendar, Columns, ListTodo, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Today",
      href: "/schedule",
      icon: Calendar,
      activeIcon: Calendar,
      current: pathname === "/schedule",
      color: "text-[#80B3FF]"
    },
    {
      name: "Schedule",
      href: "/timetable",
      icon: Columns,
      activeIcon: Columns,
      current: pathname === "/timetable",
      color: "text-gray-900"
    },
    {
      name: "Assignments",
      href: "/assignments",
      icon: ListTodo,
      activeIcon: ListTodo,
      current: pathname === "/assignments",
      color: "text-gray-900"
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      activeIcon: Settings,
      current: pathname === "/settings",
      color: "text-gray-900"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5FBFF]">
      {/* Main Content */}
      <main className="flex-1 pb-16 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200  z-50">
        <div className="h-16 max-w-md mx-auto px-4">
          <ul className="h-full flex items-center justify-around">
            {navigation.map((item) => {
              const IconComponent = item.current ? item.activeIcon : item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center gap-1 ${
                      item.current ? item.color : "text-gray-400"
                    }`}
                  >
                    <IconComponent 
                      className={`w-6 h-6 ${
                        item.current ? "text-current" : "text-gray-400"
                      }`}
                    />
                    <span className="text-xs font-medium">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}