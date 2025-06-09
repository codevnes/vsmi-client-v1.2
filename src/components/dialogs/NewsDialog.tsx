"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewsItem } from "@/services/newsService";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";
import { useCallback } from "react";

interface NewsDialogProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsDialog({ news, isOpen, onClose }: NewsDialogProps) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!news) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader className="flex justify-between items-start mb-4">
          <DialogTitle className="text-xl font-semibold pr-8">{news.title}</DialogTitle>
          <button 
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <span>{news.sourceWebsite}</span>
          <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
        </div>
        
        <div className="text-base space-y-4">
          <div className="font-medium text-gray-700">Tóm tắt:</div>
          <p className="text-gray-800">{news.summarizedContent}</p>
          
          {news.originalContent && (
            <>
              <div className="font-medium text-gray-700 pt-2">Nội dung đầy đủ:</div>
              <div className="text-gray-800 whitespace-pre-wrap">{news.originalContent}</div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 