"use client";

import Link from "next/link";
import { Home, BarChart2, Newspaper, PieChart, Settings, Star } from "lucide-react";
import { usePathname } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  isDevelopment?: boolean;
}

interface MobileNavProps {
  navItems: NavItem[];
  onNavItemClick: () => void;
}

export function MobileNav({ navItems, onNavItemClick }: MobileNavProps) {
  const pathname = usePathname();
  
  // Map icons to nav items
  const getIcon = (href: string) => {
    switch (href) {
      case "/market":
        return <BarChart2 className="h-5 w-5 mr-3 text-blue-500" />;
      case "/stocks":
        return <PieChart className="h-5 w-5 mr-3 text-blue-500" />;
      case "/news":
        return <Newspaper className="h-5 w-5 mr-3 text-blue-500" />;
      case "/analysis":
        return <BarChart2 className="h-5 w-5 mr-3 text-blue-500" />;
      case "/tools":
        return <Settings className="h-5 w-5 mr-3 text-blue-500" />;
      default:
        return <Home className="h-5 w-5 mr-3 text-blue-500" />;
    }
  };

  return (
    <>
      <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={onNavItemClick}>
          <span className="font-bold text-xl">VSMI</span>
        </Link>
      </div>
      <nav className="flex flex-col py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`py-3 px-5 hover:bg-blue-50 transition-colors flex items-center ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-neutral-800'
              }`}
              onClick={onNavItemClick}
            >
              {getIcon(item.href)}
              <div className="relative font-medium">
                {item.title}
                {item.isDevelopment && (
                  <span className="absolute -top-1 -right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                )}
              </div>
              {item.isDevelopment && (
                <span className="ml-2 text-xs py-0.5 px-1.5 rounded bg-amber-100 text-amber-800">
                  Beta
                </span>
              )}
            </Link>
          );
        })}
        <div className="mt-4 mx-5 pt-4 border-t border-neutral-100">
          <Link 
            href="/premium" 
            className="flex items-center py-3 px-4 bg-blue-50 text-blue-600 font-medium rounded-lg"
            onClick={onNavItemClick}
          >
            <Star className="h-5 w-5 mr-3 text-blue-500" />
            Nâng cấp Premium
          </Link>
        </div>
      </nav>
    </>
  );
} 