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

export function Header() {
  const [showMobileMarketInfo, setShowMobileMarketInfo] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();


  console.log(user);

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
      <div className="container mx-auto px-2 sm:px-4">
        {/* Top bar with index information - Desktop */}
        <div className="hidden md:flex justify-between items-center h-8 text-xs text-neutral-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>VN-Index</span>
              <span className="font-medium">1,245.68</span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                2.45%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>HNX-Index</span>
              <span className="font-medium">235.78</span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                1.25%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/premium" className="text-xs text-blue-600 hover:text-blue-700">
              Nâng cấp Premium
            </Link>
            <span>|</span>
            <Link href="/support" className="text-xs hover:text-blue-600">
              Hỗ trợ
            </Link>
          </div>
        </div>

        {/* Mobile market info dropdown */}
        <div className="md:hidden">
          <button 
            onClick={() => setShowMobileMarketInfo(!showMobileMarketInfo)}
            className="flex items-center justify-between w-full py-1.5 px-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <span>VN-Index: <span className="font-medium">1,245.68</span></span>
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                2.45%
              </span>
            </div>
            <ChevronDown className={`h-3 w-3 transition-transform ${showMobileMarketInfo ? 'rotate-180' : ''}`} />
          </button>
          
          {showMobileMarketInfo && (
            <div className="px-2 pb-2 text-xs space-y-2 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span>HNX-Index: <span className="font-medium">235.78</span></span>
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  1.25%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Link href="/premium" className="text-xs text-blue-600 hover:text-blue-700">
                  Nâng cấp Premium
                </Link>
                <Link href="/support" className="text-xs hover:text-blue-600">
                  Hỗ trợ
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex h-14 md:h-16 items-center">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center shrink-0 mr-2 sm:mr-4">
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden mr-2">
                <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0 flex justify-center items-center">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white">
                <div className="py-4">
                  <Link href="/" className="flex items-center mb-6">
                    <span className="font-bold text-2xl">VSMI</span>
                  </Link>
                </div>
                <nav className="flex flex-col">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="py-3 px-2 border-b border-neutral-100 text-neutral-800 hover:bg-neutral-50 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl sm:text-2xl">VSMI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center mr-4 space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 lg:px-4 py-2 text-neutral-700 font-medium hover:text-blue-600 transition-colors"
              >
                {item.title}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-blue-600 transition-colors"></span>
              </Link>
            ))}
          </nav>
          
          {/* Search and Account */}
          <div className="flex items-center ml-auto">
            {/* Search - fill remaining space on desktop */}
            <div className="relative hidden sm:flex items-center bg-neutral-100 rounded-lg overflow-hidden max-w-md mr-2">
              <Search className="absolute left-3 text-neutral-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Tìm kiếm cổ phiếu..."
                className="border-none bg-transparent h-8 sm:h-9 pl-9 pr-3 w-full focus-visible:ring-0"
              />
            </div>
            
            {/* Mobile action buttons group */}
            <div className="md:hidden flex items-center bg-neutral-50 rounded-full px-1 py-1 border border-neutral-100">
              {/* Mobile search button */}
              <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 flex justify-center items-center">
                <Search className="h-3.5 w-3.5" />
                <span className="sr-only">Search</span>
              </Button>

              {isAuthenticated ? (
                <>
                  {/* Mobile notification */}
                  <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 flex justify-center items-center relative mx-1">
                    <Bell className="h-3.5 w-3.5" />
                    <span className="sr-only">Notifications</span>
                    <Badge className="absolute -top-1 -right-1 h-3.5 w-3.5 p-0 flex items-center justify-center bg-blue-600 text-[9px]">3</Badge>
                  </Button>

                  {/* Mobile user menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full h-7 w-7 p-0 flex justify-center items-center">
                        <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium">{getUserInitials()}</span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="font-medium text-sm">{user?.fullName}</p>
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/profile" className="w-full flex items-center">
                          Thông tin cá nhân
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/portfolio" className="w-full flex items-center">
                          Danh mục đầu tư
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/settings" className="w-full flex items-center">
                          Cài đặt
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer text-sm"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button variant="ghost" size="sm" className="rounded-full h-7 py-0 px-2" asChild>
                  <Link href="/dang-nhap">Đăng nhập</Link>
                </Button>
              )}
            </div>
            
            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon" className="rounded-lg h-9 w-9 relative">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-xs">3</Badge>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-lg h-9 px-2 flex items-center gap-2">
                        <div className="h-7 w-7 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                        </div>
                        <span className="font-medium text-sm">{user?.fullName?.split(' ').slice(-1)[0]}</span>
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
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/profile" className="w-full flex items-center">
                          Thông tin cá nhân
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/portfolio" className="w-full flex items-center">
                          Danh mục đầu tư
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-sm">
                        <Link href="/settings" className="w-full flex items-center">
                          Cài đặt
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer text-sm"
                        onClick={handleLogout}
                      >
                        <div className="w-full flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/dang-nhap">Đăng nhập</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/dang-ky">Đăng ký</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 