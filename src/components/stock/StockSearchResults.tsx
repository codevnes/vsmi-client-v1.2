"use client";

import * as React from "react";
import Link from "next/link";
import { Stock } from "@/types/stock";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StockSearchResultsProps {
  results: Stock[];
  isLoading: boolean;
  onResultClick: () => void;
  searchQuery: string;
  popularSearches?: string[];
  onPopularSearchClick?: (term: string) => void;
}

export function StockSearchResults({ 
  results, 
  isLoading,
  onResultClick,
  searchQuery,
  popularSearches = ["VNM", "FPT", "VHM", "VIC", "VCB", "BID", "MSN"],
  onPopularSearchClick
}: StockSearchResultsProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
    hover: { backgroundColor: "#f5f7fa" }
  };

  if (isLoading) {
    return (
      <motion.div 
        className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto p-2"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="p-6 flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-neutral-500">Đang tìm kiếm...</p>
        </div>
      </motion.div>
    );
  }

  // When there's no query, show popular searches
  if (!searchQuery.trim()) {
    return (
      <AnimatePresence>
        <motion.div 
          className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="p-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Tìm kiếm phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <motion.button
                  key={term}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-full text-xs font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPopularSearchClick && onPopularSearchClick(term)}
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (results.length === 0) {
    return (
      <AnimatePresence>
        <motion.div 
          className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg z-50 p-2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <div className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Search className="h-10 w-10 text-neutral-300" />
            </div>
            <p className="text-sm text-neutral-500 mb-1">Không tìm thấy kết quả</p>
            <p className="text-xs text-neutral-400">Thử tìm kiếm với từ khóa khác</p>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <ul className="py-2">
          {results.map((stock) => (
            <motion.li key={stock.symbol} variants={itemVariants}>
              <Link 
                href={`/ma-chung-khoan/${stock.symbol}`} 
                className="flex items-center px-4 py-3 hover:bg-neutral-50 transition-colors"
                onClick={onResultClick}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-semibold text-sm bg-neutral-100 px-2 py-1 rounded text-blue-700">{stock.symbol}</span>
                    <span className="text-xs text-neutral-500 ml-2">{stock.exchange}</span>
                  </div>
                  <div className="text-xs text-neutral-700 truncate mt-1">{stock.name}</div>
                </div>
                {stock.profile && (
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-sm">{stock.profile.price.toLocaleString('vi-VN')}</span>
                    <motion.span 
                      className={`text-xs flex items-center mt-1 px-2 py-0.5 rounded-full ${stock.profile.profit > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {stock.profile.profit > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(stock.profile.profit).toFixed(2)}%
                    </motion.span>
                  </div>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
} 