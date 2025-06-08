"use client";

import Link from "next/link";
import { Bell, LogOut, User, PieChart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  fullName?: string;
  email?: string;
}

interface UserMenuDropdownProps {
  user: User | null;
  onLogout: () => void;
}

export function UserMenuDropdown({ user, onLogout }: UserMenuDropdownProps) {
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return "U";
    const nameParts = user.fullName.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Notifications */}
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 w-8 p-0 rounded-full relative border-neutral-200"
      >
        <Bell className="h-4 w-4 text-neutral-500" />
        <span className="sr-only">Thông báo</span>
        <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-600 text-[10px] border-white border">
          3
        </Badge>
      </Button>
      
      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 sm:h-9 rounded-full flex items-center hover:bg-neutral-50"
          >
            <div className="h-7 w-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-medium">{getUserInitials()}</span>
            </div>
            <span className="hidden md:block ml-2 font-medium text-sm">
              {user?.fullName?.split(' ').slice(-1)[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 p-2">
          <DropdownMenuLabel className="p-3">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm">{user?.fullName}</p>
              <p className="text-xs text-neutral-500">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem className="cursor-pointer rounded-md p-2 flex gap-2">
            <User className="h-4 w-4 text-neutral-500" />
            <Link href="/profile" className="w-full flex items-center">
              Thông tin cá nhân
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md p-2 flex gap-2">
            <PieChart className="h-4 w-4 text-neutral-500" />
            <Link href="/portfolio" className="w-full flex items-center">
              Danh mục đầu tư
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md p-2 flex gap-2">
            <Settings className="h-4 w-4 text-neutral-500" />
            <Link href="/settings" className="w-full flex items-center">
              Cài đặt
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem 
            className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer rounded-md p-2"
            onClick={onLogout}
          >
            <div className="w-full flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 