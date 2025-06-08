"use client";

import * as React from "react";
import { Search as SearchIcon, X, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockSearchResults } from "./StockSearchResults";
import { Stock } from "@/types/stock";
import { stockService } from "@/services/stock.service";
import { useDebounce } from "@/hooks/useDebounce";

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
        const stocks = await stockService.searchStocks(debouncedQuery, 5);
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
    <div className="w-full relative px-2">
      <div className="relative flex items-center bg-white rounded-lg overflow-hidden w-full mb-2 border border-neutral-200">
        <SearchIcon className="absolute left-2.5 text-neutral-500 h-4 w-4" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Tìm kiếm cổ phiếu..."
          className="border-none bg-transparent h-10 pl-8 pr-8 w-full focus-visible:ring-0 placeholder:text-neutral-400 text-sm"
          value={query}
          onChange={handleInputChange}
          autoFocus
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 h-7 w-7 p-0 rounded-full"
            onClick={handleClearInput}
          >
            <X className="h-3.5 w-3.5 text-neutral-400" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      {!query.trim() && (
        <div className="p-2 pb-0">
          <div className="flex items-center gap-1.5 mb-2">
            <History className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs font-medium text-neutral-700">Tìm kiếm phổ biến</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularSearches.map((term) => (
              <button
                key={term}
                className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-medium transition-colors"
                onClick={() => handlePopularSearchClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {(query.trim() || isLoading) && (
        <StockSearchResults 
          results={results} 
          isLoading={isLoading || debouncedQuery !== query}
          onResultClick={handleResultClick}
          searchQuery={query}
          popularSearches={popularSearches}
          onPopularSearchClick={handlePopularSearchClick}
          compact={true}
        />
      )}
    </div>
  );
} 