"use client";

import * as React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockSearchResults } from "./StockSearchResults";
import { Stock } from "@/types/stock";
import { stockService } from "@/services/stock.service";
import { useDebounce } from "@/hooks/useDebounce";
import { motion } from "framer-motion";

export function MobileStockSearch({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Stock[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Popular stock searches
  const popularSearches = ["VNM", "FPT", "VIC", "MSN", "VCB", "VHM", "BID"];
  
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
        console.log("Mobile search results:", stocks);
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

  const handleResultClick = () => {
    if (onClose) onClose();
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
    <div className="w-full relative">
      <motion.div 
        className="relative flex items-center bg-white rounded-lg overflow-hidden w-full mb-2 border border-neutral-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SearchIcon className="absolute left-3 text-neutral-500 h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Tìm kiếm cổ phiếu..."
          className="border-none bg-transparent h-11 pl-9 pr-9 w-full focus-visible:ring-0 placeholder:text-neutral-400"
          value={query}
          onChange={handleInputChange}
          autoFocus
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 h-8 w-8 p-0 rounded-full"
            onClick={handleClearInput}
          >
            <X className="h-4 w-4 text-neutral-400" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </motion.div>
      
      <StockSearchResults 
        results={results} 
        isLoading={isLoading || debouncedQuery !== query}
        onResultClick={handleResultClick}
        searchQuery={query}
        popularSearches={popularSearches}
        onPopularSearchClick={handlePopularSearchClick}
      />
    </div>
  );
} 