"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 sm:w-auto sm:px-3 p-0 rounded-full sm:rounded-md flex items-center justify-center text-neutral-700 hover:text-blue-600 hover:bg-blue-50" 
        asChild
      >
        <Link href="/dang-nhap">
          <LogIn className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Đăng nhập</span>
        </Link>
      </Button>
      <Button 
        variant="default" 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
        asChild
      >
        <Link href="/dang-ky">Đăng ký</Link>
      </Button>
    </div>
  );
} 