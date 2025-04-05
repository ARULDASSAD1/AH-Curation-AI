
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from 'lucide-react';
import Navbar from "@/components/Navbar";
import CustomerCard from "@/components/CustomerCard";
import ProductRecommendations from "@/components/ProductRecommendations";
import CustomerHistoryCard from "@/components/CustomerHistoryCard";
import { toast } from 'sonner';
import { getRecommendations, getCustomerDetails, CustomerData, Product } from '@/services/api';

const Index = () => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [recommendations, setRecommendations] = useState<Product[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId.trim()) {
      toast.error('Please enter a customer ID');
      return;
    }

    setLoading(true);

    try {
      // Call the API to get customer details and recommendations
      const customerData = await getCustomerDetails(customerId);
      const recommendationsData = await getRecommendations(customerId);
      
      setCustomer(customerData);
      setRecommendations(recommendationsData);
      toast.success(`Recommendations loaded for customer ${customerId}`);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4 text-violet-900">AI-Powered Product Recommendations</h1>
            <p className="text-gray-600 mb-6">
              Enter a customer ID to generate personalized product recommendations with AI analysis.
            </p>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter customer ID..."
                  className="pl-9"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} className="bg-violet-600 hover:bg-violet-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </form>
          </div>
          
          {/* Customer & Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <CustomerCard customer={customer} loading={loading} />
            </div>
            
            <div className="md:col-span-2">
              <ProductRecommendations products={recommendations} loading={loading} />
            </div>
            
            <div className="md:col-span-3">
              <CustomerHistoryCard 
                browsing={customer?.browsing_history || []} 
                purchases={customer?.purchase_history || []} 
                loading={loading} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
