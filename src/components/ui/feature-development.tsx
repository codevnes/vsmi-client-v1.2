import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FeatureDevelopmentProps {
  title?: string;
  description?: string;
}

export function FeatureDevelopment({
  title = "Tính năng đang phát triển",
  description = "Chức năng này đang trong quá trình phát triển và sẽ sớm được ra mắt."
}: FeatureDevelopmentProps) {
  return (
    <div className="container mx-auto py-8">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800 font-medium">{title}</AlertTitle>
        <AlertDescription className="text-amber-700">
          {description}
        </AlertDescription>
      </Alert>
      
      <div className="mt-8 p-8 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Chúng tôi đang xây dựng tính năng này</h2>
        <p className="text-gray-600 text-center max-w-md">
          Đội ngũ kỹ thuật đang nỗ lực phát triển tính năng này. 
          Vui lòng quay lại sau để trải nghiệm đầy đủ chức năng.
        </p>
      </div>
    </div>
  );
} 