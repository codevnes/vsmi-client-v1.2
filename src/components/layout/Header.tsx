"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

import { MarketInfoBar } from "./header/MarketInfoBar";
import { MobileNav } from "./header/MobileNav";
import { DesktopNav } from "./header/DesktopNav";
import { SearchBar } from "./header/SearchBar";
import { UserMenuDropdown } from "./header/UserMenuDropdown";
import { AuthButtons } from "./header/AuthButtons";

const navItems = [
  { title: "Thị trường", href: "/market", isDevelopment: true },
  { title: "Cổ phiếu", href: "/stocks", isDevelopment: true },
  { title: "Tin tức", href: "/news", isDevelopment: true },
  { title: "Phân tích", href: "/analysis", isDevelopment: true },
  { title: "Công cụ", href: "/tools", isDevelopment: true },
];

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/dang-nhap");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      <MarketInfoBar />
      
      <div className="container mx-auto px-3 sm:px-4">
        <div className="h-14 md:h-16 flex items-center justify-between">
          {/* Left section: Logo and mobile menu */}
          <div className="flex items-center shrink-0">
            {/* Mobile menu button */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild className="md:hidden mr-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-white p-0">
                <MobileNav navItems={navItems} onNavItemClick={() => setShowMobileMenu(false)} />
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl md:text-2xl">VSMI</span>
            </Link>
            
            {/* Desktop Navigation - hidden on mobile */}
            <div className="hidden md:block ml-6">
              <DesktopNav navItems={navItems} />
            </div>
          </div>
          
          {/* Center section: Search on desktop */}
          <div className="hidden md:flex flex-1 mx-6 justify-center">
            <div className="w-full max-w-3xl">
              <SearchBar />
            </div>
          </div>
          
          {/* Right section: Search on mobile and account */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search component - only on mobile */}
            <div className="flex md:hidden items-center">
              <SearchBar />
            </div>
            
            {/* Auth section */}
            {isAuthenticated ? (
              <UserMenuDropdown user={user} onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 