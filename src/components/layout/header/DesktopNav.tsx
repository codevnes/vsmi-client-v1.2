"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  isDevelopment?: boolean;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

export function DesktopNav({ navItems }: DesktopNavProps) {
  const pathname = usePathname();
  
  return (
    <nav className="hidden md:flex items-center space-x-1 h-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 lg:px-4 h-16 flex items-center relative text-neutral-700 font-medium hover:text-blue-600 transition-colors group ${
              isActive ? 'text-blue-600' : ''
            }`}
          >
            <div className="relative">
              {item.title}
              {item.isDevelopment && (
                <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              )}
            </div>
            <span className={`absolute bottom-0 left-0 w-full h-[2px] ${
              isActive ? 'bg-blue-600' : 'bg-transparent group-hover:bg-blue-600'
            } transition-colors`}></span>
          </Link>
        );
      })}
    </nav>
  );
} 