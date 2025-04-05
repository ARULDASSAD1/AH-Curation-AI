
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ShoppingCart, Eye } from 'lucide-react';

interface CustomerHistoryProps {
  browsing: string[];
  purchases: string[];
  loading: boolean;
}

const CustomerHistoryCard = ({ browsing, purchases, loading }: CustomerHistoryProps) => {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            <History className="inline mr-2 h-5 w-5" />
            Loading History...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          <History className="inline mr-2 h-5 w-5" />
          Customer History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium flex items-center text-sm mb-2">
            <ShoppingCart className="h-4 w-4 mr-1.5 text-green-600" />
            Purchase History
          </h3>
          {purchases && purchases.length > 0 ? (
            <div className="pl-6">
              <ul className="list-disc space-y-1">
                {purchases.slice(0, 5).map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
              {purchases.length > 5 && (
                <p className="text-xs text-gray-500 mt-1">+{purchases.length - 5} more items</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 pl-6">No purchase history available</p>
          )}
        </div>

        <div>
          <h3 className="font-medium flex items-center text-sm mb-2">
            <Eye className="h-4 w-4 mr-1.5 text-blue-600" />
            Browsing History
          </h3>
          {browsing && browsing.length > 0 ? (
            <div className="pl-6">
              <ul className="list-disc space-y-1">
                {browsing.slice(0, 5).map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
              {browsing.length > 5 && (
                <p className="text-xs text-gray-500 mt-1">+{browsing.length - 5} more items</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 pl-6">No browsing history available</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerHistoryCard;
