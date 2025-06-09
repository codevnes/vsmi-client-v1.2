"use client";

import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockSearchResults } from "./StockSearchResults";
import { Stock } from "@/types/stock";
import { stockService } from "@/services/stockService";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";

export function StockSearch() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Stock[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Popular stock searches
  const popularSearches = ["VNM", "FPT", "VIC", "MSN", "VCB", "VHM", "BID"];

  // Handle click outside to close results
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search stocks when query changes
  React.useEffect(() => {
    async function searchStocks() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const stocks = await stockService.searchStocks(debouncedQuery, 7);
        setResults(stocks);
      } catch (error) {
        console.error("Error searching stocks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    searchStocks();
  }, [debouncedQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleResultClick = () => {
    setIsFocused(false);
    setQuery("");
    setResults([]);
  };

  const handleClearInput = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setQuery(term);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <motion.div 
        className="flex items-center bg-neutral-100 rounded-lg overflow-hidden w-full shadow-sm"
        whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
        animate={isFocused ? { 
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb" 
        } : {}}
        initial={false}
        transition={{ duration: 0.2 }}
        style={{ border: isFocused ? "1px solid #e5e7eb" : "1px solid transparent" }}
      >
        <SearchIcon className="absolute left-4 text-neutral-500 h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Tìm kiếm cổ phiếu..."
          className="border-none bg-transparent h-11 pl-10 pr-10 w-full focus-visible:ring-0 placeholder:text-neutral-400 text-sm"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 h-8 w-8 p-0 rounded-full"
            onClick={handleClearInput}
          >
            <X className="h-4 w-4 text-neutral-400" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </motion.div>
      
      {isFocused && (
        <StockSearchResults 
          results={results} 
          isLoading={isLoading || debouncedQuery !== query}
          onResultClick={handleResultClick}
          searchQuery={query}
          popularSearches={popularSearches}
          onPopularSearchClick={handlePopularSearchClick}
        />
      )}
    </div>
  );
} 