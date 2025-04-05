
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, ShoppingCart, Clock } from 'lucide-react';

interface CustomerData {
  customer_id: string;
  age: number;
  gender: string;
  location: string;
  customer_segment: string;
  avg_order_value: number;
  holiday: string;
  season: string;
  browsing_history: string[];
  purchase_history: string[];
}

interface CustomerCardProps {
  customer: CustomerData | null;
  loading: boolean;
}

const CustomerCard = ({ customer, loading }: CustomerCardProps) => {
  if (loading) {
    return (
      <Card className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <User className="mr-2 h-5 w-5" /> 
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!customer) {
    return (
      <Card className="h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <User className="mr-2 h-5 w-5" /> 
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Enter a customer ID to view details</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full bg-gradient-to-br from-violet-50 to-indigo-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <User className="mr-2 h-5 w-5" /> 
          Customer {customer.customer_id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-2">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm font-medium block">Profile</span>
              <span className="text-sm text-gray-500">
                {customer.age} years old, {customer.gender}
              </span>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-2">
              <MapPin className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm font-medium block">Location</span>
              <span className="text-sm text-gray-500">{customer.location}</span>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-2">
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm font-medium block">Shopping Profile</span>
              <span className="text-sm text-gray-500">
                {customer.customer_segment}, ${customer.avg_order_value.toFixed(2)} Avg. Order
              </span>
            </div>
          </li>
          <li className="flex items-start">
            <div className="bg-indigo-100 p-1 rounded-full mr-2">
              <Clock className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-sm font-medium block">Shopping Season</span>
              <span className="text-sm text-gray-500">
                {customer.season}{customer.holiday !== "None" ? `, ${customer.holiday}` : ""}
              </span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
