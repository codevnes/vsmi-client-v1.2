"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, User, Bell, TrendingUp, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { StockSearch } from "@/components/stock/StockSearch";
import { MobileStockSearch } from "@/components/stock/MobileStockSearch";

const navItems = [
  {
    title: "Thị trường",
    href: "/market",
  },
  {
    title: "Cổ phiếu",
    href: "/stocks",
  },
  {
    title: "Tin tức",
    href: "/news",
  },
  {
    title: "Phân tích",
    href: "/analysis",
  },
  {
    title: "Công cụ",
    href: "/tools",
  },
];

const marketData = [
  { name: "VN-Index", value: "1,245.68", change: "+2.45%" },
  { name: "HNX-Index", value: "235.78", change: "+1.25%" },
];

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/dang-nhap");
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      {/* Market information bar */}
      <div className="w-full bg-neutral-50 border-b border-neutral-100">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="h-8 flex items-center justify-between">
            {/* Market indices */}
            <div className="hidden sm:flex items-center space-x-4 text-xs">
              {marketData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="text-neutral-600">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Mobile market data */}
            <div className="flex sm:hidden items-center text-xs">
              <div className="flex items-center gap-1">
                <span className="text-neutral-600">VN-Index</span>
                <span className="font-medium">1,245.68</span>
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  +2.45%
                </span>
              </div>
            </div>
            
            {/* Quick links */}
            <div className="flex items-center space-x-3 text-xs">
              <Link href="/premium" className="text-blue-600 hover:text-blue-700">
                Premium
              </Link>
              <span className="hidden sm:inline text-neutral-300">|</span>
              <Link href="/support" className="text-neutral-600 hover:text-blue-600">
                Hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-14 md:h-16 flex items-center justify-between">
          {/* Left section: Logo and navigation */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild className="md:hidden mr-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white p-0">
                <div className="p-4 border-b border-neutral-100">
                  <Link href="/" className="flex items-center" onClick={() => setShowMobileMenu(false)}>
                    <span className="font-bold text-xl">VSMI</span>
                  </Link>
                </div>
                <nav className="flex flex-col py-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-2.5 px-4 text-neutral-800 hover:bg-neutral-50 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                  <div className="mt-2 pt-2 border-t border-neutral-100 px-4">
                    <Link 
                      href="/premium" 
                      className="flex items-center py-2.5 text-blue-600"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Nâng cấp Premium
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center mr-6">
              <span className="font-bold text-xl md:text-2xl">VSMI</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 lg:px-4 h-16 flex items-center relative text-neutral-700 font-medium hover:text-blue-600 transition-colors group"
                >
                  {item.title}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-blue-600 transition-colors"></span>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Right section: Search and account */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            {/* Desktop search */}
            <div className="hidden sm:block w-full max-w-xs lg:max-w-lg flex-1">
              <StockSearch />
            </div>
            
            {/* Mobile search button */}
            <div className="flex sm:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Tìm kiếm</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-[120px] pt-8 bg-white">
                  <MobileStockSearch onClose={() => {
                    const closeButton = document.querySelector('[data-radix-collection-item]');
                    if (closeButton && closeButton instanceof HTMLElement) {
                      closeButton.click();
                    }
                  }} />
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Authenticated actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full relative">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Thông báo</span>
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-600 text-[10px]">3</Badge>
                </Button>
                
                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 sm:h-9 rounded-full flex items-center">
                      <div className="h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{getUserInitials()}</span>
                      </div>
                      <span className="hidden md:block ml-2 font-medium text-sm">
                        {user?.fullName?.split(' ').slice(-1)[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium text-sm">{user?.fullName}</p>
                        <p className="text-xs text-neutral-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/profile" className="w-full flex items-center">
                        Thông tin cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/portfolio" className="w-full flex items-center">
                        Danh mục đầu tư
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/settings" className="w-full flex items-center">
                        Cài đặt
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <div className="w-full flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                  <Link href="/dang-nhap">Đăng nhập</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/dang-ky">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 