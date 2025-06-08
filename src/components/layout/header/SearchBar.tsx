"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { StockSearch } from "@/components/stock/StockSearch";
import { MobileStockSearch } from "@/components/stock/MobileStockSearch";

export function SearchBar() {
  return (
    <>
      {/* Desktop search */}
      <div className="hidden md:block w-full">
        <div className="relative">
          <StockSearch />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-neutral-50 px-1.5 font-mono text-[10px] font-medium text-neutral-600">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>
      
      {/* Mobile search button */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full border-neutral-200"
            >
              <Search className="h-4 w-4 text-neutral-500" />
              <span className="sr-only">Tìm kiếm</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[300px] pt-4 bg-white rounded-t-xl">
            <MobileStockSearch onClose={() => {
              const closeButton = document.querySelector('[data-radix-collection-item]');
              if (closeButton && closeButton instanceof HTMLElement) {
                closeButton.click();
              }
            }} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 